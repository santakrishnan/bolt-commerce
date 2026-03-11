"use client";

import { useState } from "react";
import { SearchBar } from "~/components/shared/search-bar";
import { MockAutocompleteService } from "~/components/shared/search-bar/services/mock-autocomplete";
import { useSearchNavigation } from "~/hooks/use-search-navigation";

// Create autocomplete service instance
const autocompleteService = new MockAutocompleteService();

/**
 * HomeHeroSearch component
 * Uses the unified SearchBar component with home page specific configuration
 */
export function HomeHeroSearch() {
  const { navigate } = useSearchNavigation({ recordHistory: true });
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
