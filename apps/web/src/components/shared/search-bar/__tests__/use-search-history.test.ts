/**
 * Unit tests for useSearchHistory hook
 */

import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as searchHistoryStorage from "~/lib/search-history-storage";
import { useSearchHistory } from "../hooks/use-search-history";

// Mock the search-history-storage module
vi.mock("~/lib/search-history-storage", () => ({
  getSearchHistory: vi.fn(),
  addSearchEntry: vi.fn(),
  removeSearchEntry: vi.fn(),
  clearSearchHistory: vi.fn(),
}));

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
    vi.mocked(searchHistoryStorage.getSearchHistory).mockReturnValue([]);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("loads search history on mount", () => {
    vi.mocked(searchHistoryStorage.getSearchHistory).mockReturnValue(mockSearchEntries);

    const { result } = renderHook(() => useSearchHistory());

    expect(searchHistoryStorage.getSearchHistory).toHaveBeenCalledTimes(1);
    expect(result.current.recentSearches).toEqual(mockSearchEntries);
  });

  it("returns empty array when no history exists", () => {
    vi.mocked(searchHistoryStorage.getSearchHistory).mockReturnValue([]);

    const { result } = renderHook(() => useSearchHistory());

    expect(result.current.recentSearches).toEqual([]);
  });

  it("adds a search to history", () => {
    vi.mocked(searchHistoryStorage.addSearchEntry).mockReturnValue(true);
    const firstEntry = mockSearchEntries[0];
    if (!firstEntry) {
      throw new Error("Mock entry not found");
    }
    vi.mocked(searchHistoryStorage.getSearchHistory)
      .mockReturnValueOnce([])
      .mockReturnValueOnce([firstEntry]);

    const { result } = renderHook(() => useSearchHistory());

    act(() => {
      result.current.addSearch("SUV under 35k", "/search?q=SUV+under+35k", "nlp");
    });

    expect(searchHistoryStorage.addSearchEntry).toHaveBeenCalledWith(
      "SUV under 35k",
      "/search?q=SUV+under+35k",
      "nlp"
    );
    expect(searchHistoryStorage.getSearchHistory).toHaveBeenCalledTimes(2);
    expect(result.current.recentSearches).toEqual([firstEntry]);
  });

  it("does not reload history when add fails", () => {
    vi.mocked(searchHistoryStorage.addSearchEntry).mockReturnValue(false);
    vi.mocked(searchHistoryStorage.getSearchHistory).mockReturnValue([]);

    const { result } = renderHook(() => useSearchHistory());

    const initialCallCount = vi.mocked(searchHistoryStorage.getSearchHistory).mock.calls.length;

    act(() => {
      result.current.addSearch("a", "/search?q=a", "nlp");
    });

    expect(searchHistoryStorage.addSearchEntry).toHaveBeenCalledWith("a", "/search?q=a", "nlp");
    expect(searchHistoryStorage.getSearchHistory).toHaveBeenCalledTimes(initialCallCount);
  });

  it("removes a search from history", () => {
    vi.mocked(searchHistoryStorage.removeSearchEntry).mockReturnValue(true);
    const firstEntry = mockSearchEntries[0];
    const thirdEntry = mockSearchEntries[2];
    if (!(firstEntry && thirdEntry)) {
      throw new Error("Mock entries not found");
    }
    vi.mocked(searchHistoryStorage.getSearchHistory)
      .mockReturnValueOnce(mockSearchEntries)
      .mockReturnValueOnce([firstEntry, thirdEntry]);

    const { result } = renderHook(() => useSearchHistory());

    act(() => {
      result.current.removeSearch("2");
    });

    expect(searchHistoryStorage.removeSearchEntry).toHaveBeenCalledWith("2");
    expect(searchHistoryStorage.getSearchHistory).toHaveBeenCalledTimes(2);
    expect(result.current.recentSearches).toEqual([firstEntry, thirdEntry]);
  });

  it("does not reload history when remove fails", () => {
    vi.mocked(searchHistoryStorage.removeSearchEntry).mockReturnValue(false);
    vi.mocked(searchHistoryStorage.getSearchHistory).mockReturnValue(mockSearchEntries);

    const { result } = renderHook(() => useSearchHistory());

    const initialCallCount = vi.mocked(searchHistoryStorage.getSearchHistory).mock.calls.length;

    act(() => {
      result.current.removeSearch("nonexistent");
    });

    expect(searchHistoryStorage.removeSearchEntry).toHaveBeenCalledWith("nonexistent");
    expect(searchHistoryStorage.getSearchHistory).toHaveBeenCalledTimes(initialCallCount);
  });

  it("clears all search history", () => {
    vi.mocked(searchHistoryStorage.getSearchHistory)
      .mockReturnValueOnce(mockSearchEntries)
      .mockReturnValueOnce([]);

    const { result } = renderHook(() => useSearchHistory());

    expect(result.current.recentSearches).toEqual(mockSearchEntries);

    act(() => {
      result.current.clearHistory();
    });

    expect(searchHistoryStorage.clearSearchHistory).toHaveBeenCalledTimes(1);
    expect(searchHistoryStorage.getSearchHistory).toHaveBeenCalledTimes(2);
    expect(result.current.recentSearches).toEqual([]);
  });

  it("converts history entries to suggestions format", () => {
    vi.mocked(searchHistoryStorage.getSearchHistory).mockReturnValue(mockSearchEntries);

    const { result } = renderHook(() => useSearchHistory());

    const suggestions = result.current.toSuggestions();

    expect(suggestions).toEqual([
      {
        text: "",
        highlight: "SUV under 35k",
        id: "1",
      },
      {
        text: "",
        highlight: "sedan with heated seats",
        id: "2",
      },
      {
        text: "",
        highlight: "truck near me",
        id: "3",
      },
    ]);
  });

  it("returns empty suggestions array when no history exists", () => {
    vi.mocked(searchHistoryStorage.getSearchHistory).mockReturnValue([]);

    const { result } = renderHook(() => useSearchHistory());

    const suggestions = result.current.toSuggestions();

    expect(suggestions).toEqual([]);
  });

  it("defaults to nlp type when not specified", () => {
    vi.mocked(searchHistoryStorage.addSearchEntry).mockReturnValue(true);
    vi.mocked(searchHistoryStorage.getSearchHistory).mockReturnValue([]);

    const { result } = renderHook(() => useSearchHistory());

    act(() => {
      result.current.addSearch("test query", "/search?q=test", "nlp");
    });

    expect(searchHistoryStorage.addSearchEntry).toHaveBeenCalledWith(
      "test query",
      "/search?q=test",
      "nlp"
    );
  });

  it("maintains FIFO queue with 10-entry limit (handled by storage layer)", () => {
    const tenEntries = Array.from({ length: 10 }, (_, i) => ({
      id: `${i + 1}`,
      query: `query ${i + 1}`,
      url: `/search?q=query+${i + 1}`,
      timestamp: new Date(2024, 0, i + 1).toISOString(),
      type: "nlp" as const,
    }));

    vi.mocked(searchHistoryStorage.getSearchHistory).mockReturnValue(tenEntries);

    const { result } = renderHook(() => useSearchHistory());

    expect(result.current.recentSearches).toHaveLength(10);
    expect(result.current.recentSearches).toEqual(tenEntries);
  });
});
