import { cacheLife } from "next/cache";

export type { InspectionFeature } from "~/data/inspection/features";
export type { VehicleType } from "~/data/vehicles/vehicle-types";

export async function getVehicleCount(): Promise<number> {
  "use cache";
  cacheLife("landing");

  // TODO: Replace with actual API call
  // const res = await fetch('https://api.example.com/vehicles/count')
  // const data = await res.json()
  // return data.count

  return await Promise.resolve(20_847);
}

export async function getVehicleTypes() {
  try {
    const module = await import("~/data/vehicles/vehicle-types");
    return module.vehicleTypes;
  } catch (_error) {
    return [];
  }
}

export async function getInspectionFeatures() {
  try {
    const module = await import("~/data/inspection/features");
    return module.inspectionFeatures;
  } catch (_error) {
    return [];
  }
}
