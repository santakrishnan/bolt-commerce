"use client";

import type { FC } from "react";

export interface CircularProgressProps {
  /** Label beneath the number (default: "DAYS") */
  label?: string;
  /** Rendered size in px (default: 48) */
  size?: number;
  /** Maximum value (default: 30) */
  total?: number;
  /** Current value (e.g. days remaining) */
  value: number;
}

/** Returns a stroke colour based on remaining days out of total. */
function getStrokeColor(value: number, total: number): string {
  const ratio = value / total;
  if (ratio >= 0.9) {
    return "var(--color-badge-success-bg, #078843)"; // ≥ 27 / 30 → green
  }
  if (ratio >= 0.5) {
    return "#F59E0B"; // 15 – 26 / 30 → amber
  }
  return "var(--color-accent-primary, #EB0D1C)"; // < 15 / 30 → red
}

/**
 * Circular progress ring.
 *
 * - Starts at 12 o'clock and fills **anticlockwise**.
 * - Colour thresholds (based on a 30-day total):
 *   - ≥ 27 days → green
 *   - 15 – 26 days → amber
 *   - < 15 days → red
 */
export const CircularProgress: FC<CircularProgressProps> = ({
  value,
  total = 30,
  label = "DAYS",
  size = 48,
}) => {
  const RADIUS = 18;
  const VIEW_SIZE = 40; // viewBox is "0 0 40 40"
  const circumference = 2 * Math.PI * RADIUS;
  const clamped = Math.min(Math.max(value / total, 0), 1);
  // Anticlockwise-from-12 trick:
  //   - SVG circle starts at 3 o'clock; rotate(-90°) shifts it to 12 o'clock.
  //   - Two-value dasharray [arc, gap] with dashoffset = arc causes the
  //     visible portion to sit at the END of the CW path (from (1-p)×circ → circ),
  //     which is visually the anticlockwise arc from 12 o'clock.
  const arc = clamped * circumference;
  const gap = circumference - arc;
  const strokeColor = getStrokeColor(value, total);

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/*
        -rotate-90  →  arc starts at 12 o'clock (not the default 3 o'clock).
        The progress circle uses  transform="translate(40,0) scale(-1,1)"
        which flips it around x = 20 (the SVG centre), reversing arc direction
        to anticlockwise while keeping the 12 o'clock start point.
      */}
      <svg
        aria-hidden="true"
        className="-rotate-90"
        height={size}
        viewBox={`0 0 ${VIEW_SIZE} ${VIEW_SIZE}`}
        width={size}
      >
        {/* Background track */}
        <circle cx="20" cy="20" fill="transparent" r={RADIUS} stroke="#ECECEC" strokeWidth="3" />

        {/* Anticlockwise progress arc */}
        <circle
          cx="20"
          cy="20"
          fill="transparent"
          r={RADIUS}
          stroke={strokeColor}
          strokeDasharray={`${arc} ${gap}`}
          strokeDashoffset={arc}
          strokeLinecap="round"
          strokeWidth="3"
          style={{ transition: "stroke-dashoffset 0.3s ease, stroke 0.3s ease" }}
        />
      </svg>

      {/* Centre text — counters the SVG rotation so text stays upright */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="text-center font-semibold leading-[130%]"
          style={{
            fontFamily: "var(--font-family)",
            fontSize: "var(--font-size-sm, 14px)",
            color: "var(--color-text-primary, #000)",
          }}
        >
          {value}
        </span>
        <span
          className="text-center font-semibold uppercase leading-normal"
          style={{ fontFamily: "var(--font-family)", fontSize: "8px", color: "#8A8A8A" }}
        >
          {label}
        </span>
      </div>
    </div>
  );
};
