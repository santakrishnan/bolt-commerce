/**
 * Public exports for the unified search component
 * @module search-bar
 */

export type { DropdownSuggestionsProps } from "./dropdown-suggestions";
export type { PillsSuggestionsProps } from "./pills-suggestions";
export type { SearchInputProps } from "./search-input";
// Export all TypeScript interfaces and types
export type {
  AutocompleteService,
  SearchBarConfig,
  SearchBarProps,
  SearchHistoryEntry,
  Suggestion,
  SuggestionDisplayProps,
  UseSearchHistoryReturn,
  UseVoiceRecognitionReturn,
  VoiceRecognitionError,
  VoiceRecognitionResult,
} from "./types";

// Export default configuration
export { DEFAULT_CONFIG } from "./types";

// Placeholder exports for components (to be implemented in later tasks)
// These will be uncommented and properly exported once implemented

export { DropdownSuggestions } from "./dropdown-suggestions";
export { useSearchHistory } from "./hooks/use-search-history";
export { useSearchSuggestions } from "./hooks/use-search-suggestions";
export { useVoiceRecognition } from "./hooks/use-voice-recognition";
export { PillsSuggestions } from "./pills-suggestions";
export type { SearchBackdropProps } from "./search-backdrop";
export { SearchBackdrop } from "./search-backdrop";
export { SearchBar } from "./search-bar";
export { SearchInput } from "./search-input";
// Placeholder exports for services (to be implemented in later tasks)
export { MockAutocompleteService } from "./services/mock-autocomplete";
export { VehicleAutocompleteService } from "./services/vehicle-autocomplete";
export { SuggestionDisplay } from "./suggestion-display";
