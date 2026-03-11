"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  /**
   * Optional delay in seconds before animation starts
   */
  delay?: number;
  /**
   * Optional className to pass to the motion.div wrapper
   */
  className?: string;
  /**
   * If true, adds extra delay to allow section animation to complete before child animations
   */
  staggerChildren?: boolean;
  /**
   * Custom animation duration (default: 1.2s)
   */
  duration?: number;
}

/**
 * AnimatedSection - Wrapper component for scroll-triggered animations
 * Uses Framer Motion to animate sections as they enter the viewport
 * Supports staggering child animations (like carousels) after section animation completes
 */
export function AnimatedSection({
  children,
  delay = 0,
  className,
  staggerChildren = false,
  duration = 1.2,
}: AnimatedSectionProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 30 }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: staggerChildren ? 0.2 : 0,
        delayChildren: staggerChildren ? duration : 0,
      }}
      viewport={{ once: false, amount: 0.15 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {children}
    </motion.div>
  );
}
