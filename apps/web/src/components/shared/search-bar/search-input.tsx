/**
 * SearchInput component - Controlled input field with search icon and voice button
 * Handles keyboard events and applies conditional styling
 * @module search-bar/search-input
 */

import { Button } from "@tfs-ucmp/ui";
import Image from "next/image";
import type React from "react";
import { cn } from "@/lib/utils";

/**
 * Props for the SearchInput component
 */
export interface SearchInputProps {
  /** Current input value (controlled) */
  value: string;

  /** Callback when input value changes */
  onChange: (value: string) => void;

  /** Callback when Enter key is pressed */
  onSubmit: () => void;

  /** Callback when Escape key is pressed */
  onEscape?: () => void;

  /** Callback when Arrow Down key is pressed */
  onArrowDown?: () => void;

  /** Callback when Arrow Up key is pressed */
  onArrowUp?: () => void;

  /** Placeholder text */
  placeholder?: string;

  /** Whether suggestions are currently open */
  suggestionsOpen: boolean;

  /** When true, keeps rounded-full even when suggestions are open (used for pills mode) */
  keepRounded?: boolean;

  /** Whether to show border */
  withBorder?: boolean;

  /** Whether voice recognition is enabled */
  enableVoiceRecognition?: boolean;

  /** Whether voice recognition is currently active */
  isListening?: boolean;

  /** Callback when voice button is clicked */
  onVoiceClick?: () => void;

  /** Whether to show search button */
  showSearchButton?: boolean;

  /** ARIA attributes for accessibility */
  ariaControls?: string;
  ariaExpanded?: boolean;
  ariaActiveDescendant?: string;

  /** Additional CSS classes */
  className?: string;

  /** Ref to the input element */
  inputRef?: React.RefObject<HTMLInputElement>;
}

/**
 * SearchInput component
 *
 * A controlled input field with:
 * - Search icon (sparkle) on the left
 * - Voice button (microphone) on the right (when enabled)
 * - Keyboard event handling (Enter, Escape, Arrow keys)
 * - Conditional styling based on suggestions state
 * - Border radius transitions when suggestions open/close
 * - Native browser autocomplete disabled
 * - Full ARIA support for accessibility
 *
 * @param props - SearchInputProps
 * @returns React component that renders the search input field
 *
 * @example
 * ```tsx
 * <SearchInput
 *   value={query}
 *   onChange={setQuery}
 *   onSubmit={handleSubmit}
 *   suggestionsOpen={showSuggestions}
 *   enableVoiceRecognition={true}
 *   onVoiceClick={toggleVoice}
 * />
 * ```
 */
export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  onSubmit,
  onEscape,
  onArrowDown,
  onArrowUp,
  placeholder = "Try: SUV under 35k with heated seats near San Francisco",
  withBorder = false,
  enableVoiceRecognition = true,
  isListening = false,
  onVoiceClick,
  ariaControls,
  ariaExpanded,
  ariaActiveDescendant,
  className,
  inputRef,
  showSearchButton = false,
}) => {
  /**
   * Handle keyboard events
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "Enter":
        e.preventDefault();
        onSubmit();
        break;
      case "Escape":
        if (onEscape) {
          e.preventDefault();
          onEscape();
        }
        break;
      case "ArrowDown":
        if (onArrowDown) {
          e.preventDefault();
          onArrowDown();
        }
        break;
      case "ArrowUp":
        if (onArrowUp) {
          e.preventDefault();
          onArrowUp();
        }
        break;
      default:
        // No action needed for other keys
        break;
    }
  };

  return (
    <div
      className={cn(
        // Base styles
        "relative flex items-center",
        "bg-(--color-core-surfaces-card)",
        "pt-[var(--spacing-2xs)] pr-[var(--spacing-2xs)] pb-[var(--spacing-2xs)]",
        "pl-[var(--spacing-md)]",
        // Border styles
        withBorder && "border border-(--color-structure-interaction-border)",
        // Border radius transitions - smooth transition when suggestions open/close
        "transition-all duration-500 ease-out",
        "rounded-full",
        // Additional classes
        className
      )}
    >
      {/* Search icon (sparkle) */}
      <Image
        alt="Search"
        className="mr-xs h-[19.127px] w-[19.5px] shrink-0"
        height={19.127}
        src="/images/search_star.svg"
        style={{ aspectRatio: "19.50/19.13" }}
        width={19.5}
      />

      {/* Input field */}
      <input
        aria-activedescendant={ariaActiveDescendant}
        aria-autocomplete="list"
        aria-controls={ariaControls}
        aria-expanded={ariaExpanded ?? false}
        aria-label="Search for vehicles"
        autoComplete="off"
        className={cn(
          // Base styles
          "flex-1 bg-transparent outline-none",
          // Text styles
          "text-[length:var(--font-size-sm)]",
          "font-[var(--font-family)]",
          "text-[var(--color-core-surfaces-foreground)]",
          // Placeholder styles
          "placeholder:text-[var(--color-core-surfaces-foreground-muted)]"
        )}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        ref={inputRef}
        role="combobox"
        type="text"
        value={value}
      />

      {/* Voice button (microphone) */}
      {enableVoiceRecognition && (
        <button
          aria-label={isListening ? "Stop voice input" : "Start voice input"}
          className={cn(
            "relative flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full transition-all duration-300",
            isListening
              ? "bg-[var(--color-brand-red)] shadow-[0_0_0_4px_rgba(235,10,30,0.2)]"
              : "bg-transparent"
          )}
          onClick={onVoiceClick}
          type="button"
        >
          {isListening && (
            <span className="absolute inset-0 animate-ping rounded-full bg-[var(--color-brand-red)] opacity-30" />
          )}
          <Image
            alt="Microphone"
            className={cn(
              "h-[18px] w-[12px] transition-all duration-300",
              isListening ? "brightness-0 invert" : ""
            )}
            height={18}
            src="/images/search_mic.svg"
            width={12}
          />
        </button>
      )}

      {/* Search button */}
      {showSearchButton && (
        <>
          {/* Desktop: Text button */}
          <Button
            className="hidden h-[var(--spacing-10)] w-[var(--spacing-5xl)] cursor-pointer rounded-full bg-[var(--color-brand-red)] text-[length:var(--font-size-sm)] text-[var(--color-actions-primary-foreground)] transition-colors hover:bg-red-600 lg:block"
            onClick={onSubmit}
            type="button"
            variant="search"
          >
            Search
          </Button>
          {/* Mobile: Icon button */}
          <Button
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand-red)] p-xs lg:hidden"
            onClick={onSubmit}
            type="button"
            variant="search"
          >
            <Image
              alt="Search"
              className="h-sd w-md max-w-none"
              height={14}
              src="/images/search/vlp_search.svg"
              width={16}
            />
          </Button>
        </>
      )}
    </div>
  );
};
