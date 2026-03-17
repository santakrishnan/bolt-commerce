"use client";

// Progress bar animation helper
function getProgressTransition(progress: number): string {
  if (progress === 100) {
    return "width 0.25s ease-in, opacity 0.4s ease 0.2s";
  }
  if (progress === 0) {
    return "none";
  }
  // Fast start → dramatic deceleration (NProgress-style crawl)
  return "width 1.5s cubic-bezier(0.05, 0.6, 0.1, 1), opacity 0.15s ease";
}

import { useRef } from "react";
import {
  defaultFilterState,
  FilterSidebar,
  type FilterState,
} from "~/components/features/search/filter-sidebar";
import { SearchHero } from "~/components/features/search/search-hero";
import { VehicleResults } from "~/components/features/search/vehicle-results";
import { useSearchNavigation } from "~/hooks/use-search-navigation";
import type { Vehicle } from "~/lib/search/data";
import { useSearchContext } from "./search-context";

interface FilterPreset {
  selectedPriceQuick?: string;
  selectedMileage?: string;
  /** Background label filter — matches vehicle.labels, not shown in search box */
  labelFilter?: string;
}

interface SearchClientProps {
  vehicles: Vehicle[];
  initialBodyStyles?: string[];
  initialSearchQuery?: string;
  initialFilterPreset?: FilterPreset;
}

function matchesTextQuery(vehicle: Vehicle, query: string): boolean {
  return (
    vehicle.title.toLowerCase().includes(query) ||
    vehicle.miles.toLowerCase().includes(query) ||
    vehicle.bodyType.toLowerCase().includes(query) ||
    vehicle.labels.some((label) => label.toLowerCase().includes(query))
  );
}

export function SearchClient({ vehicles }: SearchClientProps) {
  const {
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
    availableFilters,
    applyFiltersSearch,
  } = useSearchContext();
  const { navigate } = useSearchNavigation({ mode: "replace", scroll: false, recordHistory: true });
  const progressTimers = useRef<number[]>([]);
  const itemsPerPage = 12;

  // Compute filtered vehicle count based on search query + body styles + background label filter
  const filteredVehicles = vehiclePool.filter((vehicle) => {
    // Background label filter (Excellent Deals / Price Drop)
    if (
      labelFilter &&
      !vehicle.labels.some((l) => l.toLowerCase().includes(labelFilter.toLowerCase()))
    ) {
      return false;
    }
    // Body style chip filter
    if (
      filterState.selectedBodyStyles.length > 0 &&
      !filterState.selectedBodyStyles.some(
        (s) => s.toLowerCase() === vehicle.bodyType.toLowerCase()
      )
    ) {
      return false;
    }
    // Price quick filter — from "Cars Under $20,000" quick-link chip
    if (filterState.selectedPriceQuick === "Cars Under $20,000" && vehicle.price >= 20_000) {
      return false;
    }
    // Mileage quick filter — from "Low Miles" quick-link chip
    if (filterState.selectedMileage === "Low Miles" && vehicle.mileage >= 20_000) {
      return false;
    }
    // User-typed search query
    if (!searchQuery.trim()) {
      return true;
    }
    const query = searchQuery.toLowerCase();

    // ── Quick-finder preset queries ──────────────────────────────────────────
    // These originate from VehicleQuickLinkCard and require semantic matching
    // that cannot be satisfied by plain text search.
    //   "Cars Under $20,000"  → filter by price < 20,000
    //   "Shop Excellent Deals" → match the "Excellent Price" label
    //   "Price Drop"           → falls through to standard label match below
    //   "Low Miles"           → filter by mileage < 20,000
    if (query === "cars under $20,000") {
      return vehicle.price < 20_000;
    }
    if (query === "shop excellent deals") {
      return vehicle.labels.some((l) => l.toLowerCase().includes("excellent price"));
    }
    if (query === "low miles") {
      return vehicle.mileage < 20_000;
    }

    // Standard free-text search
    return matchesTextQuery(vehicle, query);
  });
  const vehicleCount = filteredVehicles.length;

  // When no results match, fall back to showing all vehicles so the page
  // never appears empty. The search query is cleared for VehicleResults so it
  // doesn't re-apply the same filter and produce zero again.
  const displayVehicles = filteredVehicles.length === 0 ? vehiclePool : filteredVehicles;
  const displaySearchQuery = filteredVehicles.length === 0 ? "" : searchQuery;

  const handleFilterChange = (key: keyof FilterState, value: FilterState[keyof FilterState]) => {
    setFilterState((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = (newState: FilterState) => {
    setFilterState(newState);
    // Fire mock search API and refresh vehiclePool + availableFilters
    applyFiltersSearch(newState, { labelFilter });
  };

  // Helper to add single-value filters
  const addSingleFilter = (
    filters: { label: string; type: string; value: string }[],
    value: string,
    type: string
  ) => {
    if (value) {
      filters.push({ label: value, type, value });
    }
  };

  // Helper to add array-value filters
  const addArrayFilters = (
    filters: { label: string; type: string; value: string }[],
    arr: string[],
    type: string
  ) => {
    for (const v of arr) {
      filters.push({ label: v, type, value: v });
    }
  };

  const getActiveFilters = () => {
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
    // Dynamic chip for label-based presets (no sidebar equivalent)
    if (labelFilter) {
      filters.push({ label: labelFilter, type: "label", value: labelFilter });
    }
    // Refine search filters
    for (const rf of refineSearchFilters) {
      filters.push({ label: rf.label, type: "refineSearch", value: rf.id });
    }
    return filters;
  };

  const activeFilters = getActiveFilters();

  const removeFilter = (type: string, value: string) => {
    switch (type) {
      case "price":
        handleFilterChange("selectedPriceQuick", "");
        break;
      case "year":
        handleFilterChange("selectedYearQuick", "");
        break;
      case "mileage":
        handleFilterChange("selectedMileage", "");
        break;
      case "bodyStyle":
        handleFilterChange(
          "selectedBodyStyles",
          filterState.selectedBodyStyles.filter((v) => v !== value)
        );
        break;
      case "exteriorColor":
        handleFilterChange(
          "selectedExteriorColors",
          filterState.selectedExteriorColors.filter((v) => v !== value)
        );
        break;
      case "interiorColor":
        handleFilterChange(
          "selectedInteriorColors",
          filterState.selectedInteriorColors.filter((v) => v !== value)
        );
        break;
      case "fuelType":
        handleFilterChange(
          "selectedFuelTypes",
          filterState.selectedFuelTypes.filter((v) => v !== value)
        );
        break;
      case "model":
        handleFilterChange(
          "selectedModels",
          filterState.selectedModels.filter((v) => v !== value)
        );
        break;
      case "safetyFeature":
        handleFilterChange(
          "selectedSafetyFeatures",
          filterState.selectedSafetyFeatures.filter((v) => v !== value)
        );
        break;
      case "comfortFeature":
        handleFilterChange(
          "selectedComfortFeatures",
          filterState.selectedComfortFeatures.filter((v) => v !== value)
        );
        break;
      case "techFeature":
        handleFilterChange(
          "selectedTechFeatures",
          filterState.selectedTechFeatures.filter((v) => v !== value)
        );
        break;
      case "exteriorFeature":
        handleFilterChange(
          "selectedExteriorFeatures",
          filterState.selectedExteriorFeatures.filter((v) => v !== value)
        );
        break;
      case "performanceFeature":
        handleFilterChange(
          "selectedPerformanceFeatures",
          filterState.selectedPerformanceFeatures.filter((v) => v !== value)
        );
        break;
      case "seatingCapacity":
        handleFilterChange(
          "selectedSeatingCapacity",
          filterState.selectedSeatingCapacity.filter((v) => v !== value)
        );
        break;
      case "drivetrain":
        handleFilterChange(
          "selectedDrivetrains",
          filterState.selectedDrivetrains.filter((v) => v !== value)
        );
        break;
      case "transmission":
        handleFilterChange(
          "selectedTransmissions",
          filterState.selectedTransmissions.filter((v) => v !== value)
        );
        break;
      case "inspection":
        handleFilterChange("inspection160", false);
        break;
      case "label":
        setLabelFilter("");
        break;
      case "refineSearch":
        setRefineSearchFilters((prev) => prev.filter((f) => f.id !== value));
        break;
      default:
        break;
    }
  };

  const resetFilters = () => {
    const reset = { ...filterState, ...defaultFilterState };
    setFilterState(reset);
    setLabelFilter("");
    setRefineSearchFilters([]);
    // Clear text query state so the reset truly clears all filters/search
    setSearchQuery("");
    searchQueryRef.current = "";
    // Re-run search with cleared filters so vehiclePool + availableFilters update
    applyFiltersSearch(defaultFilterState, { searchQuery: "" });
  };

  const applyRefineFilters = (filters: { id: string; label: string }[]) => {
    setRefineSearchFilters(filters);
    // Trigger a search including the refine-modal feature selections
    applyFiltersSearch(filterState, {
      labelFilter,
      refineFilters: filters,
    });
  };

  const handleSearch = () => {
    setVehiclePool(vehicles);
    // Cancel any running animation
    for (const t of progressTimers.current) {
      clearTimeout(t);
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
      window.setTimeout(() => setIsProgressVisible(false), 1200) as unknown as number
    );
    navigate(searchQueryRef.current);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 lg:px-0">
      <FilterSidebar
        availableFilters={availableFilters}
        filterState={filterState}
        isOpen={isFilterOpen}
        onApply={handleApplyFilters}
        onClose={() => setIsFilterOpen(false)}
        onReset={resetFilters}
        vehicleCount={vehicleCount}
        vehicles={vehicles}
        searchQuery={searchQuery}
        labelFilter={labelFilter}
        refineFilters={refineSearchFilters}
      />
      <main className="relative flex-1 bg-gray-100">
        <SearchHero
          activeFilters={activeFilters}
          onRemoveFilter={removeFilter}
          onReset={resetFilters}
          onSearch={() => {
            setCurrentPage(1);
            handleSearch();
          }}
          onSearchChange={(q) => {
            searchQueryRef.current = q;
            setSearchQuery(q);
          }}
          searchQuery={searchQuery}
          vehicleCount={vehicleCount}
          vehiclesAvailable={vehicles.length}
        />
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
            />
          </div>
        </div>
        <VehicleResults
          activeFilters={activeFilters}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onApplyRefineFilters={applyRefineFilters}
          onPageChange={setCurrentPage}
          onRemoveFilter={removeFilter}
          onReset={resetFilters}
          onToggleFilter={() => setIsFilterOpen(true)}
          searchQuery={displaySearchQuery}
          vehicles={displayVehicles}
        />
      </main>
    </div>
  );
}
