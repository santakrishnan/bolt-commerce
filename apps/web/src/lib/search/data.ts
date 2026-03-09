import { type FilterSections, filterSections } from "./filter-sections";
import { mockVehicles, type Vehicle } from "./mock-vehicles";

export type { FilterSections, MileageFilter, PriceFilter, YearFilter } from "./filter-sections";
// Types
export type { Vehicle } from "./mock-vehicles";

export interface SearchPageData {
  vehicles: Vehicle[];
  filterSections: FilterSections;
}

/**
 * Server-side data fetching function.
 *
 * Currently returns local mock data. When the Search Service is live,
 * replace the `vehicles` source with a call to `searchVehicles()` from
 * `~/services/search`.
 */
export async function getSearchPageData(): Promise<SearchPageData> {
  // TODO: Replace with `searchVehicles({ query: {} })` when SEARCH_SERVICE_URL is configured
  await Promise.resolve(); // Simulate async delay
  return {
    vehicles: mockVehicles,
    filterSections,
  };
}
