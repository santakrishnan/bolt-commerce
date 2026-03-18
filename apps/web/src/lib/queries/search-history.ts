import { queryOptions } from "@tanstack/react-query";
import { getAllSearchHistory, type SearchEntry } from "~/services/search-history-api";

/**
 * Query key factory for search history.
 *
 * Centralises the query key and options so every consumer
 * (SearchHistoryProvider, search-bar hook, my-garage) reads from the
 * same cache entry.
 *
 * `queryFn` calls the saved-registry proxy (`/api/saved-registry/search-history`)
 * which forwards to the BED Recent Search Service (currently mocked).
 */
export const searchHistoryQueries = {
  all: () =>
    queryOptions({
      queryKey: ["search-history"] as const,
      queryFn: getAllSearchHistory,
      // Show empty list while the first fetch runs
      placeholderData: [] as SearchEntry[],
    }),
} as const;
