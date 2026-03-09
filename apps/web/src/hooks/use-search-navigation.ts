"use client";

/**
 * useSearchNavigation
 *
 * Project-specific router wrapper for navigating to the VLP (/used-cars).
 *
 * Centralises three concerns that were previously duplicated across every
 * search entry-point:
 *   1. Converting a free-text query → URL slug via `toSearchUrl`
 *   2. Recording the search to the search-history provider (optional)
 *   3. Choosing push vs. replace + scroll behaviour (optional)
 *
 * Best-practice notes (Vercel React / Next.js guidelines applied):
 *  - `useCallback` with stable deps so referential identity is preserved
 *    when used as a prop (`rerender-functional-setstate`)
 *  - `useRouter` is the only Next.js import — no direct `window.location`
 *  - The util functions (`slugify`, `toSearchUrl`) live in `packages/utils`
 *    and are tested independently of React
 *
 * @example
 * // Basic — just navigate
 * const { navigate } = useSearchNavigation();
 * navigate("SUV under 35k");
 *
 * @example
 * // With history recording (search bars on landing page)
 * const { navigate } = useSearchNavigation({ recordHistory: true });
 * navigate("SUV under 35k", { source: "nlp" });
 *
 * @example
 * // Replace mode — keep current history entry (VLP search bar)
 * const { navigate } = useSearchNavigation({ mode: "replace", scroll: false });
 * navigate(query);
 */

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { toSearchUrl } from "utils";
import { useSearchHistory } from "~/components/providers/search-history-provider";

export interface UseSearchNavigationOptions {
  /**
   * `"push"` (default) adds an entry to the browser history.
   * `"replace"` updates the current entry — used on in-page search bars
   * so the back button doesn't re-run the same search.
   */
  mode?: "push" | "replace";
  /**
   * Whether the page should scroll to the top after navigation.
   * Only applies to `replace` mode (Next.js default is `true` for push).
   * @default true
   */
  scroll?: boolean;
  /**
   * When `true`, records the query in the search history provider.
   * Requires `<SearchHistoryProvider>` to be present in the tree.
   * @default false
   */
  recordHistory?: boolean;
  /**
   * Base path for the search URL. Override when targeting a page other
   * than `/used-cars` (e.g. a dealer-specific listing page).
   * @default "/used-cars"
   */
  basePath?: string;
}

export interface NavigateOptions {
  /** Source label forwarded to the search history entry. */
  source?: "nlp" | "filter";
}

export interface UseSearchNavigationReturn {
  /**
   * Navigate to the search page for the given query.
   * An empty / whitespace-only query navigates to the base path with no `?q=`.
   */
  navigate: (query: string, options?: NavigateOptions) => void;
  /**
   * Pre-built URL for a given query — useful for generating `<a href>` values
   * or pre-fetching on hover without triggering navigation.
   */
  buildUrl: (query: string) => string;
}

export function useSearchNavigation({
  mode = "push",
  scroll = true,
  recordHistory = false,
  basePath = "/used-cars",
}: UseSearchNavigationOptions = {}): UseSearchNavigationReturn {
  const router = useRouter();
  const { addSearch } = useSearchHistory();

  const buildUrl = useCallback((query: string) => toSearchUrl(query, basePath), [basePath]);

  const navigate = useCallback(
    (query: string, { source = "nlp" }: NavigateOptions = {}) => {
      const url = buildUrl(query);

      // Record to search history before navigating (fire-and-forget)
      if (recordHistory && query.trim().length > 1) {
        addSearch(query.trim(), url, source);
      }

      if (mode === "replace") {
        router.replace(url, { scroll });
      } else {
        router.push(url);
      }
    },
    [router, buildUrl, recordHistory, addSearch, mode, scroll]
  );

  return { navigate, buildUrl };
}
