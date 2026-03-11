"use client";

/**
 * useSearch — Client-side search hook
 *
 * Fetches vehicle search results from the `/api/search` proxy route.
 * Automatically attaches Arrow tracking headers for visitor-level
 * personalization. Supports debounced query changes, pagination,
 * and filter updates.
 *
 * Usage:
 * ```tsx
 * const { results, isLoading, search, setPage } = useSearch();
 *
 * // Initial search
 * search({ query: "toyota" });
 *
 * // Paginate
 * setPage(2);
 * ```
 */

import { useCallback, useRef, useState } from "react";
import { ARROW_HEADER } from "~/lib/arrow/constants";
import type { SearchPagination, SearchQuery, SearchResult, SearchVehicle } from "~/services/search";

// ─── State ──────────────────────────────────────────────────────────────────

export interface UseSearchState {
  vehicles: SearchVehicle[];
  pagination: SearchPagination | null;
  isLoading: boolean;
  error: Error | null;
  query: SearchQuery;
}

export interface UseSearchActions {
  /** Execute a search with the given query (merges with current query). */
  search(params?: Partial<SearchQuery>): Promise<void>;
  /** Set the current page. */
  setPage(page: number): Promise<void>;
  /** Reset the search state. */
  reset(): void;
}

export type UseSearchReturn = UseSearchState & UseSearchActions;

// ─── Tracking IDs (provided by the caller) ──────────────────────────────────

export interface UseSearchOptions {
  /** Arrow tracking IDs for personalization headers */
  sessionId?: string | null;
  fingerprintId?: string | null;
  profileId?: string | null;
  /** Base API path (default: "/api/search") */
  endpoint?: string;
  /** Initial query (optional) */
  initialQuery?: SearchQuery;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Build URLSearchParams from a SearchQuery */
function buildSearchParams(query: SearchQuery): URLSearchParams {
  const params = new URLSearchParams();

  const stringFields: (keyof SearchQuery)[] = ["query", "sortBy", "sortOrder"];
  for (const key of stringFields) {
    const val = query[key];
    if (val) {
      params.set(key, String(val));
    }
  }

  const numericFields: (keyof SearchQuery)[] = [
    "page",
    "pageSize",
    "priceMin",
    "priceMax",
    "yearMin",
    "yearMax",
  ];
  for (const key of numericFields) {
    const val = query[key];
    if (val != null) {
      params.set(key, String(val));
    }
  }

  const arrayFields: (keyof SearchQuery)[] = ["bodyStyles", "makes", "models", "fuelTypes"];
  for (const key of arrayFields) {
    const val = query[key] as string[] | undefined;
    if (val?.length) {
      params.set(key, val.join(","));
    }
  }

  return params;
}

// ─── Hook ───────────────────────────────────────────────────────────────────

export function useSearch(options: UseSearchOptions = {}): UseSearchReturn {
  const {
    sessionId,
    fingerprintId,
    profileId,
    endpoint = "/api/search",
    initialQuery = {},
  } = options;

  const [state, setState] = useState<UseSearchState>({
    vehicles: [],
    pagination: null,
    isLoading: false,
    error: null,
    query: initialQuery,
  });

  const abortRef = useRef<AbortController | null>(null);

  const executeSearch = useCallback(
    async (query: SearchQuery) => {
      // Abort any in-flight request
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setState((prev) => ({ ...prev, isLoading: true, error: null, query }));

      try {
        const params = buildSearchParams(query);

        const headers: Record<string, string> = {};
        if (sessionId) {
          headers[ARROW_HEADER.SESSION_ID] = sessionId;
        }
        if (fingerprintId) {
          headers[ARROW_HEADER.FP_ID] = fingerprintId;
        }
        if (profileId) {
          headers[ARROW_HEADER.PROFILE_ID] = profileId;
        }

        const url = `${endpoint}?${params.toString()}`;
        const res = await fetch(url, {
          method: "GET",
          headers,
          credentials: "include",
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`Search failed: ${res.status} ${res.statusText}`);
        }

        const data: SearchResult = await res.json();

        setState((prev) => ({
          ...prev,
          vehicles: data.vehicles,
          pagination: data.pagination,
          isLoading: false,
          error: null,
        }));
      } catch (err) {
        if (controller.signal.aborted) {
          return;
        }
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: err as Error,
        }));
      }
    },
    [sessionId, fingerprintId, profileId, endpoint]
  );

  const search = useCallback(
    async (params?: Partial<SearchQuery>) => {
      const merged = { ...state.query, ...params, page: params?.page ?? 1 };
      await executeSearch(merged);
    },
    [state.query, executeSearch]
  );

  const setPage = useCallback(
    async (page: number) => {
      await executeSearch({ ...state.query, page });
    },
    [state.query, executeSearch]
  );

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setState({
      vehicles: [],
      pagination: null,
      isLoading: false,
      error: null,
      query: initialQuery,
    });
  }, [initialQuery]);

  return {
    ...state,
    search,
    setPage,
    reset,
  };
}
