import Image from "next/image";
import { useEffect, useState } from "react";
import { mockVehicles } from "~/lib/search/mock-vehicles";
import { VehiclePreviewModal } from "../vehicle-preview-modal/vehicle-preview-modal";
import EstimationModal from "./estimation-modal";
import { RefineSearchModal } from "./refine-search-modal";

interface EstimationData {
  creditScore: string;
  apr: string;
  termLength: string;
  estimatedMonthlyPayment: string;
}

export interface CarCardProps {
  wasLiked?: boolean;
  carImage: string | string[];
  carName: string;
  // Optional VDP route segments — used to build the VDP URL and populate the preview modal
  make?: string;
  model?: string;
  variant?: string;
  year?: number;
  vin?: string;
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
  badge?: {
    type: "excellent" | "available" | "priceDrop";
    text: string;
  };
  features?: {
    warranty?: boolean;
    inspected?: boolean;
    oneOwner?: boolean;
  };
  estimation?: EstimationData;
  onFavoriteToggle?: () => void;
  /** Set to false to disable the card-click preview modal (e.g. on the garage page) */
  enablePreviewModal?: boolean;
}

// ─── Carousel ────────────────────────────────────────────────────────────────

function Carousel({ images, carName }: { images: string[]; carName: string }) {
  const [current, setCurrent] = useState(0);

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
  };
  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));
  };

  if (images.length === 0) {
    return null;
  }

  return (
    <div className="relative h-78 w-full">
      <Image
        alt={carName}
        className="absolute inset-0 h-full max-h-78 w-full max-w-104 object-contain p-4"
        height={312}
        src={images[current] ?? ""}
        width={416}
      />
      <div className="absolute right-0 bottom-2 left-0 z-20 flex items-center justify-between px-4">
        <button
          aria-label="Previous image"
          className="rounded-full bg-white/80 p-1 shadow hover:bg-white"
          onClick={prev}
          type="button"
        >
          <Image
            alt="Previous"
            className="h-5 w-5"
            height={20}
            src="/images/vdp/chevron-left2.svg"
            width={20}
          />
        </button>
        <div className="flex flex-1 justify-center gap-1">
          {images.map((img, idx) => (
            <span
              className="relative flex h-4 w-4 items-center justify-center transition-all duration-200"
              key={img}
            >
              {idx === current ? (
                <>
                  <span className="absolute h-4 w-4 rounded-full border-2 border-black bg-white" />
                  <span className="relative z-10 h-1.5 w-1.5 rounded-full bg-black" />
                </>
              ) : (
                <span className="h-2 w-2 rounded-full bg-gray-300" />
              )}
            </span>
          ))}
        </div>
        <button
          aria-label="Next image"
          className="rounded-full bg-white/80 p-1 shadow hover:bg-white"
          onClick={next}
          type="button"
        >
          <Image
            alt="Next"
            className="h-5 w-5"
            height={20}
            src="/images/vdp/Chevron-right2.svg"
            width={20}
          />
        </button>
      </div>
    </div>
  );
}

// ─── LikeButton ──────────────────────────────────────────────────────────────

const LikeButton = ({ liked, onToggle }: { liked: boolean; onToggle: () => void }) => {
  const [animating, setAnimating] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle();
    setAnimating(true);
  };

  useEffect(() => {
    if (!animating) {
      return undefined;
    }
    const timer = setTimeout(() => setAnimating(false), 500);
    return () => clearTimeout(timer);
  }, [animating]);

  return (
    <button
      aria-label="Add to favorites"
      className={`heart-button flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white transition-colors hover:bg-gray-50 ${
        animating ? "animate" : ""
      }`}
      onClick={handleClick}
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

// ─── CarCard ──────────────────────────────────────────────────────────────────

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Component has many conditional renders for badges, features, and modal state
export default function CarCard({
  carImage,
  carName,
  make,
  model,
  variant,
  year,
  vin,
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
  badge,
  owners,
  wasLiked,
  features = { warranty: true, inspected: true, oneOwner: true },
  estimation,
  onFavoriteToggle,
  enablePreviewModal = true,
}: CarCardProps) {
  const [liked, setLiked] = useState(!!wasLiked);
  const [showEstimation, setShowEstimation] = useState(false);
  const [showRefineSearch, setShowRefineSearch] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Keep heart in sync when parent re-renders with updated isVehicleSaved value
  useEffect(() => {
    setLiked(!!wasLiked);
  }, [wasLiked]);

  const handleFavoriteToggle = () => {
    setLiked((prev) => !prev);
    onFavoriteToggle?.();
  };

  const vehiclePreviewData = {
    year,
    make,
    model,
    price: Number.parseInt(price.replace(/[^0-9]/g, ""), 10) || 0,
    originalPrice: wasPrice ? Number.parseInt(wasPrice.replace(/[^0-9]/g, ""), 10) : 0,
    warranty: features?.warranty ?? false,
    inspected: features?.inspected ?? false,
    miles: mileage,
    vin,
    exterior: exteriorColor,
    exteriorColorCode: exteriorColorHex,
    interior: interiorColor,
    interiorColorCode: interiorColorHex,
    dealer: dealerName,
    distance,
    images: Array.isArray(carImage) ? carImage : [carImage],
  };

  const vdpUrl =
    make && model && variant && year && vin
      ? `/used-cars/details/${make}/${model}/${variant}/${year}/${vin}`
      : "#";

  const handleCardClick = () => {
    if (enablePreviewModal) {
      setShowPreviewModal(true);
    }
  };

  return (
    <>
      {/* Vehicle Preview Modal — Dialog portal, not bounded by the card */}
      <VehiclePreviewModal
        isLiked={liked}
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        onLikeChange={setLiked}
        vdpUrl={vdpUrl}
        vehicle={vehiclePreviewData}
      />

      {/* biome-ignore lint/a11y/useSemanticElements: Card layout requires div structure for proper styling */}
      <div
        className="relative flex w-full cursor-pointer flex-col overflow-hidden rounded-lg bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl"
        onClick={handleCardClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleCardClick();
          }
        }}
        role="button"
        tabIndex={0}
      >
        {/* Image Container with Carousel */}
        <div className="relative h-78 overflow-hidden">
          {Array.isArray(carImage) && carImage.length > 1 ? (
            <Carousel carName={carName} images={carImage} />
          ) : (
            <Image
              alt={carName}
              className="absolute inset-0 h-full max-h-78 w-full max-w-104 object-contain p-4"
              height={312}
              src={typeof carImage === "string" ? carImage : (carImage[0] ?? "")}
              width={416}
            />
          )}

          {/* Top Overlay - Badge and Icons */}
          <div className="absolute top-0 right-0 left-0 flex items-start justify-between p-4 pt-2 pr-2">
            {/* Badge */}
            <div>
              {badge ? (
                <>
                  {badge.type === "excellent" && (
                    <div className="mt-1.5·flex·max-h-[24px]·items-center·justify-center·gap-2·rounded·bg-success·px-2·py-1·pt-0.5">
                      <Image
                        alt="Excellent Price"
                        className="pt-0.5"
                        height={12}
                        src="/images/search/excellent-price.svg"
                        width={14}
                      />
                      <span className="font-semibold text-2xs text-white">{badge.text}</span>
                    </div>
                  )}
                  {badge.type === "available" && (
                    <div className="flex items-center justify-center gap-2 rounded bg-success px-2 py-1 pt-0.5">
                      <span className="font-semibold text-2xs text-white">{badge.text}</span>
                    </div>
                  )}
                  {badge.type === "priceDrop" && (
                    <div className="mt-1.5 flex items-center justify-center gap-2 rounded bg-[var(--color-card-badge-price-drop)] px-2 py-1 pt-0.5">
                      <Image
                        alt="Price Drop"
                        height={12}
                        src="/images/search/price-drop.svg"
                        width={14}
                      />
                      <span className="font-semibold text-2xs text-white">{badge.text}</span>
                    </div>
                  )}
                </>
              ) : (
                <div className="h-6" />
              )}
            </div>

            {/* Share and Favorite Icons */}
            <div className="mt-[-3px] flex gap-0">
              <button
                aria-label="Share"
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white transition-colors hover:bg-gray-50"
                onClick={(e) => e.stopPropagation()}
                type="button"
              >
                <Image alt="Share" height={36} src="/images/garage/share.svg" width={36} />
              </button>
              <LikeButton liked={liked} onToggle={handleFavoriteToggle} />
            </div>
          </div>
        </div>

        {/* Content */}
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
                    setShowEstimation(true);
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
                <Image
                  alt="Match star"
                  height={13}
                  src="/images/search/match-star.svg"
                  width={14}
                />
                <span className="font-semibold text-2xs text-white">{matchPercentage}% Match</span>
              </div>
            )}
            {/* stopPropagation prevents card click from opening VehiclePreviewModal */}
            <button
              className="cursor-pointer text-[var(--color-card-title)] text-sm underline hover:text-muted-foreground"
              onClick={(e) => {
                e.stopPropagation();
                setShowRefineSearch(true);
              }}
              type="button"
            >
              Refine your search
            </button>
          </div>

          {/* Divider */}
          <div className="h-px bg-black opacity-10" />

          {/* Dealer Info */}
          <div className="flex h-6 items-center justify-between">
            <button
              className="cursor-pointer text-muted-foreground text-sm underline hover:text-[var(--color-card-title)]"
              onClick={(e) => e.stopPropagation()}
              type="button"
            >
              {dealerName}
            </button>
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
                <svg
                  aria-hidden="true"
                  className="h-3.5 w-4 text-muted-foreground"
                  fill="none"
                  viewBox="0 0 15 14"
                >
                  <title>owners icon</title>
                  <circle cx="7.5" cy="4" r="3" stroke="currentColor" strokeWidth="1.5" />
                  <path
                    d="M1.5 13c0-3.31 2.69-6 6-6s6 2.69 6 6"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="1.5"
                  />
                </svg>
                <span className="whitespace-nowrap text-muted-foreground text-xs">
                  {owners} Owner{owners > 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ── In-card overlays (absolute inset-0, bounded by the card) ── */}

        {showEstimation && (
          // biome-ignore lint/a11y/noStaticElementInteractions: presentation wrapper stops card-click propagation
          <div
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            role="presentation"
          >
            <EstimationModal
              apr={estimation?.apr ?? "5.49%"}
              creditScore={estimation?.creditScore ?? "Excellent (800+) FICO® Score"}
              estimatedMonthlyPayment={estimation?.estimatedMonthlyPayment ?? "$583"}
              onClose={() => setShowEstimation(false)}
              termLength={estimation?.termLength ?? "$2,500"}
            />
          </div>
        )}

        {showRefineSearch && (
          // biome-ignore lint/a11y/noStaticElementInteractions: presentation wrapper stops card-click propagation
          <div
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            role="presentation"
          >
            <RefineSearchModal
              isOpen={showRefineSearch}
              onClose={() => setShowRefineSearch(false)}
            />
          </div>
        )}
      </div>
    </>
  );
}

// Render a list of CarCards using mockVehicles
export function CarCardList() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {mockVehicles.map((vehicle) => (
        <CarCard
          badge={(() => {
            if (!vehicle.labels[0]) {
              return undefined;
            }
            let type: "excellent" | "priceDrop" | "available" = "available";
            if (vehicle.labels[0] === "Excellent Price") {
              type = "excellent";
            } else if (vehicle.labels[0] === "Price Drop") {
              type = "priceDrop";
            }
            return { type, text: vehicle.labels[0] };
          })()}
          carImage={vehicle.image}
          carName={vehicle.title}
          dealerName="Local Dealer"
          distance={vehicle.miles}
          estimatedPayment={vehicle.estimation?.estimatedMonthlyPayment || "$580/mo"}
          exteriorColor="Blue"
          exteriorColorHex="#1E3A8A"
          interiorColor="Black"
          interiorColorHex="#000000"
          key={vehicle.id}
          make={vehicle.make}
          matchPercentage={vehicle.match?.toString()}
          mileage={vehicle.odometer}
          model={vehicle.model}
          owners={vehicle.owners}
          price={`$${vehicle.price.toLocaleString()}`}
          variant={vehicle.variant}
          vin={vehicle.vin}
          wasPrice={vehicle.oldPrice ? `$${vehicle.oldPrice.toLocaleString()}` : undefined}
          year={vehicle.year}
        />
      ))}
    </div>
  );
}
