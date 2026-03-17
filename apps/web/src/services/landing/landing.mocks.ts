import { mockVehicles } from "~/lib/search/mock-vehicles";
import type { HeroStat, VehicleFinderCounts, VehicleFinderOptionStatic } from "./types";

// ─── Mock data for landing service ──────────────────────────────────────────
// Co-located with the service. Replace with real API when upstream is ready.

export const MOCK_HERO_STATS: HeroStat[] = [
  {
    id: "vehicles",
    value: "20,847",
    label: "Vehicles Available",
    icon: "/images/heroes/vehicle-availability.svg",
  },
  { id: "vin", value: "100%", label: "Verified VIN", icon: "/images/heroes/vehicle-vin.svg" },
  { id: "money-back", value: "7-Day", label: "Money Back", icon: "/images/heroes/money-back.svg" },
  {
    id: "rating",
    value: "4.93",
    label: "Customer Rating",
    icon: "/images/heroes/customer-rating.svg",
  },
];

export const MOCK_VEHICLE_FINDER_OPTIONS: VehicleFinderOptionStatic[] = [
  { id: "under-20k", title: "Cars Under $20,000", icon: "price-tag" },
  { id: "excellent-deals", title: "Shop Excellent Deals", icon: "badge" },
  { id: "price-drop", title: "Price Drop", icon: "arrow-down" },
  { id: "low-miles", title: "Low Miles", icon: "speedometer" },
];

export const MOCK_VEHICLE_FINDER_COUNTS: VehicleFinderCounts = {
  "under-20k": mockVehicles.filter((v) => v.price < 20_000).length,
  "excellent-deals": mockVehicles.filter((v) =>
    v.labels.some((l) => l.toLowerCase().includes("excellent price"))
  ).length,
  "price-drop": mockVehicles.filter((v) =>
    v.labels.some((l) => l.toLowerCase().includes("price drop"))
  ).length,
  "low-miles": mockVehicles.filter((v) => v.mileage < 20_000).length,
};
