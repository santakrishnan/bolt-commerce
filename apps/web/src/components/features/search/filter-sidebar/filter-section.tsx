"use client";

import { Button } from "@tfs-ucmp/ui";

interface FilterSectionProps {
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  sectionRef?: React.Ref<HTMLDivElement>;
  title: string;
}

/**
 * Collapsible filter section (accordion — only one open at a time).
 */
export const FilterSection = ({
  title,
  children,
  isOpen,
  onToggle,
  sectionRef,
}: FilterSectionProps) => {
  return (
    <div className="border-gray-200 border-b pt-2 pb-1 pl-1" ref={sectionRef}>
      <Button
        className="flex h-auto w-full items-center justify-between px-4 py-4 transition-colors hover:bg-gray-50"
        onClick={onToggle}
        type="button"
        variant="ghost"
      >
        <span className="font-semibold text-[length:var(--text-md)] text-[var(--color-brand-text-primary)] leading-normal">
          {title}
        </span>
        {isOpen ? (
          <svg
            aria-hidden="true"
            className="h-3 w-3"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg
            aria-hidden="true"
            className="h-3 w-3"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </Button>
      {isOpen && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
};
