/**
 * Mock API service for recent search history.
 *
 * Simulates a REST-like backend with in-memory persistence and artificial
 * network latency.  In production this would be a real endpoint; the
 * interface is kept identical so the swap is painless.
 *
 * Endpoints modelled:
 *   GET    /search-history            → getAllSearchHistory()
 *   POST   /search-history            → addSearchEntry(query, url, type)
 *   DELETE /search-history/:id        → removeSearchEntry(id)
 *   DELETE /search-history            → clearSearchHistory()
 */

const MAX_SEARCHES = 10;

// IndexedDB helper imported dynamically inside functions to avoid SSR

// ── Shared type (mirrors SearchHistoryEntry in search-bar/types.ts) ──────────

export interface SearchEntry {
  id: string;
  query: string;
  url: string;
  timestamp: string;
  type: "nlp" | "filter";
}

// Key used to persist search history
const IDB_KEY = "search-history-store";

// ── In-memory store (kept as cached copy; persisted to IDB) ────────────────

let store: SearchEntry[] = [];

async function readStore(): Promise<SearchEntry[]> {
  if (typeof window === "undefined") {
    return store;
  }
  try {
    const { idbGet } = await import("~/lib/indexeddb");
    const val = await idbGet<SearchEntry[]>(IDB_KEY);
    if (Array.isArray(val)) {
      store = val;
    }
  } catch (_err) {
    // best-effort
  }
  return store;
}

async function writeStore(): Promise<void> {
  if (typeof window === "undefined") {
    return;
  }
  try {
    const { idbSet } = await import("~/lib/indexeddb");
    await idbSet(IDB_KEY, store);
  } catch (_err) {
    // best-effort
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Simulate network latency (50-150 ms). */
function simulateLatency(): Promise<void> {
  const ms = 50 + Math.random() * 100;
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ── Public API ───────────────────────────────────────────────────────────────

/** Retrieve all search entries (most recent first). */
export async function getAllSearchHistory(): Promise<SearchEntry[]> {
  await simulateLatency();
  await readStore();
  return [...store];
}

/**
 * Add a search entry.
 * - Skips empty or single-character queries (returns unchanged list).
 * - Duplicate queries are moved to the top with an updated timestamp.
 * - Oldest entries are pruned when the list exceeds MAX_SEARCHES.
 * Returns the updated list.
 */
export async function addSearchEntry(
  query: string,
  url: string,
  type: "nlp" | "filter" = "nlp"
): Promise<SearchEntry[]> {
  await simulateLatency();
  await readStore();

  const trimmed = query.trim();
  if (trimmed.length <= 1) {
    return [...store];
  }

  const entries = [...store];
  const existingIdx = entries.findIndex((e) => e.query.toLowerCase() === trimmed.toLowerCase());

  if (existingIdx !== -1) {
    const existing = entries[existingIdx] as SearchEntry;
    entries.splice(existingIdx, 1);
    entries.unshift({ ...existing, url, timestamp: new Date().toISOString() });
  } else {
    entries.unshift({
      id: Date.now().toString(),
      query: trimmed,
      url,
      timestamp: new Date().toISOString(),
      type,
    });
  }

  store = entries.slice(0, MAX_SEARCHES);
  await writeStore();
  return [...store];
}

/**
 * Remove a search entry by id.
 * Returns the updated list.
 */
export async function removeSearchEntry(id: string): Promise<SearchEntry[]> {
  await simulateLatency();
  await readStore();
  store = store.filter((e) => e.id !== id);
  await writeStore();
  return [...store];
}

/** Clear all search history. Returns an empty array. */
export async function clearSearchHistory(): Promise<SearchEntry[]> {
  await simulateLatency();
  store = [];
  await writeStore();
  return [];
}
