"use client";

import { cn } from "@tfs-ucmp/ui";
import Image from "next/image";
import * as React from "react";

export interface CarouselSlide {
  src: string;
  srcMobile?: string;
  alt: string;
  headline?: string;
  objectPosition?: string;
}

interface HomeHeroCarouselProps {
  slides: CarouselSlide[];
  autoAdvanceMs?: number;
  pauseOnHover?: boolean;
}

export function HomeHeroCarousel({
  slides,
  autoAdvanceMs = 10_000,
  pauseOnHover = true,
}: HomeHeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);

  React.useEffect(() => {
    if (isPaused || slides.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, autoAdvanceMs);

    return () => clearInterval(interval);
  }, [isPaused, slides.length, autoAdvanceMs]);

  const _goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section aria-label="Image carousel" className="absolute inset-0">
      <button
        aria-label="Carousel - focus or hover to pause"
        className="absolute inset-0 h-full w-full cursor-default border-0 bg-transparent p-0"
        onBlur={() => pauseOnHover && setIsPaused(false)}
        onFocus={() => pauseOnHover && setIsPaused(true)}
        onMouseEnter={() => pauseOnHover && setIsPaused(true)}
        onMouseLeave={() => pauseOnHover && setIsPaused(false)}
        tabIndex={-1}
        type="button"
      >
        {slides.map((slide, index) => (
          <div
            className={cn(
              "absolute inset-0 transition-opacity duration-1000",
              index === currentIndex ? "opacity-100" : "opacity-0"
            )}
            key={slide.src}
          >
            {slide.srcMobile && (
              <Image
                alt={slide.alt}
                className="object-cover md:hidden"
                fill
                priority={index === 0}
                sizes="100vw"
                src={slide.srcMobile}
                style={{ objectPosition: slide.objectPosition ?? "center" }}
              />
            )}
            <Image
              alt={slide.alt}
              className={cn("object-cover", slide.srcMobile && "hidden md:block")}
              fill
              priority={index === 0}
              sizes="100vw"
              src={slide.src}
              style={{ objectPosition: slide.objectPosition ?? "center" }}
            />
          </div>
        ))}

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(172deg, color-mix(in srgb, var(--color-foreground) 0%, transparent) 73.89%, var(--color-foreground) 112%)",
          }}
        />
      </button>
    </section>
  );
}
