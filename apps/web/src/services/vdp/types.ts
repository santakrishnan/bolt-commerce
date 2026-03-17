/**
 * VDP service types.
 *
 * Mirrors the data contracts consumed by VDP components.
 */

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

export interface VehicleSpecData {
  key: string;
  label: string;
  value: string;
}

export interface FeatureCategory {
  features: string[];
  name: string;
}

export interface PricingData {
  avgPrice: number;
  currentPrice: number;
  daysOnSite: number;
  saves: number;
  views: number;
}

export interface PriceHistoryEntry {
  change: number;
  date: string;
  price: number;
}

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

export interface VehicleStatusData {
  featuresTableView?: boolean;
  historyReportPending: boolean;
  inspectionInProgress: boolean;
  limitedPhotos: boolean;
  noLongerAvailable: boolean;
}

export interface VinData {
  history: HistoryData;
  priceHistory: PriceHistoryEntry[];
  pricing: PricingData;
  vehicle: VehicleDetail;
}

export interface VehicleData {
  features: FeatureCategory[];
  featuresInitialCount: number;
  rating: RatingData;
  specs: VehicleSpecData[];
  vehicleStatus: VehicleStatusData;
}
