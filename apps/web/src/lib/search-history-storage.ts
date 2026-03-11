/**
 * Cookie-based storage for recent search history.
 *
 * Cookie Name : "recent_searches"
 * Cookie Value: JSON-stringified array of SearchEntry objects
 *
 * Each entry contains:
 *   - id: unique identifier (timestamp string)
 *   - query: display text of the search
 *   - url: SRP URL with query parameters
 *   - timestamp: ISO string of when the search was performed
 *   - type: "nlp" (natural language) or "filter" (structured search)
 *
 * Uses cached cookie utility for optimal performance following Vercel best practices.
 */

import { getCookie, setCookie } from "./cookie-cache";

export interface SearchEntry {
  id: string;
  query: string;
  url: string;
  timestamp: string;
  type: "nlp" | "filter";
}

const COOKIE_NAME = "recent_searches";
const MAX_SEARCHES = 10;
const MAX_AGE_SECONDS = 30 * 24 * 60 * 60; // 30 days

// ── helpers ──────────────────────────────────────────────────────────

function parseCookie(): SearchEntry[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = getCookie(COOKIE_NAME);
    if (!raw) {
      return [];
    }
    const value = decodeURIComponent(raw);
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed as SearchEntry[]) : [];
  } catch {
    return [];
  }
}

function writeCookie(entries: SearchEntry[]): void {
  if (typeof window === "undefined") {
    return;
  }
  const value = encodeURIComponent(JSON.stringify(entries));
  setCookie(COOKIE_NAME, value, {
    maxAge: MAX_AGE_SECONDS,
    path: "/",
    sameSite: "Lax",
  });
}

// ── public API ───────────────────────────────────────────────────────

/** Return all stored search entries (most recent first). */
export function getSearchHistory(): SearchEntry[] {
  return parseCookie();
}

/**
 * Add a search entry to the history.
 * - Skips empty or single-character queries.
 * - Duplicate queries update timestamp rather than creating a new entry.
 * - Oldest entries removed when exceeding MAX_SEARCHES (FIFO).
 */
export function addSearchEntry(
  query: string,
  url: string,
  type: "nlp" | "filter" = "nlp"
): boolean {
  const trimmed = query.trim();
  if (trimmed.length <= 1) {
    return false;
  }

  const entries = parseCookie();

  // Check for duplicate (case-insensitive match on query text)
  const existingIdx = entries.findIndex((e) => e.query.toLowerCase() === trimmed.toLowerCase());

  if (existingIdx !== -1) {
    // Move existing entry to top with updated timestamp & url
    const existing = entries[existingIdx] as SearchEntry;
    entries.splice(existingIdx, 1);
    entries.unshift({ ...existing, url, timestamp: new Date().toISOString() });
  } else {
    // Add new entry at the top
    entries.unshift({
      id: Date.now().toString(),
      query: trimmed,
      url,
      timestamp: new Date().toISOString(),
      type,
    });
  }

  // Enforce maximum limit (remove oldest)
  const capped = entries.slice(0, MAX_SEARCHES);
  writeCookie(capped);
  return true;
}

/**
 * Remove a search entry by its id.
 * Returns `true` if the entry was found and removed.
 */
export function removeSearchEntry(id: string): boolean {
  const entries = parseCookie();
  const idx = entries.findIndex((e) => e.id === id);
  if (idx === -1) {
    return false;
  }
  entries.splice(idx, 1);
  writeCookie(entries);
  return true;
}

/** Remove all search history entries. */
export function clearSearchHistory(): void {
  writeCookie([]);
}
