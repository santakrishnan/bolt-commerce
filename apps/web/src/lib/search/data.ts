import type { Vehicle } from "~/components/shared/types";
import { type FilterSections, filterSections } from "./filter-sections";
import { mockVehicles } from "./mock-vehicles";

// Types
export type { Vehicle } from "~/components/shared/types";
export type { FilterSections, MileageFilter, PriceFilter, YearFilter } from "./filter-sections";

export interface SearchPageData {
  filterSections: FilterSections;
  vehicles: Vehicle[];
}

/**
 * Server-side data fetching function.
 *
 * Currently returns local mock data. When the Search Service is live,
 * replace the `vehicles` source with a call to `searchVehicles()` from
 * `~/services/search`.
 */
/** Fisher-Yates shuffle — returns a new randomly-ordered copy. */
function shuffle<T>(arr: readonly T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = copy[i];
    copy[i] = copy[j] as T;
    copy[j] = tmp as T;
  }
  return copy;
}

export async function getSearchPageData(): Promise<SearchPageData> {
  // TODO: Replace with `searchVehicles({ query: {} })` when SEARCH_SERVICE_URL is configured
  await Promise.resolve(); // Simulate async delay

  return {
    vehicles: shuffle(mockVehicles),
    filterSections,
  };
}
