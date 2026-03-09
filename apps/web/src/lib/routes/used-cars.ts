import { parseVehicleDetailsSegments, tryParseSlug } from "./vehicle-segments";

/**
 * Used-cars URL structure (all under `/used-cars/[[...params]]`):
 *
 * TWO top-level route types:
 *
 *  A. **SRP** (Search Results Page) — any URL that does NOT start with `details/`
 *     Segments are treated as progressive filters forwarded to the search page.
 *     - `/used-cars`                            → SRP (no filters)
 *     - `/used-cars/[body-type]`                → SRP filtered by body type
 *     - `/used-cars/[make]/[model]`             → SRP filtered by make + model
 *     - `/used-cars/[make]/[model]/[trim]`      → SRP filtered by make + model + trim
 *     - `/used-cars/[geo]`                      → TODO: SEO geo pages (treat as SRP for now)
 *
 *  B. **Details** (Vehicle Detail Page) — URL starts with `details/`
 *     - `/used-cars/details/[make]/[model]/[trim]/[year]/[vin]` → VDP
 *     - Invalid `details/...` patterns → notFound (Vehicle Not Found)
 */

// ── SRP filter shape extracted from URL segments ─────────────────────

export interface SrpUrlFilters {
  bodyType?: string;
  make?: string;
  model?: string;
  trim?: string;
}

// ── Discriminated route types ────────────────────────────────────────

export type UsedCarsRoute =
  | { type: "srp"; filters: SrpUrlFilters }
  | {
      type: "details";
      make: string;
      model: string;
      trim: string;
      year: number;
      vin: string;
    };

// ── Known body types (used to disambiguate single-segment URLs) ──────

const KNOWN_BODY_TYPES = new Set([
  "sedan",
  "suv",
  "truck",
  "coupe",
  "hatchback",
  "van",
  "convertible",
  "wagon",
  "minivan",
  "crossover",
]);

// ── Parser ───────────────────────────────────────────────────────────

/** Parse `details/[make]/[model]/[trim]/[year]/[vin]` segments into a details route, or `null`. */
function parseDetailsRoute(segments: string[]): UsedCarsRoute | null {
  if (segments.length !== 6) {
    return null;
  }

  const parsed = parseVehicleDetailsSegments(segments.slice(1));
  if (!parsed) {
    return null;
  }

  return {
    type: "details",
    make: parsed.make,
    model: parsed.model,
    trim: parsed.trim,
    year: parsed.year,
    vin: parsed.vin,
  };
}

/** Build SRP filters from 1–3 URL segments. */
function parseSrpFilters(segments: string[]): SrpUrlFilters {
  if (segments.length === 1) {
    const slug = tryParseSlug(segments[0]);
    if (!slug) {
      return {};
    }
    return KNOWN_BODY_TYPES.has(slug) ? { bodyType: slug } : { make: slug };
  }

  if (segments.length === 2) {
    return {
      make: tryParseSlug(segments[0]),
      model: tryParseSlug(segments[1]),
    };
  }

  if (segments.length === 3) {
    return {
      make: tryParseSlug(segments[0]),
      model: tryParseSlug(segments[1]),
      trim: tryParseSlug(segments[2]),
    };
  }

  return {};
}

/**
 * Parse the optional catch-all `params` array from `[[...params]]` into
 * a discriminated `UsedCarsRoute`.
 *
 * - URLs starting with `details/` are parsed as VDP routes.
 *   Returns `null` for malformed details URLs → page should call `notFound()`.
 * - All other URLs are treated as SRP with progressive filters.
 */
export function parseUsedCarsParams(segments: string[] | undefined): UsedCarsRoute | null {
  if (!segments || segments.length === 0) {
    return { type: "srp", filters: {} };
  }

  if (segments[0]?.toLowerCase() === "details") {
    return parseDetailsRoute(segments);
  }

  return { type: "srp", filters: parseSrpFilters(segments) };
}

// ── Path builders ────────────────────────────────────────────────────

export function buildUsedCarsPath(route: UsedCarsRoute): string {
  if (route.type === "details") {
    return `/used-cars/details/${route.make}/${route.model}/${route.trim}/${route.year}/${route.vin}`;
  }

  // SRP paths
  const { filters } = route;
  if (filters.bodyType) {
    return `/used-cars/${filters.bodyType}`;
  }
  if (filters.make && filters.model && filters.trim) {
    return `/used-cars/${filters.make}/${filters.model}/${filters.trim}`;
  }
  if (filters.make && filters.model) {
    return `/used-cars/${filters.make}/${filters.model}`;
  }
  if (filters.make) {
    return `/used-cars/${filters.make}`;
  }
  return "/used-cars";
}
