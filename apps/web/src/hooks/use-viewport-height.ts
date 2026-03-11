"use client";

import { useEffect, useState } from "react";

/**
 * Custom hook to calculate viewport height minus header height
 * Handles responsive header heights and updates on resize
 */
export function useViewportHeight() {
  const [viewportHeight, setViewportHeight] = useState<string>("100vh");

  useEffect(() => {
    const calculateHeight = () => {
      // Header heights: 64px (h-16) on mobile, 80px (h-20) on desktop
      const headerHeight = window.innerWidth >= 640 ? 80 : 64;
      const vh = window.innerHeight - headerHeight;
      setViewportHeight(`${vh}px`);
    };

    calculateHeight();
    window.addEventListener("resize", calculateHeight);
    return () => window.removeEventListener("resize", calculateHeight);
  }, []);

  return viewportHeight;
}

/**
 * Returns CSS custom property for viewport height minus header
 */
export function useViewportHeightVar() {
  const vh = useViewportHeight();
  return { "--vh-minus-header": vh } as React.CSSProperties;
}
