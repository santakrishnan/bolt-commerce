"use client";

import {
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
} from "@tfs-ucmp/ui";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { lockBodyScroll, unlockBodyScroll } from "~/lib/body-scroll-lock";
import type { VehicleDetail, VehicleStatusData } from "~/lib/data/vehicle";
import { capitalize } from "~/lib/formatters";
import type { VdpParams } from "~/lib/routes";
import { VehicleStatusBanners } from "./vehicle-status-banners";

interface VehiclePDPProps {
  vehicle: VehicleDetail;
  slugParams: VdpParams;
  vehicleStatus: VehicleStatusData;
}

export const VehiclePDP: React.FC<VehiclePDPProps> = ({ vehicle, slugParams, vehicleStatus }) => {
  const rightRef = useRef<HTMLDivElement | null>(null);
  const keyHighlightsRef = useRef<HTMLDivElement | null>(null);

  // --- Right sticky logic: restore original ---
  // On desktop, just use CSS sticky for right section
  // No JS needed, handled by className below

  // --- Top sticky logic: animate in as user scrolls past Key Highlights ---
  // Use a single useState for scroll offset, and only one useEffect
  const [stickyScrollOffset, setStickyScrollOffset] = useState(0);
  const [showStickyCTA, setShowStickyCTA] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down");
  const prevScrollY = useRef(0);

  // Sticky height for animation (default 72px)
  const STICKY_HEIGHT = 72;
  useEffect(() => {
    function handleScroll() {
      if (!keyHighlightsRef.current) {
        return;
      }
      const rect = keyHighlightsRef.current.getBoundingClientRect();
      const header = document.querySelector("header");
      const headerHeight = header ? header.getBoundingClientRect().height : 80;
      // If Key Highlights is above header, start animating in
      const offset = Math.max(0, headerHeight - rect.top);
      setStickyScrollOffset(offset > 0 ? offset : 0);
      setShowStickyCTA(rect.top < headerHeight);

      // Track scroll direction
      const currentY = window.scrollY;
      if (currentY > prevScrollY.current) {
        setScrollDirection("down");
      } else if (currentY < prevScrollY.current) {
        setScrollDirection("up");
      }
      prevScrollY.current = currentY;
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);

  // Generate title from slug params
  const trimLabel = slugParams.trimSlug ? ` ${slugParams.trimSlug.toUpperCase()}` : "";
  const vehicleTitle = `${slugParams.year} ${capitalize(slugParams.make)} ${capitalize(slugParams.model)}${trimLabel}`;

  const thumbnails = useMemo(
    () => vehicle.images.map((src, i) => ({ key: `${src}-${i}`, src, index: i })),
    [vehicle.images]
  );

  const thumbRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  // const rightRef = useRef<HTMLDivElement | null>(null); // Removed duplicate declaration
  const [_canScrollLeft, setCanScrollLeft] = useState(false);
  const [_canScrollRight, setCanScrollRight] = useState(false);
  // const [showStickyCTA, setShowStickyCTA] = useState(false); // Removed duplicate declaration
  // const [_isHeaderHidden, setIsHeaderHidden] = useState(false); // Removed duplicate declaration

  const getHeaderHeight = useCallback(() => {
    if (typeof window === "undefined") {
      return 80; // fallback for SSR
    }
    const header = document.querySelector("header");
    if (header) {
      const rect = header.getBoundingClientRect();
      const height = rect.height;
      return height;
    }
    return 80; // fallback
  }, []);
  useEffect(() => {
    getHeaderHeight();
  }, [getHeaderHeight]);

  const updateScrollArrows = useCallback(() => {
    const el = thumbRef.current;
    if (!el) {
      return;
    }
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    const el = thumbRef.current;
    if (!el) {
      return;
    }
    updateScrollArrows();
    const ro = new ResizeObserver(updateScrollArrows);
    ro.observe(el);
    return () => ro.disconnect();
  }, [updateScrollArrows]);

  const _scrollThumbs = useCallback((direction: "left" | "right") => {
    const el = thumbRef.current;
    if (!el) {
      return;
    }
    const scrollAmount = el.clientWidth * 0.6;
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  }, []);
  // biome lint/correctness/noUnusedVariables: Prepend scrollThumbs with underscore if unused

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % vehicle.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + vehicle.images.length) % vehicle.images.length);
  };

  const openPreview = () => {
    setPreviewIndex(currentImageIndex);
    setIsPreviewOpen(true);
  };

  useEffect(() => {
    if (!isPreviewOpen) {
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsPreviewOpen(false);
      } else if (e.key === "ArrowLeft") {
        setPreviewIndex((p) => (p - 1 + vehicle.images.length) % vehicle.images.length);
      } else if (e.key === "ArrowRight") {
        setPreviewIndex((p) => (p + 1) % vehicle.images.length);
      }
    };
    lockBodyScroll();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      unlockBodyScroll();
    };
  }, [isPreviewOpen, vehicle.images.length]);

  // ...existing code...

  return (
    <div className="mx-auto max-w-[var(--container-2xl)]">
      {/* ...existing right-side content... */}
      {/* Sticky vehicle details banner */}
      <div
        className="fixed right-0 left-0 z-50 bg-white py-6 shadow-sm"
        style={{
          opacity:
            scrollDirection === "down"
              ? Math.min(1, stickyScrollOffset / STICKY_HEIGHT)
              : Math.max(0, stickyScrollOffset / STICKY_HEIGHT),
          transform:
            scrollDirection === "down"
              ? `translateY(${Math.max(STICKY_HEIGHT - stickyScrollOffset, 0)}px)`
              : "translateY(0px)",
          //               : stickyScrollOffset < STICKY_HEIGHT ? `translateY(${-STICKY_HEIGHT*2}px)` : 0,
          transition: "opacity 0.2s, transform 0.2s",
          display: showStickyCTA ? "block" : "none",
          top: 0,
        }}
      >
        <div className="mx-auto h-full max-w-[var(--container-2xl)] px-4 sm:px-6 lg:px-20">
          {/* Mobile: stacked layout */}
          <div className="flex flex-col gap-(--spacing-xs) md:hidden">
            {/* Row 1: Heading */}
            <h1 className="font-bold text-[length:var(--text-xl)] text-foreground leading-normal">
              {vehicle.year} {vehicle.make} {vehicle.model} {vehicle.trim}
            </h1>
            {/* Row 2: Price/was on left, share links on right */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-baseline gap-(--spacing-xs)">
                <span className="font-bold text-[length:var(--font-size-lg)] text-base text-brand leading-normal">
                  ${vehicle.price.toLocaleString()}
                </span>
                <span className="font-normal text-muted-foreground text-xs leading-normal">
                  was
                </span>
                <span className="font-normal text-muted-foreground text-xs leading-normal line-through">
                  ${vehicle.originalPrice.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-[24px]">
                <button aria-label="Share this vehicle" className="hover:opacity-70" type="button">
                  <Image
                    alt=""
                    aria-hidden="true"
                    className="aspect-[16.79/18.48] h-[18.482px] w-[16.786px] flex-shrink-0"
                    height={20}
                    src="/images/vdp/Vector_6.svg"
                    width={20}
                  />
                </button>
                <button aria-label="Save to favorites" className="hover:opacity-70" type="button">
                  <Image
                    alt=""
                    aria-hidden="true"
                    className="aspect-[16.79/18.48] h-[18.482px] w-[16.786px] flex-shrink-0"
                    height={20}
                    src="/images/vdp/Vector_8.svg"
                    width={20}
                  />
                </button>
                <button
                  aria-label="Print vehicle details"
                  className="hover:opacity-70"
                  type="button"
                >
                  <Image
                    alt=""
                    aria-hidden="true"
                    className="aspect-[16.79/18.48] h-[18.482px] w-[16.786px] flex-shrink-0"
                    height={20}
                    src="/images/vdp/Vector_7.svg"
                    width={20}
                  />
                </button>
              </div>
            </div>
            {/* Row 3: Miles left, VIN right */}
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-row gap-[var(--spacing-2xs)]">
                <p className="font-semibold text-body text-sm">Miles:</p>
                <p className="font-semibold text-body text-sm">{vehicle.miles.toLocaleString()}</p>
              </div>
              <div className="flex flex-row gap-[var(--spacing-2xs)]">
                <p className="font-semibold text-body text-sm">VIN:</p>
                <p className="font-semibold text-body text-sm">{vehicle.vin}</p>
              </div>
            </div>
            {/* Row 4: Full-width button */}
            <Button className="flex max-h-[40px] w-full items-center justify-center rounded-[var(--radius-full)] bg-[var(--color-actions-primary)] px-[var(--spacing-xl)] text-center font-semibold text-[var(--font-size-sm)] text-white leading-[125%] tracking-[-0.14px]">
              Get Pre-Qualified
            </Button>
          </div>

          {/* Tablet and above: two-column layout */}
          <div className="hidden md:flex md:items-center md:justify-between md:gap-6">
            {/* Left: heading + price in one line, miles + VIN below */}
            <div className="flex min-w-0 flex-col gap-(--spacing-md)">
              <div className="flex flex-wrap items-baseline gap-x-(--spacing-sm) gap-y-(--spacing-2xs)">
                <h1 className="font-bold text-[var(--color-core-surfaces-foreground)] text-foreground text-lg leading-[115%]">
                  {vehicle.year} {vehicle.make} {vehicle.model} {vehicle.trim}
                </h1>
                <span className="font-bold text-[var(--color-actions-accent)] text-lg leading-[115%]">
                  ${vehicle.price.toLocaleString()}
                </span>
                <span className="font-normal text-muted-foreground text-xs leading-normal tracking-[-0.14px]">
                  was
                </span>
                <span className="text-[var(--text-sm)] text-muted-foreground text-xs leading-[125%] line-through">
                  ${vehicle.originalPrice.toLocaleString()}
                </span>
              </div>
              <div className="flex flex-row items-center">
                <div className="flex flex-row gap-[var(--spacing-2xs)]">
                  <p className="font-semibold text-[var(--font-size-md)] text-body tracking-[-0.16px]">
                    Miles:
                  </p>
                  <p className="font-semibold text-[var(--font-size-md)] text-body tracking-[-0.16px]">
                    {vehicle.miles.toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-row gap-[var(--spacing-2xs)]">
                  <p className="font-semibold text-[var(--font-size-md)] text-body tracking-[-0.16px]">
                    VIN:
                  </p>
                  <p className="font-semibold text-[var(--font-size-md)] text-body tracking-[-0.16px]">
                    {vehicle.vin}
                  </p>
                </div>
              </div>
            </div>

            {/* Right: share icons + CTA button */}
            <div className="flex shrink-0 items-center gap-[48px]">
              <div className="flex items-center gap-[24px]">
                <button aria-label="Share this vehicle" className="hover:opacity-70" type="button">
                  <Image
                    alt=""
                    aria-hidden="true"
                    className="aspect-[16.79/18.48] h-[18.482px] w-[16.786px] flex-shrink-0"
                    height={20}
                    src="/images/vdp/Vector_6.svg"
                    width={20}
                  />
                </button>
                <button aria-label="Save to favorites" className="hover:opacity-70" type="button">
                  <Image
                    alt=""
                    aria-hidden="true"
                    className="aspect-[16.79/18.48] h-[18.482px] w-[16.786px] flex-shrink-0"
                    height={20}
                    src="/images/vdp/Vector_8.svg"
                    width={20}
                  />
                </button>
                <button
                  aria-label="Print vehicle details"
                  className="hover:opacity-70"
                  type="button"
                >
                  <Image
                    alt=""
                    aria-hidden="true"
                    className="aspect-[16.79/18.48] h-[18.482px] w-[16.786px] flex-shrink-0"
                    height={20}
                    src="/images/vdp/Vector_7.svg"
                    width={20}
                  />
                </button>
              </div>
              <div>
                <Button className="flex max-h-[40px] items-center justify-center rounded-[var(--radius-full)] bg-[var(--color-actions-primary)] px-[var(--spacing-xl)] py-0 text-center font-semibold text-[var(--font-size-sm)] text-white leading-[125%] tracking-[-0.14px]">
                  Get Pre-Qualified
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Breadcrumb Navigation */}
      <div className="mb-6 flex items-center justify-between lg:px-0">
        <div className="flex items-center gap-2">
          <Link
            className="flex cursor-pointer items-center gap-3 text-foreground text-sm hover:text-gray-700"
            href="/used-cars"
          >
            <Image
              alt=""
              aria-hidden="true"
              className="mt-[calc(var(--spacing-2xs))] h-[var(--spacing-sm,12px)] w-[calc(var(--spacing-xs,8px)_+_2px)]"
              height={12}
              src="/images/vdp/chevron-left.svg"
              width={10}
            />
            <span className="hidden font-normal text-[var(--color-core-surfaces-foreground)] text-base md:block">
              Back to Search Result
            </span>
            <span className="font-normal text-[var(--color-core-surfaces-foreground)] text-base md:hidden">
              Back to Search
            </span>
          </Link>
          <div className="mx-[var(--spacing-xs)] mt-[calc(var(--spacing-2xs))] hidden h-[16px] w-[1px] bg-[color:var(--structure-interaction-border,#D4D4D4)] md:mx-[var(--spacing-lg,8px)] md:block" />
          <Breadcrumb>
            <BreadcrumbList className="hidden gap-[var(--spacing-sm)] text-sm md:flex">
              <BreadcrumbItem>
                <BreadcrumbLink
                  asChild
                  style={{
                    fontWeight: "var(--font-weight-normal)",
                    color: "var(--color-states-disabled-foreground)",
                  }}
                >
                  <Link href={`/used-cars/${slugParams.make}`}>{slugParams.year}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <Image
                  alt=""
                  aria-hidden="true"
                  className="mt-[calc(var(--spacing-2xs)/2)] h-[12px] w-[12px]"
                  height={12}
                  src="/images/vdp/vdp_arrow_right_gray.svg"
                  width={12}
                />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink
                  asChild
                  style={{
                    fontWeight: "var(--font-weight-normal)",
                    color: "var(--color-states-disabled-foreground)",
                  }}
                >
                  <Link href={`/used-cars/${slugParams.make}`}>{capitalize(slugParams.make)}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <Image
                  alt=""
                  aria-hidden="true"
                  className="mt-[calc(var(--spacing-2xs)/2)] h-[12px] w-[12px]"
                  height={12}
                  src="/images/vdp/vdp_arrow_right_gray.svg"
                  width={12}
                />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink
                  asChild
                  style={{
                    fontWeight: "var(--font-weight-normal)",
                    color: "var(--color-states-disabled-foreground)",
                  }}
                >
                  <Link href={`/used-cars?make=${slugParams.make}&model=${slugParams.model}`}>
                    {capitalize(slugParams.model)}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <Image
                  alt=""
                  aria-hidden="true"
                  className="mt-[calc(var(--spacing-2xs)/2)] h-[12px] w-[12px]"
                  height={12}
                  src="/images/vdp/vdp_arrow_right_gray.svg"
                  width={12}
                />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage
                  style={{
                    fontWeight: "var(--font-weight-semibold)",
                    color: "var(--color-core-surfaces-foreground)",
                  }}
                >
                  {slugParams.trimSlug ? slugParams.trimSlug.toUpperCase() : ""}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex items-center gap-4">
          <button aria-label="Share this vehicle" className="hover:opacity-70" type="button">
            <Image
              alt=""
              aria-hidden="true"
              className="aspect-[16.79/18.48] h-[18.482px] w-[16.786px] flex-shrink-0 [fill:#58595B]"
              height={18}
              src="/images/vdp/Vector_6.svg"
              width={17}
            />
          </button>
          <button aria-label="Save to favorites" className="hover:opacity-70" type="button">
            <Image
              alt=""
              aria-hidden="true"
              className="aspect-[16.79/18.48] h-[18.482px] w-[16.786px] flex-shrink-0 [fill:#58595B]"
              height={18}
              src="/images/vdp/Vector_8.svg"
              width={17}
            />
          </button>
          <button aria-label="Print vehicle details" className="hover:opacity-70" type="button">
            <Image
              alt=""
              aria-hidden="true"
              className="aspect-[16.79/18.48] h-[18.482px] w-[16.786px] flex-shrink-0 [fill:#58595B]"
              height={18}
              src="/images/vdp/Vector_7.svg"
              width={17}
            />
          </button>
        </div>
      </div>
      <VehicleStatusBanners status={vehicleStatus} />
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-red-100 p-6">
          <button
            aria-hidden
            className="absolute inset-0 bg-white"
            onClick={() => setIsPreviewOpen(false)}
            type="button"
          />
          <div
            aria-modal="true"
            className="relative z-10 flex items-center justify-center bg-white p-6"
            role="dialog"
          >
            <button
              aria-label="Close preview"
              className="absolute top-4 right-4 z-50 w-[40px] cursor-pointer rounded-full bg-gray-100 p-2 shadow"
              onClick={(e) => {
                e.stopPropagation();
                setIsPreviewOpen(false);
              }}
              type="button"
            >
              ✕
            </button>

            <button
              aria-label="Previous preview"
              className="absolute left-4 z-50 flex cursor-pointer rounded-full bg-white p-2 shadow"
              onClick={(e) => {
                e.stopPropagation();
                setPreviewIndex((p) => (p - 1 + vehicle.images.length) % vehicle.images.length);
              }}
              type="button"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <AnimatePresence initial={false} mode="wait">
              {vehicle.images[previewIndex] ? (
                <motion.div
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center justify-center"
                  exit={{ opacity: 0, scale: 0.98 }}
                  initial={{ opacity: 0, scale: 0.98 }}
                  key={vehicle.images[previewIndex]}
                  style={{ position: "relative" }}
                  transition={{ duration: 0.1, ease: "easeInOut" }}
                >
                  <Image
                    alt={`${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim} — ${previewIndex + 1}`}
                    className="h-[90vh] w-[90vw] object-contain"
                    height={720}
                    onClick={(e) => e.stopPropagation()}
                    src={vehicle.images[previewIndex]}
                    width={1280}
                  />
                </motion.div>
              ) : null}
            </AnimatePresence>

            {/* Thumbnails inside preview */}
            <ul
              aria-label="Preview thumbnails"
              className={[
                "absolute",
                "bottom-[5%]",
                "left-1/2",
                "flex",
                "w-[90vw]",
                "max-w-[90vw]",
                "-translate-x-1/2",
                "justify-center",
                "gap-2",
                "overflow-x-auto",
                "pr-4",
                "pb-2",
                "pl-4",
                "[-ms-overflow-style:none]",
                "[scrollbar-width:none]",
                "[&::-webkit-scrollbar]:hidden",
                "list-none",
              ].join(" ")}
            >
              {thumbnails.map((thumb) => (
                <li className="shrink-0" key={thumb.key}>
                  <button
                    aria-label={`Preview image ${thumb.index + 1}`}
                    className={`h-[97px] w-[97px] cursor-pointer rounded-xl p-1 transition-all ${
                      thumb.index === previewIndex
                        ? "border border-red-500"
                        : "border border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewIndex(thumb.index);
                    }}
                    type="button"
                  >
                    <Image
                      alt={`${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim} thumbnail ${thumb.index + 1}`}
                      className="h-full w-full rounded-md object-contain"
                      height={97}
                      src={thumb.src}
                      width={97}
                    />
                  </button>
                </li>
              ))}
            </ul>

            <button
              aria-label="Next preview"
              className="absolute right-4 flex cursor-pointer rounded-full bg-white p-2 shadow"
              onClick={(e) => {
                e.stopPropagation();
                setPreviewIndex((p) => (p + 1) % vehicle.images.length);
              }}
              type="button"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}

      <div
        className="flex flex-col lg:grid lg:grid-cols-[minmax(0,1fr)_392px] lg:items-start lg:gap-10"
        ref={containerRef}
      >
        {/* Left Side - Image Section */}
        <div className="flex min-w-0 flex-col gap-4">
          {/* Main Image Carousel */}
          <div
            className="relative aspect-[4/3] w-full overflow-hidden rounded-none bg-gray-100 lg:aspect-auto lg:h-[518px] lg:rounded-md"
            id={`${vehicle.id}-region`}
          >
            <button
              aria-label="Open image preview"
              className="absolute inset-0 z-30 cursor-pointer"
              onClick={openPreview}
              type="button"
            />
            <AnimatePresence initial={false} mode="wait">
              {vehicle.images[currentImageIndex] ? (
                <motion.div
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0"
                  exit={{ opacity: 0, scale: 0.98 }}
                  initial={{ opacity: 0, scale: 0.98 }}
                  key={vehicle.images[currentImageIndex]}
                  style={{ position: "absolute" }}
                  transition={{ duration: 0.1, ease: "easeInOut" }}
                >
                  <Image
                    alt={`${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim} — ${currentImageIndex + 1} of ${vehicle.images.length}`}
                    className="object-contain"
                    fill
                    priority={currentImageIndex === 0}
                    sizes="(max-width: 1024px) 100vw, calc(100vw - 392px - 5rem)"
                    src={vehicle.images[currentImageIndex]}
                  />
                </motion.div>
              ) : null}
            </AnimatePresence>

            {/* Navigation Arrows - Desktop only */}
            <button
              aria-label="Previous image"
              className={[
                "absolute",
                "top-1/2",
                "left-4",
                "hidden",
                "-translate-y-1/2",
                "rounded-full",
                "bg-white",
                "p-2",
                "shadow-md",
                "hover:bg-gray-50",
                "lg:flex",
                "z-[30]",
                "cursor-pointer",
              ].join(" ")}
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              type="button"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              aria-label="Next image"
              className={[
                "absolute",
                "top-1/2",
                "right-4",
                "hidden",
                "-translate-y-1/2",
                "rounded-full",
                "bg-white",
                "p-2",
                "shadow-md",
                "hover:bg-gray-50",
                "lg:flex",
                "z-[30]",
                "cursor-pointer",
              ].join(" ")}
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              type="button"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Image Count Badge */}
            <div className="absolute right-4 bottom-4 flex items-center gap-2 rounded-full bg-card px-4 py-2 shadow-sm">
              <Image
                alt=""
                aria-hidden="true"
                className="size-(--size-icon-sm)"
                height={16}
                src="/images/vdp/PDP_prev.svg"
                width={16}
              />
              <span className="text-center font-normal text-foreground text-xs leading-normal">
                {vehicle.images.length} Images
              </span>
            </div>
            {/* Live region for screen readers */}
            <div aria-atomic="true" aria-live="polite" className="sr-only">
              Showing image {currentImageIndex + 1} of {vehicle.images.length}
            </div>
          </div>

          {/* Thumbnail Gallery */}
          <div className="group/thumbs relative">
            {/* Left scroll arrow removed */}

            <div
              className={[
                "flex gap-2 overflow-x-auto pl-[var(--spacing-lg)] lg:gap-4 lg:pl-0",
                "[-ms-overflow-style:none]",
                "[scrollbar-width:none]",
                "[&::-webkit-scrollbar]:hidden",
                "pb-4",
              ].join(" ")}
              onScroll={updateScrollArrows}
              ref={thumbRef}
            >
              {thumbnails.map((thumb) => (
                <button
                  aria-label={`View image ${thumb.index + 1} of ${vehicle.images.length}`}
                  aria-pressed={thumb.index === currentImageIndex}
                  className={`h-(--size-thumbnail) w-(--size-thumbnail) shrink-0 cursor-pointer rounded-md p-1 transition-all ${
                    thumb.index === currentImageIndex
                      ? "border border-red-500"
                      : "border border-gray-200 hover:border-gray-300"
                  }`}
                  key={thumb.key}
                  onClick={() => setCurrentImageIndex(thumb.index)}
                  type="button"
                >
                  <Image
                    alt={`${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim} thumbnail ${thumb.index + 1}`}
                    className="h-full w-full rounded-md object-contain"
                    height={97}
                    src={thumb.src}
                    width={97}
                  />
                </button>
              ))}
            </div>

            {/* Right scroll arrow removed */}
          </div>

          {/* Key Highlights - Desktop only */}
          <div
            className="hidden rounded-md bg-gray-100 p-(--spacing-6) lg:block"
            ref={keyHighlightsRef}
          >
            <h2 className="mb-(--spacing-6) font-semibold text-lg">Key Highlights</h2>
            <div className="grid gap-(--spacing-7) gap-y-(--spacing-4) sm:grid-cols-2">
              {vehicle.highlights.map((feature, _idx) => (
                <div
                  className="flex items-center gap-[var(--spacing-4)] py-[var(--spacing-1)]"
                  key={feature}
                >
                  <Image
                    alt=""
                    aria-hidden="true"
                    className="size-(--size-icon-md) shrink-0"
                    height={20}
                    src="/images/vdp/Vector_5.svg"
                    width={20}
                  />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Details Section */}
        <div
          className="mt-4 flex w-full flex-col gap-(--spacing-lg) lg:sticky lg:top-[100px] lg:mt-0 lg:px-0"
          ref={rightRef}
        >
          {/* Title and Price */}
          <div>
            <h1 className="mb-(--spacing-xs) font-bold text-foreground text-xl leading-none lg:mt-[-6px] lg:text-2xl">
              {vehicleTitle}
            </h1>
            <div className="flex flex-wrap items-baseline gap-(--spacing-xs)">
              <span className="font-bold text-2xl text-brand leading-normal lg:text-2xl">
                ${vehicle.price.toLocaleString()}
              </span>
              <span className="font-normal text-muted-foreground text-xs leading-normal lg:text-sm">
                was
              </span>
              <span className="font-normal text-muted-foreground text-xs leading-normal line-through lg:text-sm">
                ${vehicle.originalPrice.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Badges */}
          <div className="grid grid-cols-3 gap-(--spacing-xs)">
            <Badge icon="Vector_1" text="Excellent Price" variant="excellentPrice" />
            {vehicle.warranty && <Badge icon="Vector_2" text="Warranty" variant="outline" />}
            {vehicle.inspected && <Badge icon="Vector_3" text="Inspected" variant="outline" />}
          </div>

          {/* Specs Grid */}
          <div className="border-gray-200 border-t pt-(--spacing-md)">
            <div className="grid grid-cols-3 gap-(--spacing-xs) pb-(--spacing-md)">
              <div>
                <p className="font-semibold text-body text-xs capitalize opacity-(--opacity-50)">
                  Miles
                </p>
                <p className="mt-(--spacing-xs) font-semibold text-body text-sm leading-normal">
                  {vehicle.miles}
                </p>
              </div>
              <div>
                <p className="font-semibold text-body text-xs capitalize opacity-(--opacity-50)">
                  Drivetrain
                </p>
                <p className="mt-(--spacing-xs) font-semibold text-body text-sm leading-normal">
                  {vehicle.drivetrain}
                </p>
              </div>
              <div>
                <p className="font-semibold text-body text-xs capitalize opacity-(--opacity-50)">
                  MPG
                </p>
                <p className="mt-(--spacing-xs) font-semibold text-body text-sm leading-normal">
                  {vehicle.mpg}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-(--spacing-xs) border-gray-200 border-b pt-(--spacing-md) pb-(--spacing-md)">
              <div>
                <p className="font-semibold text-body text-xs capitalize opacity-(--opacity-50)">
                  Stock #
                </p>
                <p className="mt-(--spacing-xs) font-semibold text-body text-sm leading-normal">
                  {vehicle.stock}
                </p>
              </div>
              <div className="col-span-2">
                <p className="font-semibold text-body text-xs capitalize opacity-(--opacity-50)">
                  VIN
                </p>
                <p className="mt-(--spacing-xs) font-semibold text-body text-sm leading-normal">
                  {vehicle.vin}
                </p>
              </div>
            </div>
          </div>

          {/* Colors */}
          <div className="flex gap-(--spacing-xs) border-gray-200 border-b pb-(--spacing-md) [&>*]:flex-1">
            <div className="flex items-center gap-(--spacing-xs)">
              <div
                className="size-(--size-swatch) rounded-[var(--radius-full)]"
                style={{
                  background: "linear-gradient(166deg, #3F3F3F -30%, #A5A5A5 140%)",
                }}
              />
              <div className="flex flex-col">
                <p className="font-semibold text-body text-xs capitalize opacity-(--opacity-50)">
                  Exterior
                </p>
                <span className="font-semibold text-body text-sm leading-normal">
                  {vehicle.exteriorColor}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-(--spacing-xs)">
              <div className="size-(--size-swatch) rounded-[var(--radius-full)] bg-black" />
              <div className="flex flex-col">
                <p className="font-semibold text-body text-xs capitalize opacity-(--opacity-50)">
                  Interior
                </p>
                <span className="font-semibold text-body text-sm leading-normal">
                  {vehicle.interiorColor}
                </span>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-(--spacing-md)">
            <Button className="flex h-10 w-full items-center justify-center self-stretch rounded-[var(--radius-full)] bg-[var(--color-actions-primary)] px-[var(--spacing-xl)] text-center font-semibold text-[var(--font-size-sm)] text-white leading-[125%] tracking-[-0.14px]">
              Get Pre-Qualified
            </Button>
            <Button
              className="h-10 w-full rounded-full border border-body-muted bg-white text-center font-semibold text-body text-sm hover:bg-gray-50"
              variant="outline"
            >
              Get My Trade-In Offer
            </Button>
          </div>

          {/* Dealer Info */}
          <div className="border-gray-200 border-t border-b py-(--spacing-lg)">
            <div className="flex items-end justify-between">
              <div className="flex items-center gap-(--spacing-xs)">
                <div className="flex size-(--size-avatar-sm) items-center justify-center rounded-full bg-brand">
                  <Image
                    alt="Toyota"
                    className="h-[24px] w-[23px]"
                    height={24}
                    src="/images/vdp/Vector_4.svg"
                    width={23}
                  />
                </div>
                <div>
                  <p className="font-semibold text-body text-sm leading-[130%] tracking-tight">
                    {vehicle.dealer.name}
                  </p>
                  <p className="font-normal text-body-muted text-xs leading-normal">
                    {vehicle.dealer.location}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-(--spacing-xs) font-normal text-body-muted text-xs leading-normal">
                <MapPin className="h-3.5 w-3.5" />
                <span>{vehicle.dealer.distance}</span>
              </div>
            </div>
          </div>

          {/* Key Highlights - Mobile only */}
          <div className="rounded-lg bg-gray-100 px-(--spacing-md) py-(--spacing-md) lg:hidden">
            <h2 className="mb-(--spacing-sm) font-semibold text-lg">Key Highlights</h2>
            <div className="grid grid-cols-1 gap-x-(--spacing-xs) gap-y-(--spacing-sm)">
              {vehicle.highlights.map((feature, _idx) => (
                <div className="flex items-center gap-(--spacing-xs)" key={feature}>
                  <Image
                    alt=""
                    aria-hidden="true"
                    className="size-(--size-icon-sm) shrink-0"
                    height={16}
                    src="/images/vdp/Vector_5.svg"
                    width={16}
                  />
                  <span className="text-xs">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
