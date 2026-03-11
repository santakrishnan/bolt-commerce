/**
 * Vehicle data service.
 *
 * Currently backed by mock data.
 * Swap the implementation to fetch from an API, CMS, or database
 * without touching any component code.
 */

import type { VehicleData, VinData } from "./types";
import { featuresById, ratingById, specsById, vehicleStatusById } from "./vehicle-data";
import { historyDataByVin, priceHistoryByVin, pricingByVin, vehiclesByVin } from "./vin-data";

/**
 * Fetch VIN-based data (First API call with VIN)
 *
 * @param vin – Vehicle Identification Number
 */
export async function getVinData(vin: string): Promise<VinData> {
  // TODO: replace with real API call
  // e.g. const res = await fetch(`${API_BASE}/vehicles/${vin}`)
  await Promise.resolve();

  // Fetch vehicle by VIN
  const vehicle = vehiclesByVin[vin];
  if (!vehicle) {
    throw new Error(`Vehicle with VIN ${vin} not found`);
  }

  const { price, originalPrice, year, make, model } = vehicle;

  // Fetch VIN-based data
  const pricing = pricingByVin[vin];
  const priceHistory = priceHistoryByVin[vin];
  const history = historyDataByVin[vin];

  return {
    vehicle,
    pricing: pricing ?? {
      currentPrice: price,
      avgPrice: originalPrice,
      daysOnSite: 0,
      views: 0,
      saves: 0,
    },
    priceHistory: priceHistory ?? [],
    history: history ?? {
      vin,
      vehicleDescription: `${year} ${make} ${model}`,
      damageReported: 0,
      previousOwners: 0,
      servicesOnRecord: 0,
      repairsReported: 0,
      ownerTypes: [],
      lastOdometerReading: 0,
    },
  };
}

/**
 * Fetch ID-based data (Second API call with vehicle ID)
 *
 * @param id – Vehicle ID
 */
export async function getVehicleData(id: string): Promise<VehicleData> {
  // TODO: replace with real API call
  // e.g. const res = await fetch(`${API_BASE}/vehicles/${id}/details`)
  await Promise.resolve();

  // Fetch ID-based data
  const specs = specsById[id];
  const features = featuresById[id];
  const rating = ratingById[id];
  const vehicleStatus = vehicleStatusById[id];

  return {
    specs: specs ?? [],
    features: features ?? [],
    featuresInitialCount: 4,
    rating: rating ?? {
      rating: 0,
      reviewCount: 0,
      distribution: [],
    },
    vehicleStatus: vehicleStatus ?? {
      noLongerAvailable: false,
      historyReportPending: false,
      inspectionInProgress: false,
      limitedPhotos: false,
    },
  };
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
