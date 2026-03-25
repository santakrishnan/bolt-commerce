"use client";

import { buildVdpPath, type VdpParams } from "@config/routes";
import { BackToSearch } from "@features/vdp/components/back-to-search";
import { VehicleBadges } from "@features/vdp/components/badges-vehicle";
import { VehicleColors } from "@features/vdp/components/colors-vehicle";
import { VehicleDealerInfo } from "@features/vdp/components/dealer-info";
import { ImagePreviewModal } from "@features/vdp/components/image-preview-modal";
import { ImageCarousel } from "@features/vdp/components/image-thumbnail-carousal";
import { VehicleKeyFeatures } from "@features/vdp/components/key-features";
import { VehiclePrice } from "@features/vdp/components/price-and-wasprice";
import { VehicleSpecsGrid } from "@features/vdp/components/specs";
import { VehicleStickyBanner } from "@features/vdp/components/sticky-banner";
import { VehicleTitle } from "@features/vdp/components/title";
import { VehicleActionIcons } from "@features/vdp/components/vehicle-action-icons";
import { VehicleBreadcrumbList } from "@features/vdp/components/vehicle-breadcrumb";
import {
  exteriorColorSwatches,
  interiorColorSwatches,
  swatchColor,
} from "@features/vdp/components/vehicle-meta-bar.constants";
import type { VehicleDetail } from "@features/vdp/data";
import { useStickyScroll } from "@features/vdp/hooks/use-sticky-scroll";
import { usePathname } from "next/navigation";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import { VdpPromotionCards } from "./vdp-promotion-cards";

interface VehiclePDPProps {
  promotionSlot?: React.ReactNode;
  slugParams: VdpParams;
  testDriveSlot?: React.ReactNode;
  vehicle: VehicleDetail;
}

export const VehiclePDP: React.FC<VehiclePDPProps> = ({
  vehicle,
  slugParams,
  promotionSlot,
  testDriveSlot,
}) => {
  const pathname = usePathname();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);

  // biome-ignore lint: reason biome/useEffectExhaustiveDeps -- We only want to run this on pathname change, not on every render
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    setIsPreviewOpen(false);
  }, [pathname]);

  const rightRef = useRef<HTMLDivElement | null>(null);
  const keyHighlightsRef = useRef<HTMLDivElement | null>(null);
  const keyHighlightsMobileRef = useRef<HTMLDivElement | null>(null);

  const { bannerRef } = useStickyScroll(keyHighlightsRef, keyHighlightsMobileRef);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const getHeaderHeight = useCallback(() => {
    if (typeof window === "undefined") {
      return 80;
    }
    const header = document.querySelector("header");
    if (header) {
      const rect = header.getBoundingClientRect();
      return rect.height;
    }
    return 80;
  }, []);
  useEffect(() => {
    getHeaderHeight();
  }, [getHeaderHeight]);

  const openPreview = () => {
    setPreviewIndex(currentImageIndex);
    setIsPreviewOpen(true);
  };

  return (
    <div className="mx-auto max-w-[var(--container-2xl)]">
      <VehicleStickyBanner ref={bannerRef} slugParams={slugParams} vehicle={vehicle} />
      <div className="mb-6 flex items-center justify-between lg:px-0">
        <div className="flex items-center gap-2">
          <BackToSearch />
          <div className="mx-[var(--spacing-xs)] mt-[calc(var(--spacing-2xs))] hidden h-[16px] w-[1px] bg-[color:var(--structure-interaction-border,#D4D4D4)] md:mx-[var(--spacing-lg,8px)] md:block" />
          <VehicleBreadcrumbList slugParams={slugParams} />
        </div>
        <VehicleActionIcons
          showFav={true}
          showPrint={true}
          showShare={true}
          vdpUrl={buildVdpPath(slugParams)}
          vehicle={{
            title: vehicle.title,
            year: vehicle.year,
            make: vehicle.make,
            model: vehicle.model,
            price: vehicle.price,
            originalPrice: vehicle.originalPrice ?? undefined,
            condition: vehicle.condition,
            warranty: vehicle.warranty,
            inspected: vehicle.inspected,
            miles: vehicle.miles,
            drivetrain: vehicle.drivetrain,
            mpg: vehicle.mpg,
            stock: vehicle.stock,
            vin: vehicle.vin,
            exterior: vehicle.exteriorColor,
            interior: vehicle.interiorColor,
            dealer: vehicle.dealer.name,
            location: vehicle.dealer.location,
            distance: vehicle.dealer.distance,
            images: vehicle.images,
            features: vehicle.highlights,
          }}
          vin={vehicle.vin}
        />
      </div>

      <ImagePreviewModal
        alt={vehicle.title ?? "Vehicle image"}
        currentIndex={previewIndex}
        images={vehicle.images}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onIndexChange={setPreviewIndex}
      />

      <div
        className="flex flex-col lg:grid lg:grid-cols-[minmax(0,1fr)_392px] lg:items-start lg:gap-(--spacing-10)"
        ref={containerRef}
      >
        <div className="flex min-w-0 flex-col gap-(--spacing-md)">
          <ImageCarousel
            alt={vehicle.title ?? "Vehicle image"}
            carouselClassName="h-full w-full overflow-hidden lg:rounded-md [&>div]:h-full"
            containerClassName="relative aspect-[4/3] w-full overflow-hidden rounded-none bg-background lg:aspect-auto lg:h-[518px] lg:rounded-md"
            getThumbnailButtonClassName={(isActive) =>
              `h-(--size-thumbnail) w-(--size-thumbnail) shrink-0 cursor-pointer rounded-md p-(--spacing-2xs) transition-all ${
                isActive
                  ? "border-(length:--border-width-1) border-brand"
                  : "border-(length:--border-width-1) border-divider hover:border-border"
              }`
            }
            id={`${vehicle.id}-region`}
            images={vehicle.images}
            onImageClick={openPreview}
            onImageIndexChange={setCurrentImageIndex}
            thumbnailContainerClassName="flex gap-(--spacing-xs) overflow-x-auto  pb-(--spacing-md) lg:gap-(--spacing-md) [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            thumbnailImageClassName="h-full w-full rounded-md object-contain"
            thumbnailSize={{ width: 97, height: 97 }}
          />
          <VehicleKeyFeatures
            className="hidden rounded-md bg-[var(--color-inverse-foreground)] p-(--spacing-lg) lg:block"
            collapsible={false}
            features={vehicle.highlights}
            ref={keyHighlightsRef}
          />
        </div>
        <div
          className="mt-(--spacing-md) flex w-full flex-col gap-(--spacing-lg) lg:sticky lg:top-[100px] lg:mt-0 lg:px-0"
          ref={rightRef}
        >
          <div className="flex flex-col gap-[var(--spacing-sm)] lg:gap-[var(--spacing-lg)]">
            <VehicleTitle
              className="font-bold text-[length:var(--font-size-lg)] text-foreground leading-none lg:mt-[-6px] lg:text-[length:var(--text-2xl)]"
              title={vehicle.title}
            />
            <VehiclePrice
              className="flex flex-wrap items-baseline gap-(--spacing-xs)"
              originalPrice={vehicle.originalPrice}
              price={vehicle.price}
              priceClassName="font-bold text-2xl text-brand leading-none lg:text-2xl"
            />
          </div>

          <VehicleBadges
            className="grid grid-cols-3 gap-(--spacing-xs)"
            inspected={vehicle.inspected}
            warranty={vehicle.warranty}
          />
          <div className="h-[var(--border-width-1,1px)] w-full shrink-0 bg-[var(--structure-interaction-overlay-border,rgba(212,212,212,0.50))]" />

          <VehicleSpecsGrid
            className="grid grid-cols-3 gap-(--spacing-xs)"
            drivetrain={vehicle.drivetrain}
            miles={vehicle.miles}
            mpg={vehicle.mpg}
            stock={vehicle.stock}
            vin={vehicle.vin}
          />
          <div className="h-[var(--border-width-1,1px)] w-full shrink-0 bg-[var(--structure-interaction-overlay-border,rgba(212,212,212,0.50))]" />

          <VehicleColors
            className="flex gap-(--spacing-xs) [&>*]:flex-1"
            exteriorName={vehicle.exteriorColor}
            exteriorSwatchStyle={{
              backgroundColor: swatchColor(vehicle.exteriorColor, exteriorColorSwatches),
            }}
            interiorName={vehicle.interiorColor}
            interiorSwatchStyle={{
              backgroundColor: swatchColor(vehicle.interiorColor, interiorColorSwatches),
            }}
          />
          <div className="h-[var(--border-width-1,1px)] w-full shrink-0 bg-[var(--structure-interaction-overlay-border,rgba(212,212,212,0.50))]" />

          {promotionSlot ?? (
            <div className="flex flex-col gap-(--spacing-md)">
              <VdpPromotionCards showTestDrive={false} />
            </div>
          )}

          <VehicleDealerInfo
            avatarClassName="flex size-(--size-avatar-sm) items-center justify-center rounded-full bg-brand"
            className=""
            dealerLocation={vehicle.dealer.location}
            dealerName={vehicle.dealer.name}
            distance={vehicle.dealer.distance}
            logoClassName="h-[24px] w-[23px]"
            logoSrc="/images/vdp/Vector_4.svg"
          />

          {testDriveSlot ?? (
            <VdpPromotionCards
              showPrequal={false}
              showTradeIn={false}
              testDriveButtonText="Schedule Test Drive"
            />
          )}

          <div className="h-[var(--border-width-1,1px)] w-full shrink-0 bg-[var(--structure-interaction-overlay-border,rgba(212,212,212,0.50))]" />
          <VehicleKeyFeatures
            className="rounded-lg bg-[var(--color-inverse-foreground)] px-[var(--spacing-md)] py-[var(--spacing-md)] lg:hidden"
            collapsible={false}
            features={vehicle.highlights}
            ref={keyHighlightsMobileRef}
          />
        </div>
      </div>
    </div>
  );
};
