"use client";

import { useRef, useState } from "react";
import {
  defaultFilterState,
  FilterSidebar,
  type FilterState,
} from "~/components/features/search/filter-sidebar";
import { SearchHero } from "~/components/features/search/search-hero";
import { VehicleResults } from "~/components/features/search/vehicle-results";
import { useSearchNavigation } from "~/hooks/use-search-navigation";
import type { Vehicle } from "~/lib/search/data";

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

// Regex for detecting numbers with K suffix (e.g., 35k)
const NUMBER_WITH_K_REGEX = /^\d+k$/i;

// Convert slugified query back to human-readable format
// e.g., "suv-under-35k-with-low-miles" -> "SUV under 35K with Low Miles"
function deslugify(slug: string): string {
  if (!slug) {
    return "";
  }
  return slug
    .split("-")
    .map((word) => {
      // Capitalize common acronyms
      const upper = word.toUpperCase();
      if (["SUV", "AWD", "FWD", "RWD", "4WD"].includes(upper)) {
        return upper;
      }
      // Handle numbers with K suffix (35k -> 35K)
      if (NUMBER_WITH_K_REGEX.test(word)) {
        return `${word.slice(0, -1)}K`;
      }
      // Capitalize first letter of other words
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

export function SearchClient({
  vehicles,
  initialBodyStyles = [],
  initialSearchQuery = "",
  initialFilterPreset,
}: SearchClientProps) {
  const { navigate } = useSearchNavigation({ mode: "replace", scroll: false });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [searchQuery, setSearchQuery] = useState(deslugify(initialSearchQuery));
  const searchQueryRef = useRef(deslugify(initialSearchQuery));
  // Background label filter — filters by vehicle.labels without touching the search box
  const [labelFilter, setLabelFilter] = useState(initialFilterPreset?.labelFilter ?? "");
  const [refineSearchFilters, setRefineSearchFilters] = useState<{ id: string; label: string }[]>(
    []
  );
  const [progress, setProgress] = useState(0);
  const [isProgressVisible, setIsProgressVisible] = useState(false);
  const progressTimers = useRef<number[]>([]);
  const itemsPerPage = 12;

  // Compute filtered vehicle count based on search query + background label filter
  const filteredVehicles = vehicles.filter((vehicle) => {
    // Background label filter (Excellent Deals / Price Drop)
    if (
      labelFilter &&
      !vehicle.labels.some((l) => l.toLowerCase().includes(labelFilter.toLowerCase()))
    ) {
      return false;
    }
    // User-typed search query
    if (!searchQuery.trim()) {
      return true;
    }
    const query = searchQuery.toLowerCase();
    return (
      vehicle.title.toLowerCase().includes(query) ||
      vehicle.miles.toLowerCase().includes(query) ||
      vehicle.labels.some((label) => label.toLowerCase().includes(query))
    );
  });
  const vehicleCount = filteredVehicles.length;

  // Filter state — pre-populate body styles and any filter preset from URL
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

  const handleFilterChange = (key: keyof FilterState, value: FilterState[keyof FilterState]) => {
    setFilterState((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = (newState: FilterState) => {
    setFilterState(newState);
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
    // Refine search filters (red background badges)
    for (const rf of refineSearchFilters) {
      filters.push({ label: rf.label, type: "refineSearch", value: rf.id, isRefineSearch: true });
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

  const toggleFilter = () => setIsFilterOpen(!isFilterOpen);
  const resetFilters = () => {
    setFilterState(defaultFilterState);
    setLabelFilter("");
    setRefineSearchFilters([]);
  };

  const applyRefineFilters = (filters: { id: string; label: string }[]) => {
    setRefineSearchFilters(filters);
  };

  const handleSearch = () => {
    // Update URL with ?q= param — keeps it a soft replace so SearchClient doesn't remount
    navigate(searchQueryRef.current);

    // Cancel any running animation
    for (const t of progressTimers.current) {
      clearTimeout(t);
    }
    progressTimers.current = [];
    // Reset silently, then start YouTube-style sequence on next paint
    setIsProgressVisible(false);
    setProgress(0);
    progressTimers.current.push(
      // Frame 1: bar appears at 0% (no transition yet)
      window.setTimeout(() => {
        setIsProgressVisible(true);
        setProgress(0);
      }, 16) as unknown as number,
      // Frame 2: crawl to 78% via slow cubic-bezier (1.5 s)
      window.setTimeout(() => setProgress(78), 20) as unknown as number,
      // Frame 3: snap to 100% after crawl has been running ~830 ms
      window.setTimeout(() => setProgress(100), 850) as unknown as number,
      // Frame 4: fade out
      window.setTimeout(() => setIsProgressVisible(false), 1100) as unknown as number,
      // Frame 5: silent reset so next search starts clean
      window.setTimeout(() => setProgress(0), 1550) as unknown as number
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 lg:px-0">
      <FilterSidebar
        filterState={filterState}
        isOpen={isFilterOpen}
        onApply={handleApplyFilters}
        onClose={() => setIsFilterOpen(false)}
        onReset={resetFilters}
        vehicleCount={vehicleCount}
      />

      <main className="relative flex-1 bg-gray-100">
        <SearchHero
          activeFilters={activeFilters}
          isProgressVisible={isProgressVisible}
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
          onToggleFilter={toggleFilter}
          progress={progress}
          searchQuery={searchQuery}
          vehicleCount={vehicleCount}
        />

        <div className="mx-6 md:mx-0">
          <div className="relative h-[1px] overflow-hidden bg-[var(--color-structure-interaction-subtle-border)]">
            <div
              aria-hidden
              className="absolute top-0 left-0 h-full bg-actions-primary"
              style={{
                width: `${progress}%`,
                opacity: isProgressVisible ? 1 : 0,
                transition: getProgressTransition(progress),
              }}
            />
          </div>
        </div>
        <VehicleResults
          activeFilters={activeFilters}
          currentPage={currentPage}
          isProgressVisible={isProgressVisible}
          itemsPerPage={itemsPerPage}
          onApplyRefineFilters={applyRefineFilters}
          onPageChange={setCurrentPage}
          onRemoveFilter={removeFilter}
          onReset={resetFilters}
          onToggleFilter={toggleFilter}
          searchQuery={searchQuery}
          vehicles={filteredVehicles}
        />
      </main>
    </div>
  );
}
