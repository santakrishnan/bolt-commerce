"use client";

import { usePathname } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  addSearchEntry,
  clearSearchHistory,
  getSearchHistory,
  removeSearchEntry,
  type SearchEntry,
} from "~/lib/search-history-storage";

// ── Context shape ────────────────────────────────────────────────────

interface SearchHistoryContextValue {
  /** Current list of search entries (most recent first). */
  searches: SearchEntry[];
  /** Whether the cookie has been read (avoids flash of empty state). */
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
  const [searches, setSearches] = useState<SearchEntry[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const pathname = usePathname();

  // Hydrate from cookie on mount
  useEffect(() => {
    setSearches(getSearchHistory());
    setIsLoaded(true);
  }, []);

  // Re-read cookies every time the route changes so that writes made
  // outside the provider (e.g. SearchInput calling addSearchEntry
  // directly) are picked up when the user navigates to My Garage.
  useEffect(() => {
    if (isLoaded) {
      setSearches(getSearchHistory());
    }
  }, [pathname, isLoaded]);

  const handleAdd = useCallback((query: string, url: string, type: "nlp" | "filter" = "nlp") => {
    const added = addSearchEntry(query, url, type);
    if (added) {
      setSearches(getSearchHistory());
    }
  }, []);

  const handleRemove = useCallback((id: string) => {
    const removed = removeSearchEntry(id);
    if (removed) {
      setSearches(getSearchHistory());
    }
  }, []);

  const handleClearAll = useCallback(() => {
    clearSearchHistory();
    setSearches([]);
  }, []);

  const value = useMemo<SearchHistoryContextValue>(
    () => ({
      searches,
      isLoaded,
      addSearch: handleAdd,
      removeSearch: handleRemove,
      clearAll: handleClearAll,
    }),
    [searches, isLoaded, handleAdd, handleRemove, handleClearAll]
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
