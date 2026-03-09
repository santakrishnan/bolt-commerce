"use client";

import { Button, cn } from "@tfs-ucmp/ui";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { customerJourneySlides } from "./carousel-data";

export interface PromotionFlags {
  showPrequalifyBanner: boolean;
  showTestDriveBanner: boolean;
  showTradeInBanner: boolean;
  carouselAnimationVariant?: number;
  reverseTextAnimation?: boolean;
}

interface AnimatingCarouselProps {
  className?: string;
  flags: PromotionFlags;
}

type Direction = 1 | -1;

interface StyleState {
  opacity: number;
  transform: string;
  transition: string;
  filter: string;
}

interface StaggerElementStyle {
  opacity: number;
  transform: string;
  transition: string;
}

interface StaggerStyles {
  title: StaggerElementStyle;
  subtitle: StaggerElementStyle;
  button: StaggerElementStyle;
}

const SLIDE_INTERVAL = 5000;
const EXIT_DURATION = 600;
const ENTER_DURATION = 600;
const STAGGER_DELAY = 150;

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

const DEFAULT_STAGGER_VISIBLE: StaggerStyles = {
  title: { opacity: 1, transform: "none", transition: "none" },
  subtitle: { opacity: 1, transform: "none", transition: "none" },
  button: { opacity: 1, transform: "none", transition: "none" },
};

// ============ DIRECTION HELPERS ============

function reverseDirection(dir: Direction): Direction {
  if (dir === 1) {
    return -1;
  }
  return 1;
}

function getEffectiveDirection(dir: Direction, shouldReverse: boolean): Direction {
  if (shouldReverse) {
    return reverseDirection(dir);
  }
  return dir;
}

// ============ TRANSFORM HELPERS ============

function getImageExitTransform(variant: number, dir: Direction): string {
  switch (variant) {
    case 1:
      return `translateX(${dir === 1 ? "-80px" : "80px"})`;
    case 2:
      return "scale(0.9)";
    case 3:
      return "translateY(-60px)";
    case 4:
      return "scale(0.95)";
    case 5:
      return `translateX(${dir === 1 ? "-100px" : "100px"})`;
    case 6:
      return "scale(1.1)";
    case 7:
      return "scale(0.85)";
    default:
      return "none";
  }
}

function getImageEnterStartTransform(variant: number, dir: Direction): string {
  switch (variant) {
    case 1:
      return `translateX(${dir === 1 ? "80px" : "-80px"})`;
    case 2:
      return "scale(1.1)";
    case 3:
      return "translateY(60px)";
    case 4:
      return "scale(1.05)";
    case 5:
      return `translateX(${dir === 1 ? "100px" : "-100px"})`;
    case 6:
      return "scale(1.15)";
    case 7:
      return "scale(1.2)";
    default:
      return "none";
  }
}

function getTextExitTransform(variant: number, dir: Direction, reverse: boolean): string {
  const effectiveDir = getEffectiveDirection(dir, reverse);

  switch (variant) {
    case 1:
      return `translateX(${effectiveDir === 1 ? "-60px" : "60px"})`;
    case 2:
      return "scale(0.95) translateY(-20px)";
    case 3:
      return `translateY(${effectiveDir === 1 ? "-40px" : "40px"})`;
    case 4:
      return "translateY(-30px)";
    case 5:
      return `translateX(${effectiveDir === 1 ? "80px" : "-80px"})`;
    case 6:
      return "translateY(-40px)";
    case 7:
      return "scale(0.9)";
    default:
      return "none";
  }
}

function getTextEnterStartTransform(variant: number, dir: Direction, reverse: boolean): string {
  const effectiveDir = getEffectiveDirection(dir, reverse);

  switch (variant) {
    case 1:
      return `translateX(${effectiveDir === 1 ? "60px" : "-60px"})`;
    case 2:
      return "scale(1.05) translateY(20px)";
    case 3:
      return `translateY(${effectiveDir === 1 ? "40px" : "-40px"})`;
    case 4:
      return "translateY(40px)";
    case 5:
      return `translateX(${effectiveDir === 1 ? "-80px" : "80px"})`;
    case 6:
      return "translateY(50px)";
    case 7:
      return "scale(1.15)";
    default:
      return "none";
  }
}

function getExitFilter(variant: number): string {
  return variant === 6 ? "blur(4px)" : "none";
}

function getEnterStartFilter(variant: number): string {
  return variant === 6 ? "blur(8px)" : "none";
}

function getTransition(variant: number, phase: "exit" | "enter"): string {
  const duration = phase === "exit" ? EXIT_DURATION : ENTER_DURATION;

  switch (variant) {
    case 6:
      return `opacity ${duration + 200}ms ease-out, transform ${duration + 200}ms ease-out, filter ${duration}ms ease-out`;
    case 7:
      return `opacity ${duration}ms ease-out, transform ${duration}ms cubic-bezier(0.68, -0.55, 0.265, 1.55)`;
    default:
      return `opacity ${duration}ms ease-out, transform ${duration}ms ease-out, filter ${duration}ms ease-out`;
  }
}

function calculateDirection(targetIndex: number, currentIdx: number, numSlides: number): Direction {
  if (targetIndex === 0 && currentIdx === numSlides - 1) {
    return 1;
  }
  if (targetIndex === numSlides - 1 && currentIdx === 0) {
    return -1;
  }
  return targetIndex > currentIdx ? 1 : -1;
}

function computeTextOpacity(
  isStaggerVariant: boolean,
  activeContainer: "A" | "B",
  container: "A" | "B",
  fallbackOpacity: number
): number {
  if (!isStaggerVariant) {
    return fallbackOpacity;
  }
  return activeContainer === container ? 1 : 0;
}

// ============ STAGGER ANIMATION HOOK ============

function useStaggerAnimation() {
  const [staggerStyles, setStaggerStyles] = useState<StaggerStyles>(DEFAULT_STAGGER_VISIBLE);

  const resetStaggerStyles = useCallback((visible: boolean) => {
    setStaggerStyles({
      title: {
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(30px)",
        transition: "none",
      },
      subtitle: {
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(30px)",
        transition: "none",
      },
      button: {
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(30px) scale(0.95)",
        transition: "none",
      },
    });
  }, []);

  const animateStaggerIn = useCallback(() => {
    const baseTransition = `opacity ${ENTER_DURATION}ms ease-out, transform ${ENTER_DURATION}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;

    setTimeout(() => {
      setStaggerStyles((prev) => ({
        ...prev,
        title: { opacity: 1, transform: "none", transition: baseTransition },
      }));
    }, 0);

    setTimeout(() => {
      setStaggerStyles((prev) => ({
        ...prev,
        subtitle: { opacity: 1, transform: "none", transition: baseTransition },
      }));
    }, STAGGER_DELAY);

    setTimeout(() => {
      setStaggerStyles((prev) => ({
        ...prev,
        button: {
          opacity: 1,
          transform: "none",
          transition: `opacity ${ENTER_DURATION}ms ease-out, transform ${ENTER_DURATION}ms cubic-bezier(0.34, 1.56, 0.64, 1)`,
        },
      }));
    }, STAGGER_DELAY * 2);
  }, []);

  const animateStaggerOut = useCallback(() => {
    const baseTransition = `opacity ${EXIT_DURATION * 0.7}ms ease-in, transform ${EXIT_DURATION * 0.7}ms ease-in`;

    setStaggerStyles((prev) => ({
      ...prev,
      button: {
        opacity: 0,
        transform: "translateY(-20px) scale(0.95)",
        transition: baseTransition,
      },
    }));

    setTimeout(() => {
      setStaggerStyles((prev) => ({
        ...prev,
        subtitle: {
          opacity: 0,
          transform: "translateY(-20px)",
          transition: baseTransition,
        },
      }));
    }, 50);

    setTimeout(() => {
      setStaggerStyles((prev) => ({
        ...prev,
        title: {
          opacity: 0,
          transform: "translateY(-20px)",
          transition: baseTransition,
        },
      }));
    }, 100);
  }, []);

  return {
    staggerStyles,
    resetStaggerStyles,
    animateStaggerIn,
    animateStaggerOut,
  };
}

// ============ CONTAINER STYLES HOOK ============

interface ContainerStylesState {
  containerAStyle: StyleState;
  containerBStyle: StyleState;
  textAStyle: StyleState;
  textBStyle: StyleState;
  setContainerAStyle: React.Dispatch<React.SetStateAction<StyleState>>;
  setContainerBStyle: React.Dispatch<React.SetStateAction<StyleState>>;
  setTextAStyle: React.Dispatch<React.SetStateAction<StyleState>>;
  setTextBStyle: React.Dispatch<React.SetStateAction<StyleState>>;
}

function useContainerStyles(): ContainerStylesState {
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
  variant: number;
  reverseTextAnimation: boolean;
  numSlides: number;
  containerStyles: ContainerStylesState;
  staggerAnimation: ReturnType<typeof useStaggerAnimation>;
}

function useSlideTransition({
  variant,
  reverseTextAnimation,
  numSlides,
  containerStyles,
  staggerAnimation,
}: UseSlideTransitionProps) {
  const [containerAIndex, setContainerAIndex] = useState(0);
  const [containerBIndex, setContainerBIndex] = useState<number | null>(null);
  const [activeContainer, setActiveContainer] = useState<"A" | "B">("A");

  const isAnimatingRef = useRef(false);

  const { setContainerAStyle, setContainerBStyle, setTextAStyle, setTextBStyle } = containerStyles;

  const { resetStaggerStyles, animateStaggerIn, animateStaggerOut } = staggerAnimation;

  const currentVisibleIndex = activeContainer === "A" ? containerAIndex : containerBIndex;
  const isStaggered = variant === 4;

  const performTransitionToB = useCallback(
    (targetIndex: number, adjustedDir: Direction) => {
      const exitDuration = isStaggered ? EXIT_DURATION * 0.8 : EXIT_DURATION;

      setContainerBStyle({
        opacity: 0,
        transform: getImageEnterStartTransform(variant, adjustedDir),
        transition: "none",
        filter: getEnterStartFilter(variant),
      });
      setTextBStyle({
        opacity: 0,
        transform: getTextEnterStartTransform(variant, adjustedDir, reverseTextAnimation),
        transition: "none",
        filter: getEnterStartFilter(variant),
      });
      setContainerBIndex(targetIndex);

      if (isStaggered) {
        resetStaggerStyles(false);
      }

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setContainerAStyle({
            opacity: 0,
            transform: getImageExitTransform(variant, adjustedDir),
            transition: getTransition(variant, "exit"),
            filter: getExitFilter(variant),
          });
          setTextAStyle({
            opacity: 0,
            transform: getTextExitTransform(variant, adjustedDir, reverseTextAnimation),
            transition: getTransition(variant, "exit"),
            filter: getExitFilter(variant),
          });

          if (isStaggered) {
            animateStaggerOut();
          }
        });
      });

      setTimeout(() => {
        setContainerBStyle({
          opacity: 1,
          transform: "none",
          transition: getTransition(variant, "enter"),
          filter: "none",
        });

        if (isStaggered) {
          setTextBStyle({
            opacity: 1,
            transform: "none",
            transition: "none",
            filter: "none",
          });
          animateStaggerIn();
        } else {
          setTextBStyle({
            opacity: 1,
            transform: "none",
            transition: getTransition(variant, "enter"),
            filter: "none",
          });
        }

        setActiveContainer("B");

        setTimeout(
          () => {
            setContainerAStyle({ ...DEFAULT_HIDDEN_STYLE });
            setTextAStyle({ ...DEFAULT_HIDDEN_STYLE });
            isAnimatingRef.current = false;
          },
          ENTER_DURATION + (isStaggered ? STAGGER_DELAY * 3 : 0)
        );
      }, exitDuration);
    },
    [
      variant,
      reverseTextAnimation,
      isStaggered,
      setContainerAStyle,
      setContainerBStyle,
      setTextAStyle,
      setTextBStyle,
      resetStaggerStyles,
      animateStaggerIn,
      animateStaggerOut,
    ]
  );

  const performTransitionToA = useCallback(
    (targetIndex: number, adjustedDir: Direction) => {
      const exitDuration = isStaggered ? EXIT_DURATION * 0.8 : EXIT_DURATION;

      setContainerAStyle({
        opacity: 0,
        transform: getImageEnterStartTransform(variant, adjustedDir),
        transition: "none",
        filter: getEnterStartFilter(variant),
      });
      setTextAStyle({
        opacity: 0,
        transform: getTextEnterStartTransform(variant, adjustedDir, reverseTextAnimation),
        transition: "none",
        filter: getEnterStartFilter(variant),
      });
      setContainerAIndex(targetIndex);

      if (isStaggered) {
        resetStaggerStyles(false);
      }

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setContainerBStyle({
            opacity: 0,
            transform: getImageExitTransform(variant, adjustedDir),
            transition: getTransition(variant, "exit"),
            filter: getExitFilter(variant),
          });
          setTextBStyle({
            opacity: 0,
            transform: getTextExitTransform(variant, adjustedDir, reverseTextAnimation),
            transition: getTransition(variant, "exit"),
            filter: getExitFilter(variant),
          });

          if (isStaggered) {
            animateStaggerOut();
          }
        });
      });

      setTimeout(() => {
        setContainerAStyle({
          opacity: 1,
          transform: "none",
          transition: getTransition(variant, "enter"),
          filter: "none",
        });

        if (isStaggered) {
          setTextAStyle({
            opacity: 1,
            transform: "none",
            transition: "none",
            filter: "none",
          });
          animateStaggerIn();
        } else {
          setTextAStyle({
            opacity: 1,
            transform: "none",
            transition: getTransition(variant, "enter"),
            filter: "none",
          });
        }

        setActiveContainer("A");

        setTimeout(
          () => {
            setContainerBStyle({ ...DEFAULT_HIDDEN_STYLE });
            setTextBStyle({ ...DEFAULT_HIDDEN_STYLE });
            isAnimatingRef.current = false;
          },
          ENTER_DURATION + (isStaggered ? STAGGER_DELAY * 3 : 0)
        );
      }, exitDuration);
    },
    [
      variant,
      reverseTextAnimation,
      isStaggered,
      setContainerAStyle,
      setContainerBStyle,
      setTextAStyle,
      setTextBStyle,
      resetStaggerStyles,
      animateStaggerIn,
      animateStaggerOut,
    ]
  );

  const goToSlide = useCallback(
    (targetIndex: number) => {
      if (isAnimatingRef.current || targetIndex === currentVisibleIndex || numSlides <= 1) {
        return;
      }

      isAnimatingRef.current = true;

      const currentIdx = currentVisibleIndex ?? 0;
      const adjustedDir = calculateDirection(targetIndex, currentIdx, numSlides);

      if (activeContainer === "A") {
        performTransitionToB(targetIndex, adjustedDir);
      } else {
        performTransitionToA(targetIndex, adjustedDir);
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
  const {
    showPrequalifyBanner,
    showTestDriveBanner,
    showTradeInBanner,
    carouselAnimationVariant = 0,
    reverseTextAnimation = false,
  } = flags;

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
  const variant = carouselAnimationVariant % 8;
  const isStaggerVariant = variant === 4;

  const containerStyles = useContainerStyles();
  const staggerAnimation = useStaggerAnimation();

  const {
    containerAIndex,
    containerBIndex,
    activeContainer,
    currentVisibleIndex,
    goToSlide,
    isAnimatingRef,
  } = useSlideTransition({
    variant,
    reverseTextAnimation,
    numSlides,
    containerStyles,
    staggerAnimation,
  });

  const { containerAStyle, containerBStyle, textAStyle, textBStyle } = containerStyles;
  const { staggerStyles } = staggerAnimation;

  // Auto-advance timer
  useEffect(() => {
    if (numSlides <= 1) {
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
  }, [currentVisibleIndex, numSlides, goToSlide, isAnimatingRef]);

  if (numSlides === 0) {
    return null;
  }

  if (numSlides === 1) {
    return <SingleSlideCarousel className={className} slide={filteredSlides[0]} />;
  }

  const slideA = filteredSlides[containerAIndex];
  const slideB = containerBIndex !== null ? filteredSlides[containerBIndex] : null;

  const textAOpacity = computeTextOpacity(
    isStaggerVariant,
    activeContainer,
    "A",
    textAStyle.opacity
  );
  const textBOpacity = computeTextOpacity(
    isStaggerVariant,
    activeContainer,
    "B",
    textBStyle.opacity
  );

  return (
    <div
      className={cn("relative w-full bg-black", className)}
      style={{ borderRadius: "var(--radius-xl, 16px)" }}
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
          isStaggerVariant={isStaggerVariant}
          opacity={textAOpacity}
          slide={slideA}
          staggerStyles={isStaggerVariant && activeContainer === "A" ? staggerStyles : undefined}
          style={textAStyle}
          zIndex={activeContainer === "A" ? 25 : 20}
        />

        {slideB && (
          <TextContainer
            isActive={activeContainer === "B"}
            isStaggerVariant={isStaggerVariant}
            opacity={textBOpacity}
            slide={slideB}
            staggerStyles={isStaggerVariant && activeContainer === "B" ? staggerStyles : undefined}
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
    </div>
  );
}

// ============ SUB-COMPONENTS ============

interface SingleSlideCarouselProps {
  className?: string;
  slide: (typeof customerJourneySlides)[0];
}

function SingleSlideCarousel({ className, slide }: SingleSlideCarouselProps) {
  return (
    <div className={cn("relative w-full", className)}>
      <div className="relative h-[460px] w-full overflow-hidden rounded-xl sm:h-[400px] lg:h-[500px]">
        <SlideContent slide={slide} />
        <GradientOverlays />
        <div className="absolute inset-0" style={{ zIndex: 25 }}>
          <TextContent slide={slide} />
        </div>
      </div>
    </div>
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
        className="absolute inset-x-0 bottom-[260px] h-32 bg-gradient-to-b from-transparent to-black sm:hidden"
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
  opacity: number;
  zIndex: number;
  isStaggerVariant: boolean;
  isActive: boolean;
  slide: (typeof customerJourneySlides)[0];
  staggerStyles?: StaggerStyles;
}

function TextContainer({
  style,
  opacity,
  zIndex,
  isStaggerVariant,
  isActive,
  slide,
  staggerStyles,
}: TextContainerProps) {
  const transform = isStaggerVariant ? "none" : style.transform;
  const transition = isStaggerVariant ? "opacity 300ms ease-out" : style.transition;
  const pointerEvents = isActive ? "auto" : "none";

  return (
    <div
      className="absolute inset-0 will-change-transform"
      style={{
        zIndex,
        opacity,
        transform,
        transition,
        filter: style.filter,
        pointerEvents,
      }}
    >
      <TextContent slide={slide} staggerStyles={staggerStyles} />
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
        <div className="relative h-[200px] w-full flex-shrink-0">
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
  staggerStyles?: StaggerStyles;
}

function TextContent({ slide, staggerStyles }: TextContentProps) {
  const defaultStyle = { opacity: 1, transform: "none", transition: "none" };
  const titleStyle = staggerStyles?.title ?? defaultStyle;
  const subtitleStyle = staggerStyles?.subtitle ?? defaultStyle;
  const buttonStyle = staggerStyles?.button ?? defaultStyle;

  return (
    <div className="h-full w-full">
      <div className="flex h-full w-full flex-col sm:hidden">
        <div className="h-[200px] w-full flex-shrink-0" />
        <div className="flex flex-1 flex-col justify-start px-6 pt-6 text-center text-white">
          <h2 className="mb-3 font-bold text-xl uppercase will-change-transform" style={titleStyle}>
            {slide.title}
          </h2>
          <p className="mb-6 text-sm leading-relaxed will-change-transform" style={subtitleStyle}>
            {slide.subtitle}
          </p>
          <div className="will-change-transform" style={buttonStyle}>
            <Button className="w-full rounded-full px-8" size="lg">
              {slide.ctaText}
            </Button>
          </div>
        </div>
      </div>

      <div className="relative hidden h-full w-full sm:block">
        <div className="absolute inset-0 flex w-1/2 flex-col items-start justify-center gap-6 px-12 text-white lg:px-16 xl:w-[40%]">
          <h2
            className="font-bold text-3xl uppercase leading-tight will-change-transform lg:text-4xl"
            style={titleStyle}
          >
            {slide.title}
          </h2>
          <p
            className="font-semibold text-sm leading-relaxed will-change-transform lg:text-base"
            style={subtitleStyle}
          >
            {slide.subtitle}
          </p>
          <div className="will-change-transform" style={buttonStyle}>
            <Button className="rounded-full px-8" size="lg">
              {slide.ctaText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
