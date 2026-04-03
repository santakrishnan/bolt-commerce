import type { FilterState } from "@features/search/components/filter-sidebar/types";
import { defaultFilterState } from "@features/search/components/filter-sidebar/types";
import { generateQuickFilterPills } from "@features/search/components/search-bar/services/nlp-autocomplete";
import { SearchClient } from "@features/search/context/search-client";
import { filterSections } from "@features/search/lib/filter-sections";
import { getInventoryPool } from "@features/search/lib/mock-faceted-search";
import { fetchInitialSrpResults } from "@features/search/services/srp-initial-data";
import { Suspense } from "react";
import { SearchProvider } from "./search-context";

interface SearchWrapperProps {
  initialBodyType?: string;
  initialSearchQuery?: string;
  initialUrlFilters?: Partial<FilterState>;
}

export async function SearchWrapper({
  initialBodyType,
  initialSearchQuery,
  initialUrlFilters,
}: SearchWrapperProps = {}) {
  const pool = getInventoryPool();
  const suggestedPills = generateQuickFilterPills(pool);
  const initialBodyStyles: string[] = [];
  if (initialBodyType) {
    const match = filterSections.bodyStyle.find(
      (s) => s.toLowerCase() === initialBodyType.toLowerCase()
    );
    if (match) {
      initialBodyStyles.push(match);
    }
  }

  if (initialUrlFilters?.selectedBodyStyles) {
    for (const bodyStyle of initialUrlFilters.selectedBodyStyles) {
      if (!initialBodyStyles.includes(bodyStyle)) {
        initialBodyStyles.push(bodyStyle);
      }
    }
  }

  const resolvedSearchQuery = initialSearchQuery ?? "";

  const initialResults = await fetchInitialSrpResults(initialBodyStyles[0], resolvedSearchQuery);

  // Stable key — sort object keys before serializing so property insertion
  // order never causes an unnecessary SearchProvider remount.
  const stableFilters = JSON.stringify(initialUrlFilters ?? {}, Object.keys(initialUrlFilters ?? {}).sort());
  const clientKey = `${initialBodyType ?? ""}|${initialSearchQuery ?? ""}|${stableFilters}`;

  return (
    <SearchProvider
      defaultFilterState={defaultFilterState}
      initialAppliedFilters={initialResults.appliedFilters}
      initialBodyStyles={initialBodyStyles}
      initialDataFetched
      initialSearchQuery={resolvedSearchQuery}
      initialTotalCount={initialResults.totalCount}
      initialUrlFilters={initialUrlFilters}
      initialVehicles={initialResults.vehicles}
      key={clientKey}
    >
      <Suspense fallback={null}>
        <SearchClient initialQuickFilters={suggestedPills} />
      </Suspense>
    </SearchProvider>
  );
}
