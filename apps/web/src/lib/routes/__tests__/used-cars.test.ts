/**
 * Tests for Used-Cars Route Parsing & Path Building
 *
 * Validates the `parseUsedCarsParams` parser and `buildUsedCarsPath` builder
 * covering SRP filters, details routes, edge cases, and round-trip consistency.
 */

import { describe, expect, it } from "vitest";
import { buildUsedCarsPath, parseUsedCarsParams, type UsedCarsRoute } from "../used-cars";

// ── parseUsedCarsParams ──────────────────────────────────────────────

describe("parseUsedCarsParams", () => {
  // ── SRP routes ───────────────────────────────────────────────────

  describe("SRP routes", () => {
    it("returns SRP with empty filters when segments are undefined", () => {
      const result = parseUsedCarsParams(undefined);
      expect(result).toEqual({ type: "srp", filters: {} });
    });

    it("returns SRP with empty filters when segments array is empty", () => {
      const result = parseUsedCarsParams([]);
      expect(result).toEqual({ type: "srp", filters: {} });
    });

    it("parses a single known body-type segment as bodyType filter", () => {
      const bodyTypes = [
        "sedan",
        "suv",
        "truck",
        "coupe",
        "hatchback",
        "van",
        "convertible",
        "wagon",
        "minivan",
        "crossover",
      ];

      for (const bt of bodyTypes) {
        const result = parseUsedCarsParams([bt]);
        expect(result).toEqual({ type: "srp", filters: { bodyType: bt } });
      }
    });

    it("parses a single non-body-type segment as a make filter", () => {
      const result = parseUsedCarsParams(["toyota"]);
      expect(result).toEqual({ type: "srp", filters: { make: "toyota" } });
    });

    it("parses two segments as make + model", () => {
      const result = parseUsedCarsParams(["toyota", "camry"]);
      expect(result).toEqual({
        type: "srp",
        filters: { make: "toyota", model: "camry" },
      });
    });

    it("parses three segments as make + model + trim", () => {
      const result = parseUsedCarsParams(["toyota", "camry", "se"]);
      expect(result).toEqual({
        type: "srp",
        filters: { make: "toyota", model: "camry", trim: "se" },
      });
    });

    it("handles hyphenated slugs correctly", () => {
      const result = parseUsedCarsParams(["toyota", "rav4", "xle-premium"]);
      expect(result).toEqual({
        type: "srp",
        filters: { make: "toyota", model: "rav4", trim: "xle-premium" },
      });
    });

    it("returns SRP with empty filters for more than 3 non-details segments", () => {
      const result = parseUsedCarsParams(["a", "b", "c", "d"]);
      expect(result).toEqual({ type: "srp", filters: {} });
    });

    it("returns undefined slug values for invalid slug segments", () => {
      // Segments with special characters that fail slug validation
      const result = parseUsedCarsParams(["INVALID SLUG!"]);
      expect(result).toEqual({ type: "srp", filters: {} });
    });
  });

  // ── Details routes ─────────────────────────────────────────────

  describe("details routes", () => {
    const validVin = "1HGCM82633A004352";

    it("parses a valid details route with all 6 segments", () => {
      const result = parseUsedCarsParams(["details", "toyota", "camry", "se", "2023", validVin]);
      expect(result).toEqual({
        type: "details",
        make: "toyota",
        model: "camry",
        trim: "se",
        year: 2023,
        vin: validVin,
      });
    });

    it("normalizes make/model/trim to lowercase", () => {
      const result = parseUsedCarsParams(["details", "Toyota", "Camry", "SE", "2024", validVin]);
      expect(result).toEqual({
        type: "details",
        make: "toyota",
        model: "camry",
        trim: "se",
        year: 2024,
        vin: validVin,
      });
    });

    it("normalizes VIN to uppercase", () => {
      const lowerVin = validVin.toLowerCase();
      const result = parseUsedCarsParams(["details", "toyota", "camry", "se", "2023", lowerVin]);
      expect(result).toEqual({
        type: "details",
        make: "toyota",
        model: "camry",
        trim: "se",
        year: 2023,
        vin: validVin,
      });
    });

    it("accepts the trim placeholder '-'", () => {
      const result = parseUsedCarsParams(["details", "toyota", "camry", "-", "2023", validVin]);
      expect(result).toEqual({
        type: "details",
        make: "toyota",
        model: "camry",
        trim: "-",
        year: 2023,
        vin: validVin,
      });
    });

    it("returns null for details with too few segments", () => {
      expect(parseUsedCarsParams(["details", "toyota", "camry"])).toBeNull();
    });

    it("returns null for details with too many segments", () => {
      expect(
        parseUsedCarsParams(["details", "toyota", "camry", "se", "2023", validVin, "extra"])
      ).toBeNull();
    });

    it("returns null for details with an invalid VIN", () => {
      expect(parseUsedCarsParams(["details", "toyota", "camry", "se", "2023", "BAD"])).toBeNull();
    });

    it("returns null for details with an invalid year", () => {
      expect(
        parseUsedCarsParams(["details", "toyota", "camry", "se", "abcd", validVin])
      ).toBeNull();
    });

    it("returns null for details with a year out of range", () => {
      expect(
        parseUsedCarsParams(["details", "toyota", "camry", "se", "1800", validVin])
      ).toBeNull();
    });

    it("handles 'details' keyword case-insensitively", () => {
      const result = parseUsedCarsParams(["Details", "toyota", "camry", "se", "2023", validVin]);
      expect(result).toEqual({
        type: "details",
        make: "toyota",
        model: "camry",
        trim: "se",
        year: 2023,
        vin: validVin,
      });
    });
  });
});

// ── buildUsedCarsPath ────────────────────────────────────────────────

describe("buildUsedCarsPath", () => {
  it("builds a details path", () => {
    const route: UsedCarsRoute = {
      type: "details",
      make: "toyota",
      model: "camry",
      trim: "se",
      year: 2023,
      vin: "1HGCM82633A004352",
    };
    expect(buildUsedCarsPath(route)).toBe(
      "/used-cars/details/toyota/camry/se/2023/1HGCM82633A004352"
    );
  });

  it("builds the base SRP path with no filters", () => {
    const route: UsedCarsRoute = { type: "srp", filters: {} };
    expect(buildUsedCarsPath(route)).toBe("/used-cars");
  });

  it("builds SRP path with bodyType filter", () => {
    const route: UsedCarsRoute = {
      type: "srp",
      filters: { bodyType: "suv" },
    };
    expect(buildUsedCarsPath(route)).toBe("/used-cars/suv");
  });

  it("builds SRP path with make filter only", () => {
    const route: UsedCarsRoute = {
      type: "srp",
      filters: { make: "toyota" },
    };
    expect(buildUsedCarsPath(route)).toBe("/used-cars/toyota");
  });

  it("builds SRP path with make + model", () => {
    const route: UsedCarsRoute = {
      type: "srp",
      filters: { make: "toyota", model: "camry" },
    };
    expect(buildUsedCarsPath(route)).toBe("/used-cars/toyota/camry");
  });

  it("builds SRP path with make + model + trim", () => {
    const route: UsedCarsRoute = {
      type: "srp",
      filters: { make: "toyota", model: "camry", trim: "se" },
    };
    expect(buildUsedCarsPath(route)).toBe("/used-cars/toyota/camry/se");
  });

  it("prioritizes bodyType over make when both are set", () => {
    const route: UsedCarsRoute = {
      type: "srp",
      filters: { bodyType: "sedan", make: "toyota" },
    };
    expect(buildUsedCarsPath(route)).toBe("/used-cars/sedan");
  });
});

// ── Round-trip consistency ───────────────────────────────────────────

const USED_CARS_PREFIX_REGEX = /^\/used-cars\/?/;

describe("round-trip: parse → build → parse", () => {
  const cases: [string, string[]][] = [
    ["SRP no filters", []],
    ["SRP body type", ["suv"]],
    ["SRP make", ["toyota"]],
    ["SRP make + model", ["toyota", "camry"]],
    ["SRP make + model + trim", ["toyota", "camry", "se"]],
    ["Details", ["details", "toyota", "camry", "se", "2023", "1HGCM82633A004352"]],
  ];

  it.each(cases)("%s", (_label, segments) => {
    const parsed = parseUsedCarsParams(segments.length ? segments : undefined);
    expect(parsed).not.toBeNull();

    const path = buildUsedCarsPath(parsed as NonNullable<typeof parsed>);
    // Remove the "/used-cars" prefix and split back into segments
    const rebuiltSegments = path.replace(USED_CARS_PREFIX_REGEX, "").split("/").filter(Boolean);

    const reparsed = parseUsedCarsParams(rebuiltSegments.length ? rebuiltSegments : undefined);
    expect(reparsed).toEqual(parsed);
  });
});
