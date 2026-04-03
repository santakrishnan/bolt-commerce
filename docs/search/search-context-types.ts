import type {
  AvailableFilters,
  FilterState,
} from "@features/search/components/filter-sidebar/types";
import type {
  AppliedFilter,
  FacetSection,
  SmartFilterGroup,
} from "@features/search/lib/mock-faceted-search";
import type { FacetCounts, RefineFilter } from "@features/search/lib/mock-search-service";
import type { Vehicle } from "@features/search/lib/mock-vehicles";
import type { Dispatch, MutableRefObject, ReactNode, SetStateAction } from "react";

export interface RefineSearchFilter {
  id: string;
  label: string;
}

export interface SearchContextValue {
  appliedFilters: AppliedFilter[];
  applyFiltersSearch: (
    newFilterState: FilterState,
    opts?: {
      searchQuery?: string;
      labelFilter?: string;
      refineFilters?: RefineFilter[];
      preservePage?: boolean;
    }
  ) => Promise<void>;
  availableFilters: AvailableFilters;
  currentPage: number;
  facetCounts: FacetCounts;
  filterState: FilterState;
  handleSearch: () => void;
  isFilterOpen: boolean;
  isFilterPending: boolean;
  isInitialLoading: boolean;
  isProgressVisible: boolean;
  isSearching: boolean;
  labelFilter: string;
  loadingFacetSections: FacetSection[];
  progress: number;
  refineSearchFilters: RefineSearchFilter[];
  searchQuery: string;
  searchQueryRef: MutableRefObject<string>;
  setAppliedFilters: Dispatch<SetStateAction<AppliedFilter[]>>;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  setFilterState: Dispatch<SetStateAction<FilterState>>;
  setIsFilterOpen: Dispatch<SetStateAction<boolean>>;
  setIsProgressVisible: Dispatch<SetStateAction<boolean>>;
  setLabelFilter: Dispatch<SetStateAction<string>>;
  setProgress: Dispatch<SetStateAction<number>>;
  setRefineSearchFilters: Dispatch<SetStateAction<RefineSearchFilter[]>>;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  setSmartFilters?: Dispatch<SetStateAction<SmartFilterGroup[]>>;
  setSortOption: Dispatch<SetStateAction<"recommended" | "low-high" | "high-low">>;
  setVehiclePool: Dispatch<SetStateAction<Vehicle[]>>;
  smartFilters?: SmartFilterGroup[];
  sortOption: "recommended" | "low-high" | "high-low";
  totalCount: number;
  vehiclePool: Vehicle[];
}

export interface SearchProviderProps {
  children: ReactNode;
  defaultFilterState: FilterState;
  initialAppliedFilters?: AppliedFilter[];
  initialBodyStyles?: string[];
  /** True when server-side data fetch was made, regardless of result count. */
  initialDataFetched?: boolean;
  initialSearchQuery?: string;
  initialTotalCount?: number;
  initialUrlFilters?: Partial<FilterState>;
  initialVehicles?: Vehicle[];
}
