/**
 * Mock autocomplete service for development and testing
 * @module search-bar/services/mock-autocomplete
 */

import type { AutocompleteService, Suggestion } from "../types";

/**
 * Mock implementation of AutocompleteService for development and testing.
 * Returns predefined suggestions based on common search patterns.
 */
export class MockAutocompleteService implements AutocompleteService {
  private readonly mockSuggestions: Record<string, Suggestion[]> = {
    suv: [
      { text: "SUV under 35K with", highlight: "Low Miles", id: "suv-1" },
      { text: "SUV under 35K with", highlight: "Heated Seats", id: "suv-2" },
      { text: "SUV under 35K with", highlight: "Leather Seats", id: "suv-3" },
      { text: "SUV under 35K with", highlight: "All Wheel Drive", id: "suv-4" },
    ],
    truck: [
      { text: "Truck under 40k with", highlight: "4WD", id: "truck-1" },
      { text: "Truck with", highlight: "Towing Package", id: "truck-2" },
      { text: "Truck near", highlight: "Los Angeles", id: "truck-3" },
      { text: "Truck with", highlight: "Crew Cab", id: "truck-4" },
    ],
    sedan: [
      { text: "Sedan under 25k with", highlight: "Low Miles", id: "sedan-1" },
      { text: "Sedan with", highlight: "Leather Seats", id: "sedan-2" },
      { text: "Sedan with", highlight: "Sunroof", id: "sedan-3" },
      { text: "Sedan near", highlight: "New York", id: "sedan-4" },
    ],
    toyota: [
      { text: "Toyota", highlight: "Camry", id: "toyota-1" },
      { text: "Toyota", highlight: "RAV4", id: "toyota-2" },
      { text: "Toyota", highlight: "Tacoma", id: "toyota-3" },
      { text: "Toyota", highlight: "Highlander", id: "toyota-4" },
    ],
    honda: [
      { text: "Honda", highlight: "Accord", id: "honda-1" },
      { text: "Honda", highlight: "CR-V", id: "honda-2" },
      { text: "Honda", highlight: "Civic", id: "honda-3" },
      { text: "Honda", highlight: "Pilot", id: "honda-4" },
    ],
    ford: [
      { text: "Ford", highlight: "F-150", id: "ford-1" },
      { text: "Ford", highlight: "Explorer", id: "ford-2" },
      { text: "Ford", highlight: "Mustang", id: "ford-3" },
      { text: "Ford", highlight: "Escape", id: "ford-4" },
    ],
  };

  /**
   * Fetch mock suggestions for a given query
   * @param query - The search query
   * @param maxResults - Maximum number of results to return
   * @returns Promise resolving to array of suggestions
   */
  async getSuggestions(query: string, maxResults: number): Promise<Suggestion[]> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 50));

    const normalizedQuery = query.toLowerCase().trim();

    // Find matching suggestions
    for (const [key, suggestions] of Object.entries(this.mockSuggestions)) {
      if (normalizedQuery.includes(key)) {
        return suggestions.slice(0, maxResults);
      }
    }

    // Default suggestions if no match
    const defaultSuggestions: Suggestion[] = [
      { text: `${query} with`, highlight: "Low Miles", id: "default-1" },
      { text: `${query} under`, highlight: "35k", id: "default-2" },
      { text: `${query} near`, highlight: "Me", id: "default-3" },
      { text: `${query} with`, highlight: "Warranty", id: "default-4" },
    ];

    return defaultSuggestions.slice(0, maxResults);
  }
}
