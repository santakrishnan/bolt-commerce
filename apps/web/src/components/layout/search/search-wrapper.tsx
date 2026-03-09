import { getSearchPageData } from "~/lib/search/data";
import { filterSections } from "~/lib/search/filter-sections";
import { SearchClient } from "./search-client";

// Maps VehicleFinderCard titles to filter behaviour:
// - selectedPriceQuick → pre-selects a sidebar price chip (no search box, no label filter)
// - selectedMileage    → pre-selects a sidebar mileage chip (no search box, no label filter)
// - labelFilter        → hidden background filter matching vehicle.labels; shows a removable
//                        dynamic chip in the active-filters bar (no sidebar option, no search box)
const QUERY_FILTER_PRESETS: Record<
  string,
  { selectedPriceQuick?: string; selectedMileage?: string; labelFilter?: string }
> = {
  "Cars-Under-$20,000": { selectedPriceQuick: "$20k or less" },
  "Low-Miles": { selectedMileage: "Under 15k mi" },
  "Shop-Excellent-Deals": { labelFilter: "Excellent Price" },
  "Price-Drop": { labelFilter: "Price Drop" },
};

interface SearchWrapperProps {
  initialBodyType?: string;
  initialSearchQuery?: string;
}

export async function SearchWrapper({
  initialBodyType,
  initialSearchQuery,
}: SearchWrapperProps = {}) {
  const data = await getSearchPageData();

  // Resolve the URL slug (e.g. "sedan") to the exact filter label (e.g. "Sedan" / "SUV")
  const initialBodyStyles: string[] = [];
  if (initialBodyType) {
    const match = filterSections.bodyStyle.find(
      (s) => s.toLowerCase() === initialBodyType.toLowerCase()
    );
    if (match) {
      initialBodyStyles.push(match);
    }
  }

  // Resolve preset for known VehicleFinderCard titles.
  // Price/mileage presets → sidebar chips only, empty search box.
  // Label presets → background label filter + dynamic chip, empty search box.
  const preset = initialSearchQuery ? QUERY_FILTER_PRESETS[initialSearchQuery] : undefined;
  // If it's not a known preset key, treat it as a real user search query
  const resolvedSearchQuery = preset ? "" : (initialSearchQuery ?? "");

  // Unique key so React fully remounts SearchClient whenever the filter context changes.
  // This ensures useState initializers re-run and stale state from a previous visit is cleared.
  const clientKey = `${initialBodyType ?? ""}|${initialSearchQuery ?? ""}`;

  return (
    <SearchClient
      initialBodyStyles={initialBodyStyles}
      initialFilterPreset={preset}
      initialSearchQuery={resolvedSearchQuery}
      key={clientKey}
      vehicles={data.vehicles}
    />
  );
}
