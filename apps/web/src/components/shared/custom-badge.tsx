// ─── Props ───────────────────────────────────────────────────────────────────
/**
 * Developer integration notes — `CustomBadge` props and examples
 *
 * Props:
 * - `type?: CustomBadgeType` — Variant name. Examples: 'excellentPrice', 'matchingPercentage', 'owner', or shadcn variants like 'default'.
 * - `icon?: LucideIcon | React.ReactNode | null` — Override the icon. Pass a Lucide component, a ReactNode, or `null` to suppress.
 * - `iconSrc?: string` — Filename under `/public/images/badges/` (e.g. 'my_icon.svg'). Takes precedence over `icon` and defaults.
 * - `iconPosition?: 'left' | 'right'` — Position of icon relative to text (default: 'left').
 * - `text?: React.ReactNode` — Label content. Falls back to children if omitted.
 * - `matchPercentage?: number` — When `type==='matchingPercentage'`, renders `${value}% Match`.
 * - `ownerCount?: number` — When `type==='owner'`, renders `1 Owner` or `2 Owners` depending on value.
 * - `expiresInDays?: number` — When `type==='ExpiresAt'`, renders `Expires in <n> day(s)`.

 *
 * Examples:
 * ```tsx
 * <CustomBadge type="excellentPrice" text="Excellent Price" />
 * <CustomBadge type="matchingPercentage" matchPercentage={97} />
 * <CustomBadge type="owner" ownerCount={2} iconSrc="one_owner.svg" />
 * <CustomBadge type="priceDrop" text="-$1,200" icon={null} /> // suppress icon
 * <CustomBadge type="justListed" text="Just Listed" iconPosition="right" />
 * <CustomBadge type="default" text="Label" /> // delegates to shared `Badge`
 *
 *
 * // Combined examples
 * <CustomBadge type="matchingPercentage" matchPercentage={87} iconPosition="right" />
 * <CustomBadge type="owner" ownerCount={1} iconSrc="one_owner.svg" iconPosition="right" />
 * <CustomBadge type="goodPrice" text="$12,345" icon={<svg/>} />
 * <CustomBadge type="excellentPrice" text="Excellent" iconSrc="custom_badge.svg" />
 * <CustomBadge type="ExpiresAt" expiresInDays={2} /> // renders "Expires in 2 days"
 * ```
 */

import { Badge } from "@tfs-ucmp/ui";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import * as React from "react";
import { cn } from "@/lib/utils";

// ─── Base styles shared by all price / status badges ─────────────────────────
// Layout (flex, height, padding, gap, radius) lives on the container span — see below.
const priceBadgeBase =
  "border-transparent text-white shadow-none ring-0 whitespace-nowrap" +
  " font-[var(--font-family)] text-[length:var(--text-2xs)] font-semibold leading-[125%] tracking-[-0.1px]";

// ─── Custom badge variant → class map ────────────────────────────────────────
const customBadgeClasses = {
  excellentPrice: `${priceBadgeBase} bg-[var(--color-brand-success)]`,
  lowPrice: `${priceBadgeBase} bg-[var(--color-brand-success)]`,
  preQualifies: `${priceBadgeBase} bg-[var(--color-brand-success)]`,
  goodPrice: `${priceBadgeBase} bg-[var(--color-badge-good-price)]`,
  fairPrice: `${priceBadgeBase} bg-[var(--color-badge-fair-price)]`,
  matchingPercentage: `${priceBadgeBase} bg-[var(--color-badge-matching-percentage)]`,
  ExpiresAt: `${priceBadgeBase} bg-[var(--color-badge-matching-percentage)]`,
  priceDrop: `${priceBadgeBase} bg-[var(--color-badge-price-drop-listed)]`,
  justListed: `${priceBadgeBase} bg-[var(--color-badge-price-drop-listed)]`,
  newArrival: `${priceBadgeBase} bg-[var(--color-badge-price-drop-listed)]`,
  warranty: `${priceBadgeBase} bg-inherit text-[var(--color-brand-text-secondary)]`,
  Inspected: `${priceBadgeBase} bg-inherit text-[var(--color-brand-text-secondary)]`,
  lowMiles: `${priceBadgeBase} bg-inherit text-[var(--color-brand-text-secondary)]`,
  noAccidents: `${priceBadgeBase} bg-inherit text-[var(--color-brand-text-secondary)]`,
  owner: `${priceBadgeBase} bg-inherit text-[var(--color-brand-text-secondary)]`,
} as const;

// ─── Default icons per badge type (public/images/badges/) ────────────────────
const defaultBadgeIcons: Partial<Record<keyof typeof customBadgeClasses, string>> = {
  excellentPrice: "/images/badges/excellent_price.svg",
  lowPrice: "/images/badges/low_price.svg",
  goodPrice: "/images/badges/good_price.svg",
  fairPrice: "/images/badges/fair_price.svg",
  priceDrop: "/images/badges/price_drop.svg",
  justListed: "/images/badges/just_listed.svg",
  warranty: "/images/badges/warranty.svg",
  Inspected: "/images/badges/inspected.svg",
  lowMiles: "/images/badges/low_miles.svg",
  noAccidents: "/images/badges/no_accidents.svg",
  owner: "/images/badges/one_owner.svg",
  matchingPercentage: "/images/badges/low_price.svg",
  //no default icons for preQualifies, newArrival, or ExpireAt types — these can be overridden via `icon` or `iconSrc` props as needed
};

/**
 * Renders an SVG as a CSS mask so it adopts `currentColor`.
 * Works with any single-colour SVG served from /public.
 */
function MaskedIcon({ src }: { src: string }) {
  return (
    <span
      aria-hidden
      className="inline-block h-[16px] w-[12px] shrink-0"
      style={{
        backgroundColor: "currentColor",
        WebkitMaskImage: `url(${src})`,
        maskImage: `url(${src})`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    />
  );
}

// ─── Shadcn variants are forwarded directly to <Badge variant={...}> ─────────
type ShadcnVariant = "default" | "secondary" | "destructive" | "outline" | "subtle" | "ghost";
type CustomVariant = keyof typeof customBadgeClasses;

/** All supported badge types */
export type CustomBadgeType = ShadcnVariant | CustomVariant;

// ─── Helpers ─────────────────────────────────────────────────────────────────
function isCustomVariant(type: CustomBadgeType): type is CustomVariant {
  return type in customBadgeClasses;
}

// ─── Base path for badge icons in /public ────────────────────────────────────
const BADGE_ICON_BASE = "/images/badges/";

export interface CustomBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** When `type==='ExpiresAt'`, renders `Expires in <n> day(s)` */
  expiresInDays?: number;
  /**
   * Override the default icon for this badge type.
   * - Pass a Lucide icon component to render it.
   * - Pass any ReactNode for custom markup.
   * - Pass `null` to explicitly suppress the default icon.
   * - Omit to use the default SVG from /public/images/badges.
   */
  icon?: LucideIcon | React.ReactNode | null;
  /**
   * Position of the icon relative to the text label.
   * @default 'left'
   */
  iconPosition?: "left" | "right";
  /**
   * Override the icon with a custom SVG filename from /public/images/badges/.
   * Just pass the filename, e.g. `"my_icon.svg"` — the base path is fixed.
   * Takes precedence over the `icon` prop and the default icon map.
   */
  iconSrc?: string;
  /**
   * Used when `type="matchingPercentage"`.
   * Renders as "<value>% match" — e.g. `97` → "97% match".
   */
  matchPercentage?: number;
  /**
   * Used when `type="owner"`.
   * Renders as "<value> owner" or "<value> owners" — e.g. `1` → "1 owner", `2` → "2 owners".
   */
  ownerCount?: number;
  /** Badge label */
  text?: React.ReactNode;
  /** Visual style of the badge */
  type?: CustomBadgeType;
  // expiry prop removed — badges no longer auto-hide based on time
}

// ─── Icon resolver ────────────────────────────────────────────────────────────
function resolveIcon(
  type: CustomBadgeType,
  icon: CustomBadgeProps["icon"],
  iconSrc?: string
): React.ReactNode {
  // iconSrc filename override — prepend fixed base path
  if (iconSrc) {
    return (
      <Image
        alt=""
        aria-hidden
        className="inline-block shrink-0"
        height={16}
        src={`${BADGE_ICON_BASE}${iconSrc}`}
        style={{ width: "12px", height: "16px" }}
        width={12}
      />
    );
  }

  // Explicitly suppressed
  if (icon === null) {
    return null;
  }

  // Lucide component (callable)
  if (typeof icon === "function") {
    return React.createElement(icon as React.ElementType, {
      className: "inline-block w-3 h-4 shrink-0",
    });
  }

  // Arbitrary ReactNode override
  if (icon !== undefined) {
    return icon;
  }

  // Default: use the mapped SVG from public folder (custom variants only)
  if (isCustomVariant(type)) {
    const src = defaultBadgeIcons[type];
    if (src) {
      // All custom types: mask the SVG so the icon colour matches the text colour
      return <MaskedIcon src={src} />;
    }
  }

  return null;
}

// ─── Component ───────────────────────────────────────────────────────────────
export const CustomBadge = React.forwardRef<HTMLSpanElement, CustomBadgeProps>(
  (
    {
      icon,
      iconSrc,
      iconPosition = "left",
      type = "default",
      text,
      matchPercentage,
      ownerCount,
      expiresInDays,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const iconNode = resolveIcon(type, icon, iconSrc);

    const iconEl = iconNode ? <span className="inline-flex items-center">{iconNode}</span> : null;

    // Resolve label: expiresInDays (for ExpiresAt) > type-specific > text/children
    let resolvedLabel: React.ReactNode = text ?? children;
    if (type === "ExpiresAt" && expiresInDays !== undefined) {
      resolvedLabel = `Expires in ${expiresInDays} ${expiresInDays === 1 ? "day" : "days"}`;
    } else if (type === "matchingPercentage" && matchPercentage !== undefined) {
      resolvedLabel = `${matchPercentage}% Match`;
    } else if (type === "owner" && ownerCount !== undefined) {
      resolvedLabel = `${ownerCount} ${ownerCount === 1 ? "Owner" : "Owners"}`;
    }

    const content =
      iconPosition === "right" ? (
        <>
          {resolvedLabel}
          {iconEl}
        </>
      ) : (
        <>
          {iconEl}
          {resolvedLabel}
        </>
      );

    // Custom variants: plain <span> with the mapped class string
    if (isCustomVariant(type)) {
      return (
        <span
          className={cn(
            // Design spec: border-radius 4px, height 24px, padding 0 8px, gap 4px
            "inline-flex h-[var(--spacing-lg)] max-w-fit items-center gap-[var(--spacing-2xs)] rounded-[var(--spacing-2xs)] px-[var(--spacing-xs)] py-0",
            customBadgeClasses[type],
            className
          )}
          ref={ref}
          {...props}
        >
          {content}
        </span>
      );
    }

    // Shadcn variants: delegate to the shared <Badge> primitive
    return (
      <Badge className={cn(className)} ref={ref} variant={type} {...props}>
        {content}
      </Badge>
    );
  }
);

CustomBadge.displayName = "CustomBadge";

export default CustomBadge;
