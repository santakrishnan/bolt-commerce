/**
 * Unit tests for useSearchHistory hook
 */

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as searchHistoryApi from "~/services/search-history-api";
import { useSearchHistory } from "../hooks/use-search-history";

// Mock the search-history-api module
vi.mock("~/services/search-history-api", () => ({
  getAllSearchHistory: vi.fn(),
  addSearchEntry: vi.fn(),
  removeSearchEntry: vi.fn(),
  clearSearchHistory: vi.fn(),
}));

// ── Test helper ──────────────────────────────────────────────────────────────

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
  };
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe("useSearchHistory", () => {
  const mockSearchEntries = [
    {
      id: "1",
      query: "SUV under 35k",
      url: "/search?q=SUV+under+35k",
      timestamp: "2024-01-01T00:00:00.000Z",
      type: "nlp" as const,
    },
    {
      id: "2",
      query: "sedan with heated seats",
      url: "/search?q=sedan+with+heated+seats",
      timestamp: "2024-01-02T00:00:00.000Z",
      type: "nlp" as const,
    },
    {
      id: "3",
      query: "truck near me",
      url: "/search?q=truck+near+me",
      timestamp: "2024-01-03T00:00:00.000Z",
      type: "filter" as const,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(searchHistoryApi.getAllSearchHistory).mockResolvedValue([]);
    vi.mocked(searchHistoryApi.addSearchEntry).mockResolvedValue([]);
    vi.mocked(searchHistoryApi.removeSearchEntry).mockResolvedValue([]);
    vi.mocked(searchHistoryApi.clearSearchHistory).mockResolvedValue([]);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("starts with initialData (empty array) then loads history from API", async () => {
    vi.mocked(searchHistoryApi.getAllSearchHistory).mockResolvedValue(mockSearchEntries);
    const { result } = renderHook(() => useSearchHistory(), { wrapper: createWrapper() });

    // Initial render uses initialData — empty before API resolves
    expect(result.current.recentSearches).toEqual([]);

    // After API resolves, cache updates
    await waitFor(() => {
      expect(result.current.recentSearches).toEqual(mockSearchEntries);
    });
    expect(searchHistoryApi.getAllSearchHistory).toHaveBeenCalledTimes(1);
  });

  it("returns empty array when no history exists", async () => {
    vi.mocked(searchHistoryApi.getAllSearchHistory).mockResolvedValue([]);
    const { result } = renderHook(() => useSearchHistory(), { wrapper: createWrapper() });

    await waitFor(() => expect(searchHistoryApi.getAllSearchHistory).toHaveBeenCalled());
    expect(result.current.recentSearches).toEqual([]);
  });

  it("adds a search to history optimistically", () => {
    const firstEntry = mockSearchEntries[0];
    if (!firstEntry) {
      throw new Error("Mock entry not found");
    }
    vi.mocked(searchHistoryApi.addSearchEntry).mockResolvedValue([firstEntry]);
    const { result } = renderHook(() => useSearchHistory(), { wrapper: createWrapper() });

    act(() => {
      result.current.addSearch("SUV under 35k", "/search?q=SUV+under+35k", "nlp");
    });

    // Optimistic update — visible immediately without waiting for the API
    expect(result.current.recentSearches[0]?.query).toBe("SUV under 35k");
    expect(searchHistoryApi.addSearchEntry).toHaveBeenCalledWith(
      "SUV under 35k",
      "/search?q=SUV+under+35k",
      "nlp"
    );
  });

  it("does not update cache for single-character queries", () => {
    const { result } = renderHook(() => useSearchHistory(), { wrapper: createWrapper() });

    act(() => {
      result.current.addSearch("a", "/search?q=a", "nlp");
    });

    // onMutate skips 1-char queries; cache stays empty
    expect(result.current.recentSearches).toEqual([]);
  });

  it("removes a search from history optimistically", async () => {
    vi.mocked(searchHistoryApi.getAllSearchHistory).mockResolvedValue(mockSearchEntries);
    const firstEntry = mockSearchEntries[0];
    const thirdEntry = mockSearchEntries[2];
    if (!(firstEntry && thirdEntry)) {
      throw new Error("Mock entries not found");
    }
    vi.mocked(searchHistoryApi.removeSearchEntry).mockResolvedValue([firstEntry, thirdEntry]);
    const { result } = renderHook(() => useSearchHistory(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.recentSearches).toHaveLength(3));

    act(() => {
      result.current.removeSearch("2");
    });

    // Optimistic removal — entry gone immediately
    expect(result.current.recentSearches.find((e) => e.id === "2")).toBeUndefined();
    expect(searchHistoryApi.removeSearchEntry).toHaveBeenCalledWith("2");
  });

  it("clears all search history optimistically", async () => {
    vi.mocked(searchHistoryApi.getAllSearchHistory).mockResolvedValue(mockSearchEntries);
    vi.mocked(searchHistoryApi.clearSearchHistory).mockResolvedValue([]);
    const { result } = renderHook(() => useSearchHistory(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.recentSearches).toHaveLength(3));

    act(() => {
      result.current.clearHistory();
    });

    expect(result.current.recentSearches).toEqual([]);
    expect(searchHistoryApi.clearSearchHistory).toHaveBeenCalledTimes(1);
  });

  it("converts history entries to suggestions format", async () => {
    vi.mocked(searchHistoryApi.getAllSearchHistory).mockResolvedValue(mockSearchEntries);
    const { result } = renderHook(() => useSearchHistory(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.recentSearches).toHaveLength(3));

    expect(result.current.toSuggestions()).toEqual([
      { text: "", highlight: "SUV under 35k", id: "1" },
      { text: "", highlight: "sedan with heated seats", id: "2" },
      { text: "", highlight: "truck near me", id: "3" },
    ]);
  });

  it("returns empty suggestions array when no history exists", async () => {
    const { result } = renderHook(() => useSearchHistory(), { wrapper: createWrapper() });

    await waitFor(() => expect(searchHistoryApi.getAllSearchHistory).toHaveBeenCalled());
    expect(result.current.toSuggestions()).toEqual([]);
  });

  it("defaults to nlp type when type is not specified", () => {
    const { result } = renderHook(() => useSearchHistory(), { wrapper: createWrapper() });

    act(() => {
      result.current.addSearch("test query", "/search?q=test", "nlp");
    });

    expect(searchHistoryApi.addSearchEntry).toHaveBeenCalledWith(
      "test query",
      "/search?q=test",
      "nlp"
    );
  });

  it("maintains FIFO queue with 10-entry limit (handled by API layer)", async () => {
    const tenEntries = Array.from({ length: 10 }, (_, i) => ({
      id: `${i + 1}`,
      query: `query ${i + 1}`,
      url: `/search?q=query+${i + 1}`,
      timestamp: new Date(2024, 0, i + 1).toISOString(),
      type: "nlp" as const,
    }));
    vi.mocked(searchHistoryApi.getAllSearchHistory).mockResolvedValue(tenEntries);
    const { result } = renderHook(() => useSearchHistory(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.recentSearches).toHaveLength(10));
    expect(result.current.recentSearches).toEqual(tenEntries);
  });
});
