/**
 * Client API service for recent search history.
 *
 * All operations go through the saved-registry proxy:
 *   GET    /api/saved-registry/search-history       → getAllSearchHistory()
 *   POST   /api/saved-registry/search-history       → addSearchEntry(query, url, type)
 *   DELETE /api/saved-registry/search-history/:id   → removeSearchEntry(id)
 *   DELETE /api/saved-registry/search-history       → clearSearchHistory()
 *
 * The proxy handles visitor identification via cookies and forwards
 * requests to the BED Recent Search Service (currently mocked).
 *
 * Function signatures are unchanged from the previous IndexedDB
 * implementation — query factories and providers work without changes.
 */

import { API_ROUTES } from "~/lib/routes/constants";
import type { SearchEntry } from "~/lib/saved-registry/types";

// Re-export the type so existing consumers keep importing from this file.
export type { SearchEntry } from "~/lib/saved-registry/types";

// ── Helpers ──────────────────────────────────────────────────────────

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    credentials: "include",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Request failed: ${res.status}`);
  }

  const { data } = await res.json();
  return data as T;
}

// ── Public API (same signatures as before) ───────────────────────────

/** Retrieve all search entries (most recent first). */
export function getAllSearchHistory(): Promise<SearchEntry[]> {
  return fetchJson<SearchEntry[]>(API_ROUTES.SEARCH_HISTORY);
}

/**
 * Add a search entry.
 * Returns the updated list.
 */
export function addSearchEntry(
  query: string,
  url: string,
  type: "nlp" | "filter" = "nlp"
): Promise<SearchEntry[]> {
  return fetchJson<SearchEntry[]>(API_ROUTES.SEARCH_HISTORY, {
    method: "POST",
    body: JSON.stringify({ query, url, type }),
  });
}

/**
 * Remove a search entry by id.
 * Returns the updated list.
 */
export function removeSearchEntry(id: string): Promise<SearchEntry[]> {
  return fetchJson<SearchEntry[]>(`${API_ROUTES.SEARCH_HISTORY}/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

/** Clear all search history. Returns an empty array. */
export function clearSearchHistory(): Promise<SearchEntry[]> {
  return fetchJson<SearchEntry[]>(API_ROUTES.SEARCH_HISTORY, {
    method: "DELETE",
  });
}
