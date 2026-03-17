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

function matchesTextSearch(vehicle: Vehicle, searchQuery: string): boolean {
  const q = searchQuery.trim().toLowerCase();
  if (!q) {
    return true;
  }

  // Shortcut queries — checked by stable config map, no inline magic strings.
  const shortcut = TEXT_SEARCH_SHORTCUTS[q];
  if (shortcut) {
    return shortcut(vehicle);
  }

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
function computeFiltersAndFacets(vehicles: Vehicle[]): {
  availableFilters: AvailableFilters;
  facetCounts: FacetCounts;
} {
  // ── Facet count accumulators ──
  const bodyTypeCount: Record<string, number> = {};
  const fuelTypeCount: Record<string, number> = {};
  const drivetrainCount: Record<string, number> = {};
  const transmissionCount: Record<string, number> = {};
  const priceRangeCount: Record<string, number> = {};
  const mileageRangeCount: Record<string, number> = {};
  const yearRangeCount: Record<string, number> = {};
  const exteriorColorCount: Record<string, number> = {};
  const interiorColorCount: Record<string, number> = {};

  // ── Available filter set accumulators ──
  const bodyStyles = new Set<string>();
  const fuelTypes = new Set<string>();
  const drivetrains = new Set<string>();
  const transmissions = new Set<string>();
  const exteriorColors = new Set<string>();
  const interiorColors = new Set<string>();
  const models = new Set<string>();
  const safetyFeatures = new Set<string>();
  const comfortFeatures = new Set<string>();
  const techFeatures = new Set<string>();
  const exteriorFeatures = new Set<string>();
  const perfFeatures = new Set<string>();
  const seatingCap = new Set<string>();
  let hasInspection160 = false;

  for (const v of vehicles) {
    // Facet counts (slug keys — resolved to display strings in UI)
    const priceBucket = getVehiclePriceBucket(v.price);
    const mileageBucket = getVehicleMileageBucket(v.mileage);
    const yearBucket = getVehicleYearBucket(v.year);

    bodyTypeCount[v.bodyType] = (bodyTypeCount[v.bodyType] ?? 0) + 1;
    fuelTypeCount[v.fuelType] = (fuelTypeCount[v.fuelType] ?? 0) + 1;
    drivetrainCount[v.drivetrain] = (drivetrainCount[v.drivetrain] ?? 0) + 1;
    transmissionCount[v.transmission] = (transmissionCount[v.transmission] ?? 0) + 1;
    exteriorColorCount[v.extColorName] = (exteriorColorCount[v.extColorName] ?? 0) + 1;
    interiorColorCount[v.intColorName] = (interiorColorCount[v.intColorName] ?? 0) + 1;
    priceRangeCount[priceBucket] = (priceRangeCount[priceBucket] ?? 0) + 1;
    mileageRangeCount[mileageBucket] = (mileageRangeCount[mileageBucket] ?? 0) + 1;
    yearRangeCount[yearBucket] = (yearRangeCount[yearBucket] ?? 0) + 1;

    // Available filters (derived from the same pass — no second loop needed)
    bodyStyles.add(v.bodyType);
    fuelTypes.add(v.fuelType);
    drivetrains.add(v.drivetrain);
    transmissions.add(v.transmission);
    exteriorColors.add(v.extColorName);
    interiorColors.add(v.intColorName);
    models.add(v.model);
    if (v.inspection160) {
      hasInspection160 = true;
    }
    for (const f of v.features.safety) {
      safetyFeatures.add(f);
    }
    for (const f of v.features.comfort) {
      comfortFeatures.add(f);
    }
    for (const f of v.features.tech) {
      techFeatures.add(f);
    }
    for (const f of v.features.exterior) {
      exteriorFeatures.add(f);
    }
    for (const f of v.features.performance) {
      perfFeatures.add(f);
    }
    for (const s of v.seatingCapacity) {
      seatingCap.add(s);
    }
  }

  return {
    availableFilters: {
      totalCount: vehicles.length,
      hasInspection160,
      bodyStyles: [...bodyStyles],
      fuelTypes: [...fuelTypes],
      drivetrains: [...drivetrains],
      transmissions: [...transmissions],
      exteriorColors: [...exteriorColors],
      interiorColors: [...interiorColors],
      models: [...models],
      safetyFeatures: [...safetyFeatures],
      comfortFeatures: [...comfortFeatures],
      techFeatures: [...techFeatures],
      exteriorFeatures: [...exteriorFeatures],
      performanceFeatures: [...perfFeatures],
      seatingCapacity: [...seatingCap],
    },
    facetCounts: {
      bodyType: bodyTypeCount,
      fuelType: fuelTypeCount,
      drivetrain: drivetrainCount,
      transmission: transmissionCount,
      priceRange: priceRangeCount,
      mileageRange: mileageRangeCount,
      yearRange: yearRangeCount,
      exteriorColor: exteriorColorCount,
      interiorColor: interiorColorCount,
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

  const matched = vehicles.filter((v) =>
    matchesFilters(v, filterState, searchQuery, labelFilter, refineFilters)
  );

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
