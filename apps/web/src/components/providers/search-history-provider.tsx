"use client";

import { useQuery } from "@tanstack/react-query";
import { createContext, useCallback, useContext, useMemo } from "react";
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

interface SearchHistoryContextValue {
  /** Add a new search. Skips empty/1-char queries. Dedupes by query text. */
  addSearch: (query: string, url: string, type?: "nlp" | "filter") => void;
  /** Remove all search history. */
  clearAll: () => void;
  /** Whether the initial fetch has completed. */
  isLoaded: boolean;
  /** Remove a search entry by id. */
  removeSearch: (id: string) => void;
  /** Current list of search entries (most recent first). */
  searches: SearchEntry[];
}

const SearchHistoryContext = createContext<SearchHistoryContextValue | null>(null);

// ── Mutation variable types ──────────────────────────────────────────

interface AddVars {
  query: string;
  type: "nlp" | "filter";
  url: string;
}

// ── Derived constants from query factory ─────────────────────────────

const queryOpts = searchHistoryQueries.all();

// ── Provider ─────────────────────────────────────────────────────────

export function SearchHistoryProvider({ children }: { children: React.ReactNode }) {
  // ── Query: fetch all history via query factory ────────────────────
  const { data: searches = [], isFetched } = useQuery(queryOpts);

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

  // ── Context value ─────────────────────────────────────────────────

  const value = useMemo<SearchHistoryContextValue>(
    () => ({
      searches,
      isLoaded: isFetched,
      addSearch: handleAdd,
      removeSearch: handleRemove,
      clearAll: handleClearAll,
    }),
    [searches, isFetched, handleAdd, handleRemove, handleClearAll]
  );

  return <SearchHistoryContext.Provider value={value}>{children}</SearchHistoryContext.Provider>;
}

// ── Hook ─────────────────────────────────────────────────────────────

export function useSearchHistory(): SearchHistoryContextValue {
  const ctx = useContext(SearchHistoryContext);
  if (!ctx) {
    throw new Error("useSearchHistory must be used within a <SearchHistoryProvider>");
  }
  return ctx;
}
