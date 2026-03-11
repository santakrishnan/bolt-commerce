"use client";

import { Card, CardContent, cn } from "@tfs-ucmp/ui";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { ReactElement } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import config from "./buying-process-config.json";
import { getCarouselTransform } from "./carousel-transform";
import type { ProcessStep } from "./types";

interface BuyingProcessCarouselProps {
  steps: ProcessStep[];
}

const iconMap = config.iconPaths;

const PASSIVE_LISTENER_OPTIONS = { passive: true } as const;

export function BuyingProcessCarousel({ steps }: BuyingProcessCarouselProps): ReactElement {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const isSwiping = useRef(false);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const handleTouchStart = useCallback((e: TouchEvent): void => {
    const touch = e.touches[0];
    if (!touch) {
      return;
    }
    touchStartX.current = touch.clientX;
    isSwiping.current = true;
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent): void => {
    if (!isSwiping.current) {
      return;
    }
    const touch = e.touches[0];
    if (!touch) {
      return;
    }
    touchEndX.current = touch.clientX;
  }, []);

  const handleTouchEnd = useCallback((): void => {
    if (!isSwiping.current) {
      return;
    }
    isSwiping.current = false;

    const swipeDistance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = config.carousel.minSwipeDistance;

    if (swipeDistance > minSwipeDistance && currentIndex < steps.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else if (swipeDistance < -minSwipeDistance && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex, steps.length]);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) {
      return;
    }

    element.addEventListener("touchstart", handleTouchStart, PASSIVE_LISTENER_OPTIONS);
    element.addEventListener("touchmove", handleTouchMove, PASSIVE_LISTENER_OPTIONS);
    element.addEventListener("touchend", handleTouchEnd, PASSIVE_LISTENER_OPTIONS);

    return () => {
      element.removeEventListener("touchstart", handleTouchStart);
      element.removeEventListener("touchmove", handleTouchMove);
      element.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      whileInView={{ opacity: 1 }}
    >
      <div ref={containerRef}>
        <div className="relative overflow-visible">
          <div
            className="flex gap-[var(--spacing-xs)] transition-transform duration-300 ease-in-out"
            style={{ transform: getCarouselTransform(containerRef, currentIndex) }}
          >
            {steps.map((step) => {
              const iconSrc = iconMap[step.icon];
              return (
                <div className="w-[90%] flex-shrink-0" key={step.title}>
                  <Card className="group h-full border-0 bg-card shadow-lg">
                    <CardContent className="flex h-full flex-col items-center px-[var(--spacing-md)] py-[var(--spacing-5)] text-center">
                      <div className="mb-[var(--spacing-md)] flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                        <Image
                          alt={step.title}
                          className="flex-shrink-0"
                          height={36}
                          src={iconSrc}
                          width={36}
                        />
                      </div>
                      <h3 className="mb-[var(--spacing-sm)] font-semibold text-[var(--color-core-surfaces-foreground)] text-base">
                        {step.title}
                      </h3>
                      <p className="text-[length:var(--font-size-sm)] text-[var(--color-core-surfaces-foreground)] leading-relaxed">
                        {step.description}
                      </p>
                      {step.linkText && step.linkHref && (
                        <Link
                          className="mt-auto pt-[var(--spacing-sm)] font-semibold text-[length:var(--font-size-sm)] text-primary underline underline-offset-4 hover:text-primary-hover"
                          href={step.linkHref}
                        >
                          {step.linkText}
                        </Link>
                      )}
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-[var(--spacing-lg)] flex justify-center gap-[var(--spacing-xs)]">
          {steps.map((step, index) => (
            <button
              aria-label={`Go to step ${index + 1}`}
              className={cn(
                "h-2 w-2 rounded-full transition-all",
                index === currentIndex
                  ? "bg-background ring-2 ring-background ring-offset-2 ring-offset-foreground"
                  : "bg-background/40 hover:bg-background/60"
              )}
              key={step.title}
              onClick={() => goToSlide(index)}
              type="button"
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
