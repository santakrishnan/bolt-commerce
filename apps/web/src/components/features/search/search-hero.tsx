"use client";
import { Heading } from "@tfs-ucmp/ui";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AppButton } from "~/components/shared/button";
import { SearchBar } from "~/components/shared/search-bar";
import { MockAutocompleteService } from "~/components/shared/search-bar/services/mock-autocomplete";
import { CustomChips } from "../../shared";
import type { ActiveFilter } from "./vehicle-results";

// Create autocomplete service instance
const autocompleteService = new MockAutocompleteService();

/**
 * Placeholder suggested search pills.
 * TODO: Replace with data fetched from API when available.
 */
const MOCK_SUGGESTED_PILLS = ["Off-road", "Eco-friendly", "High safety rating", "Near me"];

export interface SearchHeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearch: () => void;
  onBlurOverlayChange?: (showOverlay: boolean) => void;
  showTitle?: boolean;
  showQuickFilters?: boolean;
  placeholder?: string;
  onToggleFilter?: () => void;
  onReset?: () => void;
  vehicleCount?: number;
  vehiclesAvailable?: number;
  activeFilters: ActiveFilter[];
  onRemoveFilter: (type: string, value: string) => void;
  /** Suggested search pills shown below the input (will be fetched from API). Falls back to mock data. */
  suggestedPills?: string[];
}

export function SearchHero({
  searchQuery,
  onSearchChange,
  onSearch,
  onBlurOverlayChange,
  showTitle = true,
  showQuickFilters = true,
  placeholder = "Try: 'SUV under 35k with heated seats near San Francisco",
  onToggleFilter,
  onReset,
  vehicleCount,
  vehiclesAvailable,
  activeFilters,
  onRemoveFilter,
  suggestedPills = MOCK_SUGGESTED_PILLS,
}: SearchHeroProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const sectionRef = useRef<HTMLElement>(null);
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const [isStickyDropdownOpen, setIsStickyDropdownOpen] = useState(false);

  useEffect(() => setLocalQuery(searchQuery), [searchQuery]);

  // Detect when hero scrolls out of view to show sticky bar
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) {
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setIsHeroVisible(entry?.isIntersecting ?? true),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Handle search submission
  const handleSubmit = () => {
    onSearchChange(localQuery);
    onSearch();
  };

  return (
    <>
      {/* Sticky compact header — visible when hero scrolls out of view */}
      {!isHeroVisible && (
        <div className="fixed top-0 right-0 left-0 z-[35] bg-white">
          <div className="mx-auto flex max-w-[var(--container-2xl)] flex-col items-center justify-between gap-4 px-4 py-5 sm:flex-row sm:px-6 lg:px-20">
            {/* Left: Filter + Reset OR Vehicle count + Sort when filters applied */}
            {activeFilters.length > 0 ? (
              <div className="flex shrink-0 items-center gap-3">
                <AppButton
                  className="h-10 w-10"
                  onClick={onToggleFilter}
                  size="xs"
                  type="button"
                  variant="primary"
                >
                  <Image
                    alt="Filter"
                    className="h-4 w-4 max-w-none"
                    height={16}
                    src="/images/filter_one.svg"
                    width={16}
                  />
                </AppButton>
                <div className="flex flex-row items-center gap-3 md:flex-col md:items-start md:gap-0">
                  <div className="font-bold text-[#111] text-[12px] leading-normal md:text-[16px]">
                    {vehicleCount} vehicles found
                  </div>
                  <span className="my-1 text-[#ccc] md:hidden">|</span>
                  <div className="font-semibold text-[#121212] text-[12px] leading-normal">
                    Sort by:{" "}
                    <button
                      className="inline-flex items-center gap-1 font-medium text-black hover:underline"
                      type="button"
                    >
                      Recommended{" "}
                      <Image
                        alt="Dropdown"
                        className="mt-[3%] h-1.75 w-[12px]"
                        height={7}
                        src="/images/dropdown-arrow.svg"
                        width={12}
                      />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex shrink-0 items-center gap-2">
                {onToggleFilter && (
                  <AppButton
                    className="px-[var(--spacing-md)]"
                    icon={
                      <Image
                        alt="Filter"
                        className="h-4 w-4"
                        height={16}
                        src="/images/filter_one.svg"
                        width={16}
                      />
                    }
                    iconPosition="left"
                    onClick={onToggleFilter}
                    size="md"
                    variant="primary"
                  >
                    Filter and Sort
                  </AppButton>
                )}
              </div>
            )}
            {/* Right: SearchBar */}
            <div
              className={`relative max-w-[848px] flex-1 ${isStickyDropdownOpen ? "z-[65]" : ""}`}
            >
              {activeFilters.length === 0 && (
                <SearchBar
                  autocompleteService={autocompleteService}
                  config={{
                    displayMode: "pills",
                    withBorder: true,
                    placeholder,
                    showSearchButton: true,
                    enableSearchHistory: false,
                    quickFilters: suggestedPills,
                  }}
                  onOpenChange={(open) => {
                    setIsStickyDropdownOpen(open);
                    if (open) {
                      // Immediately kill the main overlay so both never show at once
                      setIsDropdownOpen(false);
                    }
                    onBlurOverlayChange?.(open);
                  }}
                  onSubmit={handleSubmit}
                  onValueChange={setLocalQuery}
                  value={localQuery}
                />
              )}
              {activeFilters.length > 0 && (
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-center gap-2 md:justify-end">
                    {activeFilters.map((filter) => (
                      <CustomChips
                        isRefineSearch={filter.isRefineSearch}
                        key={`${filter.type}-${filter.value}`}
                        label={filter.label}
                        onRemove={() => onRemoveFilter(filter.type, filter.value)}
                        type="applied"
                      />
                    ))}
                    <AppButton onClick={onReset} size="sm" type="button" variant="secondary">
                      Reset
                    </AppButton>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <section
        className={`${isDropdownOpen ? "bg-[var(--color-core-surfaces-background)]" : "bg-[var(--color-core-surfaces-background)]"} py-[var(--spacing-10)] pt-8 pb-6 md:pb-[var(--spacing-lg)] ${isDropdownOpen ? "relative z-30" : ""} ${showTitle ? "" : "py-0"}`}
        ref={sectionRef}
      >
        <div className="mx-auto max-w-[var(--container-2xl)] px-0 sm:px-[var(--spacing-lg)] lg:px-[var(--spacing-4xl)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            {/* Title */}
            {showTitle && (
              <div className="flex flex-col items-center justify-center text-center md:items-start md:justify-start md:text-left">
                <Heading
                  className="mb-6 text-[32px] text-brand-text uppercase leading-[56px] tracking-[-0.449px] md:mb-0"
                  level={1}
                  weight="bold"
                >
                  FIND YOUR NEXT CAR
                </Heading>
                <p className="font-normal text-[15px] text-brand-text-primary leading-normal">
                  {vehiclesAvailable} Vehicles Available
                </p>
              </div>
            )}

            {/* Search Bar */}
            <div className={`relative max-w-[848px] flex-1 pt-4 ${isDropdownOpen ? "z-50" : ""}`}>
              {/* SearchBar with Pills Suggestions */}
              <SearchBar
                autocompleteService={autocompleteService}
                config={{
                  displayMode: "pills",
                  pillsPlacement: "below",
                  withBorder: false,
                  placeholder,
                  showSearchButton: true,
                  enableSearchHistory: false,
                  quickFilters: showQuickFilters ? suggestedPills : undefined,
                }}
                onOpenChange={(open) => {
                  setIsDropdownOpen(open);
                  if (open) {
                    // Immediately kill the sticky overlay so both never show at once
                    setIsStickyDropdownOpen(false);
                  }
                  onBlurOverlayChange?.(open);
                }}
                onQuickFilterSelect={(filter) => {
                  setLocalQuery(filter);
                  onSearchChange(filter);
                  onSearch();
                }}
                onSubmit={handleSubmit}
                onValueChange={setLocalQuery}
                value={localQuery}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
