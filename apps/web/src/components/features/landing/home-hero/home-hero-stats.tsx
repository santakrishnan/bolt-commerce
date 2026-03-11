import Image from "next/image";
import type React from "react";
import type { HomeHeroStatsProps } from "./types";

/** Local icon mapping — maps JSON ids to local SVG assets */
const STAT_ICONS: Record<string, string> = {
  vehicles: "/images/heroes/vehicle-availability.svg",
  vin: "/images/heroes/vehicle-vin.svg",
  "money-back": "/images/heroes/money-back.svg",
  rating: "/images/heroes/customer-rating.svg",
};

/**
 * Formats the stat value for display.
 * Examples:
 *   "20,847"  → "20,847+"
 *   "100%"    → "100%"
 *   "7-DAY"   → "7-DAY"
 *   "4.9"     → "4.9"
 */
function formatStatValue(raw: string, id: string): string {
  // Special case: vehicles stat always shows a "+" suffix if not already present
  if (id === "vehicles" && !raw.includes("+")) {
    return `${raw}+`;
  }
  return raw;
}

export function HomeHeroStats({ stats }: HomeHeroStatsProps): React.JSX.Element {
  return (
    <div className="grid grid-cols-2 gap-[var(--spacing-md)] rounded-[var(--radius-2xl)] pt-[var(--spacing-sm)] pb-[var(--spacing-lg)] md:grid-cols-4 md:gap-[var(--spacing-2xl)] lg:px-32">
      {stats.map((stat) => {
        const icon = STAT_ICONS[stat.id] ?? stat.icon;
        const displayValue = formatStatValue(stat.value, stat.id);

        return (
          <div
            className="flex items-center gap-[var(--spacing-lg)] md:gap-[var(--spacing-md)] lg:w-50"
            key={stat.id}
          >
            <div className="flex h-[var(--spacing-2xl)] w-[var(--spacing-2xl)] items-center justify-center rounded-full">
              <Image
                alt={stat.label}
                className="h-[var(--spacing-10)] w-[var(--spacing-10)] lg:h-[var(--spacing-2xl)] lg:w-[var(--spacing-2xl)]"
                height={48}
                src={icon}
                width={48}
              />
            </div>
            <div>
              <div className="inline-block min-w-[6.5ch] font-normal text-[length:var(--font-size-xl)] text-primary-foreground">
                {displayValue}
              </div>
              <div className="text-[length:var(--font-size-xs)] text-primary-foreground/80 leading-tight tracking-[var(--tracking-tight)] md:text-[length:var(--font-size-sm)]">
                {stat.label}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
