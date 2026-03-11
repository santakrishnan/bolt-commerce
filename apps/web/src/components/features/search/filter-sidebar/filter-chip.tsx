"use client";

import Image from "next/image";
import { Button } from "../../../../../../../packages/ui/src/components/button";

interface FilterChipProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
}

/**
 * Pill-style toggle chip used throughout all filter sections.
 */
export const FilterChip = ({ label, selected = false, onClick }: FilterChipProps) => (
  <Button
    className={`flex h-[var(--spacing-xl)] cursor-pointer items-center gap-[var(--spacing-xs)] rounded-full px-[var(--spacing-sm)] font-normal text-[length:var(--font-size-xs)] leading-normal transition-colors ${
      selected
        ? "border border-[var(--color-brand-red)] bg-inherit text-[var(--color-brand-text-primary)]"
        : "bg-[var(--color-core-surfaces-background)] text-[var(--color-brand-text-primary)] hover:border hover:border-gray-400"
    }`}
    onClick={onClick}
    type="button"
    variant="search"
  >
    <span className="font-normal text-[length:var(--font-size-xs)] leading-normal">{label}</span>
    {selected && <Image alt="Selected" height={12} src="/images/search/checkmark.svg" width={12} />}
  </Button>
);
