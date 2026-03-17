"use client";

import { useQuery } from "@tanstack/react-query";
import { createContext, useCallback, useContext, useMemo } from "react";
import { useOptimisticListMutation } from "~/hooks/use-optimistic-list-mutation";
import {
  addSearchEntry,
  clearSearchHistory,
  getAllSearchHistory,
  removeSearchEntry,
  type SearchEntry,
} from "~/services/search-history-api";

// ── Query key (shared with the search-bar hook) ───────────────────────

export const SEARCH_HISTORY_KEY = ["search-history"] as const;

// ── Context shape ────────────────────────────────────────────────────

interface SearchHistoryContextValue {
  /** Current list of search entries (most recent first). */
  searches: SearchEntry[];
  /** Always true — initialData guarantees data on first render. */
  isLoaded: boolean;
  /** Add a new search. Skips empty/1-char queries. Dedupes by query text. */
  addSearch: (query: string, url: string, type?: "nlp" | "filter") => void;
  /** Remove a search entry by id. */
  removeSearch: (id: string) => void;
  /** Remove all search history. */
  clearAll: () => void;
}

const SearchHistoryContext = createContext<SearchHistoryContextValue | null>(null);

// ── Mutation variable types ──────────────────────────────────────────

interface AddVars {
  query: string;
  url: string;
  type: "nlp" | "filter";
}

// ── Provider ─────────────────────────────────────────────────────────

export function SearchHistoryProvider({ children }: { children: React.ReactNode }) {
  // ── Query: fetch all history from mock API ────────────────────────
  const { data: searches = [] } = useQuery({
    queryKey: SEARCH_HISTORY_KEY,
    queryFn: getAllSearchHistory,
    initialData: [] as SearchEntry[],
  });

  // ── Mutations using shared optimistic hook ──────────────────────────

  const { mutate: doAdd } = useOptimisticListMutation<SearchEntry, AddVars>({
    queryKey: SEARCH_HISTORY_KEY,
    mutationFn: ({ query, url, type }) => addSearchEntry(query, url, type),
    updater: (prev, { query, url, type }) => {
      const trimmed = query.trim();
      if (trimmed.length <= 1) {
        return prev;
      }

      const entries = [...prev];
      const existingIdx = entries.findIndex(
        (e) => e.query.toLowerCase() === trimmed.toLowerCase()
      );

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

      return entries.slice(0, 10);
    },
  });

  const { mutate: doRemove } = useOptimisticListMutation<SearchEntry, string>({
    queryKey: SEARCH_HISTORY_KEY,
    mutationFn: removeSearchEntry,
    updater: (prev, id) => prev.filter((e) => e.id !== id),
  });

  const { mutate: doClear } = useOptimisticListMutation<SearchEntry, void>({
    queryKey: SEARCH_HISTORY_KEY,
    mutationFn: clearSearchHistory,
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
      isLoaded: true,
      addSearch: handleAdd,
      removeSearch: handleRemove,
      clearAll: handleClearAll,
    }),
    [searches, handleAdd, handleRemove, handleClearAll]
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
