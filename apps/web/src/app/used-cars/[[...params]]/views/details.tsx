import type { VehicleData, VinData } from "~/lib/data/vehicle";
import { buildVdpPath, type VdpParams } from "~/lib/routes";
import { VehicleDetailClient } from "./vehicle-detail-client";

interface UsedCarsDetailsProps {
  make: string;
  model: string;
  trim: string;
  year: number;
  vin: string;
  vinData: VinData;
  vehicleData: VehicleData;
}

/**
 * Vehicle detail page.
 * Route: /used-cars/details/[make]/[model]/[trim]/[year]/[vin]
 * e.g.   /used-cars/details/toyota/camry/xse/2024/1234567890ABCDEFG
 *
 * Reuses the existing VehicleDetailClient component.
 */
export function UsedCarsDetails({
  make,
  model,
  trim,
  year,
  vin,
  vinData,
  vehicleData,
}: UsedCarsDetailsProps) {
  // Map to the VdpParams shape expected by VehicleDetailClient
  const vehicle: VdpParams = {
    make,
    model,
    trimSlug: trim === "-" ? null : trim,
    year,
    vin,
  };

  // Canonical VDP URL: /used-cars/details/[make]/[model]/[trim]/[year]/[vin]
  const vdpUrl = buildVdpPath(vehicle);

  return (
    <VehicleDetailClient
      vdpUrl={vdpUrl}
      vehicle={vehicle}
      vehicleData={vehicleData}
      vinData={vinData}
    />
  );
}
