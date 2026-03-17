/**
 * Shared types and default state for the FilterSidebar feature.
 */

import type { FacetCounts } from "~/lib/search/mock-search-service";
import type { Vehicle } from "~/lib/search/mock-vehicles";

// Filter state types
export interface FilterState {
  inspection160: boolean;
  selectedBodyStyles: string[];
  selectedComfortFeatures: string[];
  selectedDrivetrains: string[];
  selectedExteriorColors: string[];
  selectedExteriorFeatures: string[];
  selectedFuelTypes: string[];
  selectedInteriorColors: string[];
  selectedMileage: string;
  selectedModels: string[];
  selectedPerformanceFeatures: string[];
  selectedPriceQuick: string;
  selectedSafetyFeatures: string[];
  selectedSeatingCapacity: string[];
  selectedTechFeatures: string[];
  selectedTransmissions: string[];
  selectedYearQuick: string;
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
  comfortFeatures: string[];
  drivetrains: string[];
  exteriorColors: string[];
  exteriorFeatures: string[];
  /** Short fuel-type key, e.g. "Hybrid" not "Hybrid (Hybrid)" */
  fuelTypes: string[];
  hasInspection160: boolean;
  interiorColors: string[];
  models: string[];
  performanceFeatures: string[];
  safetyFeatures: string[];
  seatingCapacity: string[];
  techFeatures: string[];
  totalCount: number;
  transmissions: string[];
}

export interface FilterSidebarProps {
  /** Dynamic chip availability returned by the last applied search response */
  availableFilters?: AvailableFilters;
  /**
   * Per-dimension vehicle counts from the last search response.
   * Used to render count badges on filter chips, e.g. "Sedan (12)".
   * Resolve display labels with PRICE_BUCKET_LABELS / MILEAGE_BUCKET_LABELS
   * / YEAR_BUCKET_LABELS exported from mock-search-service.
   */
  facetCounts?: FacetCounts;
  filterState: FilterState;
  isOpen: boolean;
  labelFilter?: string;
  onApply: (newState: FilterState) => void;
  onClose: () => void;
  onReset: () => void;
  refineFilters?: { id: string; label: string }[];
  /** Optional live constraints that should be considered when computing draft availability */
  searchQuery?: string;
  vehicleCount: number;
  /**
   * Full vehicle list used to compute live cross-dimension chip availability
   * as the user changes draft selections inside the sidebar.
   *
   * When provided, selecting e.g. "Truck" in Body Style instantly disables
   * fuel types that no truck in the list has — without waiting for Apply.
   * When omitted, falls back to the static `availableFilters` prop.
   */
  vehicles?: Vehicle[];
}
