/**
 * Search API Route
 *
 * GET /api/search — Vehicle search proxy
 *
 * Query params are mapped to `SearchQuery` and forwarded to the
 * Search Service. Supports pagination, filtering, and sorting.
 *
 * Examples:
 *   GET /api/search?query=toyota&page=1&pageSize=20
 *   GET /api/search?priceMin=10000&priceMax=30000&sortBy=price&sortOrder=asc
 */

import { type NextRequest, NextResponse } from "next/server";
import { ARROW_HEADER } from "~/lib/arrow/constants";
import { extractForwardHeaders } from "~/lib/arrow/server-api";
import { type SearchQuery, searchVehicles } from "~/services/search";

const isDev = process.env.NODE_ENV === "development";
function noop() {
  /* no-op */
}
const log = isDev ? console.log.bind(console, "[SearchAPI]") : noop;
const logError = console.error.bind(console, "[SearchAPI]");

/**
 * Parse query parameters into a `SearchQuery` object.
 */
function parseSearchParams(params: URLSearchParams): SearchQuery {
  const query: SearchQuery = {};

  const q = params.get("query") ?? params.get("q");
  if (q) {
    query.query = q;
  }

  const page = params.get("page");
  if (page) {
    query.page = Number.parseInt(page, 10) || 1;
  }

  const pageSize = params.get("pageSize");
  if (pageSize) {
    query.pageSize = Number.parseInt(pageSize, 10) || 20;
  }

  const sortBy = params.get("sortBy");
  if (sortBy && ["price", "year", "mileage", "match", "relevance"].includes(sortBy)) {
    query.sortBy = sortBy as SearchQuery["sortBy"];
  }

  const sortOrder = params.get("sortOrder");
  if (sortOrder === "asc" || sortOrder === "desc") {
    query.sortOrder = sortOrder;
  }

  const priceMin = params.get("priceMin");
  if (priceMin) {
    query.priceMin = Number.parseInt(priceMin, 10);
  }

  const priceMax = params.get("priceMax");
  if (priceMax) {
    query.priceMax = Number.parseInt(priceMax, 10);
  }

  const yearMin = params.get("yearMin");
  if (yearMin) {
    query.yearMin = Number.parseInt(yearMin, 10);
  }

  const yearMax = params.get("yearMax");
  if (yearMax) {
    query.yearMax = Number.parseInt(yearMax, 10);
  }

  const bodyStyles = params.get("bodyStyles");
  if (bodyStyles) {
    query.bodyStyles = bodyStyles.split(",").filter(Boolean);
  }

  const makes = params.get("makes");
  if (makes) {
    query.makes = makes.split(",").filter(Boolean);
  }

  const models = params.get("models");
  if (models) {
    query.models = models.split(",").filter(Boolean);
  }

  const fuelTypes = params.get("fuelTypes");
  if (fuelTypes) {
    query.fuelTypes = fuelTypes.split(",").filter(Boolean);
  }

  return query;
}

// ─── GET /api/search ────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = parseSearchParams(searchParams);

    log("Search query:", query);

    const forwardHeaders = extractForwardHeaders(request);
    const ids = {
      sessionId: request.headers.get(ARROW_HEADER.SESSION_ID) ?? null,
      fingerprintId: request.headers.get(ARROW_HEADER.FP_ID) ?? null,
      profileId: request.headers.get(ARROW_HEADER.PROFILE_ID) ?? null,
    };

    const result = await searchVehicles({
      query,
      ids,
      forwardHeaders,
    });

    return NextResponse.json(result);
  } catch (error) {
    logError("GET error:", error);
    return NextResponse.json(
      { error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
