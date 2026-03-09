"use client";

import { Card, CardContent, cn } from "@tfs-ucmp/ui";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

interface ProcessStep {
  icon: "refresh" | "search" | "shield" | "clipboard";
  title: string;
  description: string;
  linkText?: string;
  linkHref?: string;
}

interface BuyingProcessCarouselProps {
  steps: ProcessStep[];
}

const iconMap = {
  refresh: "/images/buying-process/Subtract.svg",
  search: "/images/buying-process/SearchIcon.png",
  shield: "/images/buying-process/ShieldCheck.png",
  clipboard: "/images/buying-process/ClipBoard.png",
};

export function BuyingProcessCarousel({ steps }: BuyingProcessCarouselProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const touchStartX = React.useRef(0);
  const touchEndX = React.useRef(0);
  const isSwiping = React.useRef(false);

  const goToSlide = React.useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const handleTouchStart = React.useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    if (!touch) {
      return;
    }
    touchStartX.current = touch.clientX;
    isSwiping.current = true;
  }, []);

  const handleTouchMove = React.useCallback((e: TouchEvent) => {
    if (!isSwiping.current) {
      return;
    }
    const touch = e.touches[0];
    if (!touch) {
      return;
    }
    touchEndX.current = touch.clientX;
  }, []);

  const handleTouchEnd = React.useCallback(() => {
    if (!isSwiping.current) {
      return;
    }
    isSwiping.current = false;

    const swipeDistance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (swipeDistance > minSwipeDistance && currentIndex < steps.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else if (swipeDistance < -minSwipeDistance && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex, steps.length]);

  React.useEffect(() => {
    const element = containerRef.current;
    if (!element) {
      return;
    }

    element.addEventListener("touchstart", handleTouchStart, { passive: true });
    element.addEventListener("touchmove", handleTouchMove, { passive: true });
    element.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener("touchstart", handleTouchStart);
      element.removeEventListener("touchmove", handleTouchMove);
      element.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  const getTransform = React.useCallback(() => {
    if (!containerRef.current) {
      return "translateX(0)";
    }
    const containerWidth = containerRef.current.offsetWidth;
    const cardWidth = containerWidth * 0.9;
    const gap = 16;
    const offset = currentIndex * (cardWidth + gap);
    // Center the current card
    const centerOffset = (containerWidth - cardWidth) / 2;
    return `translateX(${centerOffset - offset}px)`;
  }, [currentIndex]);

  return (
    <div className="w-full">
      <div className="hidden grid-cols-2 gap-[var(--spacing-xs)] lg:grid lg:grid-cols-4 lg:gap-[var(--spacing-md)]">
        {steps.map((step, _index) => {
          const iconSrc = iconMap[step.icon];
          return (
            <Card
              className={cn("group h-full rounded-md border-0 bg-card shadow-lg")}
              key={step.title}
            >
              <CardContent className="flex h-full flex-col items-center px-[var(--spacing-sm)] py-[var(--spacing-lg)] text-center">
                <div className="mb-[var(--spacing-lg)] flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 sm:mb-[var(--spacing-5)]">
                  <Image
                    alt={step.title}
                    className="flex-shrink-0"
                    height={36}
                    src={iconSrc}
                    width={36}
                  />
                </div>
                <h3 className="mb-[var(--spacing-sm)] font-semibold text-[length:var(--font-size-xl)] text-[var(--color-core-surfaces-foreground)]">
                  {step.title}
                </h3>
                <p className="text-[length:var(--font-size-sm)] text-[var(--color-core-surfaces-foreground)] leading-relaxed">
                  {step.description}
                </p>
                {step.linkText && step.linkHref && (
                  <Link
                    className="mt-auto pt-[var(--spacing-md)] font-semibold text-[length:var(--font-size-sm)] text-primary underline underline-offset-4 opacity-0 transition-opacity hover:text-primary-hover group-hover:opacity-100"
                    href={step.linkHref}
                  >
                    {step.linkText}
                  </Link>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="lg:hidden" ref={containerRef}>
        <div className="relative overflow-visible">
          <div
            className="flex gap-[var(--spacing-xs)] transition-transform duration-300 ease-in-out"
            style={{ transform: getTransform() }}
          >
            {steps.map((step, _index) => {
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
                          className="mt-auto pt-3 font-semibold text-[length:var(--font-size-sm)] text-primary underline underline-offset-4 hover:text-primary-hover"
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

        <div className="mt-6 flex justify-center gap-[var(--spacing-xs)]">
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
    </div>
  );
}
