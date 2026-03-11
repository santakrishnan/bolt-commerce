"use client";

import { Button, cn } from "@tfs-ucmp/ui";
import { motion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { customerJourneySlides } from "./carousel-data";

export interface PromotionFlags {
  showPrequalifyBanner: boolean;
  showTestDriveBanner: boolean;
  showTradeInBanner: boolean;
}

interface AnimatingCarouselProps {
  className?: string;
  flags: PromotionFlags;
}

interface StyleState {
  opacity: number;
  transform: string;
  transition: string;
  filter: string;
}

const SLIDE_INTERVAL = 5000;
const EXIT_DURATION = 600;
const ENTER_DURATION = 600;

const DEFAULT_VISIBLE_STYLE: StyleState = {
  opacity: 1,
  transform: "none",
  transition: "none",
  filter: "none",
};

const DEFAULT_HIDDEN_STYLE: StyleState = {
  opacity: 0,
  transform: "none",
  transition: "none",
  filter: "none",
};

// ============ ANIMATION HELPERS ============

const getImageExitTransform = (): string => "scale(1.1)";
const getImageEnterStartTransform = (): string => "scale(1.15)";
const getTextExitTransform = (): string => "translateY(-40px)";
const getTextEnterStartTransform = (): string => "translateY(50px)";
const getExitFilter = (): string => "blur(4px)";
const getEnterStartFilter = (): string => "blur(8px)";

function getTransition(phase: "exit" | "enter"): string {
  const duration = phase === "exit" ? EXIT_DURATION : ENTER_DURATION;
  return `opacity ${duration + 200}ms ease-out, transform ${duration + 200}ms ease-out, filter ${duration}ms ease-out`;
}

// ============ CONTAINER STYLES HOOK ============

function useContainerStyles() {
  const [containerAStyle, setContainerAStyle] = useState<StyleState>(DEFAULT_VISIBLE_STYLE);
  const [containerBStyle, setContainerBStyle] = useState<StyleState>(DEFAULT_HIDDEN_STYLE);
  const [textAStyle, setTextAStyle] = useState<StyleState>(DEFAULT_VISIBLE_STYLE);
  const [textBStyle, setTextBStyle] = useState<StyleState>(DEFAULT_HIDDEN_STYLE);

  return {
    containerAStyle,
    containerBStyle,
    textAStyle,
    textBStyle,
    setContainerAStyle,
    setContainerBStyle,
    setTextAStyle,
    setTextBStyle,
  };
}

// ============ SLIDE TRANSITION HOOK ============

interface UseSlideTransitionProps {
  numSlides: number;
  containerStyles: ReturnType<typeof useContainerStyles>;
}

function useSlideTransition({ numSlides, containerStyles }: UseSlideTransitionProps) {
  const [containerAIndex, setContainerAIndex] = useState(0);
  const [containerBIndex, setContainerBIndex] = useState<number | null>(null);
  const [activeContainer, setActiveContainer] = useState<"A" | "B">("A");

  const isAnimatingRef = useRef(false);

  const { setContainerAStyle, setContainerBStyle, setTextAStyle, setTextBStyle } = containerStyles;

  const currentVisibleIndex = activeContainer === "A" ? containerAIndex : containerBIndex;

  const performTransitionToB = useCallback(
    (targetIndex: number) => {
      setContainerBStyle({
        opacity: 0,
        transform: getImageEnterStartTransform(),
        transition: "none",
        filter: getEnterStartFilter(),
      });
      setTextBStyle({
        opacity: 0,
        transform: getTextEnterStartTransform(),
        transition: "none",
        filter: getEnterStartFilter(),
      });
      setContainerBIndex(targetIndex);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setContainerAStyle({
            opacity: 0,
            transform: getImageExitTransform(),
            transition: getTransition("exit"),
            filter: getExitFilter(),
          });
          setTextAStyle({
            opacity: 0,
            transform: getTextExitTransform(),
            transition: getTransition("exit"),
            filter: getExitFilter(),
          });
        });
      });

      setTimeout(() => {
        setContainerBStyle({
          opacity: 1,
          transform: "none",
          transition: getTransition("enter"),
          filter: "none",
        });
        setTextBStyle({
          opacity: 1,
          transform: "none",
          transition: getTransition("enter"),
          filter: "none",
        });

        setActiveContainer("B");

        setTimeout(() => {
          setContainerAStyle({ ...DEFAULT_HIDDEN_STYLE });
          setTextAStyle({ ...DEFAULT_HIDDEN_STYLE });
          isAnimatingRef.current = false;
        }, ENTER_DURATION);
      }, EXIT_DURATION);
    },
    [setContainerAStyle, setContainerBStyle, setTextAStyle, setTextBStyle]
  );

  const performTransitionToA = useCallback(
    (targetIndex: number) => {
      setContainerAStyle({
        opacity: 0,
        transform: getImageEnterStartTransform(),
        transition: "none",
        filter: getEnterStartFilter(),
      });
      setTextAStyle({
        opacity: 0,
        transform: getTextEnterStartTransform(),
        transition: "none",
        filter: getEnterStartFilter(),
      });
      setContainerAIndex(targetIndex);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setContainerBStyle({
            opacity: 0,
            transform: getImageExitTransform(),
            transition: getTransition("exit"),
            filter: getExitFilter(),
          });
          setTextBStyle({
            opacity: 0,
            transform: getTextExitTransform(),
            transition: getTransition("exit"),
            filter: getExitFilter(),
          });
        });
      });

      setTimeout(() => {
        setContainerAStyle({
          opacity: 1,
          transform: "none",
          transition: getTransition("enter"),
          filter: "none",
        });
        setTextAStyle({
          opacity: 1,
          transform: "none",
          transition: getTransition("enter"),
          filter: "none",
        });

        setActiveContainer("A");

        setTimeout(() => {
          setContainerBStyle({ ...DEFAULT_HIDDEN_STYLE });
          setTextBStyle({ ...DEFAULT_HIDDEN_STYLE });
          isAnimatingRef.current = false;
        }, ENTER_DURATION);
      }, EXIT_DURATION);
    },
    [setContainerAStyle, setContainerBStyle, setTextAStyle, setTextBStyle]
  );

  const goToSlide = useCallback(
    (targetIndex: number) => {
      if (isAnimatingRef.current || targetIndex === currentVisibleIndex || numSlides <= 1) {
        return;
      }

      isAnimatingRef.current = true;

      if (activeContainer === "A") {
        performTransitionToB(targetIndex);
      } else {
        performTransitionToA(targetIndex);
      }
    },
    [currentVisibleIndex, numSlides, activeContainer, performTransitionToA, performTransitionToB]
  );

  return {
    containerAIndex,
    containerBIndex,
    activeContainer,
    currentVisibleIndex,
    goToSlide,
    isAnimatingRef,
  };
}

// ============ MAIN COMPONENT ============

export function CustomerJourneyCarousel({ className, flags }: AnimatingCarouselProps) {
  const { showPrequalifyBanner, showTestDriveBanner, showTradeInBanner } = flags;

  const filteredSlides = useMemo(() => {
    return customerJourneySlides.filter((slide) => {
      if (slide.id === "prequalify" && !showPrequalifyBanner) {
        return false;
      }
      if (slide.id === "trade-in" && !showTradeInBanner) {
        return false;
      }
      if (slide.id === "test-drive" && !showTestDriveBanner) {
        return false;
      }
      return true;
    });
  }, [showPrequalifyBanner, showTestDriveBanner, showTradeInBanner]);

  const numSlides = filteredSlides.length;

  const containerStyles = useContainerStyles();

  const {
    containerAIndex,
    containerBIndex,
    activeContainer,
    currentVisibleIndex,
    goToSlide,
    isAnimatingRef,
  } = useSlideTransition({
    numSlides,
    containerStyles,
  });

  const { containerAStyle, containerBStyle, textAStyle, textBStyle } = containerStyles;

  // Track if carousel is fully visible
  const [isFullyVisible, setIsFullyVisible] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Intersection observer to detect when carousel bottom is fully visible
  useEffect(() => {
    const element = carouselRef.current;
    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) {
          return;
        }

        // Check if the bottom of the carousel is visible
        const rect = entry.boundingClientRect;
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

        // The bottom is visible when it's above the viewport bottom
        const bottomIsVisible = rect.bottom <= viewportHeight;

        // Also ensure the element is actually intersecting (not scrolled past)
        const isIntersecting = entry.isIntersecting;

        // Require high intersection ratio to ensure most/all of carousel is visible
        const isMostlyVisible = entry.intersectionRatio >= 0.85;

        // Only start animation when bottom is visible AND element is intersecting AND mostly visible
        // Once visible, keep it visible (don't reset to false)
        if (bottomIsVisible && isIntersecting && isMostlyVisible) {
          setIsFullyVisible(true);
        }
      },
      {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.85, 0.9, 0.95, 1.0],
        rootMargin: "0px",
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Auto-advance timer - only runs when fully visible
  useEffect(() => {
    if (numSlides <= 1 || !isFullyVisible) {
      return;
    }

    const timer = setTimeout(() => {
      if (!isAnimatingRef.current) {
        const current = currentVisibleIndex ?? 0;
        const next = (current + 1) % numSlides;
        goToSlide(next);
      }
    }, SLIDE_INTERVAL);

    return () => clearTimeout(timer);
  }, [currentVisibleIndex, numSlides, goToSlide, isAnimatingRef, isFullyVisible]);

  if (numSlides === 0) {
    return null;
  }

  const firstSlide = filteredSlides[0];
  if (numSlides === 1 && firstSlide) {
    return <SingleSlideCarousel className={className} slide={firstSlide} />;
  }

  const slideA = filteredSlides[containerAIndex];
  const slideB = containerBIndex !== null ? filteredSlides[containerBIndex] : null;

  // Safety check
  if (!slideA) {
    return null;
  }

  return (
    <motion.div
      animate={{ opacity: isFullyVisible ? 1 : 0 }}
      className={cn("relative w-full bg-black", className)}
      initial={{ opacity: 0 }}
      ref={carouselRef}
      style={{ borderRadius: "var(--radius-xl, 16px)" }}
      transition={{ duration: 0.6 }}
    >
      <div
        className="relative h-[460px] w-full overflow-hidden bg-black sm:h-[400px] lg:h-[500px]"
        style={{ borderRadius: "var(--radius-xl, 16px)" }}
      >
        <ImageContainer
          slide={slideA}
          style={containerAStyle}
          zIndex={activeContainer === "A" ? 10 : 5}
        />

        {slideB && (
          <ImageContainer
            slide={slideB}
            style={containerBStyle}
            zIndex={activeContainer === "B" ? 10 : 5}
          />
        )}

        <GradientOverlays />

        <TextContainer
          isActive={activeContainer === "A"}
          slide={slideA}
          style={textAStyle}
          zIndex={activeContainer === "A" ? 25 : 20}
        />

        {slideB && (
          <TextContainer
            isActive={activeContainer === "B"}
            slide={slideB}
            style={textBStyle}
            zIndex={activeContainer === "B" ? 25 : 20}
          />
        )}

        <NavigationDots
          currentIndex={currentVisibleIndex}
          onDotClick={goToSlide}
          slides={filteredSlides}
        />
      </div>
    </motion.div>
  );
}

// ============ SUB-COMPONENTS ============

interface SingleSlideCarouselProps {
  className?: string;
  slide: (typeof customerJourneySlides)[0];
}

function SingleSlideCarousel({ className, slide }: SingleSlideCarouselProps) {
  const [isFullyVisible, setIsFullyVisible] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Intersection observer to detect when carousel bottom is fully visible
  useEffect(() => {
    const element = carouselRef.current;
    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) {
          return;
        }

        const rect = entry.boundingClientRect;
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        const bottomIsVisible = rect.bottom <= viewportHeight;
        const isIntersecting = entry.isIntersecting;
        const isMostlyVisible = entry.intersectionRatio >= 0.85;

        // Once visible, keep it visible (don't reset to false)
        if (bottomIsVisible && isIntersecting && isMostlyVisible) {
          setIsFullyVisible(true);
        }
      },
      {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.85, 0.9, 0.95, 1.0],
        rootMargin: "0px",
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <motion.div
      animate={{ opacity: isFullyVisible ? 1 : 0 }}
      className={cn("relative w-full", className)}
      initial={{ opacity: 0 }}
      ref={carouselRef}
      transition={{ duration: 0.6 }}
    >
      <div className="relative h-[460px] w-full overflow-hidden rounded-xl sm:h-[400px] lg:h-[500px]">
        <SlideContent slide={slide} />
        <GradientOverlays />
        <div className="absolute inset-0" style={{ zIndex: 25 }}>
          <TextContent slide={slide} />
        </div>
      </div>
    </motion.div>
  );
}

interface ImageContainerProps {
  style: StyleState;
  zIndex: number;
  slide: (typeof customerJourneySlides)[0];
}

function ImageContainer({ style, zIndex, slide }: ImageContainerProps) {
  return (
    <div
      className="absolute inset-0 will-change-transform"
      style={{
        zIndex,
        opacity: style.opacity,
        transform: style.transform,
        transition: style.transition,
        filter: style.filter,
      }}
    >
      <SlideContent slide={slide} />
    </div>
  );
}

function GradientOverlays() {
  return (
    <>
      <div
        className="absolute inset-x-0 bottom-[260px] h-32 bg-linear-to-b from-transparent to-black sm:hidden"
        style={{ zIndex: 15, pointerEvents: "none" }}
      />
      <div
        className="absolute inset-0 hidden sm:block"
        style={{
          zIndex: 15,
          background: "linear-gradient(91.94deg, #000000 28.21%, rgba(0, 0, 0, 0) 50.16%)",
          pointerEvents: "none",
        }}
      />
    </>
  );
}

interface TextContainerProps {
  style: StyleState;
  zIndex: number;
  isActive: boolean;
  slide: (typeof customerJourneySlides)[0];
}

function TextContainer({ style, zIndex, isActive, slide }: TextContainerProps) {
  const pointerEvents = isActive ? "auto" : "none";

  return (
    <div
      className="absolute inset-0 will-change-transform"
      style={{
        zIndex,
        opacity: style.opacity,
        transform: style.transform,
        transition: style.transition,
        filter: style.filter,
        pointerEvents,
      }}
    >
      <TextContent slide={slide} />
    </div>
  );
}

interface NavigationDotsProps {
  slides: typeof customerJourneySlides;
  currentIndex: number | null;
  onDotClick: (index: number) => void;
}

function NavigationDots({ slides, currentIndex, onDotClick }: NavigationDotsProps) {
  return (
    <div className="absolute right-0 bottom-6 left-0 z-30 flex justify-center gap-3 pt-0 sm:bottom-4">
      {slides.map((slide, i) => {
        const isActive = i === currentIndex;
        return (
          <button
            aria-label={`Go to slide ${i + 1}`}
            className={cn(
              "relative flex items-center justify-center border-none bg-transparent p-0",
              "h-4 w-4", // outer circle: 16px diameter
              isActive ? "" : "cursor-pointer"
            )}
            key={slide.id}
            onClick={() => onDotClick(i)}
            type="button"
          >
            <span
              className={cn(
                "block rounded-full transition-all",
                "h-2 w-2", // inner circle: 8px diameter
                isActive
                  ? "bg-white ring-1 ring-white ring-offset-2 ring-offset-black"
                  : "bg-white/40 hover:bg-white/60"
              )}
              style={{
                borderRadius: "var(--radius-md, 8px)", // inner
              }}
            />
          </button>
        );
      })}
    </div>
  );
}

interface SlideContentProps {
  slide: (typeof customerJourneySlides)[0];
}

function SlideContent({ slide }: SlideContentProps) {
  return (
    <div className="h-full w-full">
      <div className="flex h-full w-full flex-col sm:hidden">
        <div className="relative h-[200px] w-full shrink-0">
          <Image
            alt={slide.title}
            className="object-cover"
            fill
            priority
            sizes="100vw"
            src={slide.image}
          />
        </div>
        <div className="flex-1 bg-black" />
      </div>

      <div className="relative hidden h-full w-full sm:block">
        <Image
          alt={slide.title}
          className="object-cover"
          fill
          priority
          sizes="100vw"
          src={slide.image}
        />
      </div>
    </div>
  );
}

interface TextContentProps {
  slide: (typeof customerJourneySlides)[0];
}

function TextContent({ slide }: TextContentProps) {
  return (
    <div className="h-full w-full">
      <div className="flex h-full w-full flex-col sm:hidden">
        <div className="h-[200px] w-full shrink-0" />
        <div className="flex flex-1 flex-col justify-start px-6 pt-6 text-center text-white">
          <h2 className="mb-3 font-bold text-xl uppercase will-change-transform">{slide.title}</h2>
          <p className="mb-6 text-sm leading-relaxed will-change-transform">{slide.subtitle}</p>
          <div className="will-change-transform">
            <Button className="w-full rounded-full px-8" size="lg">
              {slide.ctaText}
            </Button>
          </div>
        </div>
      </div>

      <div className="relative hidden h-full w-full sm:block">
        <div className="absolute inset-0 flex w-1/2 flex-col items-start justify-center gap-6 px-12 text-white lg:px-16 xl:w-[40%]">
          <h2 className="font-bold text-3xl uppercase leading-tight will-change-transform lg:text-4xl">
            {slide.title}
          </h2>
          <p className="font-semibold text-sm leading-relaxed will-change-transform lg:text-base">
            {slide.subtitle}
          </p>
          <div className="will-change-transform">
            <Button className="rounded-full px-8" size="lg">
              {slide.ctaText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
