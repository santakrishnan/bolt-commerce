/**
 * VDP (Vehicle Detail Page) — shared type definitions.
 *
 * These types describe the *data shape* only.
 * Components are responsible for mapping data → icons / JSX.
 */

// ---------------------------------------------------------------------------
// Vehicle detail (the main entity)
// ---------------------------------------------------------------------------

export interface VehicleDetail {
  id: string;
  year: number;
  make: string;
  model: string;
  trim: string;
  price: number;
  originalPrice: number;
  condition: string;
  warranty: boolean;
  inspected: boolean;
  miles: string;
  drivetrain: string;
  mpg: string;
  stock: string;
  vin: string;
  exteriorColor: string;
  interiorColor: string;
  dealer: {
    name: string;
    location: string;
    distance: string;
  };
  images: string[];
  highlights: string[];
}

// ---------------------------------------------------------------------------
// Vehicle specs (Overview tab)
// ---------------------------------------------------------------------------

/** `key` maps to an icon in the component layer (e.g. "engine" → <EngineIcon />) */
export interface VehicleSpecData {
  key: string;
  label: string;
  value: string;
}

// ---------------------------------------------------------------------------
// Feature categories (Features & Details tab)
// ---------------------------------------------------------------------------

export interface FeatureCategory {
  name: string;
  features: string[];
}

// ---------------------------------------------------------------------------
// Pricing data (Pricing tab)
// ---------------------------------------------------------------------------

export interface PricingData {
  currentPrice: number;
  avgPrice: number;
  daysOnSite: number;
  views: number;
  saves: number;
}

// ---------------------------------------------------------------------------
// Price history (Pricing tab — history table)
// ---------------------------------------------------------------------------

/** A single row in the price history table */
export interface PriceHistoryEntry {
  /** ISO date string e.g. "2026-02-20" */
  date: string;
  price: number;
  /** Positive = price dropped (deal improved), negative = price increased */
  change: number;
}

// ---------------------------------------------------------------------------
// History data (History tab)
// ---------------------------------------------------------------------------

export interface HistoryData {
  vin: string;
  vehicleDescription: string;
  damageReported: number;
  previousOwners: number;
  servicesOnRecord: number;
  repairsReported: number;
  ownerTypes: string[];
  lastOdometerReading: number;
}

// ---------------------------------------------------------------------------
// Rating data
// ---------------------------------------------------------------------------

export interface RatingDistribution {
  stars: number;
  count: number;
  id: string;
}

export interface RatingData {
  rating: number;
  reviewCount: number;
  distribution: RatingDistribution[];
}

// ---------------------------------------------------------------------------
// Vehicle status
// ---------------------------------------------------------------------------

export interface VehicleStatusData {
  /** The vehicle is no longer available */
  noLongerAvailable: boolean;
  /** Vehicle history report pending */
  historyReportPending: boolean;
  /** 160-point inspection in progress */
  inspectionInProgress: boolean;
  /** Limited photos */
  limitedPhotos: boolean;
}

// ---------------------------------------------------------------------------
// Complete VDP page payload — everything needed to render the full page
// ---------------------------------------------------------------------------

export interface VdpPageData {
  vehicle: VehicleDetail;
  specs: VehicleSpecData[];
  features: FeatureCategory[];
  featuresInitialCount: number;
  pricing: PricingData;
  priceHistory: PriceHistoryEntry[];
  history: HistoryData;
  rating: RatingData;
  vehicleStatus: VehicleStatusData;
}
