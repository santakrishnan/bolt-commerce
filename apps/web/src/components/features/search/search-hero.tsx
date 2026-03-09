"use client";

import { Button } from "@tfs-ucmp/ui";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { XIcon } from "@/components/assets/icons";
import { SearchInput, type SearchInputRef } from "./search-input";
import type { ActiveFilter } from "./vehicle-results";

// top-level reusable regex to avoid recreating it per result
const TRAILING_PUNCT_RE = /[.?!]\s*$/u;

// Minimal runtime/constructor shapes to avoid depending on lib.dom SpeechRecognition type
interface BrowserSpeechRecognitionEvent {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface MinimalSpeechRecognition {
  interimResults: boolean;
  continuous: boolean;
  lang: string;
  onstart?: () => void;
  onresult?: (event: BrowserSpeechRecognitionEvent) => void;
  onend?: () => void;
  onerror?: (err: unknown) => void;
  start: () => void;
  stop: () => void;
  // allow attaching internal flag
  shouldAutoRestart?: boolean;
}
type SpeechRecognitionConstructor = new () => MinimalSpeechRecognition;
type ExtendedSpeechRecognition = MinimalSpeechRecognition & { shouldAutoRestart?: boolean };

// Search suggestions data
const quickFilters = ["Off-road", "Eco-friendly", "High safety rating", "Near me"];

function getProgressTransition(p: number): string {
  if (p === 100) {
    return "width 0.25s ease-in, opacity 0.4s ease 0.2s";
  }
  if (p === 0) {
    return "none";
  }
  // Fast start → dramatic deceleration (NProgress-style crawl)
  return "width 1.5s cubic-bezier(0.05, 0.6, 0.1, 1), opacity 0.15s ease";
}

export interface SearchHeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearch: () => void;
  onBlurOverlayChange?: (showOverlay: boolean) => void;
  showTitle?: boolean;
  showQuickFilters?: boolean;
  placeholder?: string;
  onToggleFilter?: () => void;
  onReset?: () => void;
  vehicleCount?: number;
  progress?: number;
  isProgressVisible?: boolean;
  activeFilters: ActiveFilter[];
  onRemoveFilter: (type: string, value: string) => void;
}

export function SearchHero({
  searchQuery,
  onSearchChange,
  onSearch,
  onBlurOverlayChange,
  showTitle = true,
  showQuickFilters = true,
  placeholder = "Try: 'SUV under 35k with heated seats near San Francisco",
  onToggleFilter,
  onReset,
  vehicleCount = 0,
  progress = 0,
  isProgressVisible = false,
  activeFilters,
  onRemoveFilter,
}: SearchHeroProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const searchInputRef = useRef<SearchInputRef>(null);
  const stickySearchInputRef = useRef<SearchInputRef>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const [isStickyDropdownOpen, setIsStickyDropdownOpen] = useState(false);

  useEffect(() => setLocalQuery(searchQuery), [searchQuery]);

  // Detect when hero scrolls out of view to show sticky bar
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) {
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setIsHeroVisible(entry?.isIntersecting ?? true),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // --- Speech recognition state extracted from SearchBar ---
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<ExtendedSpeechRecognition | null>(null);
  const lastFinalRef = useRef<string>("");

  useEffect(() => {
    const win = window as unknown as {
      SpeechRecognition?: SpeechRecognitionConstructor;
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
    };
    const SpeechRecognition = win.SpeechRecognition ?? win.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      recognitionRef.current = null;
      return;
    }

    const recog = new SpeechRecognition();
    // assign to ExtendedSpeechRecognition so TS knows shouldAutoRestart exists
    const extendedRecog = recog as ExtendedSpeechRecognition;

    extendedRecog.interimResults = true;
    extendedRecog.continuous = true;
    extendedRecog.lang = "en-US";

    extendedRecog.onstart = () => {
      setIsListening(true);
    };

    extendedRecog.onresult = (event: BrowserSpeechRecognitionEvent) => {
      let interim = "";
      let final = lastFinalRef.current || "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        if (!res) {
          continue; // guard against undefined
        }
        const transcript = res[0]?.transcript || "";
        if (res.isFinal) {
          final = `${final} ${transcript}`.trim();
          lastFinalRef.current = final;
        } else {
          interim += ` ${transcript}`;
        }
      }

      const combined = `${final} ${interim}`.trim();
      const sanitized = combined.replace(TRAILING_PUNCT_RE, "");
      // Only update the input display; search is triggered manually via the Search button
      setLocalQuery(sanitized);
    };

    extendedRecog.onend = () => {
      setIsListening(false);
      if (recognitionRef.current?.shouldAutoRestart) {
        try {
          extendedRecog.start();
        } catch {
          // ignore restart failures
        }
      }
    };

    extendedRecog.onerror = () => {
      setIsListening(false);
    };

    extendedRecog.shouldAutoRestart = false;
    recognitionRef.current = extendedRecog;
    // keep setLocalQuery out of deps — React state setters are stable references

    return () => {
      try {
        if (recognitionRef.current) {
          recognitionRef.current.shouldAutoRestart = false;
          recognitionRef.current.onresult = undefined;
          recognitionRef.current.onend = undefined;
          recognitionRef.current.onerror = undefined;
          recognitionRef.current.onstart = undefined;
          recognitionRef.current = null;
        }
      } catch {
        // ignore cleanup errors
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleListening = () => {
    const recog = recognitionRef.current;
    if (!recog) {
      // unsupported browser
      return;
    }

    if (isListening) {
      recog.shouldAutoRestart = false;
      try {
        recog.stop();
      } catch {
        // ignore stop errors
      }
      setIsListening(false);
    } else {
      recog.shouldAutoRestart = true;
      try {
        lastFinalRef.current = searchQuery;
        recog.start();
        setIsListening(true);
      } catch {
        setIsListening(false);
      }
    }
  };
  // --- end speech extraction ---

  return (
    <>
      {/* Sticky compact header — visible when hero scrolls out of view */}
      {!isHeroVisible && (
        <>
          {isStickyDropdownOpen && (
            <button
              className="fixed inset-0 z-[35] bg-gray-200/90 blur-[1px] transition-opacity duration-500 ease-in-out"
              onClick={() => stickySearchInputRef.current?.close()}
              type="button"
            />
          )}
          <div className="fixed top-0 right-0 left-0 z-[35] bg-white">
            <div className="mx-auto flex max-w-[var(--container-2xl)] flex-col items-center justify-between gap-4 px-4 py-5 sm:flex-row sm:px-6 lg:px-20">
              {/* Left: Filter + Reset OR Vehicle count + Sort when filters applied */}
              {activeFilters.length > 0 ? (
                <div className="flex shrink-0 items-center gap-3">
                  <button
                    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-red-500 transition-colors"
                    onClick={onToggleFilter}
                    type="button"
                  >
                    <Image
                      alt="Filter"
                      className="h-4 w-4"
                      height={16}
                      src="/images/filter_one.svg"
                      width={16}
                    />
                  </button>
                  <div className="flex flex-row items-center gap-3 md:flex-col md:items-start md:gap-0">
                    <div className="font-bold text-[#111] text-[12px] leading-normal md:text-[16px]">
                      {vehicleCount} vehicles found
                    </div>
                    <span className="my-1 text-[#ccc] md:hidden">|</span>
                    <div className="font-semibold text-[#121212] text-[12px] leading-normal">
                      Sort by:{" "}
                      <button
                        className="inline-flex items-center gap-1 font-medium text-black hover:underline"
                        type="button"
                      >
                        Recommended{" "}
                        <Image
                          alt="Dropdown"
                          className="mt-[3%] h-1.75 w-[12px]"
                          height={7}
                          src="/images/dropdown-arrow.svg"
                          width={12}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex shrink-0 items-center gap-2">
                  {onToggleFilter && (
                    <Button
                      className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full bg-[#EB0A1E] px-4 font-semibold text-[14px] text-white hover:bg-[#EB0A1E]/90"
                      onClick={onToggleFilter}
                      type="button"
                      variant="ghost"
                    >
                      <Image
                        alt="Filter"
                        className="h-4 w-4"
                        height={16}
                        src="/images/filter_one.svg"
                        width={16}
                      />
                      <span>Filter and Sort</span>
                    </Button>
                  )}
                  {onReset && (
                    <Button
                      className="inline-flex h-10 cursor-pointer items-center justify-center rounded-full bg-black px-6 font-semibold text-[14px] text-white hover:bg-black/80"
                      onClick={onReset}
                      type="button"
                      variant="ghost"
                    >
                      Reset
                    </Button>
                  )}
                </div>
              )}
              {/* Right: SearchInput */}
              <div
                className={`relative max-w-[848px] flex-1 ${isStickyDropdownOpen ? "z-[65]" : ""}`}
              >
                {activeFilters.length === 0 && (
                  <SearchInput
                    isListening={isListening}
                    onInputChange={(value) => {
                      lastFinalRef.current = value;
                      setLocalQuery(value);
                    }}
                    onOpenChange={(open) => {
                      setIsStickyDropdownOpen(open);
                      if (open) {
                        // Immediately kill the main overlay so both never show at once
                        setIsDropdownOpen(false);
                        searchInputRef.current?.close();
                      }
                      onBlurOverlayChange?.(open);
                    }}
                    onSearch={() => {
                      onSearchChange(lastFinalRef.current);
                      onSearch();
                    }}
                    onToggleListening={toggleListening}
                    placeholder={placeholder}
                    ref={stickySearchInputRef}
                    value={localQuery}
                    withBorder={true}
                  />
                )}
                {activeFilters.length > 0 && (
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-center gap-2 md:justify-end">
                      {activeFilters.map((filter, idx) => (
                        <span
                          className="flex h-7.25 items-center gap-[8px] rounded-large border border-[#0000001A] bg-transparent px-[8px] py-[10px] pt-[9px] text-black text-xs"
                          key={`${filter.type}-${filter.value}-${idx}`}
                        >
                          {filter.label}
                          <button
                            className="h-[8px] w-[8px] pb-2.5 text-black transition-colors hover:text-red-500"
                            onClick={() => onRemoveFilter(filter.type, filter.value)}
                            type="button"
                          >
                            <XIcon className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                      <button
                        className="flex h-7.25 w-[64px] items-center justify-center gap-[8px] rounded-large bg-black px-[8px] py-[10px] pt-2 text-center font-normal text-[12px] text-white leading-normal"
                        onClick={onReset}
                        type="button"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* Progress bar — bottom of sticky header */}
            <div className="relative h-[1px] overflow-hidden bg-[var(--color-structure-interaction-subtle-border)]">
              <div
                aria-hidden
                className="absolute top-0 left-0 h-full bg-[#EB0A1E]"
                style={{
                  width: `${progress}%`,
                  opacity: isProgressVisible ? 1 : 0,
                  transition: getProgressTransition(progress),
                }}
              />
            </div>
          </div>
        </>
      )}

      {/* Blur Overlay for main Search */}
      {isDropdownOpen && (
        <button
          className="fixed inset-0 z-30 bg-gray-200/90 opacity-100 blur-[1px] transition-opacity duration-500 ease-in-out"
          onClick={() => searchInputRef.current?.close()}
          type="button"
        />
      )}

      <section
        className={`${isDropdownOpen ? "bg-gray-200/90" : "bg-gray-100"} py-[var(--spacing-10)] pt-8 pb-6 md:pb-[var(--spacing-lg)] ${isDropdownOpen ? "relative z-30" : ""} ${showTitle ? "" : "py-0"}`}
        ref={sectionRef}
      >
        <div className="mx-auto max-w-[var(--container-2xl)] px-0 sm:px-6 md:px-4 lg:px-20">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            {/* Title */}
            {showTitle && (
              <div className="flex flex-col items-center justify-center text-center md:items-start md:justify-start md:text-left">
                <h1 className="mb-6 font-bold text-[#111] text-[32px] uppercase leading-[56px] tracking-[-0.449px] md:mb-0">
                  FIND YOUR NEXT CAR
                </h1>
                <p className="font-normal text-[#000] text-[15px] leading-normal">
                  1,784,503 Vehicles Available
                </p>
              </div>
            )}

            {/* Search Bar */}
            <div className={`relative max-w-[50rem] flex-1 pt-4 ${isDropdownOpen ? "z-50" : ""}`}>
              {/* Input + Suggestions Dropdown */}
              <SearchInput
                isListening={isListening}
                onInputChange={(value) => {
                  lastFinalRef.current = value;
                  setLocalQuery(value);
                }}
                onOpenChange={(open) => {
                  setIsDropdownOpen(open);
                  if (open) {
                    // Immediately kill the sticky overlay so both never show at once
                    setIsStickyDropdownOpen(false);
                    stickySearchInputRef.current?.close();
                  }
                  onBlurOverlayChange?.(open);
                }}
                onSearch={() => {
                  onSearchChange(lastFinalRef.current);
                  onSearch();
                }}
                onToggleListening={toggleListening}
                placeholder={placeholder}
                ref={searchInputRef}
                value={localQuery}
              />

              {/* Quick Filter Pills */}
              {showQuickFilters && (
                <div
                  className="scrollbar-hide mt-6 flex min-w-0 gap-2 overflow-x-auto whitespace-nowrap pl-4 md:mt-4 md:flex-wrap md:justify-end md:overflow-x-visible md:whitespace-normal md:pl-0"
                  style={{
                    WebkitOverflowScrolling: "touch",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}
                >
                  {quickFilters.map((pill) => (
                    <Button
                      className="flex h-[29px] items-center gap-[var(--spacing-2xs)] rounded-[100px] bg-white p-[var(--spacing-sm)] text-center font-normal text-[var(--color-brand-text-primary)] text-[var(--spacing-sm)] leading-normal hover:bg-white hover:text-[var(--color-brand-text-primary)] hover:opacity-100 hover:shadow-none"
                      key={pill}
                      type="button"
                      variant="ghost"
                    >
                      {pill}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
