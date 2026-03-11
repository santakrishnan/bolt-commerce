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
  id: string;
  value: string;
  label: string;
  icon: string;
}

/** Vehicle finder option with a live vehicle count. */
export interface VehicleFinderOption {
  id: string;
  title: string;
  vehicleCount: number;
  icon: "price-tag" | "badge" | "arrow-down" | "speedometer";
}

/** Static finder option metadata (without count). */
export interface VehicleFinderOptionStatic {
  id: string;
  title: string;
  icon: "price-tag" | "badge" | "arrow-down" | "speedometer";
}

/** Vehicle finder count map keyed by option id. */
export interface VehicleFinderCounts {
  "under-20k": number;
  "excellent-deals": number;
  "price-drop": number;
  "low-miles": number;
}

/** Combined vehicle finder response from the service. */
export interface VehicleFinderData {
  options: VehicleFinderOptionStatic[];
  counts: VehicleFinderCounts;
}

// ─── Raw upstream API shapes ────────────────────────────────────────────────
// These represent possible upstream response formats. When a real API is
// provided, update these types and the corresponding transformer — the rest
// of the codebase stays unchanged.

/** Raw upstream shape for a single hero stat. */
export interface RawHeroStat {
  id?: string;
  key?: string;
  value?: string | number;
  metric_value?: string | number;
  label?: string;
  display_name?: string;
  icon?: string;
  icon_url?: string;
}

/** Raw upstream response for hero stats endpoint. */
export interface RawHeroStatsResponse {
  /** Upstream may nest under "features", "stats", "metrics", or "data" */
  features?: RawHeroStat[];
  stats?: RawHeroStat[];
  metrics?: RawHeroStat[];
  data?: RawHeroStat[];
}

/** Raw upstream shape for vehicle finder counts. */
export interface RawVehicleFinderCountsResponse {
  /** Counts may come as a flat map or nested under "counts" / "data" */
  counts?: Record<string, number>;
  data?: Record<string, number>;
  [key: string]: unknown;
}
