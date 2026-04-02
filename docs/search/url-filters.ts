export type SearchSortOption = "recommended" | "low-high" | "high-low";

/**
 * SRP URL contract:
 *   Path:  /used-cars/<bodyType>   (handled by route params, not query string)
 *   Query: ?q=<search term>       (only param managed via URL)
 *
 * Filters, sort, and pagination are managed client-side via React context —
 * they are NOT serialized to the URL.
 */

export interface ParsedSearchUrlState {
  searchQuery?: string;
}

/**
 * Parse the search query from URLSearchParams.
 */
export function parseSearchUrlState(searchParams: URLSearchParams): ParsedSearchUrlState {
  return {
    searchQuery: searchParams.get("q") ?? undefined,
  };
}

/**
 * Serialize the search query to a URL query string.
 * Returns an empty string when no query is set.
 */
export function serializeSearchUrlState(searchQuery: string): string {
  const trimmed = searchQuery.trim();
  if (!trimmed) {
    return "";
  }
  const params = new URLSearchParams();
  params.set("q", trimmed);
  return params.toString();
}
