import { defaultFilterState } from "~/components/features/search/filter-sidebar";
import { getSearchPageData } from "~/lib/search/data";
import { filterSections } from "~/lib/search/filter-sections";
import { SearchClient } from "./search-client";
import { SearchProvider } from "./search-context";

interface SearchWrapperProps {
  initialBodyType?: string;
  initialSearchQuery?: string;
}

export async function SearchWrapper({
  initialBodyType,
  initialSearchQuery,
}: SearchWrapperProps = {}) {
  const data = await getSearchPageData();

// Resolve the URL slug (e.g. "sedan") to the exact body style label (e.g. "Sedan" / "SUV")
   // filterSections.bodyStyle is a string[], so we compare slugs and labels as strings (case-insensitive).
  const initialBodyStyles: string[] = [];
  if (initialBodyType) {
    const match = filterSections.bodyStyle.find(
      (s) => s.toLowerCase() === initialBodyType.toLowerCase()
    );
    if (match) {
      initialBodyStyles.push(match);
    }
  }

  // Maps of known q= slugs (produced by VehicleQuickLinkCard: title → whitespace replaced with dash)
  // to their corresponding filter presets. Keeps the search box empty and shows chips instead.
  interface QuickLinkPreset {
    selectedPriceQuick?: string;
    selectedMileage?: string;
    labelFilter?: string;
  }
  const QUICK_LINK_MAP: Record<string, QuickLinkPreset> = {
    "Cars-Under-$20,000": { selectedPriceQuick: "Cars Under $20,000" },
    "Shop-Excellent-Deals": { labelFilter: "Excellent Price" },
    "Price-Drop": { labelFilter: "Price Drop" },
    "Low-Miles": { selectedMileage: "Low Miles" },
  };

  // Create a lowercase-keyed version for case-insensitive matching
  const QUICK_LINK_MAP_LOWER: Record<string, QuickLinkPreset> = Object.fromEntries(
    Object.entries(QUICK_LINK_MAP).map(([k, v]) => [k.toLowerCase(), v])
  );

  // If q= matches a known vehicle type / body style, convert it to a filter chip
  // and leave the search box empty. Otherwise treat it as free-text search.
  let resolvedSearchQuery = initialSearchQuery ?? "";
  let filterPreset: QuickLinkPreset | undefined;

  if (initialSearchQuery) {
    // Check quick-link presets first (exact slug match)
    const quickLinkPreset = QUICK_LINK_MAP_LOWER[initialSearchQuery.toLowerCase()];
    if (quickLinkPreset) {
      filterPreset = quickLinkPreset;
      resolvedSearchQuery = "";
    } else {
      // Check body-style chips (case-insensitive label match)
      const bodyStyleMatch = filterSections.bodyStyle.find(
        (s) => s.toLowerCase() === initialSearchQuery.toLowerCase()
      );
      if (bodyStyleMatch) {
        if (!initialBodyStyles.includes(bodyStyleMatch)) {
          initialBodyStyles.push(bodyStyleMatch);
        }
        resolvedSearchQuery = "";
      }
    }
  }

  // Unique key so React fully remounts SearchClient whenever the filter context changes.
  // This ensures useState initializers re-run and stale state from a previous visit is cleared.
  const clientKey = `${initialBodyType ?? ""}|${initialSearchQuery ?? ""}`;

  return (
    <SearchProvider
      defaultFilterState={defaultFilterState}
      initialBodyStyles={initialBodyStyles}
      initialFilterPreset={filterPreset}
      initialSearchQuery={resolvedSearchQuery}
      vehicles={data.vehicles}
    >
      <SearchClient key={clientKey} vehicles={data.vehicles} />
    </SearchProvider>
  );
}
