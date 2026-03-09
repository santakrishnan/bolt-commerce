"use client";

import { Button } from "@tfs-ucmp/ui";
import Image from "next/image";
import { useState } from "react";

interface RefineSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FilterOption {
  id: string;
  label: string;
}

const YOUR_FILTERS: FilterOption[] = [
  { id: "heated-seat", label: "Heated Seat" },
  { id: "apple-carplay", label: "Apple CarPlay" },
  { id: "sensors", label: "Sensors" },
  { id: "leather-seats", label: "Leather Seats" },
  { id: "white", label: "White" },
  { id: "sunroof", label: "Sunroof" },
];

const SUGGESTED_FILTERS: FilterOption[] = [
  { id: "bluetooth", label: "Bluetooth" },
  { id: "backup-camera", label: "Backup Camera" },
  { id: "navigation", label: "Navigation" },
  { id: "parking-assist", label: "Parking Assist" },
  { id: "cruise-control", label: "Cruise Control" },
  { id: "keyless-entry", label: "Keyless Entry" },
];

export function RefineSearchModal({ isOpen, onClose }: RefineSearchModalProps) {
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());

  if (!isOpen) {
    return null;
  }

  const toggleFilter = (filterId: string) => {
    setActiveFilters((prev) => {
      const newFilters = new Set(prev);
      if (newFilters.has(filterId)) {
        newFilters.delete(filterId);
      } else {
        newFilters.add(filterId);
      }
      return newFilters;
    });
  };

  const addSuggestedFilter = (filterId: string) => {
    setActiveFilters((prev) => new Set(prev).add(filterId));
  };

  return (
    // biome-ignore lint/a11y/noNoninteractiveElementInteractions: Dialog overlay needs pointer capture to prevent card click-through
    <div
      aria-modal="true"
      className="pointer-events-auto absolute inset-0 z-[30] flex h-full w-full flex-col overflow-y-auto overflow-x-hidden rounded-lg bg-white shadow-xl"
      onClick={(e) => {
        e.stopPropagation();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          onClose();
        }
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
      }}
      role="dialog"
      tabIndex={-1}
    >
      {/* Close button */}
      <div className="flex justify-end px-4 pt-4">
        <Button
          className="flex items-center gap-2 text-[var(--color-brand-text)] text-sm underline hover:bg-transparent hover:text-[var(--color-brand-text)]"
          onClick={onClose}
          variant="ghost"
        >
          Close
          <Image alt="Close" className="mt-1 ml-1" height={10} src="/images/cross.svg" width={10} />
        </Button>
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-col gap-[203px] p-3">
        {/* Your Filters - Top */}
        <div className="flex min-w-0 flex-col gap-2">
          <h3 className="font-semibold text-[var(--color-brand-text)] text-sm">Your Filters</h3>
          <div className="flex flex-wrap gap-1.5">
            {YOUR_FILTERS.map((filter) => {
              const isActive = activeFilters.has(filter.id);
              return (
                <Button
                  className={`relative flex items-center justify-between gap-1 rounded-[100px] border-2 px-2.5 py-1 text-xs transition-all ${
                    isActive
                      ? "border-icon-primary bg-white text-[var(--color-brand-text)] hover:bg-white hover:text-[var(--color-brand-text)]"
                      : "border-gray-300 bg-white text-[var(--color-brand-text-secondary)] hover:bg-white hover:text-[var(--color-brand-text-secondary)]"
                  }`}
                  key={filter.id}
                  onClick={() => toggleFilter(filter.id)}
                  type="button"
                  variant="ghost"
                >
                  <span>{filter.label}</span>
                  {isActive && (
                    <svg
                      aria-label="Selected"
                      className="h-4 w-4 shrink-0 text-icon-primary"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <title>Selected filter</title>
                      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Suggested - Bottom */}
        <div className="flex min-w-0 flex-col gap-2">
          <h3 className="font-semibold text-[var(--color-brand-text)] text-sm">Suggested</h3>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTED_FILTERS.map((filter) => {
              const isAlreadyActive = activeFilters.has(filter.id);
              return (
                <Button
                  className={`flex items-center justify-between gap-1 rounded-[100px] border-2 px-2.5 py-1 text-xs transition-all ${
                    isAlreadyActive
                      ? "border-gray-200 bg-gray-100 text-gray-400"
                      : "border-gray-300 bg-white text-[var(--color-brand-text-secondary)] hover:bg-white hover:text-[var(--color-brand-text-secondary)]"
                  }`}
                  disabled={isAlreadyActive}
                  key={filter.id}
                  onClick={() => addSuggestedFilter(filter.id)}
                  type="button"
                  variant="ghost"
                >
                  <span>{filter.label}</span>
                  {!isAlreadyActive && (
                    <svg
                      aria-label="Add"
                      className="h-4 w-4 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <title>Add filter</title>
                      <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
