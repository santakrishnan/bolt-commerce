"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { SearchBar } from "~/components/shared/search-bar";
import { MockAutocompleteService } from "~/components/shared/search-bar/services/mock-autocomplete";
import { useSearchNavigation } from "~/hooks/use-search-navigation";
import { ROUTES } from "~/lib/routes/constants";

// Create autocomplete service instance
const autocompleteService = new MockAutocompleteService();

/**
 * HomeHeroSearch component
 * Uses the unified SearchBar component with home page specific configuration
 *
 * Behavior:
 * - On home page: navigates to /used-cars with the search query (push mode, records history)
 * - On /used-cars page: performs search without navigation (replace mode, no scroll)
 */
export function HomeHeroSearch() {
  const pathname = usePathname();
  const isOnUsedCarsPage = pathname.startsWith(ROUTES.USED_CARS);

  // On used-cars page: use replace mode (in-page search)
  // On home page: use push mode with history recording
  const { navigate } = useSearchNavigation({
    mode: isOnUsedCarsPage ? ("replace" as const) : ("push" as const),
    scroll: !isOnUsedCarsPage,
    recordHistory: !isOnUsedCarsPage,
  });

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    navigate(searchQuery, { source: "nlp" });
  };

  return (
    <div className="relative w-full lg:w-131">
      <SearchBar
        autocompleteService={autocompleteService}
        config={{
          displayMode: "dropdown",
          withBorder: false,
          placeholder: "SUV under 35K with low miles.",
          customPlaceholder: (
            <>
              SUV under 35K with <span className="font-[var(--font-weight-bold)]">low miles</span>.
            </>
          ),
          showSearchButton: true,
          maxSuggestions: 4,
          lightTheme: true,
          withBackdropBlur: false,
          enableSearchHistory: false,
        }}
        onSubmit={handleSearch}
        onValueChange={setSearchQuery}
        value={searchQuery}
      />
    </div>
  );
}
