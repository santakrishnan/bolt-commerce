import { z } from "zod";

/**
 * SRP (Search Results Page) query parameter types and parsing utilities.
 *
 * URL: /used-cars?make=toyota&model=camry&yearMin=2020&...
 *
 * Uses Zod schemas with `.catch()` so invalid values are silently
 * dropped rather than throwing errors — search should always render.
 */

// Helpers

/** Extract a single string from a query param (string | string[] | undefined) */
function toSingleString(val: unknown): string | undefined {
  if (typeof val === "string" && val.length > 0) {
    return val;
  }
  if (Array.isArray(val) && typeof val[0] === "string" && val[0].length > 0) {
    return val[0];
  }
  return undefined;
}

/** Parse a query param as a positive number, or undefined */
function toPositiveNumber(val: unknown): number | undefined {
  const s = toSingleString(val);
  if (s === undefined) {
    return undefined;
  }
  const n = Number(s);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

// Sort options

const srpSortSchema = z.enum([
  "price-asc",
  "price-desc",
  "year-desc",
  "year-asc",
  "mileage-asc",
  "newest",
]);

export type SrpSortOption = z.infer<typeof srpSortSchema>;

// SRP filters schema

const srpFiltersSchema = z.looseObject({}).transform((params) => ({
  make: toSingleString(params.make)?.toLowerCase(),
  model: toSingleString(params.model)?.toLowerCase(),
  trimSlug: toSingleString(params.trimSlug)?.toLowerCase(),
  yearMin: toPositiveNumber(params.yearMin),
  yearMax: toPositiveNumber(params.yearMax),
  priceMin: toPositiveNumber(params.priceMin),
  priceMax: toPositiveNumber(params.priceMax),
  mileageMax: toPositiveNumber(params.mileageMax),
  sort: srpSortSchema.catch("newest").parse(toSingleString(params.sort)) as
    | SrpSortOption
    | undefined,
  page: toPositiveNumber(params.page) ?? 1,
}));

export type SrpFilters = z.output<typeof srpFiltersSchema>;

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Parse and sanitize search params from the URL into typed filters.
 * Invalid values are silently dropped (not errors) — search always renders.
 */
export function parseSrpSearchParams(
  searchParams: Record<string, string | string[] | undefined>
): SrpFilters {
  return srpFiltersSchema.parse(searchParams);
}
