import { AppButton } from "~/components/shared/button";
import type React from "react";
import type { VehicleDetail } from "~/lib/data/vehicle";
import { buildVdpPath, type VdpParams } from "~/lib/routes";
import { VehicleActionIcons } from "./vehicle-action-icons";
export interface VehicleStickyBannerProps {
  vehicle: VehicleDetail;
  slugParams: VdpParams;
  showStickyCTA: boolean;
  stickyScrollOffset: number;
  scrollDirection: "up" | "down";
  stickyHeight?: number;
}

export const VehicleStickyBanner: React.FC<VehicleStickyBannerProps> = ({
  vehicle,
  showStickyCTA,
  stickyScrollOffset,
  scrollDirection,
  stickyHeight = 72,
  slugParams,
}) => {
  const shouldShowOriginalPrice =
    vehicle.originalPrice != null && vehicle.originalPrice > (vehicle.price ?? 0);

  return (
    <div
      className="fixed right-0 left-0 z-50 bg-surface py-(--spacing-lg) shadow-sm"
      style={{
        opacity:
          scrollDirection === "down"
            ? Math.min(1, stickyScrollOffset / stickyHeight)
            : Math.max(0, stickyScrollOffset / stickyHeight),
        transform:
          scrollDirection === "down"
            ? `translateY(${Math.max(stickyHeight - stickyScrollOffset, 0)}px)`
            : "translateY(0px)",
        transition: "opacity 0.2s, transform 0.2s",
        display: showStickyCTA ? "block" : "none",
        top: 0,
      }}
    >
      <div className="mx-auto h-full max-w-(--container-2xl) px-(--spacing-md) sm:px-(--spacing-lg) lg:px-(--spacing-4xl)">
        {/* Mobile: stacked layout */}
        <div className="flex flex-col gap-(--spacing-xs) md:hidden">
          {/* Row 1: Heading */}
          <h1 className="text-(length:--text-xl) font-bold text-[var(--color-core-surfaces-foreground)] leading-normal">
            {vehicle.title}
          </h1>
          {/* Row 2: Price/was on left, share links on right */}
          <div className="flex items-center justify-between gap-(--spacing-md)">
            <div className="flex items-baseline gap-(--spacing-xs)">
              <span className="text-(length:--font-size-lg) font-bold text-brand leading-normal">
                ${vehicle.price.toLocaleString()}
              </span>
              {shouldShowOriginalPrice && (
                <div className="flex items-baseline gap-(--spacing-2xs)">
                  <span className="font-normal text-[var(--color-core-surfaces-foreground)] text-xs leading-normal">
                    was
                  </span>
                  <span className="font-normal text-[var(--color-core-surfaces-foreground)] text-xs leading-normal line-through">
                    ${vehicle.originalPrice.toLocaleString()}
                  </span>
                </div>
              )}
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
          {/* Row 3: Miles left, VIN right */}
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row gap-(--spacing-2xs)">
              <p className="font-semibold text-[var(--color-core-surfaces-foreground)] text-sm">
                Miles:
              </p>
              <p className="font-semibold text-[var(--color-core-surfaces-foreground)] text-sm">
                {vehicle.miles.toLocaleString()}
              </p>
            </div>
            <div className="flex flex-row gap-(--spacing-2xs)">
              <p className="font-semibold text-[var(--color-core-surfaces-foreground)] text-sm">
                VIN:
              </p>
              <p className="font-semibold text-[var(--color-core-surfaces-foreground)] text-sm">
                {vehicle.vin}
              </p>
            </div>
          </div>
          {/* Row 4: Full-width button */}
          <AppButton className="w-full" variant="primary" size="md"
            onClick={() => {
              // TODO: wire up pre-qualification flow
            }}>
            Get Pre-Qualified
          </AppButton>
        </div>

        {/* Tablet and above: two-column layout */}
        <div className="hidden md:flex md:items-center md:justify-between md:gap-(--spacing-lg)">
          {/* Left: heading + price in one line, miles + VIN below */}
          <div className="flex min-w-0 flex-col gap-(--spacing-md)">
            <div className="flex flex-wrap items-baseline gap-x-(--spacing-md) gap-y-(--spacing-2xs)">
              <h1 className="font-bold text-[var(--color-core-surfaces-foreground)] text-lg leading-[115%]">
                {vehicle.title}
              </h1>
              <div className="flex items-baseline gap-(--spacing-xs)">
                <span className="font-bold text-(--color-actions-accent) text-lg leading-[115%]">
                  ${vehicle.price.toLocaleString()}
                </span>
                {shouldShowOriginalPrice && (
                  <div className="flex items-baseline gap-(--spacing-2xs)">
                    <span className="font-normal text-[var(--color-states-muted-foreground)] text-xs leading-normal tracking-[-0.14px]">
                      was
                    </span>
                    <span className="text-[var(--color-states-muted-foreground)] text-sm leading-[125%] line-through">
                      ${vehicle.originalPrice.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-row items-center gap-(--spacing-xl)">
              <div className="flex flex-row gap-(--spacing-2xs)">
                <p className="text-(length:--font-size-md) font-semibold text-[var(--color-core-surfaces-foreground)] tracking-[-0.16px]">
                  Miles:
                </p>
                <p className="text-(length:--font-size-md) font-semibold text-[var(--color-core-surfaces-foreground)] tracking-[-0.16px]">
                  {vehicle.miles.toLocaleString()}
                </p>
              </div>
              <div className="flex flex-row gap-(--spacing-2xs)">
                <p className="text-(length:--font-size-md) font-semibold text-[var(--color-core-surfaces-foreground)] tracking-[-0.16px]">
                  VIN:
                </p>
                <p className="text-(length:--font-size-md) font-semibold text-[var(--color-core-surfaces-foreground)] tracking-[-0.16px]">
                  {vehicle.vin}
                </p>
              </div>
            </div>
          </div>

          {/* Right: share icons + CTA button */}
          <div className="flex shrink-0 items-center gap-(--spacing-2xl)">
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
            <div>
              <AppButton variant="primary" size="md" onClick={() => {
                // TODO: wire up pre-qualification flow
              }}>
                Get Pre-Qualified
              </AppButton>
            </div>
          </div >
        </div >
      </div >
    </div >
  );
};
