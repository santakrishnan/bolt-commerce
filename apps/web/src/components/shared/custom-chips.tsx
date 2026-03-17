// ─── FilterChip docs ───────────────────────────────────────────────────────
/**
 * `FilterChip` — a small, reusable chip/pill UI that wraps the project's
 * `Chip` primitive from `@tfs-ucmp/ui` to provide consistent brand styling
 * and a compact API for search/filter UIs.
 *
 * Key behaviour:
 * - Renders four visual states: `unselected`, `selected`, `applied`, and
 *   `unavailable` (mapped via the `type` prop).
 * - `applied` chips are not interactive (no hover/click) — only the internal
 *   remove (`X`) button is interactive and stops propagation so it doesn't
 *   trigger chip-level actions.
 * - When `isRefineSearch` is true and `type` is `applied`, the chip uses the
 *   destructive visual style (brand-destructive background + foreground).
 *
 * Props summary:
 * - `label` (string): visible text inside the chip.
 * - `selected` (boolean): convenience flag for the selected state.
 * - `type` (CustomChipType): explicit visual state (overrides `selected`).
 * - `onClick` (fn): fired when an interactive chip is clicked (disabled for
 *   `applied` / `unavailable`).
 * - `onRemove` (fn): called when the remove button is pressed for `applied` chips.
 * - `prefix` (ReactNode): optional leading content (color swatch, icon, etc.).
 * - `isRefineSearch` (boolean): toggles the destructive style for applied chips.
 *
 * Accessibility notes:
 * - `unavailable` chips render with `aria-disabled` and are not focusable.
 * - The remove button is a native `button` with `aria-label` and prevents
 *   event propagation so only the removal action runs.
 *
 * Examples (scenarios):
 *
 * 1) Basic unselected chip
 * ```tsx
 * <CustomChips label="Sedan" onClick={() => select('Sedan')} />
 * ```
 *
 * 2) Selected (toggleable) chip
 * ```tsx
 * <CustomChips label="Hybrid" selected={isHybrid} onClick={toggleHybrid} />
 * ```
 *
 * 3) Applied chip with removable `X` (non-interactive chip body)
 * ```tsx
 * <CustomChips type="applied" label="Sunroof" onRemove={() => remove('sunroof')} />
 * ```
 *
 * 4) Applied refine-search (destructive) chip
 * ```tsx
 * <CustomChips type="applied" isRefineSearch label="Accident" onRemove={clearAccident} />
 * ```
 *
 * 5) Unavailable chip (disabled)
 * ```tsx
 * <CustomChips type="unavailable" label="Limited Edition" />
 * ```
 */

"use client";

import { Button, Chip } from "@tfs-ucmp/ui";
import Image from "next/image";
import type React from "react";
import type { ComponentProps } from "react";
import { XIcon } from "@/components/assets/icons";

type ChipProps = ComponentProps<typeof Chip>;

/** All high-level visual types supported by the project for filter chips. */
export type CustomChipType = "selected" | "unselected" | "unavailable" | "applied";

export interface FilterChipProps extends Omit<ChipProps, "removable" | "onRemove" | "prefix"> {
  /** When true, renders the applied chip in the destructive/refine-search style. */
  isRefineSearch?: boolean;
  /** Label text displayed inside the chip */
  label: string;
  onClick?: () => void;
  /** Called when the X button is clicked — used with type="applied". */
  onRemove?: () => void;
  /** Optional leading content rendered before the label (e.g. a color swatch circle). */
  prefix?: React.ReactNode;
  /** Convenience boolean for the selected state. Ignored when `type` is provided. */
  selected?: boolean;
  /** High-level visual type. When provided, this takes precedence over `selected`. */
  type?: CustomChipType;
}

// ─── State class resolver (avoids nested ternaries) ─────────────────────────
function resolveStateClass(
  isUnavailable: boolean,
  isSelected: boolean,
  isApplied: boolean,
  isRefineSearch: boolean
): string {
  if (isUnavailable) {
    return "border-transparent bg-[var(--color-actions-tertiary-hover)] text-[var(--color-brand-text-disabled)] cursor-not-allowed pointer-events-none";
  }
  if (isApplied && isRefineSearch) {
    return "border border-[var(--color-destructive)] bg-[var(--color-destructive)] text-[var(--color-destructive-foreground)] cursor-default hover:bg-[var(--color-destructive)] hover:text-[var(--color-destructive-foreground)]";
  }
  if (isApplied) {
    return "border border-[var(--color-states-muted)] bg-transparent text-[var(--color-brand-text)] cursor-default hover:bg-transparent hover:opacity-100 hover:text-[var(--color-brand-text)]";
  }
  if (isSelected) {
    return "border border-[var(--color-actions-accent)] bg-inherit text-[var(--color-brand-text-primary)] hover:bg-inherit hover:text-[var(--color-brand-text-primary)]";
  }
  return "border-transparent bg-[var(--color-core-surfaces-background)] text-[var(--color-brand-text-primary)] hover:bg-[var(--color-core-surfaces-background)] hover:text-[var(--color-brand-text-primary)]";
}

export const CustomChips = ({
  label,
  selected = false,
  type,
  onClick,
  className,
  prefix,
  onRemove,
  isRefineSearch = false,
  ...rest
}: FilterChipProps) => {
  const isSelected = type ? type === "selected" : selected;
  const isUnavailable = type === "unavailable";
  const isApplied = type === "applied";
  const chipOnClick = isUnavailable || isApplied ? undefined : onClick;

  return (
    <Chip
      aria-disabled={isUnavailable}
      className={[
        // ── base ─────────────────────────────────────────────────────────────
        "flex h-[var(--spacing-xl)] cursor-pointer items-center gap-[var(--spacing-xs)]",
        "rounded-full px-[var(--spacing-sm)] font-normal",
        "text-[length:var(--font-size-xs)] leading-normal transition-colors",
        // ── state ────────────────────────────────────────────────────────────
        resolveStateClass(isUnavailable, isSelected, isApplied, isRefineSearch),
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={chipOnClick}
      tabIndex={isUnavailable ? -1 : undefined}
      variant="outline"
      {...rest}
    >
      {prefix}
      <span className="font-normal text-[length:var(--font-size-xs)] leading-normal">{label}</span>
      {isSelected && (
        <Image alt="Selected" height={12} src="/images/search/checkmark.svg" width={12} />
      )}
      {isApplied && onRemove && (
        <Button
          aria-label={`Remove ${label} filter`}
          className={
            isRefineSearch
              ? "flex h-4 w-4 items-center justify-center px-0 text-[var(--color-destructive-foreground)] transition-colors hover:opacity-70"
              : "flex h-4 w-4 items-center justify-center px-0 text-[var(--color-brand-text)] transition-colors hover:text-[var(--color-destructive)]"
          }
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          type="button"
          variant="search"
        >
          <XIcon className="h-3.5 w-3.5" />
        </Button>
      )}
    </Chip>
  );
};

CustomChips.displayName = "CustomChips";

// Backwards-compatible alias for existing imports
export const FilterChip = CustomChips;
