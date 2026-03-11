/**
 * Search Service
 *
 * Handles vehicle search queries — either against an upstream BED
 * Search Service or using local mock data when the service URL is
 * not configured.
 *
 * Follows the same pattern as the events and visitor-profile services:
 * - ArrowServerClient for upstream calls (auth, retries, headers)
 * - Mock fallback for local dev / CI
 */

import {
  ArrowServerError,
  type ArrowServerIds,
  createArrowServerClient,
} from "~/lib/arrow/server-api";
import type { SearchQuery, SearchResult, SearchVehicle } from "./types";

// ─── Lazy singleton ─────────────────────────────────────────────────────────

let _client: ReturnType<typeof createArrowServerClient> | null = null;

function getSearchClient() {
  if (!_client) {
    _client = createArrowServerClient({
      baseUrl: process.env.SEARCH_SERVICE_URL ?? "",
      authToken: process.env.SEARCH_API_KEY,
      serviceName: "SearchService",
      timeout: 15_000,
      retries: 1,
    });
  }
  return _client;
}

function isMockMode(): boolean {
  return !process.env.SEARCH_SERVICE_URL || process.env.USE_MOCK_SEARCH === "true";
}

// ─── Mock data ──────────────────────────────────────────────────────────────

/**
 * Generate mock search results. Dynamically imports mock vehicles from
 * `lib/search/mock-vehicles` to keep the bundle clean in production.
 */
async function getMockResults(query: SearchQuery): Promise<SearchResult> {
  const { mockVehicles } = await import("~/lib/search/mock-vehicles");

  let vehicles: SearchVehicle[] = mockVehicles.map((v) => ({
    ...v,
    estimation: v.estimation ?? undefined,
  }));

  // Apply basic filtering
  if (query.query) {
    const q = query.query.toLowerCase();
    vehicles = vehicles.filter(
      (v) =>
        v.title.toLowerCase().includes(q) ||
        v.make.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q)
    );
  }

  if (query.priceMin != null) {
    const min = query.priceMin;
    vehicles = vehicles.filter((v) => v.price >= min);
  }
  if (query.priceMax != null) {
    const max = query.priceMax;
    vehicles = vehicles.filter((v) => v.price <= max);
  }
  if (query.yearMin != null) {
    const min = query.yearMin;
    vehicles = vehicles.filter((v) => v.year >= min);
  }
  if (query.yearMax != null) {
    const max = query.yearMax;
    vehicles = vehicles.filter((v) => v.year <= max);
  }

  // Sorting
  const sortBy = query.sortBy ?? "match";
  const sortOrder = query.sortOrder ?? "desc";
  const dir = sortOrder === "asc" ? 1 : -1;

  vehicles.sort((a, b) => {
    switch (sortBy) {
      case "price":
        return (a.price - b.price) * dir;
      case "year":
        return (a.year - b.year) * dir;
      case "match":
        return (a.match - b.match) * dir;
      default:
        return 0;
    }
  });

  // Pagination
  const page = query.page ?? 1;
  const pageSize = query.pageSize ?? 20;
  const totalResults = vehicles.length;
  const totalPages = Math.ceil(totalResults / pageSize);
  const start = (page - 1) * pageSize;
  const paged = vehicles.slice(start, start + pageSize);

  return {
    vehicles: paged,
    pagination: { page, pageSize, totalResults, totalPages },
  };
}

// ─── Public API ─────────────────────────────────────────────────────────────

export interface SearchOptions {
  query: SearchQuery;
  /** Arrow tracking IDs forwarded as headers to the BED service. */
  ids?: ArrowServerIds;
  /** Filtered incoming request headers to forward to BED. */
  forwardHeaders?: Record<string, string>;
}

/**
 * Execute a vehicle search.
 *
 * Strategy:
 * 1. If mock mode → filter/sort local mock data and return.
 * 2. Otherwise POST the query to the upstream BED Search Service.
 * 3. Falls back to empty results on failure.
 */
export async function searchVehicles({
  query,
  ids,
  forwardHeaders,
}: SearchOptions): Promise<SearchResult> {
  if (isMockMode()) {
    console.log("[SearchService] Mock mode — filtering local data");
    return getMockResults(query);
  }

  try {
    const data = await getSearchClient().post<SearchResult>("/vehicles/search", query, {
      ids,
      headers: forwardHeaders,
    });
    return data;
  } catch (error) {
    if (error instanceof ArrowServerError) {
      console.error("[SearchService] BED error:", error.message);
    } else {
      console.error("[SearchService] Unexpected error:", error);
    }

    // Return empty results on failure
    return {
      vehicles: [],
      pagination: {
        page: query.page ?? 1,
        pageSize: query.pageSize ?? 20,
        totalResults: 0,
        totalPages: 0,
      },
    };
  }
}
