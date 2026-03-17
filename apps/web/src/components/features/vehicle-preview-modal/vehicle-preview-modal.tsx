"use client";
import { Button, Dialog, DialogContent } from "@tfs-ucmp/ui";
import Image from "next/image";
import Link from "next/link";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { VehicleBadges } from "~/components/features/vdp/badges-vehicle";
import { VehicleColors } from "~/components/features/vdp/colors-vehicle";
import { VehicleDealerInfo } from "~/components/features/vdp/dealer-info";
import { ImageCarousel } from "~/components/features/vdp/image-thumbnail-carousal";
import { VehicleKeyFeatures } from "~/components/features/vdp/key-features";
import { VehiclePrice } from "~/components/features/vdp/price-and-wasprice";
import { VehicleSpecsGrid } from "~/components/features/vdp/specs";
import { VehicleTitle } from "~/components/features/vdp/title";
import { VehicleActionIcons } from "~/components/features/vdp/vehicle-action-icons";
import { AppButton } from "~/components/shared/button";
import {
  demoVehiclePreview,
  type VehiclePreviewData,
} from "~/lib/data/vehicle-preview/vehicle-preview";

export interface VehiclePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle?: Partial<VehiclePreviewData>;
  vdpUrl?: string;
  /** VIN used by the FavoriteButton for global toggle. */
  vin?: string;
}

export const VehiclePreviewModal: React.FC<VehiclePreviewModalProps> = ({
  isOpen,
  onClose,
  vehicle: vehicleProp,
  vdpUrl,
  vin,
}) => {
  // Merge provided vehicle data with demo defaults
  const vehicle = { ...demoVehiclePreview, ...vehicleProp };
  const [_isScrolling, setIsScrolling] = useState(false);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const updateScrollIndicators = useCallback(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollTop, scrollHeight, clientHeight } = container;
      setCanScrollUp(scrollTop > 0);
      setCanScrollDown(scrollTop + clientHeight < scrollHeight - 1);
    }
  }, []);
  const handleScroll = useCallback(() => {
    setIsScrolling(true);
    updateScrollIndicators();
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 400);
  }, [updateScrollIndicators]);

  // Check scroll indicators when modal opens
  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure content is rendered
      setTimeout(updateScrollIndicators, 100);
    }
  }, [isOpen, updateScrollIndicators]);

  return (
    <Dialog onOpenChange={(open) => !open && onClose()} open={isOpen}>
      <DialogContent
        className="top-15! left-1/2! h-[calc(100%-60px)] w-full max-w-350 -translate-x-1/2! translate-y-0! rounded-t-[var(--radius-2xl)]! p-0! lg:top-15.5! lg:h-[calc(100vh-129px)] lg:w-[calc(100vw-var(--spacing-10)*2)] lg:rounded-[var(--radius-xl)]! [&>button]:hidden"
        overlayClassName="inset-0! top-0! bg-[var(--color-core-surfaces-foreground)]/70"
      >
        <div className="flex h-full flex-col overflow-hidden rounded-t-[var(--radius-2xl)] bg-surface lg:rounded-[var(--radius-lg)]">
          {/* Header */}
          <div className="flex items-center justify-between border-surface border-b px-md py-sm lg:px-10 lg:py-lg">
            <Button
              className="flex items-center gap-xs font-medium text-heading text-sm hover:opacity-70 lg:hidden"
              onClick={onClose}
              type="button"
              variant="ghost"
            >
              <Image
                alt="Back to search"
                className="h-(--size-icon-md) w-(--size-icon-md)"
                height={20}
                src="/images/vdp/chevron-left.svg"
                width={20}
              />
              <span>Back to Search</span>
            </Button>
            <span className="hidden font-normal text-foreground text-md leading-5 lg:block">
              Vehicle Preview
            </span>
            <div className="flex items-center gap-lg">
              <VehicleActionIcons
                showFav={true}
                showPrint={true}
                showShare={true}
                vdpUrl={vdpUrl}
                vehicle={vehicle}
                vin={vin}
              />
              <Button
                className="cursor-pointer pl-xs hover:opacity-70"
                onClick={onClose}
                type="button"
                variant="search"
              >
                <Image
                  alt="Close dialog"
                  className="h-6 w-6"
                  height={24}
                  src="/images/vdp/x-close.svg"
                  width={24}
                />
              </Button>
            </div>
          </div>

          {/* Main Content - Image and Details */}
          <div
            className="scrollbar-hide flex min-h-0 flex-1 flex-col overflow-y-auto lg:flex-row lg:overflow-hidden lg:pb-16.75"
            onScroll={handleScroll}
          >
            {/* Left Side - Image Section (65% on desktop) */}
            <div className="flex shrink-0 flex-col gap-(--spacing-sm) lg:min-h-0 lg:w-[65%] lg:shrink lg:gap-6.25 lg:pt-0 lg:pr-11.25 lg:pl-(--spacing-10)">
              <ImageCarousel
                alt={vehicle.title ?? "Vehicle preview image"}
                images={vehicle.images}
              />
            </div>
            {/* Right Side - Details (35% on desktop) */}
            <div className="relative flex flex-col justify-between bg-surface px-lg lg:min-h-0 lg:w-[35%] lg:overflow-hidden lg:px-0 lg:pt-0 lg:pr-(--spacing-10)">
              {/* Top gradient - shows when can scroll up */}
              {canScrollUp && (
                <div
                  className="pointer-events-none absolute top-0 right-0 left-0 z-10 h-8 lg:right-(--spacing-10)"
                  style={{ background: "linear-gradient(to bottom, #ffffff 0%, #ffffff00 100%)" }}
                />
              )}
              {/* Scrollable Content Area */}
              <div
                className="scrollbar-hide vehicle-preview-scroll flex min-h-0 flex-1 flex-col gap-[var(--spacing-lg)] overflow-y-auto lg:pb-0"
                onScroll={handleScroll}
                ref={scrollContainerRef}
                style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}
              >
                <div className="pt-lg lg:pt-0">
                  <VehicleTitle title={vehicle.title} />
                  <VehiclePrice originalPrice={vehicle.originalPrice} price={vehicle.price} />
                </div>
                <VehicleBadges inspected={vehicle.inspected} warranty={vehicle.warranty} />
                <div className="h-[var(--border-width-1,1px)] w-full shrink-0 bg-[var(--structure-interaction-overlay-border,rgba(212,212,212,0.50))]" />
                <VehicleSpecsGrid
                  drivetrain={vehicle.drivetrain}
                  miles={vehicle.miles}
                  mpg={vehicle.mpg}
                  stock={vehicle.stock}
                  vin={vehicle.vin}
                />
                <div className="h-[var(--border-width-1,1px)] w-full shrink-0 bg-[var(--structure-interaction-overlay-border,rgba(212,212,212,0.50))]" />
                <VehicleColors
                  exteriorName={vehicle.exterior}
                  exteriorSwatchStyle={{ backgroundColor: vehicle.exteriorColorCode }}
                  interiorName={vehicle.interior}
                  interiorSwatchStyle={{ backgroundColor: vehicle.interiorColorCode }}
                />

                <div className="h-[var(--border-width-1,1px)] w-full shrink-0 bg-[var(--structure-interaction-overlay-border,rgba(212,212,212,0.50))]" />
                <VehicleDealerInfo
                  dealerLocation={vehicle.location}
                  dealerName={vehicle.dealer}
                  distance={vehicle.distance}
                />
                <div className="h-[var(--border-width-1,1px)] w-full shrink-0 bg-[var(--structure-interaction-overlay-border,rgba(212,212,212,0.50))]" />
                <VehicleKeyFeatures className="pb-[20px]" features={vehicle.features} />
              </div>
              {/* Bottom gradient - shows when can scroll down */}
              {canScrollDown && (
                <div
                  className="pointer-events-none absolute right-0 bottom-14 left-0 z-10 h-8 lg:right-(--spacing-10) lg:bottom-10"
                  style={{ background: "linear-gradient(to bottom, #ffffff00 0%, #ffffff 100%)" }}
                />
              )}
              {/* Desktop Full Details Button - Fixed at bottom, hides on scroll */}
              <div className="shrink-0 bg-surface pb-(--spacing-5) lg:block lg:pb-0">
                <AppButton asChild={!!vdpUrl} className="w-full" size="md" variant="primary">
                  {vdpUrl ? <Link href={vdpUrl}>Full Details</Link> : "Full Details"}
                </AppButton>
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
