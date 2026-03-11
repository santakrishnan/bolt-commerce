import { Button } from "@tfs-ucmp/ui";
import Image from "next/image";
import type { CarCardProps } from "./car-card-types";

interface CarCardContentProps {
  carName: string;
  price: string;
  wasPrice?: string;
  mileage: string;
  estimatedPayment: string;
  exteriorColor: string;
  exteriorColorHex: string;
  exteriorColorGradient?: string;
  interiorColor: string;
  interiorColorHex: string;
  matchPercentage?: string;
  dealerName: string;
  distance: string;
  owners: number;
  features: NonNullable<CarCardProps["features"]>;
  onShowEstimation: () => void;
  onShowRefineSearch: () => void;
}

/** Renders the card body — price, mileage, colours, match, dealer, features */
export function CarCardContent({
  carName,
  price,
  wasPrice,
  mileage,
  estimatedPayment,
  exteriorColor,
  exteriorColorHex,
  exteriorColorGradient,
  interiorColor,
  interiorColorHex,
  matchPercentage,
  dealerName,
  distance,
  owners,
  features,
  onShowEstimation,
  onShowRefineSearch,
}: CarCardContentProps) {
  return (
    <div className="flex flex-col gap-3 p-4 pb-3">
      {/* Divider */}
      <div className="h-px bg-black opacity-10" />

      <div className="max-h-[71px]">
        {/* Car Name and Price */}
        <div className="flex items-start justify-between py-0">
          <h3 className="max-w-[180px] overflow-hidden break-words font-bold text-[var(--color-card-title)] text-base leading-5.5">
            {carName}
          </h3>
          <div className="ml-2 flex flex-col items-end gap-2">
            {wasPrice ? (
              <span className="text-gray-400 text-xs">
                <span>was&nbsp;</span>
                <span className="line-through">{wasPrice.toLocaleString()}</span>
              </span>
            ) : (
              <span className="text-white text-xs">-</span>
            )}
            <p className="font-semibold text-[var(--color-card-price)] text-xl">{price}</p>
          </div>
        </div>

        {/* Mileage and Estimated Payment */}
        <div className="flex h-6 items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Image
              alt="Mileage"
              className="pt-0.5"
              height={14}
              src="/images/garage/odometer.svg"
              width={14}
            />
            <span className="text-muted-foreground text-sm">{mileage}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[var(--color-card-estimated-payment)] text-sm">
              {estimatedPayment}
            </span>
            {/* stopPropagation prevents card click from opening VehiclePreviewModal */}
            <Image
              alt="Info"
              className="cursor-pointer"
              height={15}
              onClick={(e) => {
                e.stopPropagation();
                onShowEstimation();
              }}
              src="/images/i.svg"
              width={15}
            />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-black opacity-10" />

      {/* Exterior Color */}
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-sm">Exterior:</span>
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground text-sm">{exteriorColor}</span>
          <div className="relative h-6 w-6">
            {exteriorColorGradient ? (
              <div
                className="h-6 w-6 rounded-full border border-[var(--color-states-muted)]"
                style={{ background: exteriorColorGradient }}
              />
            ) : (
              <div
                className="h-6 w-6 rounded-full border border-[var(--color-states-muted)]"
                style={{ backgroundColor: exteriorColorHex }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-black opacity-10" />

      {/* Interior Color */}
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-sm">Interior:</span>
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground text-sm">{interiorColor}</span>
          <div
            className="h-6 w-6 rounded-full border border-[var(--color-states-muted)]"
            style={{ backgroundColor: interiorColorHex }}
          />
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-black opacity-10" />

      {/* Match Badge and Refine Search */}
      <div className="flex items-center justify-between">
        {matchPercentage && (
          <div className="flex h-6 items-center justify-center gap-1.5 rounded bg-black px-2 py-1 pb-1.5">
            <Image alt="Match star" height={13} src="/images/search/match-star.svg" width={14} />
            <span className="font-semibold text-2xs text-white">{matchPercentage}% Match</span>
          </div>
        )}
        {/* stopPropagation prevents card click from opening VehiclePreviewModal */}
        <Button
          className="h-auto p-0 text-[var(--color-card-title)] text-sm underline hover:bg-transparent hover:text-muted-foreground"
          onClick={(e) => {
            e.stopPropagation();
            onShowRefineSearch();
          }}
          type="button"
          variant="ghost"
        >
          Refine your search
        </Button>
      </div>

      {/* Divider */}
      <div className="h-px bg-black opacity-10" />

      {/* Dealer Info */}
      <div className="flex h-6 items-center justify-between">
        <Button
          className="h-auto p-0 text-muted-foreground text-sm underline hover:bg-transparent hover:text-[var(--color-card-title)]"
          onClick={(e) => e.stopPropagation()}
          type="button"
          variant="ghost"
        >
          {dealerName}
        </Button>
        <div className="flex items-center gap-1.5">
          <Image
            alt="Distance"
            className="pt-1"
            height={12}
            src="/images/search/distance.svg"
            width={9.6}
          />
          <span className="text-muted-foreground text-sm">{distance}</span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-black opacity-10" />

      {/* Features */}
      <div className="flex items-center justify-between gap-3">
        {features.warranty && (
          <div className="flex shrink-0 items-center gap-1">
            <Image alt="Warranty" height={16} src="/images/garage/warranty.svg" width={12} />
            <span className="whitespace-nowrap text-muted-foreground text-xs">Warranty</span>
          </div>
        )}
        {features.inspected && (
          <div className="flex shrink-0 items-center gap-1">
            <Image alt="Inspected" height={15} src="/images/garage/inspected.svg" width={15} />
            <span className="whitespace-nowrap text-muted-foreground text-xs">Inspected</span>
          </div>
        )}
        {features.oneOwner && owners > 0 && (
          <div className="flex shrink-0 items-center gap-1">
            <Image alt="Owners" height={14} src="/images/garage/owners.svg" width={16} />
            <span className="whitespace-nowrap text-muted-foreground text-xs">
              {owners} Owner{owners > 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
