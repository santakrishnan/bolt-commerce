"use client";

import { Button } from "@tfs-ucmp/ui";
import Image from "next/image";
import { type Ref, useCallback, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { mockVehicles, type Vehicle } from "~/lib/search/mock-vehicles";
import { addSearchEntry } from "~/lib/search-history-storage";

const RECENT_SEARCHES_KEY = "arrow_recent_searches";
const MAX_RECENT = 6;

function loadRecentSearches(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_SEARCHES_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function saveRecentSearch(query: string): string[] {
  const q = query.trim();
  if (!q) {
    return loadRecentSearches();
  }
  const prev = loadRecentSearches().filter((s) => s !== q);
  const next = [q, ...prev].slice(0, MAX_RECENT);
  try {
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next));
  } catch {
    // intentionally ignore storage errors
  }
  return next;
}

const STATIC_SUGGESTIONS = [{ text: "2023 Toyota", highlight: "Corolla Cross" }];

export interface SearchInputRef {
  close: () => void;
}

export interface SearchInputProps {
  value: string;
  onInputChange: (value: string) => void;
  onSearch: () => void;
  placeholder?: string;
  isListening: boolean;
  onToggleListening: () => void;
  onOpenChange?: (open: boolean) => void;
  vehicles?: Vehicle[];
  ref?: Ref<SearchInputRef>;
  withBorder?: boolean;
}

export function SearchInput({
  ref,
  value,
  onInputChange,
  onSearch,
  placeholder = "Try: 'SUV under 35k with heated seats near San Francisco",
  isListening,
  onToggleListening,
  onOpenChange,
  vehicles = mockVehicles,
  withBorder = false,
}: SearchInputProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    setRecentSearches(loadRecentSearches());
  }, []);

  const closeSuggestions = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => {
      setShowSuggestions(false);
      setIsAnimating(false);
      onOpenChange?.(false);
    }, 200);
  }, [onOpenChange]);

  const openSuggestions = useCallback(() => {
    setIsAnimating(true);
    setShowSuggestions(true);
    onOpenChange?.(true);
    setTimeout(() => setIsAnimating(false), 50);
  }, [onOpenChange]);

  useImperativeHandle(ref, () => ({ close: closeSuggestions }), [closeSuggestions]);

  const isSearchOpen = showSuggestions && !isAnimating;

  const suggestions = useMemo(() => {
    const q = value.trim().toLowerCase();
    if (!q) {
      if (recentSearches.length > 0) {
        return recentSearches.map((query) => {
          const words = query.split(" ");
          return { text: words.slice(0, 2).join(" "), highlight: words.slice(2).join(" ") };
        });
      }
      return STATIC_SUGGESTIONS;
    }
    const seen = new Set<string>();
    return vehicles
      .filter((v) => {
        const title = v.title.toLowerCase();
        return (
          title.includes(q) || v.make.toLowerCase().includes(q) || v.model.toLowerCase().includes(q)
        );
      })
      .filter((v) => {
        if (seen.has(v.title)) {
          return false;
        }
        seen.add(v.title);
        return true;
      })
      .slice(0, 6)
      .map((v) => {
        const words = v.title.split(" ");
        return {
          text: words.slice(0, 2).join(" "),
          highlight: words.slice(2).join(" "),
        };
      });
  }, [value, vehicles, recentSearches]);

  const handleSearch = () => {
    if (value.trim()) {
      setRecentSearches(saveRecentSearch(value));
      // Also persist to cookie-based search history
      const slug = value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");
      const url = slug ? `/used-cars?q=${slug}` : "/used-cars";
      addSearchEntry(value.trim(), url, "nlp");
    }
    closeSuggestions();
    onSearch();
  };

  return (
    <div className="relative">
      <div
        className={`mx-[var(--spacing-md)] bg-white shadow-sm transition-all duration-500 md:mx-0 ${isSearchOpen ? "rounded-t-[1.5rem]" : "rounded-full"} ${withBorder ? "border" : ""}`}
        style={
          withBorder
            ? { borderColor: "var(--color-structure-interaction-border)", borderWidth: "1px" }
            : undefined
        }
      >
        <div className="flex w-full max-w-[848px] items-center pt-[var(--spacing-2xs)] pr-[5px] pb-[var(--spacing-2xs)] pl-[var(--spacing-sd)]">
          <Image
            alt="Search"
            className="mr-2 h-[19.127px] w-[19.5px] flex-shrink-0 text-[#EB0D1C]"
            height={19.127}
            src="/images/search_star.svg"
            style={{ aspectRatio: "19.50/19.13" }}
            width={19.5}
          />
          <input
            className="w-full flex-1 bg-transparent font-normal text-[#000] text-[15px] leading-normal outline-none"
            onChange={(e) => onInputChange(e.target.value)}
            onFocus={openSuggestions}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            placeholder={placeholder}
            type="text"
            value={value}
          />

          <button
            aria-label={isListening ? "Stop voice input" : "Start voice input"}
            aria-pressed={isListening}
            className="mx-[var(--spacing-sm)] flex h-[36px] w-[36px] items-center justify-center rounded-full transition-colors"
            onClick={(e) => {
              e.preventDefault();
              onToggleListening();
            }}
            style={isListening ? { color: "var(--color-actions-primary)" } : { color: "#111111" }}
            type="button"
          >
            <svg
              className="block h-[18px] w-[18px]"
              fill="none"
              height="18"
              role="img"
              viewBox="0 0 12 18"
              width="12"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Microphone</title>
              <path
                d="M5.69255 0.600098C5.1139 0.600098 4.55895 0.829966 4.14978 1.23913C3.74061 1.6483 3.51074 2.20325 3.51074 2.78191V8.60006C3.51074 9.17871 3.74061 9.73366 4.14978 10.1428C4.55895 10.552 5.1139 10.7819 5.69255 10.7819C6.2712 10.7819 6.82615 10.552 7.23532 10.1428C7.64449 9.73366 7.87436 9.17871 7.87436 8.60006V2.78191C7.87436 2.20325 7.64449 1.6483 7.23532 1.23913C6.82615 0.829966 6.2712 0.600098 5.69255 0.600098Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.2"
              />
              <path
                d="M10.7814 7.14697V8.60151C10.7814 9.9517 10.245 11.2466 9.29029 12.2013C8.33557 13.156 7.04068 13.6924 5.69049 13.6924C4.34031 13.6924 3.04542 13.156 2.0907 12.2013C1.13597 11.2466 0.599609 9.9517 0.599609 8.60151V7.14697"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.2"
              />
              <path
                d="M5.69141 13.6899V16.599"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.2"
              />
              <path
                d="M2.78125 16.6001H8.5994"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.2"
              />
            </svg>
          </button>

          <Button
            className="hidden h-[var(--spacing-10)] w-[var(--spacing-5xl)] cursor-pointer rounded-full bg-red-500 px-[var(--spacing-lg)] py-[var(--spacing-xs)] text-center font-medium text-white transition-colors hover:bg-red-500 hover:opacity-100 md:block"
            onClick={handleSearch}
            type="button"
            variant="ghost"
          >
            Search
          </Button>

          <button
            className="flex h-[var(--spacing-10)] w-[var(--spacing-10)] flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-destructive)] p-[var(--spacing-xs)] md:hidden"
            onClick={handleSearch}
            type="submit"
          >
            <Image
              alt="Search"
              className="h-[14px] w-[16px]"
              height={14}
              src="/images/search/vlp_search.svg"
              width={16}
            />
          </button>
        </div>
      </div>

      {showSuggestions && (
        <div
          className={`absolute top-full right-0 left-0 z-50 origin-top overflow-hidden rounded-b-[2rem] bg-white shadow-lg transition-all duration-500 ease-out ${
            isAnimating
              ? "-translate-y-1 scale-y-95 opacity-0"
              : "translate-y-0 scale-y-100 opacity-100"
          }`}
        >
          <div className="border-gray-200 border-t" />
          {suggestions.length > 0 ? (
            suggestions.map((suggestion, idx) => (
              <button
                className={`flex w-full items-center gap-[var(--spacing-xs)] border-gray-100 border-b py-[var(--spacing-sm)] pr-[var(--spacing-md)] pl-[5%] text-left transition-opacity duration-500 last:border-b-0 hover:bg-gray-50 ${
                  isAnimating ? "opacity-0" : "opacity-100"
                }`}
                key={`${suggestion.text}-${suggestion.highlight}-${idx}`}
                onClick={() => {
                  const fullQuery = `${suggestion.text} ${suggestion.highlight}`.trim();
                  onInputChange(fullQuery);

                  closeSuggestions();
                }}
                style={{ transitionDelay: isAnimating ? "0ms" : `${idx * 50}ms` }}
                type="button"
              >
                <span className="text-gray-500">{suggestion.text}</span>
                <span className="font-semibold text-black">{suggestion.highlight}</span>
              </button>
            ))
          ) : (
            <div className="py-[var(--spacing-md)] pr-[var(--spacing-md)] pl-[5%] text-left text-gray-500">
              No cars found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
