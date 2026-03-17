/**
 * Vehicle data service.
 *
 * Compatibility wrapper for legacy imports.
 *
 * The canonical implementation now lives in `~/services/vdp`.
 */

import type { VehicleData, VinData } from "~/services/vdp";
import { fetchVehicleData, fetchVinData } from "~/services/vdp";

/**
 * Fetch VIN-based data (First API call with VIN)
 *
 * @param vin – Vehicle Identification Number
 */
export function getVinData(vin: string): Promise<VinData> {
  return fetchVinData(vin);
}

/**
 * Fetch ID-based data (Second API call with vehicle ID)
 *
 * @param id – Vehicle ID
 */
export function getVehicleData(id: string): Promise<VehicleData> {
  return fetchVehicleData(id);
}

// Re-export types for convenience
export type {
  FeatureCategory,
  HistoryData,
  PriceHistoryEntry,
  PricingData,
  RatingData,
  VehicleData,
  VehicleDetail,
  VehicleSpecData,
  VehicleStatusData,
  VinData,
} from "./types";
