"use client";

import {
  Badge,
  Button,
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Dialog,
  DialogContent,
} from "@tfs-ucmp/ui";
import { MapPin } from "lucide-react";
import Image from "next/image";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  demoVehiclePreview,
  type VehiclePreviewData,
} from "~/lib/data/vehicle-preview/vehicle-preview";

// Wishlist/Like Button Component
const LikeButton = ({
  liked,
  onToggle,
}: {
  liked?: boolean;
  onToggle?: (liked: boolean) => void;
}) => {
  const [animating, setAnimating] = useState(false);

  const toggleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle?.(!liked);
    setAnimating(true);
  };

  useEffect(() => {
    if (animating) {
      const timer = setTimeout(() => setAnimating(false), 500);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [animating]);

  return (
    <button
      aria-label="Add to favorites"
      className={`heart-button flex h-9 w-9 cursor-pointer items-center justify-center rounded-[var(--radius-full)] bg-surface transition-colors hover:bg-background-lighter ${
        animating ? "animate" : ""
      }`}
      onClick={toggleLike}
      type="button"
    >
      <Image
        alt="Favorite"
        height={36}
        src={`/images/garage/heart${liked ? "-filled" : ""}.svg`}
        width={36}
      />
    </button>
  );
};

export interface VehiclePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle?: Partial<VehiclePreviewData>;
  vdpUrl?: string;
  isLiked?: boolean;
  onLikeChange?: (liked: boolean) => void;
}

export const VehiclePreviewModal: React.FC<VehiclePreviewModalProps> = ({
  isOpen,
  onClose,
  vehicle: vehicleProp,
  vdpUrl,
  isLiked,
  onLikeChange,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [featuresExpanded, setFeaturesExpanded] = useState(false);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  // Merge provided vehicle data with demo defaults
  const vehicle = { ...demoVehiclePreview, ...vehicleProp };
  const visibleFeatures = vehicle.features.slice(0, 6);
  const hiddenFeatures = vehicle.features.slice(6);
  const contentRef = useRef<HTMLDivElement>(null);

  const onSelect = useCallback(() => {
    if (!carouselApi) {
      return;
    }
    setCurrentImageIndex(carouselApi.selectedScrollSnap());
  }, [carouselApi]);

  useEffect(() => {
    if (!carouselApi) {
      return;
    }
    onSelect();
    carouselApi.on("select", onSelect);
    carouselApi.on("reInit", onSelect);
    return () => {
      carouselApi.off("select", onSelect);
      carouselApi.off("reInit", onSelect);
    };
  }, [carouselApi, onSelect]);

  return (
    <Dialog onOpenChange={(open) => !open && onClose()} open={isOpen}>
      <DialogContent
        className="top-15! left-1/2! h-[calc(100%-60px)] w-full max-w-350 -translate-x-1/2! translate-y-0! rounded-t-[var(--radius-2xl)]! p-0! lg:top-15.5! lg:h-[calc(100vh-129px)] lg:w-[calc(100vw-var(--spacing-10)*2)] lg:rounded-[var(--radius-xl)]! [&>button]:hidden"
        overlayClassName="inset-0! top-0! bg-black/60"
      >
        <div className="flex h-full flex-col overflow-hidden rounded-t-[var(--radius-2xl)] bg-surface lg:rounded-[var(--radius-lg)]">
          {/* Header */}
          <div className="flex items-center justify-between border-surface border-b px-md py-sm lg:px-10 lg:py-lg">
            <button
              className="flex items-center gap-xs font-medium text-heading text-sm hover:opacity-70 lg:hidden"
              onClick={onClose}
              type="button"
            >
              <Image
                alt=""
                className="h-(--size-icon-md) w-(--size-icon-md)"
                height={20}
                src="/images/vdp/chevron-left.svg"
                width={20}
              />
              <span>Back to Search</span>
            </button>
            <span className="hidden font-normal text-foreground text-md leading-5 lg:block">
              Vehicle Preview
            </span>
            <div className="flex items-center gap-lg">
              <button className="cursor-pointer hover:opacity-70" type="button">
                <Image
                  alt="Share"
                  className="h-(--size-icon-md) w-(--size-icon-md) lg:h-6 lg:w-6"
                  height={19}
                  src="/images/vdp/Vector_6.svg"
                  width={17}
                />
              </button>
              <LikeButton liked={isLiked} onToggle={onLikeChange} />
              <button className="cursor-pointer hover:opacity-70" type="button">
                <Image
                  alt="Print"
                  className="h-(--size-icon-md) w-(--size-icon-md) lg:h-6 lg:w-6"
                  height={19}
                  src="/images/vdp/Vector_7.svg"
                  width={17}
                />
              </button>
              <button
                className="cursor-pointer pl-xs hover:opacity-70"
                onClick={onClose}
                type="button"
              >
                <Image
                  alt=""
                  className="h-6 w-6"
                  height={24}
                  src="/images/vdp/x-close.svg"
                  width={24}
                />
              </button>
            </div>
          </div>

          {/* Main Content - Image and Details */}
          <div className="scrollbar-hide flex min-h-0 flex-1 flex-col overflow-y-auto lg:flex-row lg:overflow-hidden lg:pb-16.75">
            {/* Left Side - Image Section (65% on desktop) */}
            <div className="flex shrink-0 flex-col gap-3 lg:min-h-0 lg:w-[65%] lg:shrink lg:gap-6.25 lg:pt-0 lg:pr-11.25 lg:pl-10">
              {/* Main Image Carousel */}
              <div className="relative h-75 w-full bg-brand-surface sm:h-75 lg:min-h-0 lg:flex-1 lg:rounded-[var(--radius-xl)]">
                <Carousel
                  className="h-full w-full overflow-hidden lg:rounded-[var(--radius-xl)] [&>div]:h-full"
                  opts={{ loop: true }}
                  setApi={setCarouselApi}
                >
                  <CarouselContent className="ml-0 h-full">
                    {vehicle.images.map((img) => (
                      <CarouselItem className="h-full pl-0" key={img}>
                        <div className="relative h-full w-full">
                          <Image
                            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                            className="object-contain"
                            fill
                            src={img}
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>

                {/* Navigation Arrows - Hidden on mobile and when only 1 image */}
                {vehicle.images.length > 1 && (
                  <>
                    <button
                      aria-label="Previous image"
                      className="absolute top-1/2 left-4 z-10 hidden h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-[var(--radius-full)] border border-brand-border-light bg-surface hover:bg-background-lighter lg:flex"
                      onClick={() => carouselApi?.scrollPrev()}
                      type="button"
                    >
                      <Image
                        alt=""
                        className="h-[12px] w-[6px]"
                        height={12}
                        src="/images/vdp/chevron-left2.svg"
                        width={6}
                      />
                    </button>
                    <button
                      aria-label="Next image"
                      className="absolute top-1/2 right-4 z-10 hidden h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-[var(--radius-full)] border border-brand-border-light bg-surface hover:bg-background-lighter lg:flex"
                      onClick={() => carouselApi?.scrollNext()}
                      type="button"
                    >
                      <Image
                        alt=""
                        className="h-[12px] w-[6px]"
                        height={12}
                        src="/images/vdp/Chevron-right2.svg"
                        width={6}
                      />
                    </button>
                  </>
                )}

                {/* Image Count Badge */}
                <div className="absolute right-sm bottom-sm z-10 flex items-center gap-1.5 rounded-[var(--radius-full)] bg-[rgba(88,89,91,0.10)] px-sm py-1.5 lg:right-md lg:bottom-md lg:gap-xs lg:px-md lg:py-xs">
                  <Image
                    alt=""
                    className="h-3.5 w-3.5 lg:h-(--size-icon-sm) lg:w-(--size-icon-sm)"
                    height={14}
                    src="/images/vdp/Image-count.svg"
                    width={14}
                  />
                  <span className="text-center font-normal text-brand-text text-xs-alt leading-normal lg:text-xs">
                    {vehicle.images.length} Images
                  </span>
                </div>
              </div>

              {/* Thumbnail Gallery */}
              <div className="scrollbar-hide flex gap-xs overflow-x-auto pl-lg lg:gap-sm lg:px-0 lg:pr-lg">
                {vehicle.images.map((img, idx) => (
                  <button
                    className={`flex h-23 w-23 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-[var(--radius-xl)] border pt-5.75 pb-3.75 transition-all lg:h-[11vh] lg:w-[11vh] ${
                      idx === currentImageIndex
                        ? "border-brand bg-brand-surface"
                        : "border-divider bg-brand-surface hover:border-border"
                    }`}
                    key={img}
                    onClick={() => carouselApi?.scrollTo(idx)}
                    type="button"
                  >
                    <Image
                      alt={`Thumbnail ${idx + 1}`}
                      className="h-13.5 w-auto object-cover"
                      height={54}
                      src={img}
                      width={96}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Right Side - Details (35% on desktop) */}
            <div className="flex flex-col justify-between bg-surface px-lg lg:min-h-0 lg:w-[35%] lg:overflow-hidden lg:px-0 lg:pt-0 lg:pr-10">
              {/* Scrollable Content Area */}
              <div
                className="scrollbar-hide vehicle-preview-scroll min-h-0 flex-1 overflow-y-auto lg:pb-0"
                style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}
              >
                {/* Title and Price */}
                <div className="pt-lg lg:pt-0">
                  <h1 className="font-bold text-2xl text-heading leading-[115%]">
                    <span className="lg:hidden">
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </span>
                    <span className="hidden lg:inline">
                      {vehicle.year} {vehicle.make} <br /> {vehicle.model}
                    </span>
                  </h1>
                  <div className="mt-2xs flex items-baseline gap-xs">
                    <span className="font-bold text-2xl text-brand leading-[115%]">
                      ${(vehicle.price ?? 0).toLocaleString()}
                    </span>
                    {vehicle.originalPrice != null && vehicle.originalPrice > 0 && (
                      <>
                        <span className="text-body-muted text-sm">was</span>
                        <span className="text-[length:var(--text-sm)] text-body-muted line-through">
                          ${vehicle.originalPrice.toLocaleString()}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Badges */}
                <div className="grid grid-cols-3 gap-(--spacing-xs) border-divider border-b py-lg">
                  <Badge icon="Vector_1" text="Excellent Price" variant="excellentPrice" />
                  {vehicle.warranty && <Badge icon="Vector_2" text="Warranty" variant="outline" />}
                  {vehicle.inspected && (
                    <Badge icon="Vector_3" text="Inspected" variant="outline" />
                  )}
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-3 gap-sm border-divider border-b py-lg lg:gap-md">
                  <div className="flex flex-col gap-[var(--spacing-xs)]">
                    <p className="font-semibold text-body text-xs leading-[125%] opacity-[var(--opacity-50)]">
                      Miles
                    </p>
                    <p className="font-semibold text-body text-sm leading-[125%] tracking-[-0.14px]">
                      {vehicle.miles}
                    </p>
                  </div>
                  <div className="flex flex-col gap-[var(--spacing-xs)]">
                    <p className="font-semibold text-body text-xs leading-[125%] opacity-[var(--opacity-50)]">
                      Drivetrain
                    </p>
                    <p className="font-semibold text-body text-sm leading-[125%] tracking-[-0.14px]">
                      {vehicle.drivetrain}
                    </p>
                  </div>
                  <div className="flex flex-col gap-[var(--spacing-xs)]">
                    <p className="font-semibold text-body text-xs leading-[125%] opacity-[var(--opacity-50)]">
                      MPG
                    </p>
                    <p className="font-semibold text-body text-sm leading-[125%] tracking-[-0.14px]">
                      {vehicle.mpg}
                    </p>
                  </div>
                  <div className="flex flex-col gap-[var(--spacing-xs)]">
                    <p className="font-semibold text-body text-xs leading-[125%] opacity-[var(--opacity-50)]">
                      Stock #
                    </p>
                    <p className="font-semibold text-body text-sm leading-[125%] tracking-[-0.14px]">
                      {vehicle.stock}
                    </p>
                  </div>
                  <div className="col-span-2 flex flex-col gap-[var(--spacing-xs)]">
                    <p className="font-semibold text-body text-xs leading-[125%] opacity-[var(--opacity-50)]">
                      VIN
                    </p>
                    <p className="font-semibold text-body text-sm leading-[125%] tracking-[-0.14px]">
                      {vehicle.vin}
                    </p>
                  </div>
                </div>

                {/* Colors */}
                <div className="flex gap-lg border-divider border-b py-lg lg:gap-17.5">
                  <div className="flex items-center gap-xs">
                    <div
                      className="h-6 w-6 rounded-[var(--radius-full)] lg:h-(--size-swatch) lg:w-(--size-swatch)"
                      style={{ backgroundColor: vehicle.exteriorColorCode }}
                    />
                    <div className="flex flex-col">
                      <p className="font-semibold text-2xs text-brand-text capitalize opacity-[var(--opacity-50)] lg:text-xs">
                        Exterior
                      </p>
                      <span className="font-semibold text-brand-text text-xs leading-normal lg:text-sm">
                        {vehicle.exterior}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-xs">
                    <div
                      className="h-6 w-6 rounded-[var(--radius-full)] lg:h-(--size-swatch) lg:w-(--size-swatch)"
                      style={{ backgroundColor: vehicle.interiorColorCode }}
                    />
                    <div className="flex flex-col">
                      <p className="font-semibold text-2xs text-brand-text capitalize opacity-[var(--opacity-50)] lg:text-xs">
                        Interior
                      </p>
                      <span className="font-semibold text-brand-text text-xs leading-normal lg:text-sm">
                        {vehicle.interior}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mobile CTA Buttons */}
                <div className="flex flex-col gap-sm border-divider border-b py-lg lg:hidden">
                  <Button className="flex h-11 w-full items-center justify-center gap-2.5 rounded-[var(--radius-full)] bg-brand px-xl py-2.5 font-semibold text-primary-foreground hover:bg-primary-hover">
                    Get Pre-Qualified
                  </Button>
                  <Button
                    className="flex h-11 w-full items-center justify-center gap-2.5 rounded-[var(--radius-full)] border-[length:var(--border-width-1)] border-secondary bg-surface px-xl py-2.5 font-semibold text-foreground hover:bg-background-lighter"
                    variant="outline"
                  >
                    Get My Trade-In Offer
                  </Button>
                </div>

                {/* Dealer Info */}
                <div className="border-divider border-b py-md lg:py-lg">
                  <div className="flex items-end justify-between">
                    <div className="flex items-center gap-xs lg:gap-sm">
                      <div className="flex h-7 w-7 items-center justify-center rounded-[var(--radius-full)] bg-brand lg:h-(--size-avatar-sm) lg:w-(--size-avatar-sm)">
                        <Image
                          alt="Toyota"
                          className="h-5 w-4.75 lg:h-6 lg:w-5.75"
                          height={20}
                          src="/images/vdp/Toyota-logo.svg"
                          width={19}
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-brand-text-dealer text-sm-alt leading-[130%] tracking-[-0.14px] lg:text-sm">
                          {vehicle.dealer}
                        </p>
                        <p className="font-normal text-brand-text-secondary text-xs-alt leading-normal lg:text-xs">
                          {vehicle.location}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2xs font-normal text-brand-text-secondary text-xs-alt leading-normal lg:text-xs">
                      <MapPin className="h-3 w-3 lg:h-3.5 lg:w-3.5" />
                      <span>{vehicle.distance}</span>
                    </div>
                  </div>
                </div>

                {/* Key Features / Key Highlights */}
                <Collapsible
                  className="py-md"
                  onOpenChange={setFeaturesExpanded}
                  open={featuresExpanded}
                >
                  <div className="mb-sm flex items-center justify-between lg:mb-[17.5px]">
                    <h3 className="font-semibold text-body text-sm leading-5.5 lg:text-md">
                      <span className="lg:hidden">Key Highlights</span>
                      <span className="hidden lg:inline">Key Features</span>
                    </h3>
                    <CollapsibleTrigger asChild>
                      <button
                        className="flex items-center gap-2xs font-semibold text-heading text-xs leading-[14px] hover:text-body"
                        type="button"
                      >
                        {featuresExpanded ? "Collapse" : "Expand All"}
                        <Image
                          alt=""
                          className={`h-3 w-3 transition-transform duration-200 ${featuresExpanded ? "rotate-180" : ""}`}
                          height={14}
                          src="/images/vdp/chevron-down.svg"
                          width={14}
                        />
                      </button>
                    </CollapsibleTrigger>
                  </div>

                  {/* Always-visible features (first 6) */}
                  {/* Mobile: Single column list with tick icons */}
                  <div className="flex flex-col gap-sm lg:hidden">
                    {visibleFeatures.map((feature) => (
                      <div className="flex items-center gap-sm" key={feature}>
                        <Image
                          alt=""
                          className="h-(--size-icon-md) w-(--size-icon-md) shrink-0"
                          height={20}
                          src="/images/vdp/Tick.svg"
                          width={20}
                        />
                        <span className="text-body text-sm-alt">{feature}</span>
                      </div>
                    ))}
                  </div>
                  {/* Desktop: Two column grid */}
                  <div className="hidden grid-cols-2 gap-x-md gap-y-xs lg:grid">
                    {visibleFeatures.map((feature) => (
                      <div className="flex items-center gap-xs" key={feature}>
                        <Image
                          alt=""
                          className="h-3.5 w-3.5 shrink-0"
                          height={14}
                          src="/images/vdp/Keyfeature.svg"
                          width={14}
                        />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Collapsible extra features with animation */}
                  {hiddenFeatures.length > 0 && (
                    <div
                      ref={contentRef}
                      style={{
                        display: "grid",
                        gridTemplateRows: featuresExpanded ? "1fr" : "0fr",
                        transition: "grid-template-rows 300ms ease-in-out",
                      }}
                    >
                      <div style={{ overflow: "hidden" }}>
                        <CollapsibleContent forceMount>
                          {/* Mobile */}
                          <div className="mt-sm flex flex-col gap-sm pb-2xs lg:hidden">
                            {hiddenFeatures.map((feature) => (
                              <div className="flex items-center gap-sm" key={feature}>
                                <Image
                                  alt=""
                                  className="h-(--size-icon-md) w-(--size-icon-md) shrink-0"
                                  height={20}
                                  src="/images/vdp/Tick.svg"
                                  width={20}
                                />
                                <span className="text-body text-sm-alt">{feature}</span>
                              </div>
                            ))}
                          </div>
                          {/* Desktop */}
                          <div className="mt-xs hidden grid-cols-2 gap-x-md gap-y-xs lg:grid">
                            {hiddenFeatures.map((feature) => (
                              <div className="flex items-center gap-xs" key={feature}>
                                <Image
                                  alt=""
                                  className="h-3.5 w-3.5 shrink-0"
                                  height={14}
                                  src="/images/vdp/Keyfeature.svg"
                                  width={14}
                                />
                                <span className="text-sm">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </CollapsibleContent>
                      </div>
                    </div>
                  )}
                </Collapsible>
              </div>

              {/* Desktop Full Details Button - Fixed at bottom */}
              <div className="shrink-0 bg-surface pb-5 lg:block lg:pb-0">
                <Button
                  asChild={!!vdpUrl}
                  className="flex h-10 w-full items-center justify-center gap-2.5 rounded-[var(--radius-full)] bg-brand text-primary-foreground hover:bg-primary-hover"
                >
                  {vdpUrl ? <a href={vdpUrl}>Full Details</a> : "Full Details"}
                </Button>
              </div>
            </div>
          </div>
          <style jsx>{`
            .vehicle-preview-scroll::-webkit-scrollbar {
              display: none;
            }
          `}</style>
        </div>
      </DialogContent>
    </Dialog>
  );
};
