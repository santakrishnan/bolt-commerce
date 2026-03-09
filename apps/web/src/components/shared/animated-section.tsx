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
}

/**
 * AnimatedSection - Wrapper component for scroll-triggered animations
 * Uses Framer Motion to animate sections as they enter the viewport
 */
export function AnimatedSection({ children, delay = 0, className }: AnimatedSectionProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 30 }}
      transition={{
        duration: 1.2,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      viewport={{ once: false, amount: 0.15 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {children}
    </motion.div>
  );
}
