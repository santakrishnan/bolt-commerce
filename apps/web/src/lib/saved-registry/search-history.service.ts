/**
 * Search History — Server-side service layer.
 *
 * **Mock implementation** using an in-memory Map keyed by visitor ID.
 * When the BED Recent Search Service is available, replace the body
 * of each function with the real HTTP call — the signatures stay the same.
 *
 * Every function accepts a `visitorId` so the BED integration has
 * the context it needs to resolve the correct user store.
 */

import type { SearchEntry } from "./types";

const MAX_SEARCHES = 10;

// ── In-memory store (per-visitor) ────────────────────────────────────

const stores = new Map<string, SearchEntry[]>();

function getStore(visitorId: string): SearchEntry[] {
  let store = stores.get(visitorId);
  if (!store) {
    store = [];
    stores.set(visitorId, store);
  }
  return store;
}

// ── Public API (same signatures BED client will use) ─────────────────

/** Retrieve all search entries for a visitor (most recent first). */
export function getAll(visitorId: string): Promise<SearchEntry[]> {
  return Promise.resolve([...getStore(visitorId)]);
}

/**
 * Add a search entry.
 * - Skips empty or single-character queries (returns unchanged list).
 * - Duplicate queries are moved to the top with an updated timestamp.
 * - Oldest entries are pruned when the list exceeds MAX_SEARCHES.
 * Returns the full updated list.
 */
export function add(
  visitorId: string,
  query: string,
  url: string,
  type: "nlp" | "filter" = "nlp"
): Promise<SearchEntry[]> {
  const trimmed = query.trim();
  if (trimmed.length <= 1) {
    return Promise.resolve([...getStore(visitorId)]);
  }

  const entries = [...getStore(visitorId)];
  const existingIdx = entries.findIndex((e) => e.query.toLowerCase() === trimmed.toLowerCase());

  if (existingIdx === -1) {
    entries.unshift({
      id: Date.now().toString(),
      query: trimmed,
      url,
      timestamp: new Date().toISOString(),
      type,
    });
  } else {
    const existing = entries[existingIdx] as SearchEntry;
    entries.splice(existingIdx, 1);
    entries.unshift({ ...existing, url, timestamp: new Date().toISOString() });
  }

  const pruned = entries.slice(0, MAX_SEARCHES);
  stores.set(visitorId, pruned);
  return Promise.resolve([...pruned]);
}

/**
 * Remove a search entry by id.
 * Returns the full updated list.
 */
export function remove(visitorId: string, id: string): Promise<SearchEntry[]> {
  const filtered = getStore(visitorId).filter((e) => e.id !== id);
  stores.set(visitorId, filtered);
  return Promise.resolve([...filtered]);
}

/** Clear all search history. Returns an empty array. */
export function clearAll(visitorId: string): Promise<SearchEntry[]> {
  stores.set(visitorId, []);
  return Promise.resolve([]);
}
