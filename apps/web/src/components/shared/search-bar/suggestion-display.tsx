/**
 * SuggestionDisplay component - Strategy pattern for rendering suggestions
 * Switches between dropdown and pills display modes
 * @module search-bar/suggestion-display
 */

import type React from "react";
import { DropdownSuggestions } from "./dropdown-suggestions";
import { PillsSuggestions } from "./pills-suggestions";
import type { SuggestionDisplayProps } from "./types";

/**
 * SuggestionDisplay component
 *
 * Uses the strategy pattern to render suggestions in either dropdown or pills mode.
 * The display mode is determined by the `mode` prop, and the component delegates
 * rendering to the appropriate strategy component.
 *
 * @param props - SuggestionDisplayProps
 * @returns React component that renders suggestions based on the selected mode
 *
 * @example
 * ```tsx
 * <SuggestionDisplay
 *   mode="dropdown"
 *   suggestions={suggestions}
 *   isAnimating={false}
 *   onSelect={handleSelect}
 * />
 * ```
 */
export const SuggestionDisplay: React.FC<SuggestionDisplayProps> = ({
  mode,
  suggestions,
  isAnimating,
  onSelect,
  pillsPlacement = "below",
  quickFilters,
  onQuickFilterSelect,
}) => {
  // Strategy pattern: delegate to the appropriate display component based on mode
  if (mode === "dropdown") {
    return (
      <DropdownSuggestions
        isAnimating={isAnimating}
        onSelect={onSelect}
        suggestions={suggestions}
      />
    );
  }

  // Pills mode
  return (
    <PillsSuggestions
      isAnimating={isAnimating}
      onQuickFilterSelect={onQuickFilterSelect}
      onSelect={onSelect}
      pillsPlacement={pillsPlacement}
      quickFilters={quickFilters}
      suggestions={suggestions}
    />
  );
};
