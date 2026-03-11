"use client";

import { cn } from "@tfs-ucmp/ui";
import type { ReactNode } from "react";

interface SnapSectionProps {
  children: ReactNode;
  className?: string;
  /**
   * If true, section height will be viewport height minus header
   */
  useViewportHeight?: boolean;
  /**
   * Additional inline styles
   */
  style?: React.CSSProperties;
}

/**
 * SnapSection - Wrapper for sections that should snap to viewport
 * Automatically handles viewport height calculation and scroll snap behavior
 */
export function SnapSection({
  children,
  className,
  useViewportHeight = false,
  style,
}: SnapSectionProps) {
  return (
    <div
      className={cn(
        "snap-section w-full",
        useViewportHeight && "min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)]",
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}
