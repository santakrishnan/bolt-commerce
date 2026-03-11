/**
 * Unit tests for useSearchSuggestions hook
 */

import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useSearchSuggestions } from "../hooks/use-search-suggestions";
import type { AutocompleteService, Suggestion } from "../types";

// Mock autocomplete service
class TestAutocompleteService implements AutocompleteService {
  async getSuggestions(query: string, maxResults: number): Promise<Suggestion[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 50));

    if (query === "error") {
      throw new Error("Test error");
    }

    return Array.from({ length: Math.min(maxResults, 4) }, (_, i) => ({
      text: `${query} suggestion`,
      highlight: `${i + 1}`,
      id: `${query}-${i}`,
    }));
  }
}

describe("useSearchSuggestions", () => {
  let service: TestAutocompleteService;

  beforeEach(() => {
    service = new TestAutocompleteService();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns empty suggestions initially", () => {
    const { result } = renderHook(() =>
      useSearchSuggestions("", {
        autocompleteService: service,
      })
    );

    expect(result.current.suggestions).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it("does not fetch suggestions when query is below minimum threshold", async () => {
    const { result } = renderHook(() =>
      useSearchSuggestions("a", {
        autocompleteService: service,
        minCharsForSuggestions: 2,
      })
    );

    // Wait for debounce timeout
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 250));
    });

    expect(result.current.suggestions).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it("fetches suggestions when query meets minimum threshold", async () => {
    const { result, rerender } = renderHook(
      ({ query }) =>
        useSearchSuggestions(query, {
          autocompleteService: service,
          minCharsForSuggestions: 2,
          debounceTimeout: 100,
        }),
      { initialProps: { query: "" } }
    );

    // Update query to meet threshold
    rerender({ query: "test" });

    // Wait for debounce and async operation
    await waitFor(
      () => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.suggestions.length).toBeGreaterThan(0);
      },
      { timeout: 500 }
    );

    expect(result.current.suggestions[0]?.text).toBe("test suggestion");
    expect(result.current.error).toBe(null);
  });

  it("debounces fetch requests", async () => {
    const getSuggestionsSpy = vi.spyOn(service, "getSuggestions");

    const { rerender } = renderHook(
      ({ query }) =>
        useSearchSuggestions(query, {
          autocompleteService: service,
          minCharsForSuggestions: 2,
          debounceTimeout: 100,
        }),
      { initialProps: { query: "te" } }
    );

    // Rapidly change query multiple times
    rerender({ query: "tes" });
    await new Promise((resolve) => setTimeout(resolve, 50));

    rerender({ query: "test" });
    await new Promise((resolve) => setTimeout(resolve, 50));

    rerender({ query: "testi" });
    await new Promise((resolve) => setTimeout(resolve, 50));

    rerender({ query: "testin" });

    // Wait for debounce and async operation
    await waitFor(
      () => {
        expect(getSuggestionsSpy).toHaveBeenCalledTimes(1);
      },
      { timeout: 500 }
    );

    expect(getSuggestionsSpy).toHaveBeenCalledWith("testin", 4);
  });

  it("respects maxSuggestions parameter", async () => {
    const { result, rerender } = renderHook(
      ({ query }) =>
        useSearchSuggestions(query, {
          autocompleteService: service,
          minCharsForSuggestions: 2,
          maxSuggestions: 2,
          debounceTimeout: 100,
        }),
      { initialProps: { query: "" } }
    );

    rerender({ query: "test" });

    await waitFor(
      () => {
        expect(result.current.isLoading).toBe(false);
      },
      { timeout: 500 }
    );

    expect(result.current.suggestions.length).toBeLessThanOrEqual(2);
  });

  it("handles errors gracefully", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {
      // Intentionally empty - suppressing console.error during test
    });

    const { result, rerender } = renderHook(
      ({ query }) =>
        useSearchSuggestions(query, {
          autocompleteService: service,
          minCharsForSuggestions: 2,
          debounceTimeout: 100,
        }),
      { initialProps: { query: "" } }
    );

    rerender({ query: "error" });

    await waitFor(
      () => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBeInstanceOf(Error);
      },
      { timeout: 500 }
    );

    expect(result.current.suggestions).toEqual([]);
    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  it("clears suggestions when query becomes empty", async () => {
    const { result, rerender } = renderHook(
      ({ query }) =>
        useSearchSuggestions(query, {
          autocompleteService: service,
          minCharsForSuggestions: 2,
          debounceTimeout: 100,
        }),
      { initialProps: { query: "test" } }
    );

    // Wait for initial fetch
    await waitFor(
      () => {
        expect(result.current.suggestions.length).toBeGreaterThan(0);
      },
      { timeout: 500 }
    );

    // Clear query
    rerender({ query: "" });

    expect(result.current.suggestions).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it("clears suggestions when query is below threshold", async () => {
    const { result, rerender } = renderHook(
      ({ query }) =>
        useSearchSuggestions(query, {
          autocompleteService: service,
          minCharsForSuggestions: 2,
          debounceTimeout: 100,
        }),
      { initialProps: { query: "test" } }
    );

    // Wait for initial fetch
    await waitFor(
      () => {
        expect(result.current.suggestions.length).toBeGreaterThan(0);
      },
      { timeout: 500 }
    );

    // Reduce query below threshold
    rerender({ query: "t" });

    expect(result.current.suggestions).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it("provides clearSuggestions function", async () => {
    const { result } = renderHook(
      ({ query }) =>
        useSearchSuggestions(query, {
          autocompleteService: service,
          minCharsForSuggestions: 2,
          debounceTimeout: 100,
        }),
      { initialProps: { query: "test" } }
    );

    // Wait for initial fetch
    await waitFor(
      () => {
        expect(result.current.suggestions.length).toBeGreaterThan(0);
      },
      { timeout: 500 }
    );

    // Clear suggestions manually
    act(() => {
      result.current.clearSuggestions();
    });

    expect(result.current.suggestions).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it("provides fetchSuggestions function for manual fetching", async () => {
    const { result } = renderHook(() =>
      useSearchSuggestions("", {
        autocompleteService: service,
        minCharsForSuggestions: 2,
      })
    );

    // Manually fetch suggestions
    act(() => {
      result.current.fetchSuggestions("manual");
    });

    await waitFor(
      () => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.suggestions.length).toBeGreaterThan(0);
      },
      { timeout: 500 }
    );

    expect(result.current.suggestions[0]?.text).toBe("manual suggestion");
  });

  it("cancels previous request when new query is entered", async () => {
    const { result, rerender } = renderHook(
      ({ query }) =>
        useSearchSuggestions(query, {
          autocompleteService: service,
          minCharsForSuggestions: 2,
          debounceTimeout: 100,
        }),
      { initialProps: { query: "first" } }
    );

    // Wait a bit but not for full debounce
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Immediately change query before first request completes
    rerender({ query: "second" });

    // Wait for final state
    await waitFor(
      () => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.suggestions.length).toBeGreaterThan(0);
      },
      { timeout: 500 }
    );

    // Should only have results from second query
    expect(result.current.suggestions[0]?.text).toBe("second suggestion");
  });

  it("works without autocomplete service", async () => {
    const { result } = renderHook(() =>
      useSearchSuggestions("test", {
        minCharsForSuggestions: 2,
        debounceTimeout: 100,
      })
    );

    // Wait for debounce
    await new Promise((resolve) => setTimeout(resolve, 200));

    expect(result.current.suggestions).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });
});
