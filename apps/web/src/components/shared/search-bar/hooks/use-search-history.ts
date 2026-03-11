import { useCallback, useEffect, useState } from "react";
import {
  addSearchEntry,
  clearSearchHistory,
  getSearchHistory,
  removeSearchEntry,
} from "~/lib/search-history-storage";
import type { SearchHistoryEntry, Suggestion, UseSearchHistoryReturn } from "../types";

/**
 * Hook for managing search history with cookie-based persistence
 *
 * Features:
 * - Loads history from cookies on mount
 * - Provides methods to add, remove, and clear history
 * - Converts history entries to Suggestion format
 * - Automatically enforces 10-entry FIFO limit (handled by storage layer)
 *
 * @returns Search history state and methods
 *
 * @example
 * const { recentSearches, addSearch, toSuggestions } = useSearchHistory();
 * addSearch("SUV under 35k", "/search?q=SUV+under+35k", "nlp");
 * const suggestions = toSuggestions();
 */
export function useSearchHistory(): UseSearchHistoryReturn {
  const [recentSearches, setRecentSearches] = useState<SearchHistoryEntry[]>([]);

  /**
   * Load search history from cookies
   */
  const loadHistory = useCallback(() => {
    const entries = getSearchHistory();
    setRecentSearches(entries);
  }, []);

  /**
   * Load history on mount
   */
  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  /**
   * Add a search to history
   * - Skips empty or single-character queries
   * - Duplicate queries update timestamp rather than creating a new entry
   * - Oldest entries removed when exceeding 10 entries (FIFO)
   */
  const addSearch = useCallback(
    (query: string, url: string, type: "nlp" | "filter" = "nlp") => {
      const success = addSearchEntry(query, url, type);
      if (success) {
        loadHistory();
      }
    },
    [loadHistory]
  );

  /**
   * Remove a search from history by ID
   */
  const removeSearch = useCallback(
    (id: string) => {
      const success = removeSearchEntry(id);
      if (success) {
        loadHistory();
      }
    },
    [loadHistory]
  );

  /**
   * Clear all search history
   */
  const clearHistory = useCallback(() => {
    clearSearchHistory();
    loadHistory();
  }, [loadHistory]);

  /**
   * Convert history entries to Suggestion format
   * - Uses query as both text and highlight
   * - Includes entry ID for tracking
   *
   * @returns Array of suggestions from history
   */
  const toSuggestions = useCallback((): Suggestion[] => {
    return recentSearches.map((entry) => ({
      text: "",
      highlight: entry.query,
      id: entry.id,
    }));
  }, [recentSearches]);

  return {
    recentSearches,
    addSearch,
    removeSearch,
    clearHistory,
    toSuggestions,
  };
}
