import { mockVehicles, type Vehicle } from "~/lib/search/mock-vehicles";

export function fetchGarageCars(): Vehicle[] {
  // Uses the same data source as the used cars page
  return mockVehicles;
}
