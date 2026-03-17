import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import {
  addSearchEntry,
  clearSearchHistory,
  getAllSearchHistory,
  removeSearchEntry,
  type SearchEntry,
} from "~/services/search-history-api";
import type { SearchHistoryEntry, Suggestion, UseSearchHistoryReturn } from "../types";

// Shared query key — must match the one in SearchHistoryProvider so both
// the provider context and the search-bar hook read from the same cache.
const SEARCH_HISTORY_KEY = ["search-history"] as const;

/**
 * Hook for managing search history backed by the mock API + TanStack Query.
 *
 * Features:
 * - Shares global in-memory state with SearchHistoryProvider via QueryClient
 * - Optimistic updates: UI reflects changes instantly, API call fires in background
 * - Rollback on failure; background re-sync when the mutation settles
 * - Automatically enforces 10-entry FIFO limit (handled by the API layer)
 *
 * @example
 * const { recentSearches, addSearch, toSuggestions } = useSearchHistory();
 * addSearch("SUV under 35k", "/search?q=SUV+under+35k", "nlp");
 * const suggestions = toSuggestions();
 */
export function useSearchHistory(): UseSearchHistoryReturn {
  const queryClient = useQueryClient();

  // ── Read: live-subscribe to the shared cache ────────────────────
  const { data: recentSearches = [] } = useQuery({
    queryKey: SEARCH_HISTORY_KEY,
    queryFn: getAllSearchHistory,
    initialData: [] as SearchHistoryEntry[],
  });

  // ── Helper: always read current cache without stale closure ─────
  const readCache = useCallback(
    () => queryClient.getQueryData<SearchEntry[]>(SEARCH_HISTORY_KEY) ?? [],
    [queryClient]
  );

  // ── Mutation: add ────────────────────────────────────────────────
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
    onSettled: () => queryClient.invalidateQueries({ queryKey: SEARCH_HISTORY_KEY }),
  });

  // ── Mutation: remove ─────────────────────────────────────────────
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
    onSettled: () => queryClient.invalidateQueries({ queryKey: SEARCH_HISTORY_KEY }),
  });

  // ── Mutation: clear all ──────────────────────────────────────────
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
    onSettled: () => queryClient.invalidateQueries({ queryKey: SEARCH_HISTORY_KEY }),
  });

  // ── Stable handlers ──────────────────────────────────────────────

  const addSearch = useCallback(
    (query: string, url: string, type: "nlp" | "filter" = "nlp") => doAdd({ query, url, type }),
    [doAdd]
  );

  const removeSearch = useCallback((id: string) => doRemove(id), [doRemove]);

  const clearHistory = useCallback(() => doClear(), [doClear]);

  const toSuggestions = useCallback(
    (): Suggestion[] =>
      recentSearches.map((entry) => ({
        text: "",
        highlight: entry.query,
        id: entry.id,
      })),
    [recentSearches]
  );

  return {
    recentSearches,
    addSearch,
    removeSearch,
    clearHistory,
    toSuggestions,
  };
}
