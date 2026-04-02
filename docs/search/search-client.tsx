"use client";

import {
  defaultFilterState,
  FilterSidebar,
  type FilterState,
} from "@features/search/components/filter-sidebar";
import { SearchHero } from "@features/search/components/search-hero";
import { VehicleResults } from "@features/search/components/vehicle-results";
import { useSearchContext } from "@features/search/context/search-context";
import { SEARCH_PAGE_SIZE } from "@features/search/lib/constants";
import { mockVehicles } from "@features/search/lib/mock-vehicles";
import {
  parseSearchUrlState,
  serializeSearchUrlState,
} from "@features/search/lib/url-filters";
import { buildFilterOptions } from "@features/vehicle-card/components/refine-search-modal.helpers";
import { useDebouncedValue } from "@shared/hooks/use-debounced-value";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useDeferredValue, useEffect, useMemo, useRef } from "react";
import { slugify } from "utils";

// Animation timing for the top progress bar (kept as a helper for clarity)
function getProgressTransition(progress: number): string {
  if (progress === 100) {
    return "width 0.25s ease-in, opacity 0.4s ease 0.2s";
  }
  if (progress === 0) {
    return "none";
  }
  return "width 1.5s cubic-bezier(0.05, 0.6, 0.1, 1), opacity 0.15s ease";
}

// Helper functions for building active filters list
function addSingleFilter(
  filters: { label: string; type: string; value: string }[],
  value: string,
  type: string
) {
  if (value) {
    filters.push({ label: value, type, value });
  }
}

function addArrayFilters(
  filters: { label: string; type: string; value: string }[],
  arr: string[],
  type: string
) {
  for (const value of arr) {
    filters.push({ label: value, type, value });
  }
}

function buildActiveFilters(
  filterState: FilterState,
  labelFilter: string,
  refineSearchFilters: { id: string; label: string }[],
  appliedFilters: { field?: string; value: string; displayText?: string }[]
) {
  const filters: { label: string; type: string; value: string; isRefineSearch?: boolean }[] = [];
  addSingleFilter(filters, filterState.selectedPriceQuick, "price");
  addSingleFilter(filters, filterState.selectedYearQuick, "year");
  addSingleFilter(filters, filterState.selectedMileage, "mileage");
  addArrayFilters(filters, filterState.selectedBodyStyles, "bodyStyle");
  addArrayFilters(filters, filterState.selectedExteriorColors, "exteriorColor");
  addArrayFilters(filters, filterState.selectedInteriorColors, "interiorColor");
  addArrayFilters(filters, filterState.selectedFuelTypes, "fuelType");
  addArrayFilters(filters, filterState.selectedModels, "model");
  addArrayFilters(filters, filterState.selectedSafetyFeatures, "safetyFeature");
  addArrayFilters(filters, filterState.selectedComfortFeatures, "comfortFeature");
  addArrayFilters(filters, filterState.selectedTechFeatures, "techFeature");
  addArrayFilters(filters, filterState.selectedExteriorFeatures, "exteriorFeature");
  addArrayFilters(filters, filterState.selectedPerformanceFeatures, "performanceFeature");
  addArrayFilters(filters, filterState.selectedSeatingCapacity, "seatingCapacity");
  addArrayFilters(filters, filterState.selectedDrivetrains, "drivetrain");
  addArrayFilters(filters, filterState.selectedTransmissions, "transmission");

  if (filterState.inspection160) {
    filters.push({ label: "160-Point Inspection", type: "inspection", value: "160" });
  }
  if (labelFilter) {
    filters.push({ label: labelFilter, type: "label", value: labelFilter });
  }
  for (const refineFilter of refineSearchFilters) {
    filters.push({ label: refineFilter.label, type: "refineSearch", value: refineFilter.id });
  }

  for (const af of appliedFilters) {
    const label = af.displayText ?? af.value;
    filters.push({ label, type: "applied", value: af.value });
  }

  const unique: { label: string; type: string; value: string; isRefineSearch?: boolean }[] = [];
  const seen = new Set<string>();
  for (const f of filters) {
    const slugLabel = slugify(f.label || "");
    const slugValue = slugify(f.value || "");
    const keys = [`label:${slugLabel}`, `value:${slugValue}`, `type:${f.type}:${slugValue}`];

    const isDuplicate = keys.some((k) => seen.has(k));
    if (isDuplicate) {
      continue;
    }

    unique.push(f);
    for (const k of keys) {
      seen.add(k);
    }
  }

  return unique;
}

interface SearchClientProps {
  initialQuickFilters?: string[];
}

export function SearchClient({ initialQuickFilters }: SearchClientProps) {
  const {
    vehiclePool,
    filterState,
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
    isProgressVisible,
    isFilterOpen,
    setIsFilterOpen,
    availableFilters,
    totalCount,
    loadingFacetSections,
    applyFiltersSearch,
    isFilterPending,
    isInitialLoading,
    appliedFilters,
    setAppliedFilters,
  } = useSearchContext();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const itemsPerPage = SEARCH_PAGE_SIZE;
  const prevPageRef = useRef(currentPage);

  // Scroll to top when page changes (Story 1.1 — added [currentPage] dep)
  useEffect(() => {
    if (prevPageRef.current === currentPage) {
      return;
    }
    prevPageRef.current = currentPage;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  // ── URL sync ──────────────────────────────────────────────────────
  // SRP URL contract: only ?q= is managed. Filters/sort/page are
  // client-side context only. Single effect writes searchQuery → URL.
  // On browser back/forward, searchParams change triggers the read path.

  // Read: URL → state (browser back/forward)
  const isInternalUpdate = useRef(false);
  useEffect(() => {
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false;
      return;
    }
    const parsed = parseSearchUrlState(searchParams);
    const urlQuery = parsed.searchQuery ?? "";
    if (urlQuery !== searchQuery) {
      setSearchQuery(urlQuery);
      searchQueryRef.current = urlQuery;
    }
  }, [searchParams, searchQuery, setSearchQuery, searchQueryRef]);

  // Write: state → URL (debounced)
  const debouncedSearchQuery = useDebouncedValue(searchQuery, 250);
  useEffect(() => {
    const serialized = serializeSearchUrlState(debouncedSearchQuery);
    const currentQ = searchParams.get("q") ?? "";
    const trimmedQuery = debouncedSearchQuery.trim();
    if (trimmedQuery === currentQ) {
      return;
    }
    isInternalUpdate.current = true;
    const nextUrl = serialized ? `${pathname}?${serialized}` : pathname;
    router.replace(nextUrl, { scroll: false });
  }, [debouncedSearchQuery, pathname, router, searchParams]);

  const handleApplyFilters = useCallback(
    (newState: FilterState) => {
      applyFiltersSearch(newState, {
        searchQuery,
        labelFilter,
        refineFilters: refineSearchFilters,
      });
    },
    [applyFiltersSearch, searchQuery, labelFilter, refineSearchFilters]
  );

  const activeFilters = useMemo(
    () => buildActiveFilters(filterState, labelFilter, refineSearchFilters, appliedFilters),
    [filterState, labelFilter, refineSearchFilters, appliedFilters]
  );

  const displaySearchQuery = searchQuery?.includes("-")
    ? searchQuery.replace(/-/g, " ")
    : searchQuery;

  const deferredVehicles = useDeferredValue(vehiclePool);
  const deferredTotalCount = useDeferredValue(totalCount);
  const isPending = deferredVehicles !== vehiclePool || isFilterPending;

  const removeFilter = (type: string, value: string) => {
    let nextState: FilterState = filterState;
    let nextLabelFilter = labelFilter;
    let nextRefine = refineSearchFilters;

    switch (type) {
      case "price":
        nextState = { ...filterState, selectedPriceQuick: "" };
        break;
      case "year":
        nextState = { ...filterState, selectedYearQuick: "" };
        break;
      case "mileage":
        nextState = { ...filterState, selectedMileage: "" };
        break;
      case "bodyStyle":
        nextState = {
          ...filterState,
          selectedBodyStyles: filterState.selectedBodyStyles.filter((v) => v !== value),
        };
        break;
      case "exteriorColor":
        nextState = {
          ...filterState,
          selectedExteriorColors: filterState.selectedExteriorColors.filter((v) => v !== value),
        };
        break;
      case "interiorColor":
        nextState = {
          ...filterState,
          selectedInteriorColors: filterState.selectedInteriorColors.filter((v) => v !== value),
        };
        break;
      case "fuelType":
        nextState = {
          ...filterState,
          selectedFuelTypes: filterState.selectedFuelTypes.filter((v) => v !== value),
        };
        break;
      case "model":
        nextState = {
          ...filterState,
          selectedModels: filterState.selectedModels.filter((v) => v !== value),
        };
        break;
      case "safetyFeature":
        nextState = {
          ...filterState,
          selectedSafetyFeatures: filterState.selectedSafetyFeatures.filter((v) => v !== value),
        };
        break;
      case "comfortFeature":
        nextState = {
          ...filterState,
          selectedComfortFeatures: filterState.selectedComfortFeatures.filter((v) => v !== value),
        };
        break;
      case "techFeature":
        nextState = {
          ...filterState,
          selectedTechFeatures: filterState.selectedTechFeatures.filter((v) => v !== value),
        };
        break;
      case "exteriorFeature":
        nextState = {
          ...filterState,
          selectedExteriorFeatures: filterState.selectedExteriorFeatures.filter((v) => v !== value),
        };
        break;
      case "performanceFeature":
        nextState = {
          ...filterState,
          selectedPerformanceFeatures: filterState.selectedPerformanceFeatures.filter(
            (v) => v !== value
          ),
        };
        break;
      case "seatingCapacity":
        nextState = {
          ...filterState,
          selectedSeatingCapacity: filterState.selectedSeatingCapacity.filter((v) => v !== value),
        };
        break;
      case "drivetrain":
        nextState = {
          ...filterState,
          selectedDrivetrains: filterState.selectedDrivetrains.filter((v) => v !== value),
        };
        break;
      case "transmission":
        nextState = {
          ...filterState,
          selectedTransmissions: filterState.selectedTransmissions.filter((v) => v !== value),
        };
        break;
      case "inspection":
        nextState = { ...filterState, inspection160: false };
        break;
      case "label":
        nextLabelFilter = "";
        setLabelFilter("");
        break;
      case "refineSearch":
        nextRefine = refineSearchFilters.filter((f) => f.id !== value);
        setRefineSearchFilters(nextRefine);
        break;
      case "applied":
        if (setAppliedFilters) {
          const nextApplied = (appliedFilters || []).filter((a) => a.value !== value);
          setAppliedFilters(nextApplied);
        }
        break;
      default:
        break;
    }

    applyFiltersSearch(nextState, {
      searchQuery,
      labelFilter: nextLabelFilter,
      refineFilters: nextRefine,
    });
  };

  const resetFilters = () => {
    searchQueryRef.current = "";
    applyFiltersSearch(defaultFilterState, {
      searchQuery: "",
      labelFilter: "",
      refineFilters: [],
    });
  };

  const allModalFilterMeta = useMemo(() => {
    const { allFilters } = buildFilterOptions(mockVehicles);
    const ids = new Set<string>();
    const labelLower = new Set<string>();
    for (const f of allFilters) {
      ids.add(f.id);
      ids.add(slugify(f.label));
      labelLower.add(f.label.toLowerCase());
    }
    return { ids, labelLower };
  }, []);

  const applyRefineFilters = (filters: { id: string; label: string }[]) => {
    const unique: { id: string; label: string }[] = [];
    for (const f of filters) {
      if (!unique.some((u) => u.id === f.id)) {
        unique.push(f);
      }
    }
    setRefineSearchFilters(unique);

    const keepIds = new Set<string>();
    const keepLabelLower = new Set<string>();
    for (const f of unique) {
      keepIds.add(f.id);
      keepIds.add(slugify(f.label));
      keepLabelLower.add(f.label.toLowerCase());
    }

    const nextState: Partial<Record<keyof FilterState, unknown>> = { ...filterState } as Partial<
      Record<keyof FilterState, unknown>
    >;
    for (const key of Object.keys(nextState) as Array<keyof FilterState>) {
      const val = nextState[key];
      if (Array.isArray(val)) {
        nextState[key] = (val as string[]).filter((v: string) => {
          const inModalSet =
            allModalFilterMeta.ids.has(v) ||
            allModalFilterMeta.ids.has(slugify(v)) ||
            allModalFilterMeta.labelLower.has(v.toLowerCase());

          if (!inModalSet) {
            return true;
          }

          return keepIds.has(v) || keepIds.has(slugify(v)) || keepLabelLower.has(v.toLowerCase());
        });
      }
    }

    applyFiltersSearch(nextState as FilterState, {
      searchQuery,
      labelFilter,
      refineFilters: unique,
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 lg:px-0">
      <FilterSidebar
        availableFilters={availableFilters}
        filterState={filterState}
        isOpen={isFilterOpen}
        labelFilter={labelFilter}
        loadingFacetSections={loadingFacetSections}
        onApply={handleApplyFilters}
        onClose={() => setIsFilterOpen(false)}
        onReset={resetFilters}
        refineFilters={refineSearchFilters}
        searchQuery={searchQuery}
        vehicleCount={totalCount}
      />

      <main className="relative flex-1 bg-gray-100">
        <Suspense fallback={null}>
          <SearchHero
            activeFilters={activeFilters}
            onRemoveFilter={removeFilter}
            onReset={resetFilters}
            onSearch={() => {
              setCurrentPage(1);
            }}
            onSearchChange={(query) => {
              searchQueryRef.current = query;
              setSearchQuery(query);
            }}
            onToggleFilter={() => setIsFilterOpen(true)}
            searchQuery={displaySearchQuery}
            suggestedPills={initialQuickFilters}
            vehicleCount={totalCount}
            vehiclesAvailable={totalCount}
          />
        </Suspense>

        <div className="mx-6 md:mx-0">
          <div className="relative h-px overflow-hidden bg-(--color-structure-interaction-subtle-border)">
            <div
              aria-hidden
              className="absolute top-0 left-0 h-full"
              style={{
                width: `${progress}%`,
                opacity: isProgressVisible ? 1 : 0,
                background: "var(--primary)",
                transition: getProgressTransition(progress),
              }}
              suppressHydrationWarning
            />
          </div>
        </div>

        <VehicleResults
          activeFilters={activeFilters}
          currentPage={currentPage}
          isInitialLoading={isInitialLoading}
          isPending={isPending}
          itemsPerPage={itemsPerPage}
          onApplyRefineFilters={applyRefineFilters}
          onPageChange={setCurrentPage}
          onRemoveFilter={removeFilter}
          onReset={resetFilters}
          onSearch={() => {
            setCurrentPage(1);
          }}
          onToggleFilter={() => setIsFilterOpen(true)}
          searchQuery={searchQuery}
          totalCount={deferredTotalCount}
          vehicles={deferredVehicles}
        />
      </main>
    </div>
  );
}
