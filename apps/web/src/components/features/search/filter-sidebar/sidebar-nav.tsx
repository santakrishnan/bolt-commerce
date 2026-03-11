"use client";

import { Button } from "@tfs-ucmp/ui";
import { filterSections } from "~/lib/search/filter-sections";

interface SidebarNavProps {
  openSection: string | null;
  onToggleSection: (section: string) => void;
}

/**
 * Left desktop navigation column — highlights the active filter section.
 */
export function SidebarNav({ openSection, onToggleSection }: SidebarNavProps) {
  return (
    <aside
      className="hidden w-[215px] flex-shrink-0 overflow-y-auto border-gray-200 border-r bg-white md:block"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      {filterSections.navItems.map((item) => (
        <Button
          className={`mb-[var(--spacing-xs)] ml-[8.5%] w-full max-w-[182px] justify-start py-3 pr-4 pl-4 text-left font-normal text-[length:var(--text-sm)] leading-normal transition-colors ${
            openSection === item
              ? "rounded-[var(--radius-md)] bg-[var(--color-core-surfaces-background)] text-[var(--color-brand-text-primary)] hover:bg-[var(--color-core-surfaces-background)] hover:text-[var(--color-brand-text-primary)]"
              : "text-[var(--color-states-muted-foreground)]"
          }`}
          key={item}
          onClick={() => onToggleSection(item)}
          type="button"
          variant="search"
        >
          {item}
        </Button>
      ))}
    </aside>
  );
}
