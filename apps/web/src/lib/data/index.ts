import { cacheLife } from "next/cache";

export async function getHeroData() {
  const data = await import("~/data/landing-data.json");
  return data.default.hero;
}

export async function getVehiclesAvailable() {
  const data = await import("~/data/landing-data.json");
  return data.default.hero.features[0];
}

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

export async function getVehicleTypes() {
  const data = await import("~/data/landing-data.json");
  return data.default.vehicleTypes;
}

export async function getHowToBuy() {
  const data = await import("~/data/landing-data.json");
  return data.default.howToBuy;
}

export async function getFindVehicle() {
  const data = await import("~/data/landing-data.json");
  return data.default.findVehicle;
}

export async function getPrequalify() {
  const data = await import("~/data/landing-data.json");
  return data.default.prequalify;
}

export async function getArrowInspected() {
  const data = await import("~/data/landing-data.json");
  return data.default.arrowInspected;
}
