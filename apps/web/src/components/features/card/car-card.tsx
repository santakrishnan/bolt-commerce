import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CustomBadge } from "~/components/shared/custom-badge";
import { FavoriteButton } from "~/components/shared/favourite-button";
import { ShareButton } from "~/components/shared/share-button";
import { buildUsedCarsPath } from "~/lib/routes";
import { mockVehicles } from "~/lib/search/mock-vehicles";
import { VehiclePreviewModal } from "../vehicle-preview-modal/vehicle-preview-modal";
import { Carousel } from "./car-card-carousel";
import { CarCardContent } from "./car-card-content";
import type { CarCardProps } from "./car-card-types";
import EstimationModal from "./estimation-modal";
import { RefineSearchModal } from "./refine-search-modal";

export type { CarCardProps } from "./car-card-types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function resolveBadgeNode(badge: CarCardProps["badge"]) {
  if (!badge) {
    return <div className="h-6" />;
  }
  if (badge.type === "excellent") {
    return <CustomBadge text={badge.text} type="excellentPrice" />;
  }
  if (badge.type === "priceDrop") {
    return <CustomBadge text={badge.text} type="priceDrop" />;
  }
  return <CustomBadge icon={null} text={badge.text} type="preQualifies" />;
}

function resolveBadgeType(label: string): NonNullable<CarCardProps["badge"]>["type"] {
  if (label === "Excellent Price") {
    return "excellent";
  }
  if (label === "Price Drop") {
    return "priceDrop";
  }
  return "available";
}

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
  features = { warranty: true, inspected: true, oneOwner: true },
  estimation,
  onApplyRefineFilters,
  enablePreviewModal = true,
}: CarCardProps) {
  const [showEstimation, setShowEstimation] = useState(false);
  const [showRefineSearch, setShowRefineSearch] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  useEffect(() => {
    setShowPreviewModal(false);
  }, []);

  const vehiclePreviewData = useMemo(
    () => ({
      title: carName,
      year,
      make,
      model,
      trim: variant,
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
      carName,
      year,
      make,
      model,
      variant,
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
        ? buildUsedCarsPath({ type: "details", make, model, trim: variant, year, vin })
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
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        vdpUrl={vdpUrl}
        vehicle={vehiclePreviewData}
        vin={vin}
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
            <div>{resolveBadgeNode(badge)}</div>

            {/* Share and Favorite Icons */}
            <div className="-mt-0.75 flex gap-0">
              <ShareButton vehicleUrl={vdpUrl} />
              {vin && <FavoriteButton vin={vin} />}
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
              isOpen={showEstimation}
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

/** Fisher-Yates shuffle — returns a new randomly-ordered copy. */
function shuffle<T>(arr: readonly T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = copy[i];
    copy[i] = copy[j] as T;
    copy[j] = tmp as T;
  }
  return copy;
}

// Render a list of CarCards using mockVehicles
export function CarCardList() {
  const shuffled = shuffle(mockVehicles);
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {shuffled.map((vehicle) => (
        <CarCard
          badge={
            vehicle.labels[0]
              ? { type: resolveBadgeType(vehicle.labels[0]), text: vehicle.labels[0] }
              : undefined
          }
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
