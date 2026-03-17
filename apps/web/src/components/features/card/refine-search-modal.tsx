"use client";
import { Button, Heading } from "@tfs-ucmp/ui";
import Image from "next/image";
import { useState } from "react";
import { CustomChips } from "~/components/shared/custom-chips";
import { useSingletonModal } from "~/hooks/use-single-modal";
import { AppButton } from "../../shared/button";

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
  const [isCloseHovered, setIsCloseHovered] = useState(false);

  useSingletonModal("refine-search-open", isOpen, onClose);

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

  // intentionally removed unused helper to satisfy lint rules

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
      className="pointer-events-auto absolute inset-0 z-30 flex h-full w-full flex-col overflow-y-auto overflow-x-hidden rounded-lg bg-white shadow-xl"
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
      <div className="flex justify-end px-4 pt-1">
        <Button
          className="flex items-center gap-2 underline hover:bg-transparent"
          onClick={onClose}
          onMouseEnter={() => setIsCloseHovered(true)}
          onMouseLeave={() => setIsCloseHovered(false)}
          type="button"
          variant="ghost"
        >
          <span
            className={`text-sm ${
              isCloseHovered ? "text-muted-foreground" : "text-(--color-brand-text)"
            }`}
          >
            Close
          </span>
          <Image
            alt="Close"
            className={`mt-1 ml-1 ${isCloseHovered ? "opacity-60" : "opacity-100"}`}
            height={7.15}
            src="/images/cross.svg"
            width={7.15}
          />
        </Button>
      </div>

      <div className="mt-3 h-px bg-black opacity-10" />

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col justify-between overflow-y-auto p-3">
        {/* Your Filters - Top */}
        <div className="flex min-w-0 flex-col gap-4">
          <Heading
            className="text-[var(--color-brand-text)] text-sm md:text-sm"
            level={3}
            weight="semibold"
          >
            Your Filters
          </Heading>
          <div className="flex flex-wrap gap-1.5">
            {YOUR_FILTERS.map((filter) => (
              <CustomChips
                key={filter.id}
                label={filter.label}
                onClick={() => toggleFilter(filter.id)}
                type={activeFilters.has(filter.id) ? "selected" : "unselected"}
              />
            ))}
          </div>
        </div>

        {/* Suggested - Bottom */}
        <div className="flex min-w-0 flex-col gap-4">
          <Heading
            className="font-semibold text-[var(--color-brand-text)] text-sm md:text-sm"
            level={3}
            weight="semibold"
          >
            Suggested
          </Heading>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTED_FILTERS.map((filter) => (
              <CustomChips
                key={filter.id}
                label={filter.label}
                onClick={() => toggleFilter(filter.id)}
                type={activeFilters.has(filter.id) ? "selected" : "unselected"}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Buttons */}
      <div className="flex gap-4 px-4 pt-2 pb-3.5">
        <AppButton className="flex-1" onClick={handleApplyFilters} variant="primary">
          Apply Filter
        </AppButton>
        <AppButton className="flex-1" onClick={handleReset} variant="tertiary">
          Reset
        </AppButton>
      </div>
    </div>
  );
}
