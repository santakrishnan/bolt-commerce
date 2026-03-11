/**
 * SearchBackdrop component - Overlay backdrop for dropdown mode
 * Renders a semi-transparent backdrop with blur effect when suggestions are displayed
 * @module search-bar/search-backdrop
 */

import type React from "react";
import { cn } from "@/lib/utils";

/**
 * Props for the SearchBackdrop component
 */
export interface SearchBackdropProps {
  /** Whether the backdrop is visible */
  isVisible: boolean;

  /** Callback when the backdrop is clicked */
  onClose: () => void;

  /** Whether the backdrop is currently animating */
  isAnimating?: boolean;

  /** Whether to apply blur to the backdrop layer */
  withBlur?: boolean;
}

/**
 * SearchBackdrop component
 *
 * Renders an overlay backdrop for dropdown mode that:
 * - Provides visual separation between suggestions and page content
 * - Applies backdrop blur effect for depth perception
 * - Handles click-to-close behavior for dismissing suggestions
 * - Animates smoothly when appearing/disappearing
 *
 * The backdrop is only rendered in dropdown mode and sits behind the
 * suggestions dropdown but above the rest of the page content.
 *
 * @param props - SearchBackdropProps
 * @returns React component that renders the backdrop overlay
 *
 * @example
 * ```tsx
 * <SearchBackdrop
 *   isVisible={showSuggestions}
 *   onClose={handleClose}
 *   isAnimating={isAnimating}
 * />
 * ```
 */
export const SearchBackdrop: React.FC<SearchBackdropProps> = ({
  isVisible,
  onClose,
  isAnimating = false,
  withBlur = true,
}) => {
  // Don't render if not visible
  if (!isVisible) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className={cn(
        // Base styles
        "fixed inset-0 z-40",
        // Backdrop styling
        "bg-black/20",
        withBlur && "backdrop-blur-sm",
        // Animation styles
        "transition-opacity duration-200 ease-out",
        isAnimating ? "opacity-0" : "opacity-100"
      )}
      onClick={onClose}
      onKeyDown={(e) => {
        // Handle Escape key to close
        if (e.key === "Escape") {
          e.preventDefault();
          onClose();
        }
      }}
      role="presentation"
      tabIndex={-1}
    />
  );
};
