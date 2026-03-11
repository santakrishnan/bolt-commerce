import { cacheLife } from "next/cache";

export type {
  VehicleFinderOption,
  VehicleFinderOptionStatic,
} from "~/components/features/landing/vehicle-quick-links/data";
export type { InspectionFeature } from "~/data/inspection/features";
export type { VehicleType } from "~/data/vehicles/vehicle-types";

export async function getVehicleCount(): Promise<number> {
  "use cache";
  cacheLife({
    stale: 900, // 15 min - serve stale while revalidating
    revalidate: 900, // 15 min - background revalidation interval
    expire: 3600, // 1 hour - hard expiration
  });

  // TODO: Replace with actual API call
  // const res = await fetch('https://api.example.com/vehicles/count')
  // const data = await res.json()
  // return data.count

  return await Promise.resolve(20_847);
}

export interface HeroStat {
  id: string;
  value: string;
  label: string;
  icon: string;
}

export async function getHeroStats(): Promise<HeroStat[]> {
  "use cache";
  cacheLife({
    stale: 900,
    revalidate: 900,
    expire: 3600,
  });

  const data = await import("~/data/landing-data.json");
  return data.default.hero.features;
}

export interface VehicleFinderCounts {
  "under-20k": number;
  "excellent-deals": number;
  "price-drop": number;
  "low-miles": number;
}

export async function getVehicleFinderCounts(): Promise<VehicleFinderCounts> {
  "use cache";
  cacheLife({
    stale: 900, // 15 min - serve stale while revalidating
    revalidate: 900, // 15 min - background revalidation interval
    expire: 3600, // 1 hour - hard expiration
  });

  // TODO: Replace with actual API call
  // const res = await fetch('https://api.example.com/vehicles/finder-counts')
  // const data = await res.json()
  // return data

  return await Promise.resolve({
    "under-20k": 4564,
    "excellent-deals": 9797,
    "price-drop": 17_998,
    "low-miles": 9797,
  });
}

export async function getVehicleFinderOptions() {
  try {
    const module = await import("~/components/features/landing/vehicle-quick-links/data");
    return module.vehicleFinderOptions;
  } catch (_error) {
    return [];
  }
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
