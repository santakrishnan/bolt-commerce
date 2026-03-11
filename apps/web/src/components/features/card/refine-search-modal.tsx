"use client";

import { Button } from "@tfs-ucmp/ui";
import Image from "next/image";
import { useState } from "react";

interface RefineSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters?: (filters: { id: string; label: string }[]) => void;
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

const ALL_FILTERS = [...YOUR_FILTERS, ...SUGGESTED_FILTERS];

export function RefineSearchModal({ isOpen, onClose, onApplyFilters }: RefineSearchModalProps) {
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

  const handleApplyFilters = () => {
    const selected = ALL_FILTERS.filter((f) => activeFilters.has(f.id));
    onApplyFilters?.(selected);
    onClose();
  };

  const handleReset = () => {
    setActiveFilters(new Set());
  };

  return (
    // biome-ignore lint/a11y/noNoninteractiveElementInteractions: Modal backdrop needs click handler to close modal
    <div
      aria-label="Close modal"
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
      <div className="flex justify-end px-4 pt-2">
        <Button
          className="group flex items-center gap-2 text-[var(--color-brand-text)] text-sm underline hover:bg-transparent hover:text-muted-foreground"
          onClick={onClose}
          variant="ghost"
        >
          Close
          <Image
            alt="Close"
            className="mt-1 ml-1 group-hover:opacity-60"
            height={10}
            src="/images/cross.svg"
            width={10}
          />
        </Button>
      </div>

      <div className="mt-3 h-px bg-black opacity-10" />

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col gap-[203px] overflow-y-auto p-3">
        {/* Your Filters - Top */}
        <div className="flex min-w-0 flex-col gap-4">
          <h3 className="font-semibold text-[var(--color-brand-text)] text-sm">Your Filters</h3>
          <div className="flex flex-wrap gap-1.5">
            {YOUR_FILTERS.map((filter) => {
              const isActive = activeFilters.has(filter.id);
              return (
                <Button
                  className={`relative flex items-center justify-between gap-1 rounded-[100px] border-2 px-2.5 py-1 text-xs transition-all ${
                    isActive
                      ? "border-[var(--color-destructive)] bg-[var(--color-destructive)] text-[var(--color-destructive-foreground)] hover:bg-[var(--color-destructive)] hover:text-[var(--color-destructive-foreground)] hover:opacity-90"
                      : "border-[var(--color-border)] bg-white text-[var(--color-brand-text-secondary)] hover:bg-white hover:text-[var(--color-brand-text-secondary)]"
                  }`}
                  key={filter.id}
                  onClick={() => toggleFilter(filter.id)}
                  type="button"
                  variant="ghost"
                >
                  <span>{filter.label}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Suggested - Bottom */}
        <div className="flex min-w-0 flex-col gap-4">
          <h3 className="font-semibold text-[var(--color-brand-text)] text-sm">Suggested</h3>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTED_FILTERS.map((filter) => {
              const isAlreadyActive = activeFilters.has(filter.id);
              return (
                <Button
                  className={`flex items-center justify-between gap-1 rounded-[100px] border-2 px-2.5 py-1 text-xs transition-all ${
                    isAlreadyActive
                      ? "border-[var(--color-brand-border-light)] bg-[var(--color-background)] text-[var(--color-muted)]"
                      : "border-[var(--color-border)] bg-white text-[var(--color-brand-text-secondary)] hover:bg-white hover:text-[var(--color-brand-text-secondary)]"
                  }`}
                  disabled={isAlreadyActive}
                  key={filter.id}
                  onClick={() => addSuggestedFilter(filter.id)}
                  type="button"
                  variant="ghost"
                >
                  <span>{filter.label}</span>
                  {!isAlreadyActive && (
                    <Image
                      alt="Add filter"
                      className="h-2 w-2 shrink-0"
                      height={8}
                      src="/images/search/plus.svg"
                      width={8}
                    />
                  )}
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Buttons */}
      <div className="flex gap-3 px-4 pt-2 pb-4">
        <Button
          className="flex-1 whitespace-nowrap rounded-md px-4 py-2.5 font-semibold text-sm"
          onClick={handleApplyFilters}
          variant="default"
        >
          Apply Filter
        </Button>
        <Button
          className="flex-1 rounded-lg px-4 py-2.5 font-semibold text-[var(--color-brand-text)] text-sm underline hover:bg-transparent hover:text-[var(--color-brand-text)]"
          onClick={handleReset}
          variant="outline"
        >
          Reset
        </Button>
      </div>
    </div>
  );
}
