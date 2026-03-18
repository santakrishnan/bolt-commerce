"use client";

import {
  DealerInfoCard,
  DealerNotesSection,
  VehicleDetailsTabs,
  VehiclePDP,
  VehicleRating,
} from "~/components/features/vdp";
import { useDealerData } from "~/hooks/use-dealer-data";
import type { VehicleData, VinData } from "~/lib/data/vehicle";
import type { VdpParams } from "~/lib/routes";

interface VehicleDetailClientProps {
  vdpUrl: string;
  vehicle: VdpParams;
  vehicleData: VehicleData;
  vinData: VinData;
}

export function VehicleDetailClient({ vehicle, vinData, vehicleData }: VehicleDetailClientProps) {
  const { vehicle: vehicleInfo, pricing, priceHistory, history } = vinData;

  const { specs, features, featuresInitialCount, rating, vehicleStatus } = vehicleData;

  // Fetch dealer details from VIN so the dealer association follows vehicle inventory.
  const { dealerInfo, dealerNotes } = useDealerData(vehicle.vin);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1">
        {/* Vehicle PDP Section */}
        <div className="mx-auto max-w-(--container-2xl) px-4 py-12 sm:px-6 lg:px-20">
          <VehiclePDP slugParams={vehicle} vehicle={vehicleInfo} />
        </div>

        {/* Tabs, Rating and Dealer section - full width grey background */}
        <div className="w-full bg-gray-100 pt-4 pb-10 lg:py-(--spacing-4xl)">
          <div className="mx-auto max-w-(--container-2xl) px-6 sm:px-6 lg:px-20">
            <VehicleDetailsTabs
              features={features}
              featuresInitialCount={featuresInitialCount}
              featuresTableView={vehicleStatus.featuresTableView}
              historyData={history}
              priceHistory={priceHistory}
              pricingData={pricing}
              showInspectionSection={true}
              specs={specs}
              vehicle={vehicleInfo}
              vehicleStatus={vehicleStatus}
            />

            {/* Rating Section */}
            <div className="mt-6">
              <VehicleRating
                distribution={rating.distribution}
                rating={rating.rating}
                reviewCount={rating.reviewCount}
                title={vehicleInfo.title ?? ""}
              />
            </div>

            {/* Dealer Notes Section */}
            <div className="mt-6">
              <DealerNotesSection data={dealerNotes} />
            </div>
          </div>
        </div>

        {/* Dealer Info Section - white background, no gap before footer */}
        <div className="mx-auto max-w-(--container-2xl) px-6 sm:px-6 lg:px-(--spacing-4xl)">
          <DealerInfoCard dealer={dealerInfo} />
        </div>
      </main>
    </div>
  );
}
