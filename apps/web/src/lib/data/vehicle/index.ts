/**
 * Vehicle data service.
 *
 * Currently backed by mock data.
 * Swap the implementation to fetch from an API, CMS, or database
 * without touching any component code.
 */

import { mockVdpPageData } from "./mock-data";
import type { VdpPageData } from "./types";

/**
 * Fetch the full VDP page payload for a given vehicle.
 *
 * @param _vin – Vehicle Identification Number (unused while mocked)
 */
export async function getVdpPageData(_vin: string): Promise<VdpPageData> {
  // TODO: replace with real API call
  // e.g. const res = await fetch(`${API_BASE}/vehicles/${vin}`)
  await Promise.resolve();
  return mockVdpPageData;
}

// Re-export types for convenience
export type {
  FeatureCategory,
  HistoryData,
  PriceHistoryEntry,
  PricingData,
  RatingData,
  VdpPageData,
  VehicleDetail,
  VehicleSpecData,
  VehicleStatusData,
} from "./types";
