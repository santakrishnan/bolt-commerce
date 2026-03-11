import { Button } from "@tfs-ucmp/ui";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { mockVehicles } from "~/lib/search/mock-vehicles";
import { VehiclePreviewModal } from "../vehicle-preview-modal/vehicle-preview-modal";
import { CardBadge, resolveCarCardBadge } from "./car-card-badge";
import { Carousel } from "./car-card-carousel";
import { CarCardContent } from "./car-card-content";
import { LikeButton } from "./car-card-like-button";
import type { CarCardProps } from "./car-card-types";
import EstimationModal from "./estimation-modal";
import { RefineSearchModal } from "./refine-search-modal";

export type { CarCardProps } from "./car-card-types";

// ─── CarCard ──────────────────────────────────────────────────────────────────

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
  onApplyRefineFilters,
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

  const handleFavoriteToggle = useCallback(() => {
    setLiked((prev) => !prev);
    onFavoriteToggle?.();
  }, [onFavoriteToggle]);

  const vehiclePreviewData = useMemo(
    () => ({
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
    }),
    [
      year,
      make,
      model,
      price,
      wasPrice,
      features,
      mileage,
      vin,
      exteriorColor,
      exteriorColorHex,
      interiorColor,
      interiorColorHex,
      dealerName,
      distance,
      carImage,
    ]
  );

  const vdpUrl = useMemo(
    () =>
      make && model && variant && year && vin
        ? `/used-cars/details/${make}/${model}/${variant}/${year}/${vin}`
        : "#",
    [make, model, variant, year, vin]
  );

  const handleCardClick = useCallback(() => {
    if (enablePreviewModal) {
      setShowPreviewModal(true);
    }
  }, [enablePreviewModal]);

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
        className="group relative flex w-full cursor-pointer flex-col overflow-hidden rounded-lg bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl"
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
              <CardBadge badge={badge} />
            </div>

            {/* Share and Favorite Icons */}
            <div className="mt-[-3px] flex gap-0">
              <Button
                aria-label="Share"
                className="h-9 w-9 rounded-full bg-white hover:bg-gray-50"
                onClick={(e) => e.stopPropagation()}
                size="icon"
                type="button"
                variant="ghost"
              >
                <Image alt="Share" height={36} src="/images/garage/share.svg" width={36} />
              </Button>
              <LikeButton liked={liked} onToggle={handleFavoriteToggle} />
            </div>
          </div>
        </div>

        <CarCardContent
          carName={carName}
          dealerName={dealerName}
          distance={distance}
          estimatedPayment={estimatedPayment}
          exteriorColor={exteriorColor}
          exteriorColorGradient={exteriorColorGradient}
          exteriorColorHex={exteriorColorHex}
          features={features}
          interiorColor={interiorColor}
          interiorColorHex={interiorColorHex}
          matchPercentage={matchPercentage}
          mileage={mileage}
          onShowEstimation={() => setShowEstimation(true)}
          onShowRefineSearch={() => setShowRefineSearch(true)}
          owners={owners}
          price={price}
          wasPrice={wasPrice}
        />

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
              onApplyFilters={onApplyRefineFilters}
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
          badge={resolveCarCardBadge(vehicle.labels[0])}
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
