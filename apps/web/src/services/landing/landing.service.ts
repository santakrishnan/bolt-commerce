/**
 * Landing Service
 *
 * Provides hero-stats and vehicle-finder data for the landing page.
 * Follows the same hybrid mock / upstream pattern as the search and
 * visitor-profile services:
 *
 * - Mock data is returned when LANDING_SERVICE_URL is not set.
 * - When a real upstream is configured, data is fetched via
 *   ArrowServerClient and passed through thin transformation helpers
 *   that normalise any API schema into the canonical types consumed
 *   by UI components.
 *
 * To integrate a real API later:
 * 1. Set LANDING_SERVICE_URL and LANDING_API_KEY env vars.
 * 2. Update the Raw* types in `types.ts` to match the actual schema.
 * 3. Adjust the `transformHeroStats` / `transformVehicleFinderCounts`
 *    functions below — nothing else needs to change.
 */

import { cacheLife } from "next/cache";

import { ArrowServerError, createArrowServerClient } from "~/lib/arrow/server-api";
import {
  MOCK_HERO_STATS,
  MOCK_VEHICLE_FINDER_COUNTS,
  MOCK_VEHICLE_FINDER_OPTIONS,
} from "./landing.mocks";
import type {
  HeroStat,
  RawHeroStat,
  RawHeroStatsResponse,
  RawVehicleFinderCountsResponse,
  VehicleFinderCounts,
  VehicleFinderOptionStatic,
} from "./types";

// ─── Lazy singleton ─────────────────────────────────────────────────────────

let _client: ReturnType<typeof createArrowServerClient> | null = null;

function getLandingClient() {
  if (!_client) {
    _client = createArrowServerClient({
      baseUrl: process.env.LANDING_SERVICE_URL ?? "",
      authToken: process.env.LANDING_API_KEY,
      serviceName: "LandingService",
      timeout: 10_000,
      retries: 1,
    });
  }
  return _client;
}

function isMockMode(): boolean {
  return !process.env.LANDING_SERVICE_URL || process.env.USE_MOCK_LANDING === "true";
}

/**
 * Transform a single raw upstream hero stat into the canonical shape.
 *
 * Handles common upstream variations:
 * - `key` vs `id` for the identifier
 * - `metric_value` vs `value` for the display value
 * - `display_name` vs `label` for the label
 * - `icon_url` vs `icon` for the icon path
 */
export function transformRawHeroStat(raw: RawHeroStat): HeroStat {
  return {
    id: raw.id ?? raw.key ?? "",
    value: String(raw.value ?? raw.metric_value ?? ""),
    label: raw.label ?? raw.display_name ?? "",
    icon: raw.icon ?? raw.icon_url ?? "",
  };
}

/**
 * Transform a full upstream hero-stats response into an array of
 * canonical HeroStat items. Handles responses where the array
 * lives under `features`, `stats`, `metrics`, or `data`.
 */
export function transformHeroStats(raw: RawHeroStatsResponse): HeroStat[] {
  const items = raw.features ?? raw.stats ?? raw.metrics ?? raw.data ?? [];
  return items.map(transformRawHeroStat);
}

/**
 * Transform a raw upstream vehicle-finder counts response into the
 * canonical VehicleFinderCounts map. Handles responses where the
 * map lives under `counts`, `data`, or at the top level.
 */
export function transformVehicleFinderCounts(
  raw: RawVehicleFinderCountsResponse
): VehicleFinderCounts {
  const counts = raw.counts ?? raw.data ?? raw;
  return {
    "under-20k": Number(counts["under-20k"] ?? 0),
    "excellent-deals": Number(counts["excellent-deals"] ?? 0),
    "price-drop": Number(counts["price-drop"] ?? 0),
    "low-miles": Number(counts["low-miles"] ?? 0),
  };
}

/**
 * Fetch hero stats for the landing page info strip.
 *
 * Strategy:
 * 1. Mock mode → return transformed mock JSON data.
 * 2. Otherwise GET from the upstream landing service.
 * 3. Falls back to mock data on failure.
 */
export async function fetchHeroStats(): Promise<HeroStat[]> {
  "use cache";
  cacheLife("landing");

  if (isMockMode()) {
    console.log("[LandingService] Mock mode — returning local hero stats");
    return MOCK_HERO_STATS;
  }

  try {
    const raw = await getLandingClient().get<RawHeroStatsResponse>("/landing/hero-stats");
    return transformHeroStats(raw);
  } catch (error) {
    if (error instanceof ArrowServerError) {
      console.error("[LandingService] Upstream error (hero-stats):", error.message);
    } else {
      console.error("[LandingService] Unexpected error (hero-stats):", error);
    }
    // Graceful fallback to mock data
    return MOCK_HERO_STATS;
  }
}

/**
 * Fetch vehicle finder quick-link options.
 *
 * Strategy:
 * 1. Mock mode → return static options list.
 * 2. Otherwise GET from the upstream landing service.
 * 3. Falls back to mock data on failure.
 */
export async function fetchVehicleFinderOptions(): Promise<VehicleFinderOptionStatic[]> {
  "use cache";
  cacheLife("landing");

  if (isMockMode()) {
    console.log("[LandingService] Mock mode — returning local finder options");
    return MOCK_VEHICLE_FINDER_OPTIONS;
  }

  try {
    const raw = await getLandingClient().get<{ options: VehicleFinderOptionStatic[] }>(
      "/landing/vehicle-finder/options"
    );
    return raw.options ?? MOCK_VEHICLE_FINDER_OPTIONS;
  } catch (error) {
    if (error instanceof ArrowServerError) {
      console.error("[LandingService] Upstream error (finder-options):", error.message);
    } else {
      console.error("[LandingService] Unexpected error (finder-options):", error);
    }
    return MOCK_VEHICLE_FINDER_OPTIONS;
  }
}

/**
 * Fetch vehicle finder counts.
 *
 * Strategy:
 * 1. Mock mode → return static counts.
 * 2. Otherwise GET from the upstream landing service.
 * 3. Falls back to mock data on failure.
 */
export async function fetchVehicleFinderCounts(): Promise<VehicleFinderCounts> {
  "use cache";
  cacheLife("landing");

  if (isMockMode()) {
    console.log("[LandingService] Mock mode — returning local finder counts");
    return MOCK_VEHICLE_FINDER_COUNTS;
  }

  try {
    const raw = await getLandingClient().get<RawVehicleFinderCountsResponse>(
      "/landing/vehicle-finder/counts"
    );
    return transformVehicleFinderCounts(raw);
  } catch (error) {
    if (error instanceof ArrowServerError) {
      console.error("[LandingService] Upstream error (finder-counts):", error.message);
    } else {
      console.error("[LandingService] Unexpected error (finder-counts):", error);
    }
    return MOCK_VEHICLE_FINDER_COUNTS;
  }
}
