/**
 * PillsSuggestions component - Renders suggestions as horizontal pill-shaped buttons
 * Displays suggestions as clickable pills that can be placed above or below the search input
 * @module search-bar/pills-suggestions
 */

import type React from "react";
import { cn } from "@/lib/utils";
import { Button } from "../../../../../../packages/ui/src";
import type { Suggestion } from "./types";

/**
 * Props for the PillsSuggestions component
 */
export interface PillsSuggestionsProps {
  /** Array of suggestions to display */
  suggestions: Suggestion[];

  /** Whether suggestions are currently animating */
  isAnimating: boolean;

  /** Callback when a suggestion is selected */
  onSelect: (suggestion: Suggestion) => void;

  /** Placement of pills relative to search input */
  pillsPlacement?: "above" | "below";

  /** ID of the currently active suggestion for ARIA */
  activeDescendantId?: string;

  /** Callback when a suggestion is focused via keyboard navigation */
  onSuggestionFocus?: (index: number) => void;

  /** Quick-filter pill labels to show when there are no suggestions */
  quickFilters?: string[];

  /** Callback when a quick-filter pill is clicked */
  onQuickFilterSelect?: (filter: string) => void;
}

/**
 * PillsSuggestions component
 *
 * Renders autocomplete suggestions as horizontal pill-shaped buttons that can be
 * positioned above or below the search input. Features include:
 * - Pill-shaped button design with rounded corners
 * - Horizontal scrolling layout for multiple suggestions
 * - Support for above/below placement configuration
 * - Smooth animations for appearance/disappearance
 * - Keyboard navigation support
 * - ARIA attributes for accessibility
 * - Theme token-based styling
 *
 * @param props - PillsSuggestionsProps
 * @returns React component that renders suggestions as pills
 *
 * @example
 * ```tsx
 * <PillsSuggestions
 *   suggestions={suggestions}
 *   isAnimating={false}
 *   onSelect={handleSelect}
 *   pillsPlacement="below"
 * />
 * ```
 */
export const PillsSuggestions: React.FC<PillsSuggestionsProps> = ({
  suggestions,
  isAnimating,
  onSelect,
  pillsPlacement = "below",
  activeDescendantId,
  onSuggestionFocus,
  quickFilters,
  onQuickFilterSelect,
}) => {
  // Don't render if no suggestions and no quick filters
  if (suggestions.length === 0 && (!quickFilters || quickFilters.length === 0)) {
    return null;
  }

  return (
    <div
      aria-label="Search suggestions"
      className={cn(
        // Base styles
        "z-40 w-full",
        // Position based on placement
        pillsPlacement === "above" ? "mb-sm" : "mt-sm",
        // Animation styles
        "transition-all duration-200 ease-out",
        // Animation direction based on placement and state
        isAnimating && pillsPlacement === "above" && "translate-y-1 opacity-0",
        isAnimating && pillsPlacement === "below" && "-translate-y-1 opacity-0",
        !isAnimating && "translate-y-0 opacity-100"
      )}
      id="search-suggestions"
      role="listbox"
    >
      <div
        className={cn(
          "scrollbar-hide flex min-w-0 gap-2 overflow-x-auto whitespace-nowrap pl-4",
          "md:flex-wrap md:justify-end md:overflow-x-visible md:whitespace-normal md:pl-0",
          pillsPlacement === "above" ? "mb-4" : "mt-6 md:mt-4"
        )}
        style={{
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {suggestions.map((suggestion, index) => {
          const suggestionId = `suggestion-${index}`;
          const isActive = activeDescendantId === suggestionId;

          return (
            <Button
              aria-selected={isActive}
              className={cn(
                "flex h-[var(--spacing-xl)] items-center gap-[var(--spacing-2xs)] rounded-full bg-white px-[var(--spacing-sm)]",
                "text-(length:--font-size-xs) text-center font-normal text-[var(--color-brand-text-primary)] leading-normal",
                "hover:bg-white hover:text-[var(--color-brand-text-primary)] hover:opacity-100 hover:shadow-none",
                "cursor-pointer whitespace-nowrap",
                isActive && "opacity-80"
              )}
              id={suggestionId}
              key={suggestion.id || `${suggestion.text}-${index}`}
              onClick={() => onSelect(suggestion)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(suggestion);
                }
              }}
              onMouseEnter={() => onSuggestionFocus?.(index)}
              role="option"
              tabIndex={-1}
              type="button"
              variant="search"
            >
              {suggestion.text
                ? `${suggestion.text} ${suggestion.highlight}`.trim()
                : suggestion.highlight}
            </Button>
          );
        })}

        {/* Quick filter pills — shown when query is empty and no suggestions */}
        {suggestions.length === 0 &&
          quickFilters?.map((filter) => (
            <Button
              className={cn(
                "flex h-[var(--spacing-xl)] items-center gap-[var(--spacing-2xs)] rounded-full bg-white px-[var(--spacing-sm)]",
                "text-(length:--font-size-xs) text-center font-normal text-[var(--color-brand-text-primary)] leading-normal",
                "hover:bg-white hover:text-[var(--color-brand-text-primary)] hover:opacity-100 hover:shadow-none",
                "cursor-pointer whitespace-nowrap"
              )}
              key={filter}
              onClick={() => onQuickFilterSelect?.(filter)}
              role="option"
              tabIndex={-1}
              type="button"
              variant="search"
            >
              {filter}
            </Button>
          ))}
      </div>
    </div>
  );
};
