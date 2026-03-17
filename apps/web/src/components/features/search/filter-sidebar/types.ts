/**
 * Shared types and default state for the FilterSidebar feature.
 */

import type { FacetCounts } from "~/lib/search/mock-search-service";
import type { Vehicle } from "~/lib/search/mock-vehicles";

// Filter state types
export interface FilterState {
  selectedPriceQuick: string;
  selectedYearQuick: string;
  selectedMileage: string;
  selectedBodyStyles: string[];
  selectedExteriorColors: string[];
  selectedInteriorColors: string[];
  selectedFuelTypes: string[];
  selectedModels: string[];
  selectedSafetyFeatures: string[];
  selectedComfortFeatures: string[];
  selectedTechFeatures: string[];
  selectedExteriorFeatures: string[];
  selectedPerformanceFeatures: string[];
  selectedSeatingCapacity: string[];
  selectedDrivetrains: string[];
  selectedTransmissions: string[];
  inspection160: boolean;
}

export const defaultFilterState: FilterState = {
  selectedPriceQuick: "",
  selectedYearQuick: "",
  selectedMileage: "",
  selectedBodyStyles: [],
  selectedExteriorColors: [],
  selectedInteriorColors: [],
  selectedFuelTypes: [],
  selectedModels: [],
  selectedSafetyFeatures: [],
  selectedComfortFeatures: [],
  selectedTechFeatures: [],
  selectedExteriorFeatures: [],
  selectedPerformanceFeatures: [],
  selectedSeatingCapacity: [],
  selectedDrivetrains: [],
  selectedTransmissions: [],
  inspection160: false,
};

/**
 * Which filter chip values are available (have ≥1 matching vehicle) in the
 * current search result. Returned by the mock search service and stored in
 * SearchContext so sidebar chips and card chips can be disabled dynamically.
 */
export interface AvailableFilters {
  bodyStyles: string[];
  exteriorColors: string[];
  interiorColors: string[];
  /** Short fuel-type key, e.g. "Hybrid" not "Hybrid (Hybrid)" */
  fuelTypes: string[];
  models: string[];
  safetyFeatures: string[];
  comfortFeatures: string[];
  techFeatures: string[];
  exteriorFeatures: string[];
  performanceFeatures: string[];
  seatingCapacity: string[];
  drivetrains: string[];
  transmissions: string[];
  hasInspection160: boolean;
  totalCount: number;
}

export interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleCount: number;
  filterState: FilterState;
  onApply: (newState: FilterState) => void;
  onReset: () => void;
  /** Dynamic chip availability returned by the last applied search response */
  availableFilters?: AvailableFilters;
  /**
   * Full vehicle list used to compute live cross-dimension chip availability
   * as the user changes draft selections inside the sidebar.
   *
   * When provided, selecting e.g. "Truck" in Body Style instantly disables
   * fuel types that no truck in the list has — without waiting for Apply.
   * When omitted, falls back to the static `availableFilters` prop.
   */
  vehicles?: Vehicle[];
  /** Optional live constraints that should be considered when computing draft availability */
  searchQuery?: string;
  labelFilter?: string;
  refineFilters?: { id: string; label: string }[];
  /**
   * Per-dimension vehicle counts from the last search response.
   * Used to render count badges on filter chips, e.g. "Sedan (12)".
   * Resolve display labels with PRICE_BUCKET_LABELS / MILEAGE_BUCKET_LABELS
   * / YEAR_BUCKET_LABELS exported from mock-search-service.
   */
  facetCounts?: FacetCounts;
}
