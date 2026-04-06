import type {
  AvailableFilters,
  FilterState,
} from "@features/search/components/filter-sidebar/types";
import {
  changedFacetSections,
  listEqual,
  mergeUniqueSections,
} from "@features/search/lib/facet-utils";
import type {
  AppliedFilter,
  FacetCounts,
  RefineFilter,
} from "@features/search/lib/search-types";
import type { FacetSection } from "@features/search/lib/search-types";
import { useCallback, useRef, useState, useTransition } from "react";
import type { RefineSearchFilter, SearchProviderProps } from "./search-context-types";

// ── Applied filter merge helpers (used at initialization only) ──────

const ARRAY_APPLIED_FILTER_FIELDS = {
  bodyStyle: "selectedBodyStyles",
  comfortFeature: "selectedComfortFeatures",
  drivetrain: "selectedDrivetrains",
  exteriorColor: "selectedExteriorColors",
  exteriorFeature: "selectedExteriorFeatures",
  fuelType: "selectedFuelTypes",
  interiorColor: "selectedInteriorColors",
  model: "selectedModels",
  performanceFeature: "selectedPerformanceFeatures",
  safetyFeature: "selectedSafetyFeatures",
  seatingCapacity: "selectedSeatingCapacity",
  techFeature: "selectedTechFeatures",
  transmission: "selectedTransmissions",
} as const;

const SCALAR_APPLIED_FILTER_FIELDS = {
  distance: "selectedMileage",
  mileage_condition: "selectedMileage",
  price: "selectedPriceQuick",
  year: "selectedYearQuick",
} as const;

function appendUnique(values: string[] | undefined, value: string): string[] {
  return Array.from(new Set([...(values ?? []), value]));
}

function mergeAppliedIntoFilterState(base: FilterState, applied: AppliedFilter[]): FilterState {
  let next: FilterState = { ...base };

  for (const a of applied) {
    const arrayKey =
      ARRAY_APPLIED_FILTER_FIELDS[a.field as keyof typeof ARRAY_APPLIED_FILTER_FIELDS];
    if (arrayKey) {
      next = {
        ...next,
        [arrayKey]: appendUnique(next[arrayKey], a.value),
      } as FilterState;
      continue;
    }

    const scalarKey =
      SCALAR_APPLIED_FILTER_FIELDS[a.field as keyof typeof SCALAR_APPLIED_FILTER_FIELDS];
    if (scalarKey) {
      next = {
        ...next,
        [scalarKey]: a.displayText ?? a.value,
      } as FilterState;
      continue;
    }

    if (a.field === "inspection160") {
      next = {
        ...next,
        inspection160: a.value === "true" || a.value === "1" || a.displayText === "true",
      };
    }
  }

  return next;
}

// ── Initial values for query-owned state (passed to useSearchQueries) ──

const INITIAL_AVAILABLE_FILTERS: AvailableFilters = {
  bodyStyles: [],
  comfortFeatures: [],
  drivetrains: [],
  exteriorColors: [],
  exteriorFeatures: [],
  fuelTypes: [],
  hasInspection160: false,
  interiorColors: [],
  models: [],
  performanceFeatures: [],
  safetyFeatures: [],
  seatingCapacity: [],
  techFeatures: [],
  totalCount: 0,
  transmissions: [],
};

const INITIAL_FACET_COUNTS: FacetCounts = {
  bodyType: {},
  drivetrain: {},
  exteriorColor: {},
  fuelType: {},
  interiorColor: {},
  mileageRange: { min: 0, max: 0 },
  priceRange: { min: 0, max: 0 },
  transmission: {},
  yearRange: { min: 0, max: 0 },
};

// ── Hook ────────────────────────────────────────────────────────────

export function useSearchState({
  defaultFilterState,
  initialAppliedFilters = [],
  initialBodyStyles = [],
  initialSearchQuery = "",
  initialUrlFilters,
}: Omit<SearchProviderProps, "children">) {
  // ── User interaction state ──────────────────────────────────────
  const [sortOption, setSortOption] = useState<"recommended" | "low-high" | "high-low">(
    "recommended"
  );
  const [filterState, setFilterState] = useState<FilterState>(() => {
    const base: FilterState = {
      ...defaultFilterState,
      ...initialUrlFilters,
      ...(initialBodyStyles.length > 0 ? { selectedBodyStyles: initialBodyStyles } : {}),
    };
    return initialAppliedFilters.length > 0
      ? mergeAppliedIntoFilterState(base, initialAppliedFilters)
      : base;
  });
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const searchQueryRef = useRef(initialSearchQuery);
  const [labelFilter, setLabelFilter] = useState("");
  const [refineSearchFilters, setRefineSearchFilters] = useState<RefineSearchFilter[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  // Start empty: server provides initial filter data via SSR props, so no
  // sections are pending until the user applies a filter change (which calls
  // applyFiltersSearch → setPendingFacetSections). This also prevents a
  // hydration mismatch — loading spinners must not render during SSR since
  // the query layer that resolves them is client-only.
  const [pendingFacetSections, setPendingFacetSections] =
    useState<FacetSection[]>([]);

  // ── UI state ────────────────────────────────────────────────────
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isProgressVisible, setIsProgressVisible] = useState(false);
  const progressTimers = useRef<number[]>([]);

  // ── Transitions ─────────────────────────────────────────────────
  const [, startFilterTransition] = useTransition();

  // ── Latest-value refs (Vercel advanced-use-latest pattern) ─────
  // Store current values in refs so applyFiltersSearch can read them
  // without capturing state in its closure. This makes the callback
  // stable ([] deps) while always accessing the latest values.
  const latestRef = useRef({ filterState, searchQuery, labelFilter, refineSearchFilters });
  latestRef.current = { filterState, searchQuery, labelFilter, refineSearchFilters };

  // ── Actions ─────────────────────────────────────────────────────

  const applyFiltersSearch = useCallback(
    (
      newFilterState: FilterState,
      opts?: {
        searchQuery?: string;
        labelFilter?: string;
        refineFilters?: RefineFilter[];
        preservePage?: boolean;
      }
    ) => {
      const prev = latestRef.current;
      const nextSearchQuery = opts?.searchQuery ?? searchQueryRef.current;
      const nextLabelFilter = opts?.labelFilter ?? prev.labelFilter;

      let nextRefineFilters: RefineFilter[];
      if (opts?.refineFilters === undefined) {
        nextRefineFilters = prev.refineSearchFilters;
      } else {
        const uniq: RefineFilter[] = [];
        for (const f of opts.refineFilters) {
          if (!uniq.some((u) => u.id === f.id)) {
            uniq.push(f);
          }
        }
        nextRefineFilters = uniq;
      }

      const sections = changedFacetSections(prev.filterState, newFilterState, {
        queryChanged: nextSearchQuery !== prev.searchQuery,
        labelChanged: nextLabelFilter !== prev.labelFilter,
        refineChanged:
          opts?.refineFilters !== undefined ||
          !listEqual(
            prev.refineSearchFilters.map((f) => f.id),
            nextRefineFilters.map((f) => f.id)
          ),
      });

      // Trigger progress bar animation — directly in the event handler
      // (Vercel rerender-move-effect-to-event pattern: no useEffect needed)
      for (const timer of progressTimers.current) {
        clearTimeout(timer);
      }
      progressTimers.current = [];
      setIsProgressVisible(false);
      setProgress(0);
      progressTimers.current.push(
        window.setTimeout(() => {
          setIsProgressVisible(true);
          setProgress(0);
        }, 16) as unknown as number,
        window.setTimeout(() => setProgress(78), 20) as unknown as number,
        window.setTimeout(() => setProgress(100), 850) as unknown as number,
        window.setTimeout(() => {
          setIsProgressVisible(false);
        }, 1200) as unknown as number
      );

      startFilterTransition(() => {
        setFilterState(newFilterState);
        setSearchQuery(nextSearchQuery);
        searchQueryRef.current = nextSearchQuery;
        setLabelFilter(nextLabelFilter);
        setRefineSearchFilters(nextRefineFilters);
        if (!opts?.preservePage) {
          setCurrentPage(1);
        }
        setPendingFacetSections((prev) => mergeUniqueSections(prev, sections));
      });
    },
    [] // stable — reads from latestRef, no stale closures
  );

  return {
    // User interaction state
    sortOption,
    setSortOption,
    filterState,
    setFilterState,
    searchQuery,
    setSearchQuery,
    searchQueryRef,
    labelFilter,
    setLabelFilter,
    refineSearchFilters,
    setRefineSearchFilters,
    currentPage,
    setCurrentPage,
    pendingFacetSections,
    setPendingFacetSections,

    // UI state
    isFilterOpen,
    setIsFilterOpen,
    progress,
    setProgress,
    isProgressVisible,
    setIsProgressVisible,

    // Initial values for query options (read once, not reactive)
    initialAvailableFilters: INITIAL_AVAILABLE_FILTERS,
    initialFacetCounts: INITIAL_FACET_COUNTS,

    // Actions
    applyFiltersSearch,
  } as const;
}
