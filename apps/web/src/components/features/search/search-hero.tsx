"use client";

import { Button } from "@tfs-ucmp/ui";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { XIcon } from "@/components/assets/icons";
import { cn } from "@/lib/utils";
import { SearchBar } from "~/components/shared/search-bar";
import { MockAutocompleteService } from "~/components/shared/search-bar/services/mock-autocomplete";
import type { ActiveFilter } from "./vehicle-results";

// Create autocomplete service instance
const autocompleteService = new MockAutocompleteService();

/**
 * Placeholder suggested search pills.
 * TODO: Replace with data fetched from API when available.
 */
const MOCK_SUGGESTED_PILLS = ["Off-road", "Eco-friendly", "High safety rating", "Near me"];

function getProgressTransition(p: number): string {
  if (p === 100) {
    return "width 0.25s ease-in, opacity 0.4s ease 0.2s";
  }
  if (p === 0) {
    return "none";
  }
  // Fast start → dramatic deceleration (NProgress-style crawl)
  return "width 1.5s cubic-bezier(0.05, 0.6, 0.1, 1), opacity 0.15s ease";
}

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
  progress?: number;
  isProgressVisible?: boolean;
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
  vehicleCount = 0,
  progress = 0,
  isProgressVisible = false,
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
                <button
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-red-500 transition-colors"
                  onClick={onToggleFilter}
                  type="button"
                >
                  <Image
                    alt="Filter"
                    className="h-4 w-4"
                    height={16}
                    src="/images/filter_one.svg"
                    width={16}
                  />
                </button>
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
                  <Button
                    className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full bg-[#EB0A1E] px-4 font-semibold text-[14px] text-white hover:bg-[#EB0A1E]/90"
                    onClick={onToggleFilter}
                    type="button"
                    variant="ghost"
                  >
                    <Image
                      alt="Filter"
                      className="h-4 w-4"
                      height={16}
                      src="/images/filter_one.svg"
                      width={16}
                    />
                    <span>Filter and Sort</span>
                  </Button>
                )}
                {onReset && (
                  <Button
                    className="inline-flex h-10 cursor-pointer items-center justify-center rounded-full bg-black px-6 font-semibold text-[14px] text-white hover:bg-black/80"
                    onClick={onReset}
                    type="button"
                    variant="ghost"
                  >
                    Reset
                  </Button>
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
                    {activeFilters.map((filter, idx) => (
                      <div
                        className={cn(
                          "flex h-[var(--spacing-xl)] items-center gap-[var(--spacing-xs)] rounded-full border p-[var(--spacing-sm)] text-xs",
                          filter.isRefineSearch
                            ? "border-[var(--color-destructive)] bg-[var(--color-destructive)] text-[var(--color-destructive-foreground)]"
                            : "border-[var(--color-states-muted)] bg-transparent text-black"
                        )}
                        key={`${filter.type}-${filter.value}-${idx}`}
                      >
                        <span>{filter.label}</span>
                        <Button
                          className={cn(
                            "h-[var(--spacing-xs)] w-[var(--spacing-xs)] p-[0px] transition-colors hover:text-[var(--color-destructive)]",
                            filter.isRefineSearch
                              ? "text-[var(--color-destructive-foreground)]"
                              : "text-black"
                          )}
                          onClick={() => onRemoveFilter(filter.type, filter.value)}
                          type="button"
                          variant="search"
                        >
                          <XIcon className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      className="flex h-[var(--spacing-xl)] items-center justify-center gap-[var(--spacing-xs)] rounded-full bg-black px-[var(--spacing-lg)] text-center font-normal text-[var(--text-xs)] text-white leading-normal"
                      onClick={onReset}
                      type="button"
                      variant="search"
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Progress bar — bottom of sticky header */}
          <div className="relative h-[1px] overflow-hidden bg-[var(--color-structure-interaction-subtle-border)]">
            <div
              aria-hidden
              className="absolute top-0 left-0 h-full bg-[#EB0A1E]"
              style={{
                width: `${progress}%`,
                opacity: isProgressVisible ? 1 : 0,
                transition: getProgressTransition(progress),
              }}
            />
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
                <h1 className="mb-6 font-bold text-[32px] text-brand-text uppercase leading-[56px] tracking-[-0.449px] md:mb-0">
                  FIND YOUR NEXT CAR
                </h1>
                <p className="font-normal text-[15px] text-brand-text-primary leading-normal">
                  1,784,503 Vehicles Available
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
