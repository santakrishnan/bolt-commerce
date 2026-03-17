"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useCallback, useContext, useMemo } from "react";
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

// ── Provider ─────────────────────────────────────────────────────────

export function SearchHistoryProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  // ── Query: fetch all history from mock API ────────────────────────
  const { data: searches = [] } = useQuery({
    queryKey: SEARCH_HISTORY_KEY,
    queryFn: getAllSearchHistory,
    initialData: [] as SearchEntry[],
  });

  // ── Helper: always read the freshest cache value ──────────────────
  const readCache = useCallback(
    () => queryClient.getQueryData<SearchEntry[]>(SEARCH_HISTORY_KEY) ?? [],
    [queryClient]
  );

  // ── Mutation: add a search entry — fire-and-forget ────────────────
  const { mutate: doAdd } = useMutation({
    mutationFn: ({ query, url, type }: { query: string; url: string; type: "nlp" | "filter" }) =>
      addSearchEntry(query, url, type),
    onMutate: async ({ query, url, type }) => {
      await queryClient.cancelQueries({ queryKey: SEARCH_HISTORY_KEY });
      const previous = readCache();

      const trimmed = query.trim();
      if (trimmed.length <= 1) {
        return { previous };
      }

      const entries = [...previous];
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

      queryClient.setQueryData<SearchEntry[]>(SEARCH_HISTORY_KEY, entries.slice(0, 10));
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(SEARCH_HISTORY_KEY, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: SEARCH_HISTORY_KEY });
    },
  });

  // ── Mutation: remove a search entry — fire-and-forget ────────────
  const { mutate: doRemove } = useMutation({
    mutationFn: removeSearchEntry,
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: SEARCH_HISTORY_KEY });
      const previous = readCache();
      queryClient.setQueryData<SearchEntry[]>(
        SEARCH_HISTORY_KEY,
        previous.filter((e) => e.id !== id)
      );
      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(SEARCH_HISTORY_KEY, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: SEARCH_HISTORY_KEY });
    },
  });

  // ── Mutation: clear all — fire-and-forget ────────────────────────
  const { mutate: doClear } = useMutation({
    mutationFn: clearSearchHistory,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: SEARCH_HISTORY_KEY });
      const previous = readCache();
      queryClient.setQueryData<SearchEntry[]>(SEARCH_HISTORY_KEY, []);
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(SEARCH_HISTORY_KEY, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: SEARCH_HISTORY_KEY });
    },
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
