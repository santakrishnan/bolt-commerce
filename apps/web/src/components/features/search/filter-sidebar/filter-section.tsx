"use client";

import { Button } from "@tfs-ucmp/ui";
import Image from "next/image";

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  sectionRef?: React.Ref<HTMLDivElement>;
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
          <Image
            alt="Collapse"
            aria-hidden="true"
            className="h-3 w-3"
            height={12}
            src="/images/search/minus.svg"
            width={12}
          />
        ) : (
          <Image
            alt="Expand"
            aria-hidden="true"
            className="h-3 w-3"
            height={12}
            src="/images/search/plus.svg"
            width={12}
          />
        )}
      </Button>
      {isOpen && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
};
