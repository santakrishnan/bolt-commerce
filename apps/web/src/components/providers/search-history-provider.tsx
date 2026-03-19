"use client";

import { useQuery } from "@tanstack/react-query";
import { createContext, use, useCallback, useMemo } from "react";
import { useOptimisticListMutation } from "~/hooks/use-optimistic-list-mutation";
import { searchHistoryQueries } from "~/lib/queries/search-history";
import {
  addSearchEntry,
  clearSearchHistory,
  removeSearchEntry,
  type SearchEntry,
} from "~/services/search-history-api";

// ── Re-export query key for consumers that need it (e.g. search-bar hook) ──

export const SEARCH_HISTORY_KEY = searchHistoryQueries.all().queryKey;

// ── Context shape ────────────────────────────────────────────────────
// The provider only holds mutations. Data is fetched lazily by consumers
// via useSearchHistory(), so pages that don't need search history
// (e.g. VDP) never fire the /api/saved-registry/search-history call.

interface SearchHistoryMutations {
  /** Add a new search. Skips empty/1-char queries. Dedupes by query text. */
  addSearch: (query: string, url: string, type?: "nlp" | "filter") => void;
  /** Remove all search history. */
  clearAll: () => void;
  /** Remove a search entry by id. */
  removeSearch: (id: string) => void;
}

/** Full context value returned by useSearchHistory (mutations + data). */
export interface SearchHistoryContextValue extends SearchHistoryMutations {
  /** Whether the initial fetch has completed. */
  isLoaded: boolean;
  /** Current list of search entries (most recent first). */
  searches: SearchEntry[];
}

const SearchHistoryContext = createContext<SearchHistoryMutations | null>(null);

// ── Mutation variable types ──────────────────────────────────────────

interface AddVars {
  query: string;
  type: "nlp" | "filter";
  url: string;
}

// ── Derived constants from query factory ─────────────────────────────

const queryOpts = searchHistoryQueries.all();

// ── Provider ─────────────────────────────────────────────────────────
// Mutations only — no useQuery here. The API call fires lazily when a
// consumer mounts and calls useSearchHistory().

export function SearchHistoryProvider({ children }: { children: React.ReactNode }) {
  // ── Mutations using shared optimistic hook ──────────────────────────

  const { mutate: doAdd } = useOptimisticListMutation<SearchEntry, AddVars>({
    queryKey: queryOpts.queryKey,
    mutationFn: ({ query, url, type }) => addSearchEntry(query, url, type),
    updater: (prev, { query, url, type }) => {
      const trimmed = query.trim();
      if (trimmed.length <= 1) {
        return prev;
      }

      const entries = [...prev];
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

      return entries.slice(0, 10);
    },
  });

  const { mutate: doRemove } = useOptimisticListMutation<SearchEntry, string>({
    queryKey: queryOpts.queryKey,
    mutationFn: (id) => removeSearchEntry(id),
    updater: (prev, id) => prev.filter((e) => e.id !== id),
  });

  const { mutate: doClear } = useOptimisticListMutation<SearchEntry, void>({
    queryKey: queryOpts.queryKey,
    mutationFn: () => clearSearchHistory(),
    updater: () => [],
  });

  // ── Stable action handlers ────────────────────────────────────────

  const handleAdd = useCallback(
    (query: string, url: string, type: "nlp" | "filter" = "nlp") => doAdd({ query, url, type }),
    [doAdd]
  );

  const handleRemove = useCallback((id: string) => doRemove(id), [doRemove]);

  const handleClearAll = useCallback(() => doClear(), [doClear]);

  // ── Context value (mutations only) ─────────────────────────────────

  const value = useMemo<SearchHistoryMutations>(
    () => ({
      addSearch: handleAdd,
      removeSearch: handleRemove,
      clearAll: handleClearAll,
    }),
    [handleAdd, handleRemove, handleClearAll]
  );

  return <SearchHistoryContext value={value}>{children}</SearchHistoryContext>;
}

// ── Hook ─────────────────────────────────────────────────────────────
// Fetches search history data lazily — the API call only fires when a
// component calls this hook. Pages without search bar skip the call.

export function useSearchHistory(): SearchHistoryContextValue {
  const ctx = use(SearchHistoryContext);
  if (!ctx) {
    throw new Error("useSearchHistory must be used within a <SearchHistoryProvider>");
  }

  // Lazy data fetch — only runs when a consumer mounts
  const { data: searches = [], isFetched } = useQuery(queryOpts);

  return {
    ...ctx,
    searches,
    isLoaded: isFetched,
  };
}
