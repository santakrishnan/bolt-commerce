/**
 * Vehicle autocomplete service using existing vehicle data
 * @module search-bar/services/vehicle-autocomplete
 */

import type { AutocompleteService, Suggestion } from "../types";

/**
 * Vehicle interface matching the structure from mock-vehicles.ts
 */
export interface Vehicle {
  id: number;
  title: string;
  make: string;
  model: string;
  variant: string;
  year: number;
  vin: string;
  price: number;
  oldPrice?: number;
  image: string | string[];
  miles: string;
  odometer: string;
  match: number;
  labels: string[];
  owners: number;
  extColorName: string;
  extColorCode: string;
  intColorName: string;
  intColorCode: string;
}

/**
 * Production implementation of AutocompleteService using vehicle data.
 * Filters vehicles by make, model, or title and returns formatted suggestions.
 */
export class VehicleAutocompleteService implements AutocompleteService {
  private readonly vehicles: Vehicle[];

  constructor(vehicles: Vehicle[]) {
    this.vehicles = vehicles;
  }

  /**
   * Fetch suggestions for a given query based on vehicle data
   * @param query - The search query
   * @param maxResults - Maximum number of results to return
   * @returns Promise resolving to array of suggestions
   */
  async getSuggestions(query: string, maxResults: number): Promise<Suggestion[]> {
    // Simulate network delay for realistic behavior
    await new Promise((resolve) => setTimeout(resolve, 50));

    const normalizedQuery = query.toLowerCase().trim();

    if (normalizedQuery.length === 0) {
      return [];
    }

    // Track unique suggestions to avoid duplicates
    const uniqueSuggestions = new Map<string, Suggestion>();

    // Search through vehicles for matches
    for (const vehicle of this.vehicles) {
      if (uniqueSuggestions.size >= maxResults) {
        break;
      }

      const make = vehicle.make.toLowerCase();
      const model = vehicle.model.toLowerCase();
      const title = vehicle.title.toLowerCase();

      // Match by make
      if (make.includes(normalizedQuery)) {
        const key = `${vehicle.make} ${vehicle.model}`;
        if (!uniqueSuggestions.has(key)) {
          uniqueSuggestions.set(key, {
            text: vehicle.make,
            highlight: vehicle.model,
            id: `make-model-${vehicle.id}`,
          });
        }
      }
      // Match by model
      else if (model.includes(normalizedQuery)) {
        const key = `${vehicle.make} ${vehicle.model}`;
        if (!uniqueSuggestions.has(key)) {
          uniqueSuggestions.set(key, {
            text: vehicle.make,
            highlight: vehicle.model,
            id: `model-${vehicle.id}`,
          });
        }
      }
      // Match by title
      else if (title.includes(normalizedQuery)) {
        const key = vehicle.title;
        if (!uniqueSuggestions.has(key)) {
          // Split title to create text and highlight
          const words = vehicle.title.split(" ");
          const midpoint = Math.ceil(words.length / 2);
          uniqueSuggestions.set(key, {
            text: words.slice(0, midpoint).join(" "),
            highlight: words.slice(midpoint).join(" "),
            id: `title-${vehicle.id}`,
          });
        }
      }
    }

    return Array.from(uniqueSuggestions.values()).slice(0, maxResults);
  }
}
