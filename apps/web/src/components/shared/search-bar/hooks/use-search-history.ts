import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { useOptimisticListMutation } from "~/hooks/use-optimistic-list-mutation";
import { searchHistoryQueries } from "~/lib/queries/search-history";
import {
  addSearchEntry,
  clearSearchHistory,
  removeSearchEntry,
  type SearchEntry,
} from "~/services/search-history-api";
import type { Suggestion, UseSearchHistoryReturn } from "../types";

// ── Derived constants from query factory ─────────────────────────────

const queryOpts = searchHistoryQueries.all();

/**
 * Hook for managing search history backed by TanStack Query.
 *
 * Shares the same QueryClient cache entry as SearchHistoryProvider
 * via the centralised query key factory. Mutations use the shared
 * `useOptimisticListMutation` hook — no duplicated boilerplate.
 *
 * @example
 * const { recentSearches, addSearch, toSuggestions } = useSearchHistory();
 * addSearch("SUV under 35k", "/search?q=SUV+under+35k", "nlp");
 * const suggestions = toSuggestions();
 */
export function useSearchHistory(): UseSearchHistoryReturn {
  // ── Read: live-subscribe to the shared cache ────────────────────
  const { data: recentSearches = [] } = useQuery(queryOpts);

  // ── Mutations using shared optimistic hook ──────────────────────

  const { mutate: doAdd } = useOptimisticListMutation<
    SearchEntry,
    { query: string; url: string; type: "nlp" | "filter" }
  >({
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
