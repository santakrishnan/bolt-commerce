"use client";

import { useEffect, useState } from "react";

/**
 * useIsMobile
 *
 * Custom hook that detects if the current viewport is mobile-sized (< 1024px).
 * Corresponds to Tailwind's `lg` breakpoint.
 *
 * Usage:
 * - Returns `true` when viewport width is less than 1024px
 * - Returns `false` when viewport width is 1024px or greater
 * - Returns `false` during SSR (server-side rendering)
 *
 * The hook:
 * - Sets up a resize listener to track viewport changes
 * - Cleans up the listener on unmount
 * - Debounces updates to avoid excessive re-renders
 *
 * @example
 * const isMobile = useIsMobile();
 * return isMobile ? <MobileView /> : <DesktopView />;
 *
 * @returns {boolean} True if viewport width is less than 1024px
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const MOBILE_BREAKPOINT = 1024;
    const checkIsMobile = (): void => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  return isMobile;
}
