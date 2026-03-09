"use client";

import { useState } from "react";
import {
  DealerInfoCard,
  DealerNotesSection,
  VehicleDetailsTabs,
  VehiclePDP,
  VehicleRating,
  VehicleStatusFAB,
} from "~/components/features/vdp";
import { sampleDealerNotes } from "~/lib/data/dealer/dealer-data";
import type { VdpPageData, VehicleStatusData } from "~/lib/data/vehicle";
import { getVehicleStatusFromFlagsSync } from "~/lib/flags/vdp-client";
import { capitalize } from "~/lib/formatters";
import type { VdpParams } from "~/lib/routes";

interface VehicleDetailClientProps {
  vehicle: VdpParams;
  pageData: VdpPageData;
  vdpUrl: string;
}

export function VehicleDetailClient({ vehicle, pageData }: VehicleDetailClientProps) {
  const {
    vehicle: vehicleData,
    specs,
    features,
    featuresInitialCount,
    pricing,
    priceHistory,
    history,
    rating,
    vehicleStatus,
  } = pageData;

  // Initialise from the persisted VDP flag cookie (localStorage). Falls back to
  // pageData.vehicleStatus when no scenario has been selected by the debug FAB.
  const [activeVehicleStatus, setActiveVehicleStatus] = useState<VehicleStatusData>(() => {
    const fromFlag = getVehicleStatusFromFlagsSync();
    const hasActiveFlag = Object.values(fromFlag).some(Boolean);
    return hasActiveFlag ? fromFlag : vehicleStatus;
  });

  console.log("trim slug value in client component", vehicle.trimSlug); // Debug log to verify trim value

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1">
        {/* Vehicle PDP Section */}
        <div className="mx-auto max-w-[var(--container-2xl)] px-4 py-12 sm:px-6 lg:px-20">
          <VehiclePDP
            slugParams={vehicle}
            vehicle={vehicleData}
            vehicleStatus={activeVehicleStatus}
          />
        </div>

        {/* Tabs, Rating and Dealer section - full width grey background */}
        <div className="w-full bg-gray-100 pt-4 pb-10 lg:py-[var(--spacing-4xl)]">
          <div className="mx-auto max-w-[var(--container-2xl)] px-6 sm:px-6 lg:px-20">
            <VehicleDetailsTabs
              features={features}
              featuresInitialCount={featuresInitialCount}
              featuresTableView={activeVehicleStatus.featuresTableView}
              historyData={history}
              priceHistory={priceHistory}
              pricingData={pricing}
              showInspectionSection={true}
              specs={specs}
            />

            {/* Rating Section */}
            <div className="mt-6">
              <VehicleRating
                distribution={rating.distribution}
                rating={rating.rating}
                reviewCount={rating.reviewCount}
                title={`${vehicle.year} ${capitalize(vehicle.make)} ${capitalize(vehicle.model)} ${vehicle.trimSlug?.toUpperCase()}`}
              />
            </div>

            {/* Dealer Notes Section */}
            <div className="mt-6">
              <DealerNotesSection
                onReviewsClick={() => {
                  // TODO: implement reviews navigation
                }}
                onTestDriveClick={() => {
                  // TODO: implement test drive scheduling
                }}
              />
            </div>
          </div>
        </div>

        {/* Dealer Info Section - white background, no gap before footer */}
        <div className="mx-auto max-w-[var(--container-2xl)] px-6 sm:px-6 lg:px-[var(--spacing-4xl)]">
          <DealerInfoCard
            dealer={sampleDealerNotes.dealer}
            onReviewsClick={() => {
              // TODO: implement reviews navigation
            }}
            onTestDriveClick={() => {
              // TODO: implement test drive scheduling
            }}
          />
        </div>

        {/* Floating Action Button for vehicle status switching */}
        <VehicleStatusFAB onStatusChange={setActiveVehicleStatus} />
      </main>
    </div>
  );
}
