"use client";
import { SearchBar } from "@features/search/components/search-bar/search-bar";
import { useSearchContext } from "@features/search/context/search-context";
import { mockVehicles } from "@features/search/lib/mock-vehicles";
import { AppButton } from "@shared/components/button";
import { CustomChips } from "@shared/components/custom-chips";
import { useIntersectionObserver } from "@shared/hooks/use-intersection-observer";
import { Heading } from "@tfs-ucmp/ui";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AutocompleteProxyService } from "~/features/search/components/search-bar/services/autocomplete-proxy";
import { SORT_LABELS } from "./sort-labels";
import type { ActiveFilter } from "./vehicle-results";

const autocompleteService = new AutocompleteProxyService();

export interface SearchHeroProps {
  activeFilters: ActiveFilter[];
  onBlurOverlayChange?: (showOverlay: boolean) => void;
  onRemoveFilter: (type: string, value: string) => void;
  onReset?: () => void;
  onSearch: () => void;
  onSearchChange: (query: string) => void;
  onToggleFilter?: () => void;
  placeholder?: string;
  searchQuery: string;
  showQuickFilters?: boolean;
  showTitle?: boolean;
  suggestedPills?: string[];
  vehicleCount?: number;
  vehiclesAvailable?: number;
}

export function SearchHero({
  searchQuery,
  onSearchChange,
  onBlurOverlayChange,
  showTitle = true,
  showQuickFilters = true,
  placeholder = "Try: 'SUV under 35k with heated seats near San Francisco",
  onToggleFilter,
  onReset,
  vehicleCount,
  activeFilters,
  onRemoveFilter,
  suggestedPills,
  onSearch,
}: SearchHeroProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!isEditing) {
      setLocalQuery(searchQuery);
    }
  }, [searchQuery, isEditing]);
  const sectionRef = useRef<HTMLElement>(null);
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const [isStickyDropdownOpen, setIsStickyDropdownOpen] = useState(false);
  const selectRef = useRef<HTMLSelectElement | null>(null);
  const measureRef = useRef<HTMLSpanElement | null>(null);
  const { sortOption, setSortOption, progress, isProgressVisible } = useSearchContext();

  const resolvedPills = suggestedPills ?? [];

  // Recompute select width when sortOption changes (matches SRP behavior)
  // biome-ignore lint/correctness/useExhaustiveDependencies: sortOption triggers recalculation when sort label text changes width
  useEffect(() => {
    if (!(measureRef.current && selectRef.current)) {
      return;
    }
    const w = measureRef.current.offsetWidth;
    if (w > 0) {
      selectRef.current.style.width = `${w}px`;
    }
  }, [sortOption]);

  useIntersectionObserver(
    sectionRef,
    (entries) => setIsHeroVisible(entries[0]?.isIntersecting ?? true),
    { threshold: 0 }
  );

  const handleSubmit = () => {
    onSearchChange(localQuery);
    onSearch();
  };

  return (
    <>
      {!isHeroVisible && (
        <div className="fixed top-0 right-0 left-0 z-[35] bg-white">
          <div className="mx-auto flex min-h-20 max-w-[var(--container-2xl)] flex-col items-start justify-between gap-4 px-[var(--spacing-2xs)] py-[var(--spacing-xs)] sm:flex-row sm:px-6 lg:px-20">
            {activeFilters.length > 0 ? (
              <div className="flex shrink-0 items-center gap-[var(--spacing-sm)]">
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
                <div className="mx-auto flex flex-row items-center gap-[var(--spacing-sm)] md:mx-0 md:flex-col md:items-start md:gap-0">
                  <div className="font-[var(--font-family,'Toyota_Type')] font-semibold text-[length:var(--font-size-xs)] text-[var(--color-core-surfaces-foreground)] leading-normal md:text-[length:var(--font-size-md)]">
                    {vehicleCount} vehicles found
                  </div>
                  <span className="my-1 text-[#ccc] md:hidden">|</span>
                  <div className="font-[var(--font-family,'Toyota_Type')] font-semibold text-[length:var(--font-size-xs)] text-[var(--color-core-surfaces-foreground)] leading-normal">
                    Sort by:{" "}
                    <div className="inline-flex items-center gap-[var(--spacing-sm)] font-semibold">
                      <span
                        aria-hidden
                        className="pointer-events-none invisible absolute whitespace-nowrap font-medium"
                        ref={measureRef}
                      >
                        {SORT_LABELS[sortOption]}
                      </span>
                      <select
                        className="cursor-pointer appearance-none border-none bg-transparent font-medium text-black outline-none"
                        onChange={(e) =>
                          setSortOption(e.target.value as "recommended" | "low-high" | "high-low")
                        }
                        ref={selectRef}
                        value={sortOption}
                      >
                        <option value="recommended">Recommended</option>
                        <option value="low-high">Low to High</option>
                        <option value="high-low">High to Low</option>
                      </select>
                      <Image
                        alt="Dropdown"
                        className="h-1.75 w-[12px]"
                        height={7}
                        src="/images/dropdown-arrow.svg"
                        width={12}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex shrink-0 items-center gap-2">
                {onToggleFilter && (
                  <div className="flex shrink-0 items-center gap-[var(--spacing-sm)]">
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
                    <div className="mx-auto flex flex-row items-center gap-[var(--spacing-sm)] md:mx-0 md:flex-col md:items-start md:gap-0">
                      <div className="font-[var(--font-family)] font-semibold text-[length:var(--font-size-xs)] text-[var(--color-core-surfaces-foreground)] leading-normal md:text-[length:var(--font-size-md)]">
                        {vehicleCount} vehicles found
                      </div>
                      <span className="my-1 text-[var(--color-brand-border-medium)] md:hidden">
                        |
                      </span>
                      <div className="font-[var(--font-family)] font-semibold text-[length:var(--font-size-xs)] text-[var(--color-core-surfaces-foreground)] leading-normal">
                        Sort by:{" "}
                        <div className="inline-flex items-center gap-[var(--spacing-sm)] font-semibold">
                          <span
                            aria-hidden
                            className="pointer-events-none invisible absolute whitespace-nowrap font-medium"
                            ref={measureRef}
                          >
                            {SORT_LABELS[sortOption]}
                          </span>
                          <select
                            className="cursor-pointer appearance-none border-none bg-transparent font-medium text-black outline-none"
                            onChange={(e) =>
                              setSortOption(
                                e.target.value as "recommended" | "low-high" | "high-low"
                              )
                            }
                            ref={selectRef}
                            value={sortOption}
                          >
                            <option value="recommended">Recommended</option>
                            <option value="low-high">Low to High</option>
                            <option value="high-low">High to Low</option>
                          </select>
                          <Image
                            alt="Dropdown"
                            className="h-1.75 w-[12px]"
                            height={7}
                            src="/images/dropdown-arrow.svg"
                            width={12}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            <div
              className={`relative w-full min-w-0 max-w-[848px] flex-1 overflow-hidden ${isStickyDropdownOpen ? "z-[50]" : ""}`}
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
                    quickFilters: resolvedPills,
                    customPlaceholder: (
                      <>
                        SUV under 35K with{" "}
                        <span className="font-[var(--font-weight-bold)]">low miles</span>.
                      </>
                    ),
                  }}
                  onOpenChange={(open) => {
                    setIsStickyDropdownOpen(open);
                    if (open) {
                      setIsDropdownOpen(false);
                    }
                    onBlurOverlayChange?.(open);
                  }}
                  onQuickFilterSelect={(filter) => {
                    setLocalQuery(filter);
                    setIsEditing(false);
                    onSearchChange(filter);
                    onSearch();
                  }}
                  onSubmit={handleSubmit}
                  onValueChange={(v) => {
                    setIsEditing(true);
                    setLocalQuery(v);
                  }}
                  value={localQuery}
                />
              )}
              {activeFilters.length > 0 && (
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-center gap-[var(--spacing-2xs)] md:justify-end">
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
          <div className="mx-6 md:mx-0">
            <div className="relative h-px overflow-hidden bg-(--color-structure-interaction-subtle-border)">
              <div
                aria-hidden
                className="absolute top-0 left-0 h-full"
                style={{
                  width: `${progress}%`,
                  opacity: isProgressVisible ? 1 : 0,
                  background: "var(--primary)",
                  transition: (() => {
                    if (progress === 100) {
                      return "width 0.25s ease-in, opacity 0.4s ease 0.2s";
                    }
                    if (progress === 0) {
                      return "none";
                    }
                    return "width 1.5s cubic-bezier(0.05, 0.6, 0.1, 1), opacity 0.15s ease";
                  })(),
                }}
              />
            </div>
          </div>
        </div>
      )}

      <section
        className={`${isDropdownOpen ? "bg-[var(--color-core-surfaces-background)]" : "bg-[var(--color-core-surfaces-background)]"} py-[var(--spacing-10)] pt-8 pb-6 md:pb-[var(--spacing-lg)] ${isDropdownOpen ? "relative z-30" : ""} ${showTitle ? "" : "py-0"}`}
        ref={sectionRef}
      >
        <div className="mx-auto max-w-[var(--container-2xl)] px-0 sm:px-[var(--spacing-lg)] lg:px-[var(--spacing-4xl)]">
          <div className="flex flex-col gap-6 lg:min-h-[120px] lg:flex-row lg:items-start lg:justify-between">
            {/* Title */}
            {showTitle && (
              <div className="flex flex-col items-center justify-center text-center md:items-start md:justify-start md:text-left">
                <Heading
                  className="mb-6 text-[color:var(--color-core-surfaces-foreground)] uppercase leading-[56px] tracking-[-0.449px] md:mb-0 md:text-[length:var(--text-2xl)] lg:text-[length:var(--text-2xl)]"
                  level={1}
                  weight="bold"
                >
                  FIND YOUR NEXT CAR
                </Heading>
                <p className="font-normal text-[15px] text-brand-text-primary leading-normal">
                  {mockVehicles.length} Vehicles Available
                </p>
              </div>
            )}

            <div
              className={`relative w-full min-w-0 max-w-[848px] flex-1 overflow-hidden pt-4 ${isDropdownOpen ? "z-50" : ""}`}
            >
              <SearchBar
                autocompleteService={autocompleteService}
                config={{
                  displayMode: "pills",
                  pillsPlacement: "below",
                  withBorder: false,
                  placeholder,
                  showSearchButton: true,
                  enableSearchHistory: false,
                  quickFilters: showQuickFilters ? resolvedPills : undefined,
                  customPlaceholder: (
                    <>
                      SUV under 35K with{" "}
                      <span className="font-[var(--font-weight-bold)]">low miles</span>.
                    </>
                  ),
                }}
                onOpenChange={(open) => {
                  setIsDropdownOpen(open);
                  if (open) {
                    setIsStickyDropdownOpen(false);
                  }
                  onBlurOverlayChange?.(open);
                }}
                onQuickFilterSelect={(filter) => {
                  setLocalQuery(filter);
                  setIsEditing(false);
                  onSearchChange(filter);
                  onSearch();
                }}
                onSubmit={handleSubmit}
                onValueChange={(v) => {
                  setIsEditing(true);
                  setLocalQuery(v);
                }}
                value={localQuery}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
