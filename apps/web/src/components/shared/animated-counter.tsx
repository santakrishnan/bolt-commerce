"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
  /** The target value to count up to */
  value: number;
  /** Duration of the animation in ms */
  duration?: number;
  /** Optional prefix (e.g. "$") */
  prefix?: string;
  /** Optional suffix (e.g. "+") */
  suffix?: string;
  /** Format with locale separators (e.g. 1,000) */
  formatted?: boolean;
  /** Additional class names */
  className?: string;
}

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - 2 ** (-10 * t);
}

export function AnimatedCounter({
  value,
  duration = 2000,
  prefix = "",
  suffix = "",
  formatted = true,
  className,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) {
      return;
    }

    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) {
        startTime = timestamp;
      }
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutExpo(progress);

      // Support fractional target values. Animate a floating point
      // value and let the display formatter round to the appropriate
      // number of decimal places.
      setCount(easedProgress * value);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [hasAnimated, value, duration]);

  // Always show at most one decimal place for fractional values
  const decimals = Number.isInteger(value) ? 0 : 1;

  let displayValue: string;
  if (formatted) {
    if (decimals === 0) {
      displayValue = Math.round(count).toLocaleString();
    } else {
      displayValue = new Intl.NumberFormat(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(count);
    }
  } else if (decimals === 0) {
    displayValue = Math.round(count).toString();
  } else {
    displayValue = count.toFixed(decimals);
  }

  return (
    <span className={className} ref={ref}>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
}
