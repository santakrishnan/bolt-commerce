import {
  ArrowServerError,
  type ArrowServerIds,
  createArrowServerClient,
} from "@features/tracking/lib/server-api";
import { cacheLife, cacheTag } from "next/cache";
import type { VehicleData, VinData } from "./types";
import { fetchMockVehicleData, fetchMockVinData } from "./vdp.mocks";

export interface VdpFetchOptions {
  forwardHeaders?: Record<string, string>;
  ids?: ArrowServerIds;
}

let _client: ReturnType<typeof createArrowServerClient> | null = null;

function getVdpClient() {
  if (!_client) {
    _client = createArrowServerClient({
      baseUrl: process.env.VDP_SERVICE_URL ?? "",
      authToken: process.env.VDP_API_KEY,
      serviceName: "VDPService",
      timeout: 10_000,
      retries: 1,
    });
  }
  return _client;
}

function isMockMode(): boolean {
  return !process.env.VDP_SERVICE_URL || process.env.USE_MOCK_VDP === "true";
}

/**
 * Uncached VIN data fetch — used by API route handlers that forward
 * per-user Arrow tracking headers. Do NOT add "use cache" here:
 * the `options` arg contains per-user data that would pollute the cache key.
 *
 * For page-level cached fetching, use `fetchVinDataCached()` instead.
 */
export async function fetchVinData(vin: string, options: VdpFetchOptions = {}): Promise<VinData> {
  if (isMockMode()) {
    return await fetchMockVinData(vin);
  }

  try {
    return await getVdpClient().get<VinData>(`/vdp/vehicles/${vin}`, {
      ids: options.ids,
      headers: options.forwardHeaders,
    });
  } catch (error) {
    if (error instanceof ArrowServerError) {
      console.error("[VDPService] Upstream error (vin-data):", error.message);
    } else {
      console.error("[VDPService] Unexpected error (vin-data):", error);
    }
    return await fetchMockVinData(vin);
  }
}

/**
 * Uncached vehicle data fetch — used by API route handlers that forward
 * per-user Arrow tracking headers. Do NOT add "use cache" here:
 * the `options` arg contains per-user data that would pollute the cache key.
 *
 * For page-level cached fetching, use `fetchVehicleDataCached()` instead.
 */
export async function fetchVehicleData(
  id: string,
  options: VdpFetchOptions = {}
): Promise<VehicleData> {
  if (isMockMode()) {
    return await fetchMockVehicleData(id);
  }

  try {
    return await getVdpClient().get<VehicleData>(`/vdp/vehicle-details/${id}`, {
      ids: options.ids,
      headers: options.forwardHeaders,
    });
  } catch (error) {
    if (error instanceof ArrowServerError) {
      console.error("[VDPService] Upstream error (vehicle-data):", error.message);
    } else {
      console.error("[VDPService] Unexpected error (vehicle-data):", error);
    }
    return await fetchMockVehicleData(id);
  }
}

// ─── Cache-optimized functions (VIN-only cache key, no per-request headers) ──

/**
 * VIN data cached purely by VIN — no user-specific headers in the cache key.
 * Use from server components / page.tsx instead of the API proxy route.
 */
export async function fetchVinDataCached(vin: string): Promise<VinData> {
  "use cache";
  cacheLife("vdp");
  cacheTag("vdp", `vin-${vin}`);

  if (isMockMode()) {
    return await fetchMockVinData(vin);
  }

  try {
    return await getVdpClient().get<VinData>(`/vdp/vehicles/${vin}`);
  } catch (error) {
    if (error instanceof ArrowServerError) {
      console.error("[VDPService] Upstream error (vin-data-cached):", error.message);
    } else {
      console.error("[VDPService] Unexpected error (vin-data-cached):", error);
    }
    return await fetchMockVinData(vin);
  }
}

/**
 * Vehicle data cached purely by ID — no user-specific headers in the cache key.
 * Use from server components / page.tsx instead of the API proxy route.
 */
export async function fetchVehicleDataCached(id: string): Promise<VehicleData> {
  "use cache";
  cacheLife("vdp");
  cacheTag("vdp", `vehicle-${id}`);

  if (isMockMode()) {
    return await fetchMockVehicleData(id);
  }

  try {
    return await getVdpClient().get<VehicleData>(`/vdp/vehicle-details/${id}`);
  } catch (error) {
    if (error instanceof ArrowServerError) {
      console.error("[VDPService] Upstream error (vehicle-data-cached):", error.message);
    } else {
      console.error("[VDPService] Unexpected error (vehicle-data-cached):", error);
    }
    return await fetchMockVehicleData(id);
  }
}
