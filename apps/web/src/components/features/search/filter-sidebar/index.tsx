"use client";

import { Button } from "@tfs-ucmp/ui";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { SidebarFilters } from "./sidebar-filters";
import { SidebarNav } from "./sidebar-nav";
import { defaultFilterState, type FilterSidebarProps, type FilterState } from "./types";

export type { FilterSidebarProps, FilterState } from "./types";
export { defaultFilterState } from "./types";

export function FilterSidebar({
  isOpen,
  onClose,
  filterState,
  onApply,
  onReset,
}: FilterSidebarProps) {
  // Draft state: tracks user selections inside the sidebar without propagating to parent
  const [draftState, setDraftState] = useState<FilterState>(filterState);

  // Sync draft state from parent when sidebar opens
  useEffect(() => {
    if (isOpen) {
      setDraftState(filterState);
    }
  }, [isOpen, filterState]);

  const handleDraftChange = (key: keyof FilterState, value: FilterState[keyof FilterState]) => {
    setDraftState((prev) => ({ ...prev, [key]: value }));
  };

  // Track which section is open (null = all closed, string = section title)
  const [openSection, setOpenSection] = useState<string | null>(null);

  // Section refs for scroll-into-view
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Custom scrollbar tracking
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollInfo, setScrollInfo] = useState({ thumbTop: 0, thumbHeight: 20 });

  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) {
      return;
    }

    const { scrollTop, scrollHeight, clientHeight } = container;
    const trackHeight = clientHeight;
    const thumbHeight = Math.max((clientHeight / scrollHeight) * trackHeight, 30);
    const scrollableHeight = scrollHeight - clientHeight;
    const thumbTop =
      scrollableHeight > 0 ? (scrollTop / scrollableHeight) * (trackHeight - thumbHeight) : 0;

    setScrollInfo({ thumbTop, thumbHeight });
  }, []);

  useEffect(() => {
    handleScroll();
  }, [handleScroll]);

  const toggleSection = (section: string) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  // Scroll the opened section into view after it expands
  useEffect(() => {
    if (!openSection) {
      return undefined;
    }
    const timer = setTimeout(() => {
      const sectionEl = sectionRefs.current[openSection];
      if (sectionEl && scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const sectionRect = sectionEl.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const offsetTop = sectionRect.top - containerRect.top + container.scrollTop;
        container.scrollTo({ top: offsetTop, behavior: "smooth" });
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [openSection]);

  const toggleArrayFilter = (key: keyof FilterState, arr: string[], value: string) => {
    if (arr.includes(value)) {
      handleDraftChange(
        key,
        arr.filter((v) => v !== value)
      );
    } else {
      handleDraftChange(key, [...arr, value]);
    }
  };

  const handleApply = () => {
    onApply(draftState);
    onClose();
  };

  const handleReset = () => {
    setDraftState(defaultFilterState);
    onReset();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <Button
          className="fixed inset-0 top-0 z-[100] bg-black/40 transition-opacity"
          onClick={onClose}
          onKeyDown={(e) => e.key === "Escape" && onClose()}
          type="button"
          variant="search"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-[100] flex h-full w-full max-w-full transform flex-col bg-white transition-transform duration-300 ease-in-out md:max-w-[70%] ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-gray-200 border-b bg-white py-4 pr-4 pl-[15px] md:pl-[35px]">
          <div className="flex items-center gap-[1rem] md:gap-[7.5rem]">
            <div className="flex items-center gap-[var(--spacing-xs)]">
              <Image
                alt="Filter"
                className="h-[var(--spacing-3)] w-[var(--spacing-sd)]"
                height={10}
                src="/images/filter-lines.svg"
                width={14}
              />
              <span className="font-semibold text-[length:var(--font-size-xl)] text-[var(--color-brand-text-primary)] leading-normal md:text-[length:var(--font-size-lg)]">
                Filter
              </span>
            </div>
            <div className="flex flex-row items-center gap-2.5">
              <Button
                className="text-(length:--font-size-sm) flex h-[var(--spacing-10)] items-center justify-center rounded-full bg-[var(--color-brand-red)] px-[var(--spacing-xl)] py-0 text-center font-semibold text-white leading-normal"
                onClick={handleApply}
                type="button"
                variant="search"
              >
                Apply
              </Button>
              <Button
                className="text-(length:--font-size-sm) flex h-[var(--spacing-10)] cursor-pointer items-center justify-center rounded-full bg-[var(--color-brand-text-primary)] px-[var(--spacing-xl)] py-0 text-center font-semibold text-white leading-normal"
                onClick={handleReset}
                type="button"
                variant="search"
              >
                Reset
              </Button>
            </div>
          </div>
          <Button
            className="rounded-full p-1 transition-colors hover:bg-gray-100"
            onClick={onClose}
            type="button"
            variant="search"
          >
            <Image
              alt="Close"
              className="h-[10px] w-[10px]"
              height={10}
              src="/images/cross.svg"
              width={10}
            />
          </Button>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          <SidebarNav onToggleSection={toggleSection} openSection={openSection} />

          <SidebarFilters
            draftState={draftState}
            handleDraftChange={handleDraftChange}
            handleScroll={handleScroll}
            openSection={openSection}
            scrollContainerRef={scrollContainerRef}
            scrollInfo={scrollInfo}
            sectionRefs={sectionRefs}
            toggleArrayFilter={toggleArrayFilter}
            toggleSection={toggleSection}
          />
        </div>
      </aside>
    </>
  );
}
