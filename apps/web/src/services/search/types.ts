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
  /** Body style filter (multi-select) */
  bodyStyles?: string[];
  /** Fuel type filter */
  fuelTypes?: string[];
  /** Make filter */
  makes?: string[];
  /** Model filter */
  models?: string[];
  /** Page number (1-based) */
  page?: number;
  /** Results per page */
  pageSize?: number;
  priceMax?: number;
  /** Price range filter */
  priceMin?: number;
  /** Free-text search term */
  query?: string;
  /** Sort field */
  sortBy?: "price" | "year" | "mileage" | "match" | "relevance";
  /** Sort direction */
  sortOrder?: "asc" | "desc";
  yearMax?: number;
  /** Year range filter */
  yearMin?: number;
}

// ─── Search response ────────────────────────────────────────────────────────

/** A vehicle result item. */
export interface SearchVehicle {
  estimation?: {
    creditScore: string;
    apr: string;
    termLength: string;
    estimatedMonthlyPayment: string;
  };
  id: number;
  image: string | string[];
  labels: string[];
  make: string;
  match: number;
  miles: string;
  model: string;
  odometer: string;
  oldPrice?: number;
  owners: number;
  price: number;
  title: string;
  variant: string;
  vin: string;
  year: number;
}

/** Pagination metadata. */
export interface SearchPagination {
  page: number;
  pageSize: number;
  totalPages: number;
  totalResults: number;
}

/** Full search response. */
export interface SearchResult {
  pagination: SearchPagination;
  vehicles: SearchVehicle[];
}
