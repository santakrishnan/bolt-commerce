/**
 * Search Service Types
 *
 * Types for the vehicle search service. Mirrors the `Vehicle` and
 * `FilterSections` shapes from `lib/search/` but defines the API
 * contract independently so the service layer can evolve without
 * coupling to UI components.
 */

// ─── Search request ─────────────────────────────────────────────────────────

/** Parameters for a vehicle search query. */
export interface SearchQuery {
  /** Free-text search term */
  query?: string;
  /** Page number (1-based) */
  page?: number;
  /** Results per page */
  pageSize?: number;
  /** Sort field */
  sortBy?: "price" | "year" | "mileage" | "match" | "relevance";
  /** Sort direction */
  sortOrder?: "asc" | "desc";
  /** Price range filter */
  priceMin?: number;
  priceMax?: number;
  /** Year range filter */
  yearMin?: number;
  yearMax?: number;
  /** Body style filter (multi-select) */
  bodyStyles?: string[];
  /** Make filter */
  makes?: string[];
  /** Model filter */
  models?: string[];
  /** Fuel type filter */
  fuelTypes?: string[];
}

// ─── Search response ────────────────────────────────────────────────────────

/** A vehicle result item. */
export interface SearchVehicle {
  id: number;
  title: string;
  make: string;
  model: string;
  variant: string;
  year: number;
  vin: string;
  price: number;
  oldPrice?: number;
  image: string | string[];
  miles: string;
  odometer: string;
  match: number;
  labels: string[];
  owners: number;
  estimation?: {
    creditScore: string;
    apr: string;
    termLength: string;
    estimatedMonthlyPayment: string;
  };
}

/** Pagination metadata. */
export interface SearchPagination {
  page: number;
  pageSize: number;
  totalResults: number;
  totalPages: number;
}

/** Full search response. */
export interface SearchResult {
  vehicles: SearchVehicle[];
  pagination: SearchPagination;
}
