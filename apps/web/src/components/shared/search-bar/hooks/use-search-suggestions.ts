import { useCallback, useEffect, useRef, useState } from "react";
import type { AutocompleteService, Suggestion } from "../types";

/**
 * Return type for useSearchSuggestions hook
 */
export interface UseSearchSuggestionsReturn {
  /** Current suggestions from autocomplete service */
  suggestions: Suggestion[];

  /** Whether suggestions are currently being fetched */
  isLoading: boolean;

  /** Error state if autocomplete request fails */
  error: Error | null;

  /** Manually trigger a suggestions fetch */
  fetchSuggestions: (query: string) => void;

  /** Clear current suggestions */
  clearSuggestions: () => void;
}

/**
 * Options for useSearchSuggestions hook
 */
export interface UseSearchSuggestionsOptions {
  /** Autocomplete service to use for fetching suggestions */
  autocompleteService?: AutocompleteService;

  /** Minimum characters before fetching suggestions */
  minCharsForSuggestions?: number;

  /** Debounce timeout in milliseconds */
  debounceTimeout?: number;

  /** Maximum number of suggestions to fetch */
  maxSuggestions?: number;
}

/**
 * Custom hook for managing autocomplete suggestions with debouncing
 *
 * @param query - Current search query value
 * @param options - Configuration options
 * @returns Suggestions state and control functions
 *
 * @example
 * ```tsx
 * const { suggestions, isLoading, error } = useSearchSuggestions(query, {
 *   autocompleteService: myService,
 *   minCharsForSuggestions: 2,
 *   debounceTimeout: 200,
 *   maxSuggestions: 4,
 * });
 * ```
 */
export function useSearchSuggestions(
  query: string,
  options: UseSearchSuggestionsOptions = {}
): UseSearchSuggestionsReturn {
  const {
    autocompleteService,
    minCharsForSuggestions = 2,
    debounceTimeout = 200,
    maxSuggestions = 4,
  } = options;

  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Use ref to track the latest request to avoid race conditions
  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Fetch suggestions from the autocomplete service
   */
  const fetchSuggestions = useCallback(
    async (searchQuery: string) => {
      // Cancel any pending request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Check if we have a service and meet minimum character threshold
      if (!autocompleteService) {
        setSuggestions([]);
        setIsLoading(false);
        return;
      }

      if (searchQuery.length < minCharsForSuggestions) {
        setSuggestions([]);
        setIsLoading(false);
        setError(null);
        return;
      }

      // Create new abort controller for this request
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      setIsLoading(true);
      setError(null);

      try {
        const results = await autocompleteService.getSuggestions(searchQuery, maxSuggestions);

        // Only update state if this request wasn't aborted
        if (!abortController.signal.aborted) {
          setSuggestions(results);
          setIsLoading(false);
        }
      } catch (err) {
        // Only update error state if this request wasn't aborted
        if (!abortController.signal.aborted) {
          console.error("Autocomplete service error:", err);
          const error = err instanceof Error ? err : new Error("Failed to fetch suggestions");
          setError(error);
          setSuggestions([]); // Graceful degradation
          setIsLoading(false);
        }
      }
    },
    [autocompleteService, minCharsForSuggestions, maxSuggestions]
  );

  /**
   * Clear current suggestions
   */
  const clearSuggestions = useCallback(() => {
    // Cancel any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Clear debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    setSuggestions([]);
    setIsLoading(false);
    setError(null);
  }, []);

  /**
   * Effect to handle debounced fetching when query changes
   */
  useEffect(() => {
    // Clear any existing debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // If query is empty or below threshold, clear suggestions immediately
    if (!query || query.length < minCharsForSuggestions) {
      clearSuggestions();
      return;
    }

    // Set up debounced fetch
    debounceTimerRef.current = setTimeout(() => {
      fetchSuggestions(query);
    }, debounceTimeout);

    // Cleanup function
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query, debounceTimeout, minCharsForSuggestions, fetchSuggestions, clearSuggestions]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      // Cancel any pending request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Clear debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    suggestions,
    isLoading,
    error,
    fetchSuggestions,
    clearSuggestions,
  };
}
