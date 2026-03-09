"use client";

import { cn } from "@tfs-ucmp/ui";
import Image from "next/image";
import { useState } from "react";
import { useSearchNavigation } from "~/hooks/use-search-navigation";

const searchSuggestions = [
  { text: "SUV under 35k with", highlight: "Low Miles" },
  { text: "SUV under 35k with", highlight: "Heated Seats" },
  { text: "SUV under 35K with", highlight: "Leather Seats" },
  { text: "SUV under 35K with", highlight: "All Wheel Drive" },
];

export function HomeHeroSearchWrapper() {
  const { navigate } = useSearchNavigation({ recordHistory: true });
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showMicModal, setShowMicModal] = useState(false);

  const closeSuggestions = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setShowSuggestions(false);
      setIsAnimating(false);
    }, 200);
  };

  const openSuggestions = () => {
    setIsAnimating(true);
    setShowSuggestions(true);
    setTimeout(() => setIsAnimating(false), 50);
  };

  const handleSearch = () => {
    navigate(searchQuery, { source: "nlp" });
  };

  const isSearchOpen = showSuggestions && !isAnimating;

  return (
    <>
      {showSuggestions && (
        <button
          className={cn(
            "fixed inset-0 z-30 bg-black/20 backdrop-blur-[2px] transition-height ease-out",
            isAnimating ? "opacity-0" : "opacity-100"
          )}
          onClick={closeSuggestions}
          type="button"
        />
      )}

      <div className={cn("relative w-full lg:w-131", showSuggestions ? "z-50" : "")}>
        <div
          className={cn(
            "bg-[var(--color-core-surfaces-card)] shadow-sm",
            isSearchOpen ? "rounded-t-[1.5rem]" : "rounded-full"
          )}
        >
          <div
            className={cn(
              "flex items-center justify-between self-stretch",
              "py-[var(--spacing-2xs)] pr-[var(--spacing-2xs)] pl-[var(--spacing-md)]"
            )}
          >
            <Image
              alt="Search"
              className="mr-[var(--spacing-xs)] h-[19.127px] w-[19.5px] flex-shrink-0"
              height={19.127}
              src="/images/search_star.svg"
              style={{ aspectRatio: "19.50/19.13" }}
              width={19.5}
            />
            <div className="relative w-full flex-1">
              {!(searchQuery || showSuggestions) && (
                <div className="pointer-events-none absolute inset-0 flex items-center font-[var(--font-family,'Toyota_Type')] text-[var(--font-size-sm)] leading-[125%] tracking-[-0.14px]">
                  <span className="text-[var(--Core-surfaces-foreground,#0A0A0A)]/60">
                    SUV under 35k with&nbsp;
                  </span>
                  <span className="font-semibold text-[var(--Core-surfaces-foreground,#0A0A0A)]">
                    low miles...
                  </span>
                </div>
              )}
              <input
                className={cn(
                  "w-full bg-transparent outline-none",
                  "text-[var(--Core-surfaces-foreground,#0A0A0A)]",
                  "font-[var(--font-family,'Toyota_Type')] font-normal",
                  "text-[var(--font-size-sm)] leading-[125%] tracking-[-0.14px]"
                )}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={openSuggestions}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    closeSuggestions();
                  }
                }}
                placeholder={showSuggestions ? "SUV under 35k with low miles..." : ""}
                type="text"
                value={searchQuery}
              />
            </div>
            <Image
              alt="Microphone"
              className="mx-[12px] hidden h-[18px] w-[12px] cursor-pointer lg:block"
              height={18}
              onClick={() => setShowMicModal(true)}
              role="button"
              src="/images/search_mic.svg"
              tabIndex={0}
              width={12}
            />
            <button
              className="hidden cursor-pointer rounded-full bg-[var(--color-actions-primary)] px-[var(--spacing-lg)] py-[var(--spacing-xs)] font-medium text-[var(--color-actions-primary-foreground)] transition-colors hover:bg-red-600 lg:block"
              onClick={() => {
                closeSuggestions();
                handleSearch();
              }}
              type="button"
            >
              Search
            </button>
            <button
              className="flex h-[var(--spacing-10)] w-[var(--spacing-10)] flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-actions-primary)] p-[var(--spacing-xs)] lg:hidden"
              onClick={() => {
                closeSuggestions();
                handleSearch();
              }}
              type="button"
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
            className={cn(
              "absolute top-full right-0 left-0 z-50 origin-top overflow-hidden",
              "rounded-b-[2rem] border border-gray-300 border-t-0 bg-[var(--color-core-surfaces-card)] shadow-lg",
              "transition-all duration-500 ease-out",
              isAnimating
                ? "-translate-y-1 scale-y-95 opacity-0"
                : "translate-y-0 scale-y-100 opacity-100"
            )}
          >
            <div className="border-gray-200 border-t" />
            {searchSuggestions.map((suggestion, idx) => (
              <button
                className={cn(
                  "flex w-full items-center gap-[var(--spacing-xs)] border-gray-100 border-b py-[var(--spacing-sm)] pr-[var(--spacing-md)] pl-[5%]",
                  "text-left transition-opacity duration-500 last:border-b-0 hover:bg-gray-50",
                  isAnimating ? "opacity-0" : "opacity-100"
                )}
                key={`${suggestion.text}-${suggestion.highlight}-${idx}`}
                onClick={() => {
                  setSearchQuery(`${suggestion.text} ${suggestion.highlight}`);
                  closeSuggestions();
                }}
                style={{ transitionDelay: isAnimating ? "0ms" : `${idx * 50}ms` }}
                type="button"
              >
                <span className="text-gray-500">{suggestion.text}</span>
                <span className="font-semibold text-black">{suggestion.highlight}</span>
              </button>
            ))}
          </div>
        )}
        {showMicModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-md rounded bg-white p-[var(--spacing-lg)] text-center">
              <p className="mb-[var(--spacing-md)] text-[length:var(--font-size-sm)]">
                This microphone is still work in progress. Redirect to Vehicle listing Page?
              </p>
              <div className="flex justify-center gap-[var(--spacing-sm)]">
                <button
                  className="rounded bg-gray-200 px-[var(--spacing-md)] py-[var(--spacing-xs)]"
                  onClick={() => setShowMicModal(false)}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="rounded bg-red-500 px-[var(--spacing-md)] py-[var(--spacing-xs)] text-white"
                  onClick={() => {
                    setShowMicModal(false);
                    navigate("");
                  }}
                  type="button"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
