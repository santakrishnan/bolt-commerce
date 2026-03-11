/**
 * SearchBar component - Main unified search component
 * Orchestrates all subcomponents with proper state management
 * @module search-bar/search-bar
 */

import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { lockBodyScroll, unlockBodyScroll } from "~/lib/body-scroll-lock";
import { useSearchHistory } from "./hooks/use-search-history";
import { useSearchSuggestions } from "./hooks/use-search-suggestions";
import { useVoiceRecognition } from "./hooks/use-voice-recognition";
import { SearchBackdrop } from "./search-backdrop";
import { SearchInput } from "./search-input";
import { SuggestionDisplay } from "./suggestion-display";
import { DEFAULT_CONFIG, type SearchBarProps, type Suggestion } from "./types";

/**
 * SearchBar component
 *
 * The main unified search component that consolidates duplicate search implementations
 * across the application. Provides:
 * - Controlled component pattern for search query management
 * - Configurable display modes (dropdown/pills)
 * - Autocomplete suggestions with debouncing
 * - Voice recognition support
 * - Search history persistence
 * - Full keyboard navigation and accessibility
 *
 * @param props - SearchBarProps
 * @returns React component that renders the complete search bar
 *
 * @example
 * ```tsx
 * const [query, setQuery] = useState('');
 *
 * <SearchBar
 *   value={query}
 *   onValueChange={setQuery}
 *   onSubmit={() => navigate(`/search?q=${query}`)}
 *   config={{ displayMode: 'dropdown' }}
 *   autocompleteService={vehicleAutocomplete}
 * />
 * ```
 */
export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onValueChange,
  onSubmit,
  config: userConfig,
  autocompleteService,
  onOpenChange,
  onQuickFilterSelect,
  className,
}) => {
  // Merge user config with defaults
  const config = {
    ...DEFAULT_CONFIG,
    ...userConfig,
  };

  // State management
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState<number>(-1);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [voiceErrorDismissed, setVoiceErrorDismissed] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Refs
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Custom hooks
  const { suggestions } = useSearchSuggestions(value, {
    autocompleteService,
    minCharsForSuggestions: config.minCharsForSuggestions,
    debounceTimeout: config.suggestionTimeout,
    maxSuggestions: config.maxSuggestions,
  });

  const {
    isListening,
    toggleListening,
    transcript,
    error: voiceError,
    isSupported: isVoiceSupported,
  } = useVoiceRecognition();

  const { addSearch, toSuggestions } = useSearchHistory();

  /**
   * Close suggestions with animation
   */
  const closeSuggestions = useCallback(() => {
    setIsClosing(true);
    setIsAnimating(true);
    setHasInteracted(false); // Reset interaction flag when closing
    setTimeout(() => {
      setShowSuggestions(false);
      setIsAnimating(false);
      setActiveSuggestionIndex(-1);
      setIsClosing(false);
      onOpenChange?.(false);
    }, 200); // Animation duration
  }, [onOpenChange]);

  // Determine which suggestions to show
  const displaySuggestions: Suggestion[] = (() => {
    // If user has typed something, show autocomplete suggestions
    if (value.length >= (config.minCharsForSuggestions ?? 2)) {
      return suggestions;
    }

    // If input is empty or below threshold, show search history
    if (config.enableSearchHistory && value.length === 0) {
      return toSuggestions();
    }

    return [];
  })();

  // Update voice transcript to input
  useEffect(() => {
    if (transcript) {
      onValueChange(transcript);
    }
  }, [transcript, onValueChange]);

  // Open suggestions when we have suggestions to display AND user has interacted
  useEffect(() => {
    // Don't open if we're in the middle of closing
    if (isClosing) {
      return;
    }

    const shouldOpen = displaySuggestions.length > 0 && !showSuggestions && hasInteracted;
    const shouldClose = displaySuggestions.length === 0 && showSuggestions;

    if (shouldOpen) {
      setShowSuggestions(true);
      setIsAnimating(false);
      onOpenChange?.(true);
    } else if (shouldClose) {
      closeSuggestions();
    }
  }, [
    displaySuggestions.length,
    showSuggestions,
    hasInteracted,
    isClosing,
    closeSuggestions,
    onOpenChange,
  ]);

  /**
   * Handle suggestion selection
   * - Populate input with suggestion text
   * - Do NOT submit search
   * - Do NOT refocus (let user decide next action)
   */
  const handleSuggestionSelect = useCallback(
    (suggestion: Suggestion) => {
      // Combine text and highlight for full suggestion
      const fullText = suggestion.text
        ? `${suggestion.text} ${suggestion.highlight}`.trim()
        : suggestion.highlight;

      // Temporarily disable interaction tracking to prevent reopening suggestions
      setHasInteracted(false);
      onValueChange(fullText);
      closeSuggestions();
    },
    [onValueChange, closeSuggestions]
  );

  /**
   * Handle search submission
   * - Call onSubmit callback
   * - Add to search history if enabled
   * - Close suggestions
   */
  const handleSubmit = useCallback(() => {
    if (!value.trim()) {
      return;
    }

    // Add to search history if enabled
    if (config.enableSearchHistory) {
      addSearch(value, `/search?q=${encodeURIComponent(value)}`, "nlp");
    }

    // Close suggestions
    closeSuggestions();

    // Call parent's onSubmit
    onSubmit();
  }, [value, config.enableSearchHistory, addSearch, closeSuggestions, onSubmit]);

  /**
   * Handle voice button click
   */
  const handleVoiceClick = useCallback(() => {
    // Only toggle if voice is supported
    if (isVoiceSupported) {
      toggleListening();
    }
  }, [toggleListening, isVoiceSupported]);

  /**
   * Handle Escape key - close suggestions
   */
  const handleEscape = useCallback(() => {
    closeSuggestions();
  }, [closeSuggestions]);

  /**
   * Handle Arrow Down - navigate to next suggestion
   */
  const handleArrowDown = useCallback(() => {
    if (!showSuggestions || displaySuggestions.length === 0) {
      return;
    }

    setActiveSuggestionIndex((prev) => {
      const next = prev + 1;
      return next >= displaySuggestions.length ? 0 : next;
    });
  }, [showSuggestions, displaySuggestions.length]);

  /**
   * Handle Arrow Up - navigate to previous suggestion
   */
  const handleArrowUp = useCallback(() => {
    if (!showSuggestions || displaySuggestions.length === 0) {
      return;
    }

    setActiveSuggestionIndex((prev) => {
      const next = prev - 1;
      return next < 0 ? displaySuggestions.length - 1 : next;
    });
  }, [showSuggestions, displaySuggestions.length]);

  /**
   * Handle click outside - close suggestions
   */
  useEffect(() => {
    if (!showSuggestions) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        closeSuggestions();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSuggestions, closeSuggestions]);

  // Lock body scroll when dropdown is open
  useEffect(() => {
    if (config.displayMode !== "dropdown") {
      return;
    }

    if (!showSuggestions) {
      return;
    }

    const shouldLockBodyScroll =
      config.lockBodyScrollOnOpen ?? window.matchMedia("(max-width: 1023px)").matches;

    if (!shouldLockBodyScroll) {
      return;
    }

    lockBodyScroll();

    return () => {
      unlockBodyScroll();
    };
  }, [showSuggestions, config.displayMode, config.lockBodyScrollOnOpen]);

  // Generate ARIA IDs
  const suggestionsId = "search-suggestions";
  const activeDescendantId =
    activeSuggestionIndex >= 0 ? `suggestion-${activeSuggestionIndex}` : undefined;

  return (
    <div className={cn("relative z-30", className)} ref={containerRef}>
      {/* Backdrop for dropdown mode */}
      {config.displayMode === "dropdown" && (
        <SearchBackdrop
          isAnimating={isAnimating}
          isVisible={showSuggestions}
          onClose={closeSuggestions}
          withBlur={config.withBackdropBlur}
        />
      )}

      {/* Main search input - ensure it's above backdrop */}
      <div
        className={cn(
          "relative z-50",
          // Apply horizontal padding only on mobile when in pills mode; remove at md and above
          config.displayMode === "pills" && "px-[var(--spacing-md)] md:px-0"
        )}
      >
        <SearchInput
          ariaActiveDescendant={activeDescendantId}
          ariaControls={suggestionsId}
          ariaExpanded={showSuggestions}
          enableVoiceRecognition={config.enableVoiceRecognition}
          inputRef={inputRef as React.RefObject<HTMLInputElement>}
          isListening={isListening}
          keepRounded={config.displayMode === "pills"}
          onArrowDown={handleArrowDown}
          onArrowUp={handleArrowUp}
          onChange={(newValue) => {
            setHasInteracted(true);
            onValueChange(newValue);
          }}
          onEscape={handleEscape}
          onSubmit={handleSubmit}
          onVoiceClick={handleVoiceClick}
          placeholder={config.placeholder}
          showSearchButton={config.showSearchButton}
          suggestionsOpen={showSuggestions}
          value={value}
          withBorder={config.withBorder}
        />
      </div>

      {/* Pills above input (if configured) */}
      {config.displayMode === "pills" && config.pillsPlacement === "above" && showSuggestions && (
        <div className="mb-xs">
          <SuggestionDisplay
            isAnimating={isAnimating}
            mode="pills"
            onSelect={handleSuggestionSelect}
            pillsPlacement="above"
            suggestions={displaySuggestions}
          />
        </div>
      )}

      {/* Dropdown suggestions (below input) */}
      {config.displayMode === "dropdown" && showSuggestions && (
        <div className="absolute top-full right-0 left-0 z-50">
          <SuggestionDisplay
            isAnimating={isAnimating}
            mode="dropdown"
            onSelect={handleSuggestionSelect}
            suggestions={displaySuggestions}
          />
        </div>
      )}

      {/* Pills below input (if configured) */}
      {config.displayMode === "pills" &&
        config.pillsPlacement === "below" &&
        (showSuggestions || (!value && (config.quickFilters?.length ?? 0) > 0)) && (
          <div className="mt-xs">
            <SuggestionDisplay
              isAnimating={isAnimating}
              mode="pills"
              onQuickFilterSelect={onQuickFilterSelect}
              onSelect={handleSuggestionSelect}
              pillsPlacement="below"
              quickFilters={value ? undefined : config.quickFilters}
              suggestions={displaySuggestions}
            />
          </div>
        )}

      {/* Voice error message - positioned absolutely to not affect layout */}
      {voiceError && !voiceErrorDismissed && (
        <div
          aria-live="polite"
          className={cn(
            "absolute top-full right-0 left-0 z-50 mt-xs flex items-center justify-between gap-sm rounded-lg px-sm py-xs shadow-lg",
            config.lightTheme
              ? "bg-white/10 text-white backdrop-blur-sm"
              : "bg-(--color-feedback-error-background) text-(--color-feedback-error-text)"
          )}
          role="alert"
          style={{ fontSize: "var(--font-size-xs)" }}
        >
          <span>{voiceError.message}</span>
          <button
            aria-label="Dismiss error"
            className={cn(
              "shrink-0 hover:opacity-70",
              config.lightTheme ? "text-white" : "text-(--color-feedback-error-text)"
            )}
            onClick={() => setVoiceErrorDismissed(true)}
            type="button"
          >
            <svg
              aria-hidden="true"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}

      {/* ARIA live region for suggestion count announcements */}
      <output aria-atomic="true" aria-live="polite" className="sr-only">
        {showSuggestions && displaySuggestions.length > 0 && (
          <span>{displaySuggestions.length} suggestions available</span>
        )}
      </output>
    </div>
  );
};
