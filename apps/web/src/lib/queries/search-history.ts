import { queryOptions } from "@tanstack/react-query";
import { getAllSearchHistory, type SearchEntry } from "~/services/search-history-api";

/**
 * Query key factory for search history.
 *
 * Centralises the query key and options so every consumer
 * (SearchHistoryProvider, search-bar hook, my-garage) reads from the
 * same cache entry.
 *
 * When the real API replaces the mock, swap `queryFn` here — all consumers
 * update automatically.
 */
export const searchHistoryQueries = {
  all: () =>
    queryOptions({
      queryKey: ["search-history"] as const,
      //  TODO: Replace with actual API call
      queryFn: getAllSearchHistory,
      // Show empty list while the first fetch runs
      placeholderData: [] as SearchEntry[],
    }),
} as const;
