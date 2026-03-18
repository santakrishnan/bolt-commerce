"use client";
import type { ReactNode } from "react";
import { createContext, use, useCallback, useRef, useState } from "react";
import type { FilterState } from "~/components/features/search/filter-sidebar";
import type { AvailableFilters } from "~/components/features/search/filter-sidebar/types";
import type { Vehicle } from "~/lib/search/data";
import {
  buildAllAvailableFilters,
  buildAllFacetCounts,
  type FacetCounts,
  mockSearchVehicles,
  type RefineFilter,
} from "~/lib/search/mock-search-service";

export type { AvailableFilters } from "~/components/features/search/filter-sidebar/types";
export type { FacetCounts, RefineFilter } from "~/lib/search/mock-search-service";

interface FilterPreset {
  labelFilter?: string;
  selectedMileage?: string;
  selectedPriceQuick?: string;
}

interface RefineSearchFilter {
  id: string;
  label: string;
}

interface SearchContextValue {
  /**
   * Execute a full filter search via the mock service.
   * Updates `vehiclePool`, `availableFilters`, and resets to page 1.
   * Swap the internals for a real API call without changing any caller.
   */
  applyFiltersSearch: (
    newFilterState: FilterState,
    opts?: {
      searchQuery?: string;
      labelFilter?: string;
      refineFilters?: RefineFilter[];
    }
  ) => Promise<void>;
  /** Available filter chip values derived from the latest search response */
  availableFilters: AvailableFilters;
  currentPage: number;
  /** Per-filter-value vehicle counts from the latest search response */
  facetCounts: FacetCounts;
  filterState: FilterState;
  isFilterOpen: boolean;
  isProgressVisible: boolean;
  /** True while a mock-search fetch is in flight */
  isSearching: boolean;
  labelFilter: string;
  progress: number;
  refineSearchFilters: RefineSearchFilter[];
  searchQuery: string;
  searchQueryRef: React.MutableRefObject<string>;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
  setIsFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsProgressVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setLabelFilter: React.Dispatch<React.SetStateAction<string>>;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
  setRefineSearchFilters: React.Dispatch<React.SetStateAction<RefineSearchFilter[]>>;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  setSortOption: React.Dispatch<React.SetStateAction<"recommended" | "low-high" | "high-low">>;
  setVehiclePool: React.Dispatch<React.SetStateAction<Vehicle[]>>;
  sortOption: "recommended" | "low-high" | "high-low";
  /** Total matched vehicles before pagination (use for page count display) */
  totalCount: number;
  vehiclePool: Vehicle[];
  vehicles: Vehicle[];
}

const SearchContext = createContext<SearchContextValue | undefined>(undefined);

export function useSearchContext() {
  const ctx = use(SearchContext);
  if (!ctx) {
    throw new Error("useSearchContext must be used within SearchProvider");
  }
  return ctx;
}

interface SearchProviderProps {
  children: ReactNode;
  defaultFilterState: FilterState;
  initialBodyStyles?: string[];
  initialFilterPreset?: FilterPreset;
  initialSearchQuery?: string;
  vehicles: Vehicle[];
}

export function SearchProvider({
  children,
  vehicles,
  initialBodyStyles = [],
  initialSearchQuery = "",
  initialFilterPreset,
  defaultFilterState,
}: SearchProviderProps) {
  const [sortOption, setSortOption] = useState<"recommended" | "low-high" | "high-low">(
    "recommended"
  );
  const [vehiclePool, setVehiclePool] = useState<Vehicle[]>(vehicles);
  const [filterState, setFilterState] = useState<FilterState>({
    ...defaultFilterState,
    ...(initialBodyStyles.length > 0 ? { selectedBodyStyles: initialBodyStyles } : {}),
    ...(initialFilterPreset?.selectedPriceQuick
      ? { selectedPriceQuick: initialFilterPreset.selectedPriceQuick }
      : {}),
    ...(initialFilterPreset?.selectedMileage
      ? { selectedMileage: initialFilterPreset.selectedMileage }
      : {}),
  });
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const searchQueryRef = useRef(initialSearchQuery);
  const [labelFilter, setLabelFilter] = useState(initialFilterPreset?.labelFilter ?? "");
  const [refineSearchFilters, setRefineSearchFilters] = useState<RefineSearchFilter[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [progress, setProgress] = useState(0);
  const [isProgressVisible, setIsProgressVisible] = useState(false);

  // Available filters and facet counts — initialised from the full vehicle
  // list so all chips start as enabled before the first explicit search.
  const [availableFilters, setAvailableFilters] = useState<AvailableFilters>(() =>
    buildAllAvailableFilters(vehicles)
  );
  const [facetCounts, setFacetCounts] = useState<FacetCounts>(() => buildAllFacetCounts(vehicles));
  const [totalCount, setTotalCount] = useState<number>(vehicles.length);
  const [isSearching, setIsSearching] = useState(false);

  /**
   * Calls the mock search service with the given filter state + optional
   * overrides.  Updates vehiclePool + availableFilters and resets to page 1.
   *
   * Swap the body of this function for a real `fetch("/api/search", ...)` call
   * once the BED Search Service is available — callers don't need to change.
   */
  const applyFiltersSearch = useCallback(
    async (
      newFilterState: FilterState,
      opts?: {
        searchQuery?: string;
        labelFilter?: string;
        refineFilters?: RefineFilter[];
      }
    ) => {
      setIsSearching(true);
      try {
        const result = await mockSearchVehicles({
          filterState: newFilterState,
          searchQuery: opts?.searchQuery ?? searchQueryRef.current,
          labelFilter: opts?.labelFilter,
          refineFilters: opts?.refineFilters,
          vehicles,
          sortOption,
          page: 1,
          pageSize: vehicles.length, // Get all results for accurate available-filters computation; pagination is handled in the UI
        });
        setVehiclePool(result.vehicles);
        setTotalCount(result.totalCount);
        setAvailableFilters(result.availableFilters);
        setFacetCounts(result.facetCounts);
        setCurrentPage(1);
      } finally {
        setIsSearching(false);
      }
    },
    // `vehicles`, `sortOption`, and `searchQueryRef` are stable references
    [vehicles, sortOption]
  );

  return (
    <SearchContext
      value={{
        vehicles,
        vehiclePool,
        setVehiclePool,
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
        progress,
        setProgress,
        isProgressVisible,
        setIsProgressVisible,
        isFilterOpen,
        setIsFilterOpen,
        sortOption,
        setSortOption,
        availableFilters,
        facetCounts,
        totalCount,
        isSearching,
        applyFiltersSearch,
      }}
    >
      {children}
    </SearchContext>
  );
}
