"use client";

import { Button } from "@tfs-ucmp/ui";
import Image from "next/image";

interface ColorSwatchProps {
  color: string;
  label: string;
  selected?: boolean;
  onClick?: () => void;
}

const colorMap: Record<string, string> = {
  White: "bg-white border border-gray-300",
  Black: "bg-black",
  "Midnight Gray": "bg-gray-600",
  "Metallic Green": "bg-green-600",
  "Deep Red": "bg-red-700",
  Graphite: "bg-gray-800",
  "Luminous Yellow": "bg-yellow-400",
  "Ocean Blue": "bg-blue-600",
  "Electric Blue": "bg-blue-400",
};

/**
 * Color swatch pill — shows a colored circle alongside the color name.
 */
export const ColorSwatch = ({
  color: _color,
  label,
  selected = false,
  onClick,
}: ColorSwatchProps) => (
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
    <span className={`h-5 w-5 rounded-full ${colorMap[label] ?? "bg-gray-400"}`} />
    <span className="font-normal text-[length:var(--font-size-xs)] text-[var(--color-brand-text-primary)] leading-normal">
      {label}
    </span>
    {selected && <Image alt="Selected" height={12} src="/images/search/checkmark.svg" width={12} />}
  </Button>
);
