import type { VdpParams } from "@config/routes";
import {
  DealerInfoCard,
  DealerNotesSection,
  VehicleDetailsTabs,
  VehiclePDP,
  VehicleRating,
} from "@features/vdp/components";
import { AuthAwarePromotions } from "@features/vdp/components/auth-aware-promotions";
import {
  PromotionCardsSkeleton,
  TestDriveCardSkeleton,
} from "@features/vdp/components/promotion-skeletons";
import type { VehicleBundle } from "@features/vdp/services/vdp-api";
import type { DealerNotes } from "@shared/data/dealer/dealer-data";
import { Suspense } from "react";

export interface UsedCarsDetailsProps {
  make: string;
  model: string;
  trim: string;
  vehicleBundlePromise: Promise<VehicleBundle>;
  vin: string;
  year: number;
}

/**
 * Vehicle detail page — async Server Component (donut pattern).
 *
 * Receives the vehicle bundle as a promise so the parent can wrap this
 * in <Suspense>, allowing the page shell to stream immediately.
 * Dealer info comes from a separate dealer service call (fetched in parallel).
 */
export async function UsedCarsDetails({
  vehicleBundlePromise,
  make,
  model,
  trim,
  year,
  vin,
}: UsedCarsDetailsProps) {
  const { vinData, vehicleData, dealerInfo } = await vehicleBundlePromise;
  const dealerData: DealerNotes = {
    vehicleDescription: vinData.dealerNotes,
    vehicleImage: vinData.vehicle.images[0] ?? "/images/vdp/dealer_info.png",
    dealer: dealerInfo,
  };
  const vehicle: VdpParams = {
    make,
    model,
    trimSlug: trim === "-" ? null : trim,
    year,
    vin,
  };

  const { vehicle: vehicleInfo, pricing, priceHistory, history } = vinData;
  const { specs, features, featuresInitialCount, rating, vehicleStatus } = vehicleData;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1">
        {/* Client island: carousel, sticky banner, scroll logic, promotion cards */}
        <div className="mx-auto max-w-(--container-2xl) px-4 py-12 sm:px-6 lg:px-20">
          <VehiclePDP
            dealerInfo={dealerInfo}
            promotionSlot={
              <Suspense fallback={<PromotionCardsSkeleton />}>
                <AuthAwarePromotions variant="prequal" />
              </Suspense>
            }
            slugParams={vehicle}
            testDriveSlot={
              <Suspense fallback={<TestDriveCardSkeleton />}>
                <AuthAwarePromotions variant="test-drive" />
              </Suspense>
            }
            vehicle={vehicleInfo}
          />
        </div>

        {/* Tabs (client) + server-rendered rating & dealer content */}
        <div className="w-full bg-[var(--color-core-surfaces-background)] pt-4 pb-10 lg:py-(--spacing-4xl)">
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

            {/* Server-rendered rating */}
            <div className="mt-6">
              <VehicleRating
                distribution={rating.distribution}
                rating={rating.rating}
                reviewCount={rating.reviewCount}
                title={vehicleInfo.title ?? ""}
              />
            </div>

            {/* Server-rendered dealer notes */}
            <div className="mt-6">
              <DealerNotesSection data={dealerData} />
            </div>
          </div>
        </div>

        {/* Server-rendered dealer info card */}
        <div className="mx-auto max-w-(--container-2xl) px-6 sm:px-6 lg:px-(--spacing-4xl)">
          <DealerInfoCard dealer={dealerData.dealer} />
        </div>
      </main>
    </div>
  );
}
