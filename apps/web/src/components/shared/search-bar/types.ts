/**
 * TypeScript interfaces for the unified search component
 * @module search-bar/types
 */

/**
 * Configuration options for the SearchBar component
 */
export interface SearchBarConfig {
  /** Display mode for suggestions */
  displayMode: "dropdown" | "pills";

  /** Placement of pills (only applies when displayMode is 'pills') */
  pillsPlacement?: "above" | "below";

  /** Maximum number of suggestions to display */
  maxSuggestions?: number;

  /** Minimum characters before showing suggestions */
  minCharsForSuggestions?: number;

  /** Timeout for autocomplete requests in milliseconds */
  suggestionTimeout?: number;

  /** Enable voice recognition feature */
  enableVoiceRecognition?: boolean;

  /** Enable search history feature */
  enableSearchHistory?: boolean;

  /** Show border around search input */
  withBorder?: boolean;

  /** Custom placeholder text */
  placeholder?: string;

  /** Show search button (desktop: "Search" text, mobile: icon) */
  showSearchButton?: boolean;

  /** Use light theme (white text for dark backgrounds) */
  lightTheme?: boolean;

  /** Apply blur effect on dropdown backdrop */
  withBackdropBlur?: boolean;

  /**
   * Lock body scroll while dropdown suggestions are open.
   * By default this is applied only on mobile-sized viewports.
   */
  lockBodyScrollOnOpen?: boolean;

  /** Quick-filter pill labels shown when query is empty (pills mode only) */
  quickFilters?: string[];
}

/**
 * Props for the SearchBar component
 */
export interface SearchBarProps {
  /** Current search query value (controlled) */
  value: string;

  /** Callback when search query changes */
  onValueChange: (value: string) => void;

  /** Callback when search is submitted */
  onSubmit: () => void;

  /** Configuration options */
  config?: Partial<SearchBarConfig>;

  /** Optional autocomplete service */
  autocompleteService?: AutocompleteService;

  /** Callback when suggestions panel opens/closes */
  onOpenChange?: (open: boolean) => void;

  /** Callback when a quick-filter pill is selected */
  onQuickFilterSelect?: (filter: string) => void;

  /** Additional CSS classes */
  className?: string;
}

/**
 * A search suggestion with text and highlighted portion
 */
export interface Suggestion {
  /** Main text portion of the suggestion */
  text: string;

  /** Highlighted portion of the suggestion */
  highlight: string;

  /** Optional unique identifier */
  id?: string;
}

/**
 * Service interface for fetching autocomplete suggestions
 */
export interface AutocompleteService {
  /**
   * Fetch suggestions for a given query
   * @param query - The search query
   * @param maxResults - Maximum number of results to return
   * @returns Promise resolving to array of suggestions
   */
  getSuggestions(query: string, maxResults: number): Promise<Suggestion[]>;
}

/**
 * Result from voice recognition
 */
export interface VoiceRecognitionResult {
  /** Recognized text */
  transcript: string;

  /** Confidence score (0-1) */
  confidence: number;

  /** Whether recognition is final */
  isFinal: boolean;
}

/**
 * Error from voice recognition
 */
export interface VoiceRecognitionError {
  /** Error code from Web Speech API */
  code: string;

  /** Human-readable error message */
  message: string;
}

/**
 * Return type for useVoiceRecognition hook
 */
export interface UseVoiceRecognitionReturn {
  /** Whether voice recognition is currently active */
  isListening: boolean;

  /** Start voice recognition */
  startListening: () => void;

  /** Stop voice recognition */
  stopListening: () => void;

  /** Toggle voice recognition on/off */
  toggleListening: () => void;

  /** Current transcript (interim or final) */
  transcript: string;

  /** Error state if recognition fails */
  error: VoiceRecognitionError | null;

  /** Whether browser supports Web Speech API */
  isSupported: boolean;
}

/**
 * A search history entry
 */
export interface SearchHistoryEntry {
  /** Unique identifier */
  id: string;

  /** Search query text */
  query: string;

  /** URL for the search */
  url: string;

  /** ISO timestamp */
  timestamp: string;

  /** Search type */
  type: "nlp" | "filter";
}

/**
 * Return type for useSearchHistory hook
 */
export interface UseSearchHistoryReturn {
  /** Recent search entries (most recent first) */
  recentSearches: SearchHistoryEntry[];

  /** Add a search to history */
  addSearch: (query: string, url: string, type: "nlp" | "filter") => void;

  /** Remove a search from history */
  removeSearch: (id: string) => void;

  /** Clear all search history */
  clearHistory: () => void;

  /** Convert history entries to suggestions format */
  toSuggestions: () => Suggestion[];
}

/**
 * Props for the SuggestionDisplay component
 */
export interface SuggestionDisplayProps {
  /** Array of suggestions to display */
  suggestions: Suggestion[];

  /** Whether suggestions are currently animating */
  isAnimating: boolean;

  /** Callback when a suggestion is selected */
  onSelect: (suggestion: Suggestion) => void;

  /** Display mode */
  mode: "dropdown" | "pills";

  /** Pills placement (only for pills mode) */
  pillsPlacement?: "above" | "below";

  /** Quick-filter pill labels rendered alongside suggestions */
  quickFilters?: string[];

  /** Callback when a quick-filter pill is clicked */
  onQuickFilterSelect?: (filter: string) => void;
}

/**
 * Default configuration values for SearchBar
 */
export const DEFAULT_CONFIG: SearchBarConfig = {
  displayMode: "dropdown",
  pillsPlacement: "below",
  maxSuggestions: 4,
  minCharsForSuggestions: 2,
  suggestionTimeout: 500,
  enableVoiceRecognition: true,
  enableSearchHistory: true,
  withBorder: false,
  placeholder: 'Try: "SUV under 35k with heated seats near San Francisco"',
  showSearchButton: false,
  lightTheme: false,
  withBackdropBlur: true,
};
