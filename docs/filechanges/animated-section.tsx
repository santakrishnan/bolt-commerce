"use client";

import { motion, useInView } from "framer-motion";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  /**
   * Optional className to pass to the motion.div wrapper
   */
  className?: string;
  /**
   * Optional delay in seconds before animation starts
   */
  delay?: number;
  /**
   * Custom animation duration (default: 1.2s)
   */
  duration?: number;
  /**
   * If true, adds extra delay to allow section animation to complete before child animations
   */
  staggerChildren?: boolean;
}

/**
 * AnimatedSection - Wrapper component for scroll-triggered animations
 *
 * SSR/PPR-safe: before hydration, `isInView` defaults to true so the server
 * HTML contains `opacity:1` (visible in the static shell). After hydration
 * the real IntersectionObserver takes over — below-fold elements are instantly
 * hidden and then animate in on scroll; above-fold elements stay visible.
 */
export function AnimatedSection({
  children,
  className,
  delay = 0,
  duration = 1.2,
  staggerChildren = false,
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  // SSR + first client render: visible (no opacity:0 inline styles).
  // After hydration: defer to IntersectionObserver.
  const isInView = !hydrated || inView;

  return (
    <motion.div
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      className={className}
      initial={false}
      ref={ref}
      transition={{
        duration: isInView ? duration : 0,
        delay: isInView ? delay : 0,
        ease: [0.25, 0.46, 0.45, 0.94],
        ...(staggerChildren && isInView ? { staggerChildren: 0.2, delayChildren: duration } : {}),
      }}
    >
      {children}
    </motion.div>
  );
}
