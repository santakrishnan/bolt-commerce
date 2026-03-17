/**
 * VDP service types.
 *
 * Mirrors the data contracts consumed by VDP components.
 */

export interface VehicleDetail {
  id: string;
  title?: string;
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
  fuelType?: string;
  transmission?: string;
  mpg: string;
  stock: string;
  vin: string;
  exteriorColor: string;
  interiorColor: string;
  certified?: boolean;
  inspectionPassed?: boolean;
  dealer: {
    name: string;
    location: string;
    distance: string;
  };
  images: string[];
  highlights: string[];
}

export interface VehicleSpecData {
  key: string;
  label: string;
  value: string;
}

export interface FeatureCategory {
  name: string;
  features: string[];
}

export interface PricingData {
  currentPrice: number;
  avgPrice: number;
  daysOnSite: number;
  views: number;
  saves: number;
}

export interface PriceHistoryEntry {
  date: string;
  price: number;
  change: number;
}

export interface HistoryData {
  vin: string;
  vehicleDescription: string;
  damageReported: number;
  previousOwners: number;
  servicesOnRecord: number;
  repairsReported: number;
  ownerTypes: string[];
  lastOdometerReading: number;
  titleStatus?: string;
}

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

export interface VehicleStatusData {
  noLongerAvailable: boolean;
  historyReportPending: boolean;
  inspectionInProgress: boolean;
  limitedPhotos: boolean;
  featuresTableView?: boolean;
}

export interface VinData {
  vehicle: VehicleDetail;
  pricing: PricingData;
  priceHistory: PriceHistoryEntry[];
  history: HistoryData;
}

export interface VehicleData {
  specs: VehicleSpecData[];
  features: FeatureCategory[];
  featuresInitialCount: number;
  rating: RatingData;
  vehicleStatus: VehicleStatusData;
}
