/**
 * Unit tests for autocomplete services
 */

import { describe, expect, it } from "vitest";
import { MockAutocompleteService } from "../services/mock-autocomplete";
import type { Vehicle } from "../services/vehicle-autocomplete";
import { VehicleAutocompleteService } from "../services/vehicle-autocomplete";

describe("MockAutocompleteService", () => {
  const service = new MockAutocompleteService();

  it("returns suggestions for known queries", async () => {
    const suggestions = await service.getSuggestions("suv", 4);
    expect(suggestions).toHaveLength(4);
    expect(suggestions[0]).toHaveProperty("text");
    expect(suggestions[0]).toHaveProperty("highlight");
    expect(suggestions[0]).toHaveProperty("id");
  });

  it("respects maxResults parameter", async () => {
    const suggestions = await service.getSuggestions("toyota", 2);
    expect(suggestions).toHaveLength(2);
  });

  it("returns default suggestions for unknown queries", async () => {
    const suggestions = await service.getSuggestions("unknown query", 4);
    expect(suggestions).toHaveLength(4);
    expect(suggestions.length).toBeGreaterThan(0);
    expect(suggestions[0]?.text).toContain("unknown query");
  });

  it("returns empty array for empty query", async () => {
    const suggestions = await service.getSuggestions("", 4);
    expect(suggestions).toHaveLength(4);
  });
});

describe("VehicleAutocompleteService", () => {
  const mockVehicles: Vehicle[] = [
    {
      id: 1,
      title: "2020 Toyota Camry SE",
      make: "Toyota",
      model: "Camry",
      variant: "SE",
      year: 2020,
      vin: "VIN123",
      price: 25_000,
      image: "image.jpg",
      miles: "30,000",
      odometer: "30000",
      match: 95,
      labels: ["Low Miles"],
      owners: 1,
      extColorName: "Blue",
      extColorCode: "#0000FF",
      intColorName: "Black",
      intColorCode: "#000000",
    },
    {
      id: 2,
      title: "2021 Honda Accord EX",
      make: "Honda",
      model: "Accord",
      variant: "EX",
      year: 2021,
      vin: "VIN456",
      price: 28_000,
      image: "image2.jpg",
      miles: "20,000",
      odometer: "20000",
      match: 90,
      labels: ["Excellent Deal"],
      owners: 1,
      extColorName: "Red",
      extColorCode: "#FF0000",
      intColorName: "Tan",
      intColorCode: "#D2B48C",
    },
  ];

  const service = new VehicleAutocompleteService(mockVehicles);

  it("returns suggestions matching make", async () => {
    const suggestions = await service.getSuggestions("toyota", 4);
    expect(suggestions.length).toBeGreaterThan(0);
    expect(suggestions[0]?.text).toBe("Toyota");
    expect(suggestions[0]?.highlight).toBe("Camry");
  });

  it("returns suggestions matching model", async () => {
    const suggestions = await service.getSuggestions("accord", 4);
    expect(suggestions.length).toBeGreaterThan(0);
    expect(suggestions[0]?.text).toBe("Honda");
    expect(suggestions[0]?.highlight).toBe("Accord");
  });

  it("respects maxResults parameter", async () => {
    const suggestions = await service.getSuggestions("2020", 1);
    expect(suggestions.length).toBeLessThanOrEqual(1);
  });

  it("returns empty array for empty query", async () => {
    const suggestions = await service.getSuggestions("", 4);
    expect(suggestions).toHaveLength(0);
  });

  it("returns unique suggestions (no duplicates)", async () => {
    const suggestions = await service.getSuggestions("toyota", 10);
    const keys = suggestions.map((s) => `${s.text} ${s.highlight}`);
    const uniqueKeys = new Set(keys);
    expect(keys.length).toBe(uniqueKeys.size);
  });

  it("never returns more than maxResults", async () => {
    const maxResults = 2;
    const suggestions = await service.getSuggestions("2020", maxResults);
    expect(suggestions.length).toBeLessThanOrEqual(maxResults);
  });
});
