"use client";

import { SEARCH_PAGE_SIZE } from "@features/search/lib/constants";
import type {
  MockFacetedSearchRequest,
  MockFilterSearchRequest,
} from "@features/search/lib/mock-faceted-search";
import { useDebouncedValue } from "@shared/hooks/use-debounced-value";
import { createContext, useCallback, useContext, useMemo, useTransition } from "react";
import { useSearchQueries } from "./search-context-queries";
import { useSearchState } from "./search-context-state";
import type { SearchContextValue, SearchProviderProps } from "./search-context-types";

const SearchContext = createContext<SearchContextValue | undefined>(undefined);

export function useSearchContext() {
  const ctx = useContext(SearchContext);
  if (!ctx) {
    throw new Error("useSearchContext must be used within SearchProvider");
  }
  return ctx;
}

export function SearchProvider({
  children,
  initialAppliedFilters = [],
  initialBodyStyles = [],
  initialDataFetched,
  initialSearchQuery = "",
  initialUrlFilters,
  defaultFilterState,
  initialVehicles = [],
  initialTotalCount = 0,
}: SearchProviderProps) {
  const [isFilterPending, startFilterTransition] = useTransition();
  const hasServerData = initialDataFetched ?? initialVehicles.length > 0;
  const state = useSearchState({
    defaultFilterState,
    initialAppliedFilters,
    initialBodyStyles,
    initialSearchQuery,
    initialUrlFilters,
    initialVehicles,
    initialTotalCount,
  });

  const {
    filterState,
    searchQuery,
    labelFilter,
    refineSearchFilters,
    sortOption,
    currentPage,
    pendingFacetSections,
    setVehiclePool,
    setAvailableFilters,
    setFacetCounts,
    setTotalCount,
    setPendingFacetSections,
    setSearchId,
    setFilterId,
    setLoadingFacetSections,
    handleSearch,
    setSmartFilters,
    setAppliedFilters,
  } = state;

  const searchRequestPayload = useMemo<MockFacetedSearchRequest>(
    () => ({
      filterState,
      searchQuery,
      labelFilter,
      refineFilters: refineSearchFilters,
      sortOption,
      page: currentPage,
      pageSize: SEARCH_PAGE_SIZE,
      includeFacets: false,
    }),
    [filterState, searchQuery, labelFilter, refineSearchFilters, sortOption, currentPage]
  );

  const filterRequestPayload = useMemo<MockFilterSearchRequest>(
    () => ({
      filterState,
      searchQuery,
      labelFilter,
      refineFilters: refineSearchFilters,
      updatedSections: pendingFacetSections,
    }),
    [filterState, searchQuery, labelFilter, refineSearchFilters, pendingFacetSections]
  );

  const debouncedSearchRequest = useDebouncedValue(searchRequestPayload, 300);
  const debouncedFilterRequest = useDebouncedValue(filterRequestPayload, 300);

  const { isSearching, isInitialLoading } = useSearchQueries(
    debouncedSearchRequest,
    debouncedFilterRequest,
    {
      setVehiclePool,
      setTotalCount,
      setSearchId,
      setAvailableFilters,
      setFacetCounts,
      setPendingFacetSections,
      setFilterId,
      setLoadingFacetSections,
      setSmartFilters,
      setAppliedFilters,
      handleSearch,
    },
    hasServerData
  );

  const setSortOptionTransitioned = useCallback(
    (
      value:
        | "recommended"
        | "low-high"
        | "high-low"
        | ((
            prev: "recommended" | "low-high" | "high-low"
          ) => "recommended" | "low-high" | "high-low")
    ) => {
      startFilterTransition(() => {
        state.setSortOption(value);
      });
    },
    [state.setSortOption]
  );

  const setLabelFilterTransitioned = useCallback(
    (value: string | ((prev: string) => string)) => {
      startFilterTransition(() => {
        state.setLabelFilter(value);
      });
    },
    [state.setLabelFilter]
  );

  const contextValue = useMemo(
    () => ({
      vehiclePool: state.vehiclePool,
      setVehiclePool: state.setVehiclePool,
      filterState: state.filterState,
      setFilterState: state.setFilterState,
      searchQuery: state.searchQuery,
      setSearchQuery: state.setSearchQuery,
      searchQueryRef: state.searchQueryRef,
      labelFilter: state.labelFilter,
      setLabelFilter: setLabelFilterTransitioned,
      refineSearchFilters: state.refineSearchFilters,
      appliedFilters: state.appliedFilters,
      setRefineSearchFilters: state.setRefineSearchFilters,
      currentPage: state.currentPage,
      setCurrentPage: state.setCurrentPage,
      progress: state.progress,
      setProgress: state.setProgress,
      isProgressVisible: state.isProgressVisible,
      setIsProgressVisible: state.setIsProgressVisible,
      isFilterOpen: state.isFilterOpen,
      setIsFilterOpen: state.setIsFilterOpen,
      sortOption: state.sortOption,
      setSortOption: setSortOptionTransitioned,
      availableFilters: state.availableFilters,
      facetCounts: state.facetCounts,
      smartFilters: state.smartFilters,
      totalCount: state.totalCount,
      isSearching,
      isInitialLoading,
      isFilterPending,
      loadingFacetSections: state.loadingFacetSections,
      applyFiltersSearch: state.applyFiltersSearch,
      setAppliedFilters: state.setAppliedFilters,
      handleSearch: state.handleSearch,
    }),
    [
      state.vehiclePool,
      state.setVehiclePool,
      state.filterState,
      state.setFilterState,
      state.searchQuery,
      state.setSearchQuery,
      state.searchQueryRef,
      state.labelFilter,
      setLabelFilterTransitioned,
      state.refineSearchFilters,
      state.setRefineSearchFilters,
      state.currentPage,
      state.setCurrentPage,
      state.progress,
      state.setProgress,
      state.isProgressVisible,
      state.setIsProgressVisible,
      state.isFilterOpen,
      state.setIsFilterOpen,
      state.sortOption,
      setSortOptionTransitioned,
      state.availableFilters,
      state.facetCounts,
      state.smartFilters,
      state.totalCount,
      isSearching,
      isInitialLoading,
      isFilterPending,
      state.loadingFacetSections,
      state.applyFiltersSearch,
      state.handleSearch,
      state.appliedFilters,
      state.setAppliedFilters,
    ]
  );

  return <SearchContext.Provider value={contextValue}>{children}</SearchContext.Provider>;
}
