"use client";

import { cn } from "@tfs-ucmp/ui";
import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import { getPriceCategory } from "~/lib/formatters";

interface PriceRangeMeterProps {
  currentPrice: number;
  avgPrice: number;
}

/**
 * PriceRangeMeter - Visualizes where a vehicle's price falls relative to market average.
 * Renders a segmented bar (Excellent → Good → Fair → High) with price markers.
 */
export function PriceRangeMeter({ currentPrice, avgPrice }: PriceRangeMeterProps) {
  // Calculate percentage position for current price (0-100%)
  // Range: 0.7 * avgPrice to 1.3 * avgPrice
  const minPrice = avgPrice * 0.7;
  const maxPrice = avgPrice * 1.3;
  const currentPercentage = Math.min(
    100,
    Math.max(0, ((currentPrice - minPrice) / (maxPrice - minPrice)) * 100)
  );

  // Calculate percentage for avg price marker (should be around 50%)
  const avgPercentage = 50;

  // Determine price category based on where the price falls
  const { color: categoryColor } = getPriceCategory(currentPercentage);

  // Bar segment percentages computed from design pixel widths
  // Provided pixels: excellent=92px, good=92px, fair=200px, high=200px
  const segmentPixels: number[] = [92, 92, 200, 200];
  const totalPixels = segmentPixels.reduce((s, n) => s + (n ?? 0), 0);
  const excellentEnd = ((segmentPixels[0] ?? 0) / totalPixels) * 100;
  const goodEnd = (((segmentPixels[0] ?? 0) + (segmentPixels[1] ?? 0)) / totalPixels) * 100;
  const fairEnd =
    (((segmentPixels[0] ?? 0) + (segmentPixels[1] ?? 0) + (segmentPixels[2] ?? 0)) / totalPixels) *
    100;
  // High: 75-100

  // Measurement refs/state to align dot under the comma in the price badge
  const badgeRef = useRef<HTMLDivElement | null>(null);
  const leftPartRef = useRef<HTMLSpanElement | null>(null);
  const avgLeftRef = useRef<HTMLSpanElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);
  const [dotLeftPx, setDotLeftPx] = useState<string | null>(null);
  const [avgDotLeftPx, setAvgDotLeftPx] = useState<string | null>(null);

  const formatted = currentPrice.toLocaleString();
  const commaIndex = formatted.indexOf(",");
  const leftPart = commaIndex >= 0 ? formatted.slice(0, commaIndex + 1) : formatted;
  const rightPart = formatted.slice(leftPart.length);

  useLayoutEffect(() => {
    const compute = () => {
      const barEl = barRef.current;
      const leftSpan = leftPartRef.current;
      const badgeEl = badgeRef.current;
      const avgLeftSpan = avgLeftRef.current;
      if (!(barEl && leftSpan && badgeEl)) {
        setDotLeftPx(null);
        return;
      }
      // Read design tokens (CSS variables) for dynamic pixel math
      const cssVarPx = (name: string, fallback = "0px") => {
        try {
          const v = getComputedStyle(document.documentElement).getPropertyValue(name) || fallback;
          return Number.parseFloat(v);
        } catch (_e) {
          return Number.parseFloat(fallback);
        }
      };

      const nudgePx = cssVarPx("--spacing-sm", "12px");
      const dotHalf = cssVarPx("--size-icon-sm", "16px") / 2;

      const barRect = barEl.getBoundingClientRect();
      const leftSpanRect = leftSpan.getBoundingClientRect();

      // Desired left inside the bar: distance from bar left to the right edge of leftPart
      const desiredLeft = leftSpanRect.right - barRect.left + nudgePx;

      // Center the dot horizontally under the comma (adjust by half dot width)
      const clamped = Math.max(0, Math.min(barRect.width, desiredLeft - dotHalf));
      setDotLeftPx(`${clamped}px`);

      // Compute avg marker position if avg left span is available
      if (avgLeftSpan) {
        const avgLeftRect = avgLeftSpan.getBoundingClientRect();
        const desiredAvgLeft = avgLeftRect.right - barRect.left + nudgePx / 2;
        const avgClamped = Math.max(0, Math.min(barRect.width, desiredAvgLeft - dotHalf));
        setAvgDotLeftPx(`${avgClamped}px`);
      } else {
        setAvgDotLeftPx(null);
      }
    };

    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  });

  return (
    <div className="w-full">
      <div className="mb-[var(--spacing-xs)] flex items-start justify-start">
        <div
          className="ml-[var(--spacing-xs)] flex min-w-[var(--size-thumbnail)] flex-col items-center"
          ref={badgeRef}
        >
          <div
            className={cn(
              "mb-[var(--spacing-2xs)] whitespace-nowrap rounded-full px-[var(--spacing-md)] py-[var(--spacing-xs)] text-center font-semibold text-[length:var(--font-size-sm)] text-white leading-[1.25] lg:font-semibold lg:text-[length:var(--font-size-md)] lg:leading-[1.25]",
              categoryColor
            )}
          >
            ${""}
            <span ref={leftPartRef}>{leftPart}</span>
            <span>{rightPart}</span>
          </div>
        </div>
        <div className="flex flex-1 justify-start lg:justify-center">
          <div className="text-left">
            <div className="pb-[var(--spacing-xs)] text-center font-semibold text-[length:var(--font-size-sm)] leading-[1.25] lg:font-semibold lg:text-[length:var(--font-size-md)] lg:leading-[1.25]">
              ${""}
              {(() => {
                const formattedAvg = avgPrice.toLocaleString();
                const commaIdx = formattedAvg.indexOf(",");
                const leftAvg = commaIdx >= 0 ? formattedAvg.slice(0, commaIdx + 1) : formattedAvg;
                const rightAvg = formattedAvg.slice(leftAvg.length);
                return (
                  <>
                    <span ref={avgLeftRef}>{leftAvg}</span>
                    <span>{rightAvg}</span>
                  </>
                );
              })()}
            </div>
            <div className="text-right font-normal text-[color:var(--color-brand-text-secondary)] text-[length:var(--font-size-xs)] leading-[1.125] lg:font-normal lg:text-[length:var(--font-size-sm)] lg:leading-[1.125]">
              Avg. market price (IMV)
            </div>
          </div>
        </div>
      </div>
      {/* Segmented bar with markers - 4 segments */}
      <div
        className="relative mb-[var(--spacing-xs)] flex h-[var(--spacing-xl)] w-full items-center"
        ref={barRef}
      >
        {/* Segments */}
        <div className="absolute top-1/2 left-0 z-0 flex h-[calc(var(--spacing-xs)/2)] w-full -translate-y-1/2 gap-[calc(var(--spacing-sm)/2)]">
          <div
            className="h-[calc(var(--spacing-xs)/2)] rounded-full bg-green-500"
            style={{ width: `${excellentEnd}%` }}
          />
          <div
            className="h-[calc(var(--spacing-xs)/2)] rounded-full bg-green-700"
            style={{ width: `${goodEnd - excellentEnd}%` }}
          />
          <div
            className="h-[calc(var(--spacing-xs)/2)] rounded-full bg-gray-700"
            style={{ width: `${fairEnd - goodEnd}%` }}
          />
          <div
            className="h-[calc(var(--spacing-xs)/2)] rounded-full bg-orange-500"
            style={{ width: `${100 - fairEnd}%` }}
          />
        </div>
        {/* Current price marker */}
        <div
          className="absolute top-1/2 z-10 -translate-y-1/2 overflow-hidden"
          style={
            dotLeftPx
              ? { left: dotLeftPx, borderRadius: "var(--radius-md)" }
              : {
                  left: `calc(${currentPercentage}% - (var(--size-icon-sm) / 2))`,
                  borderRadius: "var(--radius-md)",
                }
          }
        >
          <Image
            alt="Current price marker"
            height={16}
            src="/images/vdp/Ellipse-Light.svg"
            width={16}
          />
        </div>
        {/* Avg price marker */}
        <div
          className="absolute top-1/2 z-10 -translate-y-1/2 overflow-hidden"
          style={
            avgDotLeftPx
              ? { left: avgDotLeftPx, borderRadius: "var(--radius-md)" }
              : {
                  left: `calc(${avgPercentage}% - (var(--size-icon-sm) / 2))`,
                  borderRadius: "var(--radius-md)",
                }
          }
        >
          <Image
            alt="Average price marker"
            height={16}
            src="/images/vdp/Ellipse-Dark.svg"
            width={16}
          />
        </div>
      </div>
      {/* Labels below bar — each label width matches its segment so text centers correctly */}
      <div className="flex w-full">
        <div
          className="shrink-0 text-center font-normal text-[length:var(--text-2xs)] text-body leading-tight sm:text-[length:var(--text-xs)] lg:text-[length:var(--font-size-sm)] lg:leading-normal"
          style={{ width: `${excellentEnd}%` }}
        >
          Excellent
        </div>
        <div
          className="shrink-0 text-center font-normal text-[length:var(--text-2xs)] text-body leading-tight sm:text-[length:var(--text-xs)] lg:text-[length:var(--font-size-sm)] lg:leading-normal"
          style={{ width: `${goodEnd - excellentEnd}%` }}
        >
          Good
        </div>
        <div
          className="shrink-0 text-center font-normal text-[length:var(--text-2xs)] text-body leading-tight sm:text-[length:var(--text-xs)] lg:text-[length:var(--font-size-sm)] lg:leading-normal"
          style={{ width: `${fairEnd - goodEnd}%` }}
        >
          Fair
        </div>
        <div
          className="shrink-0 text-center font-normal text-[length:var(--text-2xs)] text-body leading-tight sm:text-[length:var(--text-xs)] lg:text-[length:var(--font-size-sm)] lg:leading-normal"
          style={{ width: `${100 - fairEnd}%` }}
        >
          High
        </div>
      </div>
    </div>
  );
}
