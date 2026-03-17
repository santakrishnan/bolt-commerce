/**
 * Landing Service Types
 *
 * Defines canonical types for landing page data (hero stats, vehicle finder)
 * as well as raw upstream API shapes. The service layer transforms upstream
 * responses into these canonical types, so UI components stay decoupled from
 * any particular API schema.
 */

// ─── Canonical types (used by UI components) ────────────────────────────────

/** A single hero banner stat displayed in the info strip. */
export interface HeroStat {
  icon: string;
  id: string;
  label: string;
  value: string;
}

/** Vehicle finder option with a live vehicle count. */
export interface VehicleFinderOption {
  icon: "price-tag" | "badge" | "arrow-down" | "speedometer";
  id: string;
  title: string;
  vehicleCount: number;
}

/** Static finder option metadata (without count). */
export interface VehicleFinderOptionStatic {
  icon: "price-tag" | "badge" | "arrow-down" | "speedometer";
  id: string;
  title: string;
}

/** Vehicle finder count map keyed by option id. */
export interface VehicleFinderCounts {
  "excellent-deals": number;
  "low-miles": number;
  "price-drop": number;
  "under-20k": number;
}

/** Combined vehicle finder response from the service. */
export interface VehicleFinderData {
  counts: VehicleFinderCounts;
  options: VehicleFinderOptionStatic[];
}

// ─── Raw upstream API shapes ────────────────────────────────────────────────
// These represent possible upstream response formats. When a real API is
// provided, update these types and the corresponding transformer — the rest
// of the codebase stays unchanged.

/** Raw upstream shape for a single hero stat. */
export interface RawHeroStat {
  display_name?: string;
  icon?: string;
  icon_url?: string;
  id?: string;
  key?: string;
  label?: string;
  metric_value?: string | number;
  value?: string | number;
}

/** Raw upstream response for hero stats endpoint. */
export interface RawHeroStatsResponse {
  data?: RawHeroStat[];
  /** Upstream may nest under "features", "stats", "metrics", or "data" */
  features?: RawHeroStat[];
  metrics?: RawHeroStat[];
  stats?: RawHeroStat[];
}

/** Raw upstream shape for vehicle finder counts. */
export interface RawVehicleFinderCountsResponse {
  /** Counts may come as a flat map or nested under "counts" / "data" */
  counts?: Record<string, number>;
  data?: Record<string, number>;
  [key: string]: unknown;
}
