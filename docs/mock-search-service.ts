/**
 * Mock Search Service
 *
 * Full-fledged client-side filter engine that mirrors what a real BED
 * Search API would do. Applies all FilterState dimensions and returns:
 *   - `vehicles` — matched and optionally sorted results
 *   - `availableFilters` — which chip values have ≥1 match in the current
 *     result set (used to grey-out / disable chips in the sidebar and cards)
 *
 * When a real API is integrated, replace `mockSearchVehicles` with a real
 * fetch. The `SearchFilterRequest` / `SearchFilterResult` contract stays.
 */

import type {
  AvailableFilters,
  FilterState,
} from "~/components/features/search/filter-sidebar/types";
import { filterSections } from "~/lib/search/filter-sections";
import { mockVehicles, type Vehicle } from "./mock-vehicles";

// vehicle-enrichments.ts is no longer needed —
// all enrichment data is now part of the flat Vehicle document.

export type { AvailableFilters } from "~/components/features/search/filter-sidebar/types";

/** Supported sort orders — keep in sync with the UI sort selector. */
export type SortOption = "recommended" | "low-high" | "high-low";

// ─── Public types ───

export interface RefineFilter {
  id: string;
  label: string;
}

/**
 * Request shape for a search/filter operation.
 * - `filterState`: current UI filter selections.
 * - optional `searchQuery`, `labelFilter`, `refineFilters`.
 * - optional `vehicles` to search within (defaults to `mockVehicles`).
 */
export interface SearchFilterRequest {
  filterState: FilterState;
  labelFilter?: string;
  /** 1-based page number. Defaults to 1. */
  page?: number;
  /** Results per page. Defaults to 20. */
  pageSize?: number;
  refineFilters?: RefineFilter[];
  searchQuery?: string;
  /** Sort order to apply to matched results before pagination. Defaults to "recommended". */
  sortOption?: SortOption;
  vehicles?: Vehicle[];
}

export interface SearchFilterResult {
  availableFilters: AvailableFilters;
  /** Per-filter-value counts for the matched result set. */
  facetCounts: FacetCounts;
  /** Current 1-based page number. */
  page: number;
  /** Results per page used for this response. */
  pageSize: number;
  /** Total matched vehicles before pagination. */
  totalCount: number;
  vehicles: Vehicle[];
}

/**
 * Per-dimension counts of how many vehicles in the current result set
 * match each filter value. Use to render "(12)" counters next to filter chips.
 */
export interface FacetCounts {
  bodyType: Record<string, number>;
  drivetrain: Record<string, number>;
  exteriorColor: Record<string, number>;
  fuelType: Record<string, number>;
  interiorColor: Record<string, number>;
  mileageRange: Record<string, number>;
  priceRange: Record<string, number>;
  transmission: Record<string, number>;
  yearRange: Record<string, number>;
}

// ─── Module-level constants (avoids object re-creation on every call) ───

const PRICE_LIMITS: Record<string, number> = {
  "Cars Under $20,000": 19_999,
  "$10k or less": 10_000,
  "$20k or less": 20_000,
  "$30k or less": 30_000,
  "$40k or less": 40_000,
  "$50k or less": 50_000,
};

const MILEAGE_LIMITS: Record<string, number> = {
  "Low Miles": 19_999,
  "Under 15k mi": 15_000,
  "Under 30k mi": 30_000,
  "Under 50k mi": 50_000,
  "Under 75k mi": 75_000,
  "Under 100k mi": 100_000,
};

/**
 * Year range config — maps UI filter option label to numeric min/max bounds.
 * Add new ranges here; matchesYearFilter reads this automatically.
 */
const YEAR_RANGES: Record<string, { min?: number; max?: number }> = {
  "2023 or newer": { min: 2023 },
  "2019-2021": { min: 2019, max: 2021 },
  "2015-2018": { min: 2015, max: 2018 },
  "pre-2015": { max: 2014 },
};

/**
 * Price bucket slug → human-readable display label.
 * Exported so UI components can resolve facetCounts keys to display strings.
 */
export const PRICE_BUCKET_LABELS: Record<string, string> = {
  "under-10k": "Under $10k",
  "10k-20k": "$10k–20k",
  "20k-30k": "$20k–30k",
  "30k-40k": "$30k–40k",
  "40k-50k": "$40k–50k",
  "50k-plus": "$50k+",
};

/**
 * Mileage bucket slug → human-readable display label.
 * Exported so UI components can resolve facetCounts keys to display strings.
 */
export const MILEAGE_BUCKET_LABELS: Record<string, string> = {
  "under-15k": "Under 15k mi",
  "15k-30k": "15k–30k mi",
  "30k-50k": "30k–50k mi",
  "50k-75k": "50k–75k mi",
  "75k-100k": "75k–100k mi",
  "100k-plus": "100k+ mi",
};

/**
 * Year bucket slug → human-readable display label.
 * Exported so UI components can resolve facetCounts keys to display strings.
 */
export const YEAR_BUCKET_LABELS: Record<string, string> = {
  "2023-or-newer": "2023 or newer",
  "2022": "2022",
  "2019-2021": "2019–2021",
  "2015-2018": "2015–2018",
  "pre-2015": "Pre-2015",
};

const TEXT_SEARCH_SHORTCUTS: Record<string, (v: Vehicle) => boolean> = {
  "cars under $20,000": (v) => v.price < 20_000,
  "cars-under-$20,000": (v) => v.price < 20_000,
  "shop excellent deals": (v) => v.labels.some((l) => l.toLowerCase().includes("excellent price")),
  "shop-excellent-deals": (v) => v.labels.some((l) => l.toLowerCase().includes("excellent price")),
  "low miles": (v) => v.mileage < 20_000,
  "low-miles": (v) => v.mileage < 20_000,
  "price drop": (v) => v.labels.some((l) => l.toLowerCase().includes("price drop")),
  "price-drop": (v) => v.labels.some((l) => l.toLowerCase().includes("price drop")),
};

// ─── Helpers ───
/** "Hybrid (Hybrid)" → "Hybrid",  "Gasoline (Gas)" → "Gasoline" */
function fuelLabelToKey(label: string): string {
  return label.split("(")[0]?.trim() ?? label;
}

function hasAll(available: string[], required: string[]): boolean {
  return required.every((r) => available.includes(r));
}

// ─── Filter sub-predicates ───

function matchesLabelFilter(vehicle: Vehicle, labelFilter: string): boolean {
  if (!labelFilter) {
    return true;
  }
  return vehicle.labels.some((l) => l.toLowerCase().includes(labelFilter.toLowerCase()));
}

function matchesBodyStyle(vehicle: Vehicle, s: FilterState): boolean {
  if (s.selectedBodyStyles.length === 0) {
    return true;
  }
  return s.selectedBodyStyles.some((bs) => bs.toLowerCase() === vehicle.bodyType.toLowerCase());
}

function matchesPriceFilter(vehicle: Vehicle, s: FilterState): boolean {
  const max = PRICE_LIMITS[s.selectedPriceQuick];
  return max === undefined ? true : vehicle.price <= max;
}

function matchesMileageFilter(vehicle: Vehicle, s: FilterState): boolean {
  const max = MILEAGE_LIMITS[s.selectedMileage];
  return max === undefined ? true : vehicle.mileage <= max;
}

function matchesYearFilter(vehicle: Vehicle, s: FilterState): boolean {
  if (!s.selectedYearQuick) {
    return true;
  }
  const range = YEAR_RANGES[s.selectedYearQuick];
  if (!range) {
    return true;
  }
  if (range.min !== undefined && vehicle.year < range.min) {
    return false;
  }
  if (range.max !== undefined && vehicle.year > range.max) {
    return false;
  }
  return true;
}

function matchesColors(vehicle: Vehicle, s: FilterState): boolean {
  if (
    s.selectedExteriorColors.length > 0 &&
    !s.selectedExteriorColors.includes(vehicle.extColorName)
  ) {
    return false;
  }
  if (
    s.selectedInteriorColors.length > 0 &&
    !s.selectedInteriorColors.includes(vehicle.intColorName)
  ) {
    return false;
  }
  return true;
}

function matchesModel(vehicle: Vehicle, s: FilterState): boolean {
  if (s.selectedModels.length === 0) {
    return true;
  }
  const titleLower = vehicle.title.toLowerCase();
  return s.selectedModels.some((m) => titleLower.includes(m.toLowerCase()));
}

function matchesEnrichmentFilters(vehicle: Vehicle, s: FilterState): boolean {
  if (!matchesFuelType(vehicle, s)) {
    return false;
  }
  if (s.selectedDrivetrains.length > 0 && !s.selectedDrivetrains.includes(vehicle.drivetrain)) {
    return false;
  }
  if (
    s.selectedTransmissions.length > 0 &&
    !s.selectedTransmissions.includes(vehicle.transmission)
  ) {
    return false;
  }
  if (s.inspection160 && !vehicle.inspection160) {
    return false;
  }
  return matchesFeatureSets(vehicle, s);
}

function matchesFuelType(vehicle: Vehicle, s: FilterState): boolean {
  if (s.selectedFuelTypes.length === 0) {
    return true;
  }
  const keys = s.selectedFuelTypes.map(fuelLabelToKey);
  return keys.some((k) => vehicle.fuelType.toLowerCase() === k.toLowerCase());
}

function matchesFeatureSets(vehicle: Vehicle, s: FilterState): boolean {
  if (
    s.selectedSafetyFeatures.length > 0 &&
    !hasAll(vehicle.features.safety, s.selectedSafetyFeatures)
  ) {
    return false;
  }
  if (
    s.selectedComfortFeatures.length > 0 &&
    !hasAll(vehicle.features.comfort, s.selectedComfortFeatures)
  ) {
    return false;
  }
  if (s.selectedTechFeatures.length > 0 && !hasAll(vehicle.features.tech, s.selectedTechFeatures)) {
    return false;
  }
  if (
    s.selectedExteriorFeatures.length > 0 &&
    !hasAll(vehicle.features.exterior, s.selectedExteriorFeatures)
  ) {
    return false;
  }
  if (
    s.selectedPerformanceFeatures.length > 0 &&
    !hasAll(vehicle.features.performance, s.selectedPerformanceFeatures)
  ) {
    return false;
  }
  if (
    s.selectedSeatingCapacity.length > 0 &&
    !hasAll(vehicle.seatingCapacity, s.selectedSeatingCapacity)
  ) {
    return false;
  }
  return true;
}

function matchesRefineFilters(vehicle: Vehicle, refineFilters: RefineFilter[]): boolean {
  if (refineFilters.length === 0) {
    return true;
  }
  const refinedLabels = refineFilters.map((r) => r.label.toLowerCase());
  const allFeatures = [
    ...vehicle.features.safety,
    ...vehicle.features.comfort,
    ...vehicle.features.tech,
    ...vehicle.features.exterior,
    ...vehicle.features.performance,
  ].map((f) => f.toLowerCase());

  return refinedLabels.every((rl) => allFeatures.some((f) => f.includes(rl) || rl.includes(f)));
}

// ─── Compound NLP query support ───────────────────────────────────────────
// Derived from filterSections — no hardcoded body type lists.
const BODY_TYPE_SET: Set<string> = new Set(
  filterSections.bodyStyle.map((s) => s.toLowerCase())
);

/** Price patterns: "under 35k", "under $35,000", "below 20k" */
const PRICE_PATTERN = /(?:under|below|less than)\s*\$?([\d,]+)\s*(k)?/i;

/** Mileage patterns: "low miles", "low mileage", "under 50k miles" */
const MILEAGE_PATTERN = /(?:under|below|less than)\s*\$?([\d,]+)\s*k?\s*(?:miles?|mi)/i;
const LOW_MILES_PATTERN = /\blow[\s-]?(?:miles?|mileage)\b/i;

/**
 * Parse a compound NLP-style query (e.g. "SUV under 35k with low miles")
 * into a list of predicate functions.  Each clause is AND-ed together.
 *
 * Supports:
 *  - Body types (derived from filterSections.bodyStyle)
 *  - Price clauses: "under 35k", "below $20,000"
 *  - Mileage clauses: "low miles", "under 50k miles"
 *  - Feature / keyword clauses: remaining tokens matched against vehicle fields
 *
 * Returns `null` when the query is simple enough for the legacy path.
 */
function parseCompoundQuery(query: string): ((v: Vehicle) => boolean)[] | null {
  // Normalize: replace hyphens/underscores with spaces, collapse whitespace
  const normalized = query.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim().toLowerCase();
  if (!normalized) {
    return null;
  }

  const predicates: ((v: Vehicle) => boolean)[] = [];
  let remaining = normalized;

  // 1. Extract body type tokens
  for (const bodyType of BODY_TYPE_SET) {
    const re = new RegExp(`\\b${bodyType}s?\\b`, "i");
    if (re.test(remaining)) {
      const bt = bodyType;
      predicates.push((v) => v.bodyType.toLowerCase() === bt);
      remaining = remaining.replace(re, " ").trim();
    }
  }

  // 2. Extract "low miles" / "low mileage" before the generic price/mileage patterns
  if (LOW_MILES_PATTERN.test(remaining)) {
    predicates.push((v) => v.mileage < 20_000);
    remaining = remaining.replace(LOW_MILES_PATTERN, " ").trim();
  }

  // 3. Extract mileage clause: "under 50k miles"  (must precede price to avoid ambiguity)
  const mileageMatch = remaining.match(MILEAGE_PATTERN);
  if (mileageMatch) {
    const rawNum = Number(mileageMatch[1]?.replace(/,/g, "") ?? "0");
    const multiplier = mileageMatch[2]?.toLowerCase() === "k" ? 1000 : 1;
    const maxMileage = rawNum * multiplier;
    predicates.push((v) => v.mileage <= maxMileage);
    remaining = remaining.replace(MILEAGE_PATTERN, " ").trim();
  }

  // 4. Extract price clause: "under 35k", "below $20,000"
  const priceMatch = remaining.match(PRICE_PATTERN);
  if (priceMatch) {
    const rawNum = Number(priceMatch[1]?.replace(/,/g, "") ?? "0");
    const multiplier = priceMatch[2]?.toLowerCase() === "k" ? 1000 : 1;
    const maxPrice = rawNum * multiplier;
    predicates.push((v) => v.price <= maxPrice);
    remaining = remaining.replace(PRICE_PATTERN, " ").trim();
  }

  // 5. Strip filler words
  remaining = remaining
    .replace(/\b(with|and|the|a|an|in|near|for|has|have)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // 6. Remaining tokens → free-text keyword match against vehicle fields
  if (remaining.length > 0) {
    const keywords = remaining.split(" ").filter((t) => t.length > 1);
    for (const kw of keywords) {
      const keyword = kw;
      predicates.push(
        (v) =>
          v.title.toLowerCase().includes(keyword) ||
          v.bodyType.toLowerCase().includes(keyword) ||
          v.fuelType.toLowerCase().includes(keyword) ||
          v.labels.some((l) => l.toLowerCase().includes(keyword)) ||
          v.features.comfort.some((f) => f.toLowerCase().includes(keyword)) ||
          v.features.tech.some((f) => f.toLowerCase().includes(keyword)) ||
          v.features.safety.some((f) => f.toLowerCase().includes(keyword)) ||
          v.features.exterior.some((f) => f.toLowerCase().includes(keyword)) ||
          v.features.performance.some((f) => f.toLowerCase().includes(keyword))
      );
    }
  }

  return predicates.length > 0 ? predicates : null;
}

/**
 * Score a vehicle against compound NLP predicates.
 * Returns the fraction of predicates satisfied (0–1).
 */
function scoreCompoundMatch(vehicle: Vehicle, predicates: ((v: Vehicle) => boolean)[]): number {
  if (predicates.length === 0) {
    return 0;
  }
  let hits = 0;
  for (const pred of predicates) {
    if (pred(vehicle)) {
      hits++;
    }
  }
  return hits / predicates.length;
}

/** Cached parsed predicates for the current search query — avoids re-parsing per vehicle. */
let _cachedQuery = "";
let _cachedPredicates: ((v: Vehicle) => boolean)[] | null = null;

function getCachedPredicates(q: string): ((v: Vehicle) => boolean)[] | null {
  if (q !== _cachedQuery) {
    _cachedQuery = q;
    _cachedPredicates = parseCompoundQuery(q);
  }
  return _cachedPredicates;
}

function matchesTextSearch(vehicle: Vehicle, searchQuery: string): boolean {
  const q = searchQuery.trim().toLowerCase();
  if (!q) {
    return true;
  }

  // Shortcut queries — exact match for known phrases.
  const shortcut = TEXT_SEARCH_SHORTCUTS[q];
  if (shortcut) {
    return shortcut(vehicle);
  }

  // Compound NLP query — decompose into clauses and AND them together.
  const predicates = getCachedPredicates(q);
  if (predicates) {
    return predicates.every((pred) => pred(vehicle));
  }

  // Simple fallback — substring match against common fields.
  return (
    vehicle.title.toLowerCase().includes(q) ||
    vehicle.bodyType.toLowerCase().includes(q) ||
    vehicle.miles.toLowerCase().includes(q) ||
    vehicle.labels.some((l) => l.toLowerCase().includes(q)) ||
    vehicle.fuelType.toLowerCase().includes(q)
  );
}

/**
 * Composite predicate that checks whether `vehicle` satisfies the full
 * `FilterState` plus optional `searchQuery`, `labelFilter` and `refineFilters`.
 * All enrichment data is now part of the flat Vehicle document — no JOIN needed.
 */
function matchesFilters(
  vehicle: Vehicle,
  s: FilterState,
  searchQuery: string,
  labelFilter: string,
  refineFilters: RefineFilter[]
): boolean {
  return (
    matchesLabelFilter(vehicle, labelFilter) &&
    matchesBodyStyle(vehicle, s) &&
    matchesPriceFilter(vehicle, s) &&
    matchesMileageFilter(vehicle, s) &&
    matchesYearFilter(vehicle, s) &&
    matchesColors(vehicle, s) &&
    matchesModel(vehicle, s) &&
    matchesEnrichmentFilters(vehicle, s) &&
    matchesRefineFilters(vehicle, refineFilters) &&
    matchesTextSearch(vehicle, searchQuery)
  );
}

// ─── Facet + filter helpers ───────────────────────────────────────────────

/**
 * Map a vehicle price to a stable slug bucket key.
 * Display label resolved in UI via PRICE_BUCKET_LABELS.
 */
function getVehiclePriceBucket(price: number): string {
  if (price < 10_000) {
    return "under-10k";
  }
  if (price < 20_000) {
    return "10k-20k";
  }
  if (price < 30_000) {
    return "20k-30k";
  }
  if (price < 40_000) {
    return "30k-40k";
  }
  if (price < 50_000) {
    return "40k-50k";
  }
  return "50k-plus";
}

/**
 * Map a vehicle mileage to a stable slug bucket key.
 * Display label resolved in UI via MILEAGE_BUCKET_LABELS.
 */
function getVehicleMileageBucket(mileage: number): string {
  if (mileage < 15_000) {
    return "under-15k";
  }
  if (mileage < 30_000) {
    return "15k-30k";
  }
  if (mileage < 50_000) {
    return "30k-50k";
  }
  if (mileage < 75_000) {
    return "50k-75k";
  }
  if (mileage < 100_000) {
    return "75k-100k";
  }
  return "100k-plus";
}

/**
 * Map a vehicle year to a stable slug bucket key.
 * Display label resolved in UI via YEAR_BUCKET_LABELS.
 */
function getVehicleYearBucket(year: number): string {
  if (year >= 2023) {
    return "2023-or-newer";
  }
  if (year === 2022) {
    return "2022";
  }
  if (year >= 2019 && year <= 2021) {
    return "2019-2021";
  }
  if (year >= 2015 && year <= 2018) {
    return "2015-2018";
  }
  return "pre-2015";
}

/**
 * Single O(n) pass: computes both availableFilters (which values exist) and
 * facetCounts (how many vehicles per value) from the same vehicle list.
 *
 * Replaces the previous two-pass approach (computeAvailableFilters +
 * computeFacetCounts). availableFilters is a by-product of the count loop —
 * a value "existing" simply means its count is > 0.
 */
function countFacets(
  v: Vehicle,
  facetAcc: {
    bodyType: Record<string, number>;
    fuelType: Record<string, number>;
    drivetrain: Record<string, number>;
    transmission: Record<string, number>;
    priceRange: Record<string, number>;
    mileageRange: Record<string, number>;
    yearRange: Record<string, number>;
    exteriorColor: Record<string, number>;
    interiorColor: Record<string, number>;
  }
) {
  const priceBucket = getVehiclePriceBucket(v.price);
  const mileageBucket = getVehicleMileageBucket(v.mileage);
  const yearBucket = getVehicleYearBucket(v.year);

  facetAcc.bodyType[v.bodyType] = (facetAcc.bodyType[v.bodyType] ?? 0) + 1;
  facetAcc.fuelType[v.fuelType] = (facetAcc.fuelType[v.fuelType] ?? 0) + 1;
  facetAcc.drivetrain[v.drivetrain] = (facetAcc.drivetrain[v.drivetrain] ?? 0) + 1;
  facetAcc.transmission[v.transmission] = (facetAcc.transmission[v.transmission] ?? 0) + 1;
  facetAcc.exteriorColor[v.extColorName] = (facetAcc.exteriorColor[v.extColorName] ?? 0) + 1;
  facetAcc.interiorColor[v.intColorName] = (facetAcc.interiorColor[v.intColorName] ?? 0) + 1;
  facetAcc.priceRange[priceBucket] = (facetAcc.priceRange[priceBucket] ?? 0) + 1;
  facetAcc.mileageRange[mileageBucket] = (facetAcc.mileageRange[mileageBucket] ?? 0) + 1;
  facetAcc.yearRange[yearBucket] = (facetAcc.yearRange[yearBucket] ?? 0) + 1;
}

interface FilterAccumulator {
  bodyStyles: Set<string>;
  comfortFeatures: Set<string>;
  drivetrains: Set<string>;
  exteriorColors: Set<string>;
  exteriorFeatures: Set<string>;
  fuelTypes: Set<string>;
  hasInspection160: boolean;
  interiorColors: Set<string>;
  models: Set<string>;
  performanceFeatures: Set<string>;
  safetyFeatures: Set<string>;
  seatingCapacity: Set<string>;
  techFeatures: Set<string>;
  transmissions: Set<string>;
}

function accumulateAvailableFilters(v: Vehicle, filterAcc: FilterAccumulator) {
  filterAcc.bodyStyles.add(v.bodyType);
  filterAcc.fuelTypes.add(v.fuelType);
  filterAcc.drivetrains.add(v.drivetrain);
  filterAcc.transmissions.add(v.transmission);
  filterAcc.exteriorColors.add(v.extColorName);
  filterAcc.interiorColors.add(v.intColorName);
  filterAcc.models.add(v.model);
  if (v.inspection160) {
    filterAcc.hasInspection160 = true;
  }
  for (const f of v.features.safety) {
    filterAcc.safetyFeatures.add(f);
  }
  for (const f of v.features.comfort) {
    filterAcc.comfortFeatures.add(f);
  }
  for (const f of v.features.tech) {
    filterAcc.techFeatures.add(f);
  }
  for (const f of v.features.exterior) {
    filterAcc.exteriorFeatures.add(f);
  }
  for (const f of v.features.performance) {
    filterAcc.performanceFeatures.add(f);
  }
  for (const s of v.seatingCapacity) {
    filterAcc.seatingCapacity.add(s);
  }
}

function computeFiltersAndFacets(vehicles: Vehicle[]): {
  availableFilters: AvailableFilters;
  facetCounts: FacetCounts;
} {
  // ── Facet count accumulators ──
  const facetAcc = {
    bodyType: {} as Record<string, number>,
    fuelType: {} as Record<string, number>,
    drivetrain: {} as Record<string, number>,
    transmission: {} as Record<string, number>,
    priceRange: {} as Record<string, number>,
    mileageRange: {} as Record<string, number>,
    yearRange: {} as Record<string, number>,
    exteriorColor: {} as Record<string, number>,
    interiorColor: {} as Record<string, number>,
  };

  // ── Available filter set accumulators ──
  const filterAcc = {
    bodyStyles: new Set<string>(),
    fuelTypes: new Set<string>(),
    drivetrains: new Set<string>(),
    transmissions: new Set<string>(),
    exteriorColors: new Set<string>(),
    interiorColors: new Set<string>(),
    models: new Set<string>(),
    safetyFeatures: new Set<string>(),
    comfortFeatures: new Set<string>(),
    techFeatures: new Set<string>(),
    exteriorFeatures: new Set<string>(),
    performanceFeatures: new Set<string>(),
    seatingCapacity: new Set<string>(),
    hasInspection160: false,
  };

  for (const v of vehicles) {
    countFacets(v, facetAcc);
    accumulateAvailableFilters(v, filterAcc);
  }

  return {
    availableFilters: {
      totalCount: vehicles.length,
      hasInspection160: filterAcc.hasInspection160,
      bodyStyles: [...filterAcc.bodyStyles],
      fuelTypes: [...filterAcc.fuelTypes],
      drivetrains: [...filterAcc.drivetrains],
      transmissions: [...filterAcc.transmissions],
      exteriorColors: [...filterAcc.exteriorColors],
      interiorColors: [...filterAcc.interiorColors],
      models: [...filterAcc.models],
      safetyFeatures: [...filterAcc.safetyFeatures],
      comfortFeatures: [...filterAcc.comfortFeatures],
      techFeatures: [...filterAcc.techFeatures],
      exteriorFeatures: [...filterAcc.exteriorFeatures],
      performanceFeatures: [...filterAcc.performanceFeatures],
      seatingCapacity: [...filterAcc.seatingCapacity],
    },
    facetCounts: {
      bodyType: facetAcc.bodyType,
      fuelType: facetAcc.fuelType,
      drivetrain: facetAcc.drivetrain,
      transmission: facetAcc.transmission,
      priceRange: facetAcc.priceRange,
      mileageRange: facetAcc.mileageRange,
      yearRange: facetAcc.yearRange,
      exteriorColor: facetAcc.exteriorColor,
      interiorColor: facetAcc.interiorColor,
    },
  };
}

/**
 * Sort vehicles by the requested sort option.
 * "recommended" preserves the original relevance order from the data.
 */
function applySortOption(vehicles: Vehicle[], sortOption: SortOption): Vehicle[] {
  if (sortOption === "low-high") {
    return [...vehicles].sort((a, b) => a.price - b.price);
  }
  if (sortOption === "high-low") {
    return [...vehicles].sort((a, b) => b.price - a.price);
  }
  return vehicles; // "recommended" — preserve data order
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Build the initial available-filter set from the full vehicle list.
 * Call once on mount; updated on each search via mockSearchVehicles.
 */
export function buildAllAvailableFilters(vehicles: Vehicle[]): AvailableFilters {
  return computeFiltersAndFacets(vehicles).availableFilters;
}

/**
 * Build the initial facet count map from the full vehicle list.
 * Call once on mount; updated on each search via mockSearchVehicles.
 */
export function buildAllFacetCounts(vehicles: Vehicle[]): FacetCounts {
  return computeFiltersAndFacets(vehicles).facetCounts;
}

/**
 * Synchronously compute which filter chip values are available and how many
 * vehicles match each value, given the current draft filter state.
 *
 * Uses DISJUNCTIVE FACETING (Algolia/Amazon standard):
 * ─ For each multi-select dimension D:
 *     available values = vehicles matching ALL filters EXCEPT dimension D.
 *   This means selecting "SUV" keeps all other body styles enabled (you can
 *   still add "Truck"), while still narrowing Fuel Type to only what SUVs have.
 * ─ Single-select range dims (Price / Year / Mileage) always apply globally
 *   and narrow every other dimension.
 *
 * Never simulates latency — runs synchronously for instant sidebar feedback.
 */
export function computeAvailableFiltersSync(
  allVehicles: Vehicle[],
  filterState: FilterState,
  opts?: { searchQuery?: string; labelFilter?: string; refineFilters?: RefineFilter[] }
): { availableFilters: AvailableFilters; facetCounts: FacetCounts } {
  const sq = opts?.searchQuery ?? "";
  const lf = opts?.labelFilter ?? "";
  const rf = opts?.refineFilters ?? [];

  /** Filter with an override applied on top of the current filterState. */
  function filterWith(override: Partial<FilterState>): Vehicle[] {
    const s = { ...filterState, ...override };
    const result = allVehicles.filter((v) => matchesFilters(v, s, sq, lf, rf));
    // Never return empty during drafting — fall back to full list so chips
    // don't all grey out mid-selection (Algolia/Shopify convention).
    return result.length > 0 ? result : allVehicles;
  }

  // ── Fully-matched set → used for count badges (facetCounts) ──────────────
  const fullyMatched = allVehicles.filter((v) => matchesFilters(v, filterState, sq, lf, rf));
  const countSource = fullyMatched.length > 0 ? fullyMatched : allVehicles;
  const { facetCounts } = computeFiltersAndFacets(countSource);

  // ── Per-dimension disjunctive sets ────────────────────────────────────────
  // Each multi-select dimension is computed by excluding its OWN filter so
  // users can keep adding values in the same dimension (OR within a dim,
  // AND across dims).
  const forBodyStyles = filterWith({ selectedBodyStyles: [] });
  const forFuelTypes = filterWith({ selectedFuelTypes: [] });
  const forExtColors = filterWith({ selectedExteriorColors: [] });
  const forIntColors = filterWith({ selectedInteriorColors: [] });
  const forModels = filterWith({ selectedModels: [] });
  const forDrivetrains = filterWith({ selectedDrivetrains: [] });
  const forTransmissions = filterWith({ selectedTransmissions: [] });
  const forSafety = filterWith({ selectedSafetyFeatures: [] });
  const forComfort = filterWith({ selectedComfortFeatures: [] });
  const forTech = filterWith({ selectedTechFeatures: [] });
  const forExterior = filterWith({ selectedExteriorFeatures: [] });
  const forPerf = filterWith({ selectedPerformanceFeatures: [] });
  const forSeating = filterWith({ selectedSeatingCapacity: [] });
  const forInspection = filterWith({ inspection160: false });

  const availableFilters: AvailableFilters = {
    // totalCount = actual fully-matched count (what Apply would produce)
    totalCount: fullyMatched.length,
    hasInspection160: forInspection.some((v) => v.inspection160),
    bodyStyles: [...new Set(forBodyStyles.map((v) => v.bodyType))],
    fuelTypes: [...new Set(forFuelTypes.map((v) => v.fuelType))],
    exteriorColors: [...new Set(forExtColors.map((v) => v.extColorName))],
    interiorColors: [...new Set(forIntColors.map((v) => v.intColorName))],
    models: [...new Set(forModels.map((v) => v.model))],
    drivetrains: [...new Set(forDrivetrains.map((v) => v.drivetrain))],
    transmissions: [...new Set(forTransmissions.map((v) => v.transmission))],
    safetyFeatures: [...new Set(forSafety.flatMap((v) => v.features.safety))],
    comfortFeatures: [...new Set(forComfort.flatMap((v) => v.features.comfort))],
    techFeatures: [...new Set(forTech.flatMap((v) => v.features.tech))],
    exteriorFeatures: [...new Set(forExterior.flatMap((v) => v.features.exterior))],
    performanceFeatures: [...new Set(forPerf.flatMap((v) => v.features.performance))],
    seatingCapacity: [...new Set(forSeating.flatMap((v) => v.seatingCapacity))],
  };

  return { availableFilters, facetCounts };
}

/**
 * Execute a full-fledged mock vehicle search.
 * Applies filters → sorts → paginates → returns results + facets in one call.
 *
 * Only simulates network latency in development so tests and CI run at full
 * speed. Swap the body for a real `fetch("/api/search", …)` when the BED is
 * ready — the SearchFilterRequest → SearchFilterResult contract stays.
 */
export async function mockSearchVehicles(req: SearchFilterRequest): Promise<SearchFilterResult> {
  if (process.env.NODE_ENV === "development") {
    await new Promise<void>((resolve) => setTimeout(resolve, 150 + Math.random() * 100));
  }

  const {
    filterState,
    searchQuery = "",
    labelFilter = "",
    refineFilters = [],
    vehicles = mockVehicles,
    sortOption = "recommended",
    page = 1,
    pageSize = 20,
  } = req;

  let matched = vehicles.filter((v) =>
    matchesFilters(v, filterState, searchQuery, labelFilter, refineFilters)
  );

  // ── Progressive relaxation for compound NLP queries ──────────────────
  // When a strict AND of all parsed predicates yields 0 results, score
  // each vehicle by how many predicates it satisfies and return the best
  // partial matches.  This mirrors how real search engines (Algolia,
  // Elasticsearch) handle "optional filters" / soft constraints.
  if (matched.length === 0 && searchQuery.trim()) {
    const predicates = getCachedPredicates(searchQuery.trim().toLowerCase());
    if (predicates && predicates.length > 1) {
      // Score every vehicle that passes the non-text filters
      const candidates = vehicles.filter((v) =>
        matchesFilters(v, filterState, "", labelFilter, refineFilters)
      );

      const scored = candidates
        .map((v) => ({ vehicle: v, score: scoreCompoundMatch(v, predicates) }))
        .filter((entry) => entry.score > 0)
        .sort((a, b) => b.score - a.score);

      // Take vehicles that match at least the primary predicate (body type or first clause)
      const minScore = 1 / predicates.length; // at least one predicate
      matched = scored.filter((e) => e.score >= minScore).map((e) => e.vehicle);
    }
  }

  // Compute facets + available filters from matched set.
  // When nothing matched, fall back to the full list so chips don't all grey
  // out — a UX convention used by Algolia, Shopify, and similar platforms.
  const facetSource = matched.length > 0 ? matched : vehicles;
  const { availableFilters, facetCounts } = computeFiltersAndFacets(facetSource);

  // Sort BEFORE pagination so every page respects the sort order.
  const sorted = applySortOption(matched, sortOption);

  // Paginate
  const offset = (page - 1) * pageSize;
  const paginated = sorted.slice(offset, offset + pageSize);

  return {
    vehicles: paginated,
    totalCount: matched.length,
    page,
    pageSize,
    availableFilters,
    facetCounts,
  };
}
