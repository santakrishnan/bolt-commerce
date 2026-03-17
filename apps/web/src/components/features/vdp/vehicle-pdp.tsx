"use client";

import { usePathname } from "next/navigation";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { BackToSearch } from "~/components/features/vdp/back-to-search";
import { VehicleBadges } from "~/components/features/vdp/badges-vehicle";
import { VehicleColors } from "~/components/features/vdp/colors-vehicle";
import { VehicleDealerInfo } from "~/components/features/vdp/dealer-info";
import { ImagePreviewModal } from "~/components/features/vdp/image-preview-modal";
import { ImageCarousel } from "~/components/features/vdp/image-thumbnail-carousal";
import { VehicleKeyFeatures } from "~/components/features/vdp/key-features";
import { VehiclePrice } from "~/components/features/vdp/price-and-wasprice";
import { VehicleSpecsGrid } from "~/components/features/vdp/specs";
import { VehicleStickyBanner } from "~/components/features/vdp/sticky-banner";
import { VehicleTitle } from "~/components/features/vdp/title";
import { VehicleActionIcons } from "~/components/features/vdp/vehicle-action-icons";
import { VehicleBreadcrumbList } from "~/components/features/vdp/vehicle-breadcrumb";
import { VehicleCTAButtons } from "~/components/features/vdp/vehicle-status";
import type { VehicleDetail, VehicleStatusData } from "~/lib/data/vehicle";
import { buildVdpPath, type VdpParams } from "~/lib/routes";

// import { VehicleStatusBanners } from "./vehicle-status-banners";

interface VehiclePDPProps {
  vehicle: VehicleDetail;
  slugParams: VdpParams;
  vehicleStatus: VehicleStatusData;
}

export const VehiclePDP: React.FC<VehiclePDPProps> = ({
  vehicle,
  slugParams /*, vehicleStatus */,
}) => {
  // Ensure page starts at top on load
  const pathname = usePathname();
  // biome-ignore lint: reason biome/useEffectExhaustiveDeps -- We only want to run this on pathname change, not on every render
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  const rightRef = useRef<HTMLDivElement | null>(null);

  //This is used for both desktop and mobile key highlights, as well as scroll calculations for the sticky CTA. Both the ref are used for getting the position of key highlights for scroll calculations, and the state is used to determine when to show the sticky CTA on mobile and animate it in on desktop. The logic is combined for both desktop and mobile to ensure the sticky CTA appears at the right time regardless of which version of key highlights is currently visible.

  const keyHighlightsRef = useRef<HTMLDivElement | null>(null);
  const keyHighlightsMobileRef = useRef<HTMLDivElement | null>(null);

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
      // Use whichever Key Highlights element is currently visible (desktop vs mobile)
      const desktopEl = keyHighlightsRef.current;
      const mobileEl = keyHighlightsMobileRef.current;
      const target = desktopEl && desktopEl.offsetParent !== null ? desktopEl : mobileEl;
      if (!target) {
        return;
      }
      const rect = target.getBoundingClientRect();
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

  const containerRef = useRef<HTMLDivElement | null>(null);

  // Get header height for scroll calculations
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

  // Open preview at current image index
  const openPreview = () => {
    setPreviewIndex(currentImageIndex);
    setIsPreviewOpen(true);
  };

  return (
    <div className="mx-auto max-w-[var(--container-2xl)]">
      {/* Sticky vehicle details banner */}
      <VehicleStickyBanner
        scrollDirection={scrollDirection}
        showStickyCTA={showStickyCTA}
        slugParams={slugParams}
        stickyHeight={STICKY_HEIGHT}
        stickyScrollOffset={stickyScrollOffset}
        vehicle={vehicle}
      />
      {/* Breadcrumb Navigation */}
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
            originalPrice: vehicle.originalPrice,
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
        {/* Left Side - Image Section */}
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

          {/* Key Highlights - Desktop only */}
          <VehicleKeyFeatures
            className="hidden rounded-md bg-background p-(--spacing-lg) lg:block"
            collapsible={false}
            features={vehicle.highlights}
            ref={keyHighlightsRef}
          />
        </div>

        {/* Right Side - Details Section */}
        <div
          className="mt-(--spacing-md) flex w-full flex-col gap-(--spacing-lg) lg:sticky lg:top-[100px] lg:mt-0 lg:px-0"
          ref={rightRef}
        >
          {/* Title and Price */}
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

          {/* Badges */}
          <VehicleBadges
            className="grid grid-cols-3 gap-(--spacing-xs)"
            inspected={vehicle.inspected}
            warranty={vehicle.warranty}
          />
          <div className="h-[var(--border-width-1,1px)] w-full shrink-0 bg-[var(--structure-interaction-overlay-border,rgba(212,212,212,0.50))]" />

          {/* Specs Grid */}
          <VehicleSpecsGrid
            className="grid grid-cols-3 gap-(--spacing-xs)"
            drivetrain={vehicle.drivetrain}
            miles={vehicle.miles}
            mpg={vehicle.mpg}
            stock={vehicle.stock}
            vin={vehicle.vin}
          />
          <div className="h-[var(--border-width-1,1px)] w-full shrink-0 bg-[var(--structure-interaction-overlay-border,rgba(212,212,212,0.50))]" />

          {/* Colors */}
          <VehicleColors
            className="flex gap-(--spacing-xs) [&>*]:flex-1"
            exteriorName={vehicle.exteriorColor}
            exteriorSwatchStyle={{
              background: "linear-gradient(166deg, #3F3F3F -30%, #A5A5A5 140%)",
            }}
            interiorName={vehicle.interiorColor}
            interiorSwatchStyle={{ backgroundColor: "black" }}
          />
          <div className="h-[var(--border-width-1,1px)] w-full shrink-0 bg-[var(--structure-interaction-overlay-border,rgba(212,212,212,0.50))]" />

          {/* CTA Buttons */}
          <VehicleCTAButtons />
          <div className="h-[var(--border-width-1,1px)] w-full shrink-0 bg-[var(--structure-interaction-overlay-border,rgba(212,212,212,0.50))]" />

          {/* Dealer Info */}
          <VehicleDealerInfo
            avatarClassName="flex size-(--size-avatar-sm) items-center justify-center rounded-full bg-brand"
            className=""
            dealerLocation={vehicle.dealer.location}
            dealerName={vehicle.dealer.name}
            distance={vehicle.dealer.distance}
            logoClassName="h-[24px] w-[23px]"
            logoSrc="/images/vdp/Vector_4.svg"
          />
          <div className="h-[var(--border-width-1,1px)] w-full shrink-0 bg-[var(--structure-interaction-overlay-border,rgba(212,212,212,0.50))]" />

          {/* Key Highlights - Mobile only */}
          <VehicleKeyFeatures
            className="rounded-lg bg-background px-(--spacing-md) py-(--spacing-md) lg:hidden"
            collapsible={false}
            features={vehicle.highlights}
            ref={keyHighlightsMobileRef}
          />
        </div>
      </div>
    </div>
  );
};
