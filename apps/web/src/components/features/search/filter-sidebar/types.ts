/**
 * Shared types and default state for the FilterSidebar feature.
 */

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

export interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleCount: number;
  filterState: FilterState;
  onApply: (newState: FilterState) => void;
  onReset: () => void;
}
