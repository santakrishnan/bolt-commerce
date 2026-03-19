import {
  DealerInfoCard,
  DealerNotesSection,
  VehicleDetailsTabs,
  VehiclePDP,
  VehicleRating,
} from "~/components/features/vdp";
import type { DealerNotes } from "~/lib/data/dealer/dealer-data";
import type { VdpParams } from "~/lib/routes";
import type { VehicleBundle } from "~/services/vdp-api";

export interface UsedCarsDetailsProps {
  dealerDataPromise: Promise<DealerNotes>;
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
 * Receives data as promises so the parent can wrap this in <Suspense>,
 * allowing the page shell (header/footer) to stream immediately while
 * data fetches resolve.
 */
export async function UsedCarsDetails({
  dealerDataPromise,
  vehicleBundlePromise,
  make,
  model,
  trim,
  year,
  vin,
}: UsedCarsDetailsProps) {
  const [{ vinData, vehicleData }, dealerData] = await Promise.all([
    vehicleBundlePromise,
    dealerDataPromise,
  ]);
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
          <VehiclePDP slugParams={vehicle} vehicle={vehicleInfo} />
        </div>

        {/* Tabs (client) + server-rendered rating & dealer content */}
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
