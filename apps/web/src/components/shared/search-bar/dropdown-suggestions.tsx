/**
 * DropdownSuggestions component - Renders suggestions in dropdown list format
 * Displays suggestions below the search input with visual separation and smooth animations
 * @module search-bar/dropdown-suggestions
 */

import type React from "react";
import { cn } from "@/lib/utils";
import type { Suggestion } from "./types";

/**
 * Props for the DropdownSuggestions component
 */
export interface DropdownSuggestionsProps {
  /** ID of the currently active suggestion for ARIA */
  activeDescendantId?: string;

  /** Whether suggestions are currently animating */
  isAnimating: boolean;

  /** Callback when a suggestion is selected */
  onSelect: (suggestion: Suggestion) => void;

  /** Callback when a suggestion is focused via keyboard navigation */
  onSuggestionFocus?: (index: number) => void;
  /** Array of suggestions to display */
  suggestions: Suggestion[];
}

/**
 * DropdownSuggestions component
 *
 * Renders autocomplete suggestions in a dropdown list format positioned directly
 * below the search input. Features include:
 * - Visual separation with shadows and borders
 * - Smooth open/close animations
 * - Keyboard navigation support
 * - ARIA attributes for accessibility
 * - Theme token-based styling
 *
 * @param props - DropdownSuggestionsProps
 * @returns React component that renders suggestions in dropdown format
 *
 * @example
 * ```tsx
 * <DropdownSuggestions
 *   suggestions={suggestions}
 *   isAnimating={false}
 *   onSelect={handleSelect}
 *   activeDescendantId="suggestion-0"
 * />
 * ```
 */
export const DropdownSuggestions: React.FC<DropdownSuggestionsProps> = ({
  suggestions,
  isAnimating,
  onSelect,
  activeDescendantId,
  onSuggestionFocus,
}) => {
  // Don't render if no suggestions
  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        // Base styles
        "absolute right-0 left-0 z-10",
        "bg-(--color-core-surfaces-card)",
        "border border-(--color-structure-interaction-border)",
        "border-t-0",
        "rounded-t-none rounded-b-3xl",
        "overflow-hidden",
        "shadow-lg",
        // Position directly below input (no gap)
        "top-0",
        // Animation styles
        "origin-top transition-all duration-200 ease-out",
        isAnimating
          ? "-translate-y-1 scale-y-95 opacity-0"
          : "translate-y-0 scale-y-100 opacity-100"
      )}
      id="search-suggestions"
      role="listbox"
    >
      <div className="pt-lg pb-xs">
        {suggestions.map((suggestion, index) => {
          const suggestionId = `suggestion-${index}`;
          const isActive = activeDescendantId === suggestionId;

          return (
            <div
              aria-selected={isActive}
              className={cn(
                // Base styles
                "group search-dropdown-item",
                "px-md",
                "py-sm",
                "cursor-pointer",
                "transition-colors duration-150",
                // Hover and active states
                "hover:bg-gray-100",
                isActive && "bg-gray-100",
                // Text styles
                "text-(--font-size-sm)",
                "font-(--font-family)"
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
            >
              <span className="text-(--color-core-surfaces-foreground-muted) transition-colors group-hover:text-(--color-core-surfaces-foreground)">
                {suggestion.text}
              </span>
              {suggestion.highlight && (
                <>
                  {" "}
                  <span className="font-semibold text-(--color-core-surfaces-foreground) transition-colors group-hover:text-(--color-brand-text-primary)">
                    {suggestion.highlight}
                  </span>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
