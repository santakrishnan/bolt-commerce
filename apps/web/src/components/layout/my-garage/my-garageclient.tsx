"use client";

import type { ReactNode } from "react";
import CarCard from "~/components/features/card/car-card";
import { MyGarageCards } from "~/components/features/mygarage/my-garage-cards";
import { TestDriveBanner } from "~/components/features/mygarage/test-drive-banner";
import { useFavorites } from "~/components/providers/favorites-provider";
import { useSearchHistory } from "~/components/providers/search-history-provider";
import { getVehicleEstimation, type Vehicle } from "~/lib/search/mock-vehicles";

/** Parse dealer name and distance from the miles field (e.g. "Toyota of Fort Worth - 6.1mi") */
function parseDealerInfo(miles: string) {
  const parts = miles.split(" - ");
  return {
    dealerName: parts[0] ?? miles,
    distance: parts[1] ?? "",
  };
}

interface MyGarageClientProps {
  cars: Vehicle[];
  children?: ReactNode;
  /** Customer prequalification status - determines which financing card variation to show */
  isPreQualified?: boolean;
  /** Customer trade-in submission status - determines which trade-in card variation to show */
  hasTradeInSubmitted?: boolean;
  /** Days remaining for prequalification offer (out of 30) */
  daysRemaining?: number;
}

export function MyGarageClient({
  cars,
  children,
  isPreQualified = false,
  hasTradeInSubmitted = false,
  daysRemaining = 27,
}: MyGarageClientProps) {
  const { savedVins, toggleVehicle, isVehicleSaved, removeVehicle } = useFavorites();
  const { searches, removeSearch, clearAll: clearAllSearches } = useSearchHistory();

  // Map search entries to the format expected by MyGarageCards
  const recentSearchCards = searches.map((entry) => ({
    id: entry.id,
    search: entry.query,
    url: entry.url,
  }));

  // Derive saved-vehicle cards by matching VINs against the cars prop
  const savedVehicles = savedVins
    .map((vin) => cars.find((c) => c.vin === vin))
    .filter((car): car is Vehicle => car !== undefined)
    .map((car) => ({
      id: car.vin,
      imageUrl: Array.isArray(car.image) ? (car.image[0] ?? "") : car.image,
      title: car.title,
      price: `$${car.price.toLocaleString()}`,
      miles: car.odometer,
    }));

  const handleRemoveSavedVehicle = (id: number | string) => {
    removeVehicle(String(id));
  };

  const handleFavoriteToggle = (car: Vehicle) => {
    toggleVehicle(car.vin);
  };

  return (
    <div className="relative min-h-screen">
      {/* Background layer with image and gradient overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/images/garage/background.svg')",
          backgroundSize: "cover",
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
        }}
      />
      {/* Gradient overlay: solid #F5F5F5 at top only, transparent below to show background image */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(to bottom, #F5F5F5 0%, #F5F5F5 350px, rgba(245,245,245,0) 600px, rgba(245,245,245,0) 100%)",
        }}
      />
      {/* Content */}
      <div className="relative z-10">
        <h2 className="mx-auto mb-8 w-full max-w-[var(--container-2xl)] px-4 pt-8 text-left font-semibold text-lg sm:px-6 lg:px-20">
          My Garage
        </h2>
        <div className="mx-auto mb-10 w-full max-w-[var(--container-2xl)] px-4 sm:px-6 lg:px-20">
          <MyGarageCards
            financing={{
              prequalified: isPreQualified,
              daysRemaining,
            }}
            onClearAllSearches={clearAllSearches}
            onRemoveSavedVehicle={handleRemoveSavedVehicle}
            onRemoveSearch={removeSearch}
            recentSearches={recentSearchCards}
            savedVehicles={savedVehicles}
            tradeOffer={{
              imageUrl: hasTradeInSubmitted ? "/images/vehicles/offer.png" : undefined,
              title: hasTradeInSubmitted ? "2019 Audi A7" : undefined,
              price: hasTradeInSubmitted ? "$15,500" : undefined,
              miles: hasTradeInSubmitted ? "68,150 miles" : undefined,
              expiresIn: hasTradeInSubmitted ? "2 days" : undefined,
              hasSubmittedTradeIn: hasTradeInSubmitted,
            }}
          />
        </div>

        <h2 className="mx-auto mb-6 w-full max-w-[var(--container-2xl)] px-4 text-left font-semibold text-xl sm:px-6 lg:px-20">
          Best Matches for you
        </h2>
        <div className="mx-auto grid max-w-[var(--container-2xl)] grid-cols-1 gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-20 xl:grid-cols-4">
          {cars.slice(0, 12).map((car) => {
            const firstLabel = car.labels[0];
            const { dealerName, distance } = parseDealerInfo(car.miles);
            const estimation = getVehicleEstimation(car);

            let badgeType: "excellent" | "priceDrop" | "available" | undefined;
            if (firstLabel === "Excellent Price") {
              badgeType = "excellent";
            } else if (firstLabel === "Price Drop") {
              badgeType = "priceDrop";
            } else if (firstLabel) {
              badgeType = "available";
            }

            return (
              <CarCard
                badge={badgeType && firstLabel ? { type: badgeType, text: firstLabel } : undefined}
                carImage={car.image}
                carName={car.title}
                dealerName={dealerName}
                distance={distance}
                estimatedPayment={`Est. ${estimation.estimatedMonthlyPayment}/mo`}
                estimation={estimation}
                exteriorColor="White"
                exteriorColorSolid="#FFFFFF"
                features={{ warranty: true, inspected: true, oneOwner: car.owners === 1 }}
                interiorColor="Black"
                interiorColorHex="#000000"
                key={car.id}
                make={car.make}
                matchPercentage={car.match > 0 ? car.match.toString() : undefined}
                mileage={car.odometer}
                model={car.model}
                onFavoriteToggle={() => handleFavoriteToggle(car)}
                owners={car.owners}
                price={`$${car.price.toLocaleString()}`}
                variant={car.variant}
                vin={car.vin}
                wasLiked={isVehicleSaved(car.vin)}
                wasPrice={car.oldPrice ? `$${car.oldPrice.toLocaleString()}` : undefined}
                year={car.year}
              />
            );
          })}
        </div>

        {children}

        <div className="mx-auto mt-20 mb-10 w-full">
          <TestDriveBanner />
        </div>
        {/* Because You Viewed Toyota Camry */}
        <h2 className="mx-auto mb-8 w-full max-w-[var(--container-2xl)] px-4 text-left font-semibold text-xl sm:px-6 lg:px-20">
          Because You Viewed Toyota Camry
        </h2>
        <div className="mx-auto mb-16 grid max-w-[var(--container-2xl)] grid-cols-1 gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-20 xl:grid-cols-4">
          {cars.slice(0, 4).map((car) => {
            const badgeLabel = car.labels[0];
            const { dealerName, distance } = parseDealerInfo(car.miles);
            const estimation = getVehicleEstimation(car);

            let badgeType: "excellent" | "priceDrop" | "available" | undefined;
            if (badgeLabel === "Excellent Price") {
              badgeType = "excellent";
            } else if (badgeLabel === "Price Drop") {
              badgeType = "priceDrop";
            } else if (badgeLabel) {
              badgeType = "available";
            }

            return (
              <CarCard
                badge={
                  badgeType && badgeLabel
                    ? {
                        type: badgeType,
                        text: badgeLabel,
                      }
                    : undefined
                }
                carImage={car.image}
                carName={car.title}
                dealerName={dealerName}
                distance={distance}
                estimatedPayment={`Est. ${estimation.estimatedMonthlyPayment}/mo`}
                estimation={estimation}
                exteriorColor="White"
                exteriorColorSolid="#FFFFFF"
                features={{ warranty: true, inspected: true, oneOwner: car.owners === 1 }}
                interiorColor="Black"
                interiorColorHex="#000000"
                key={car.id}
                make={car.make}
                matchPercentage={car.match > 0 ? String(car.match) : undefined}
                mileage={car.odometer}
                model={car.model}
                onFavoriteToggle={() => handleFavoriteToggle(car)}
                owners={car.owners}
                price={`$${car.price.toLocaleString()}`}
                variant={car.variant}
                vin={car.vin}
                wasLiked={isVehicleSaved(car.vin)}
                wasPrice={car.oldPrice ? `$${car.oldPrice.toLocaleString()}` : undefined}
                year={car.year}
              />
            );
          })}
        </div>

        {/* Recent Price Drop - only cars with oldPrice */}
        <h2 className="mx-auto mb-8 w-full max-w-[var(--container-2xl)] px-4 text-left font-semibold text-xl sm:px-6 lg:px-20">
          Recent Price Drop
        </h2>
        <div className="mx-auto grid max-w-[var(--container-2xl)] grid-cols-1 gap-4 px-4 pb-16 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-20 xl:grid-cols-4">
          {cars
            .filter((car) => car.oldPrice)
            .slice(0, 4)
            .map((car) => {
              const { dealerName, distance } = parseDealerInfo(car.miles);
              const estimation = getVehicleEstimation(car);

              return (
                <CarCard
                  badge={{ type: "priceDrop", text: "Price Drop" }}
                  carImage={car.image}
                  carName={car.title}
                  dealerName={dealerName}
                  distance={distance}
                  estimatedPayment={`Est. ${estimation.estimatedMonthlyPayment}/mo`}
                  estimation={estimation}
                  exteriorColor="White"
                  exteriorColorSolid="#FFFFFF"
                  features={{ warranty: true, inspected: true, oneOwner: car.owners === 1 }}
                  interiorColor="Black"
                  interiorColorHex="#000000"
                  key={car.id}
                  make={car.make}
                  matchPercentage={car.match > 0 ? String(car.match) : undefined}
                  mileage={car.odometer}
                  model={car.model}
                  onFavoriteToggle={() => handleFavoriteToggle(car)}
                  owners={car.owners}
                  price={`$${car.price.toLocaleString()}`}
                  variant={car.variant}
                  vin={car.vin}
                  wasLiked={isVehicleSaved(car.vin)}
                  wasPrice={`$${car.oldPrice?.toLocaleString()}`}
                  year={car.year}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
}
