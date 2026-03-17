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
  certified?: boolean;
  condition: string;
  dealer: {
    name: string;
    location: string;
    distance: string;
  };
  drivetrain: string;
  exteriorColor: string;
  fuelType?: string;
  highlights: string[];
  id: string;
  images: string[];
  inspected: boolean;
  inspectionPassed?: boolean;
  interiorColor: string;
  make: string;
  miles: string;
  model: string;
  mpg: string;
  originalPrice: number;
  price: number;
  stock: string;
  title?: string;
  transmission?: string;
  trim: string;
  vin: string;
  warranty: boolean;
  year: number;
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
  features: string[];
  name: string;
}

// ---------------------------------------------------------------------------
// Pricing data (Pricing tab)
// ---------------------------------------------------------------------------

export interface PricingData {
  avgPrice: number;
  currentPrice: number;
  daysOnSite: number;
  saves: number;
  views: number;
}

// ---------------------------------------------------------------------------
// Price history (Pricing tab — history table)
// ---------------------------------------------------------------------------

/** A single row in the price history table */
export interface PriceHistoryEntry {
  change: number;
  date: string;
  price: number;
}

// ---------------------------------------------------------------------------
// History data (History tab)
// ---------------------------------------------------------------------------

export interface HistoryData {
  damageReported: number;
  lastOdometerReading: number;
  ownerTypes: string[];
  previousOwners: number;
  repairsReported: number;
  servicesOnRecord: number;
  titleStatus?: string;
  vehicleDescription: string;
  vin: string;
}

// ---------------------------------------------------------------------------
// Rating data
// ---------------------------------------------------------------------------

export interface RatingDistribution {
  count: number;
  id: string;
  stars: number;
}

export interface RatingData {
  distribution: RatingDistribution[];
  rating: number;
  reviewCount: number;
}

// ---------------------------------------------------------------------------
// Vehicle status
// ---------------------------------------------------------------------------

export interface VehicleStatusData {
  featuresTableView?: boolean;
  historyReportPending: boolean;
  inspectionInProgress: boolean;
  limitedPhotos: boolean;
  noLongerAvailable: boolean;
}

// ---------------------------------------------------------------------------
// VIN-based data (First API call)
// ---------------------------------------------------------------------------

export interface VinData {
  history: HistoryData;
  priceHistory: PriceHistoryEntry[];
  pricing: PricingData;
  vehicle: VehicleDetail;
}

// ---------------------------------------------------------------------------
// ID-based data (Second API call)
// ---------------------------------------------------------------------------

export interface VehicleData {
  features: FeatureCategory[];
  featuresInitialCount: number;
  rating: RatingData;
  specs: VehicleSpecData[];
  vehicleStatus: VehicleStatusData;
}
