import { cacheLife } from "next/cache";
import { ArrowServerError, createArrowServerClient } from "~/lib/arrow/server-api";
import type { VehicleData, VinData } from "./types";
import { fetchMockVehicleData, fetchMockVinData } from "./vdp.mocks";

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

export async function fetchVinData(vin: string): Promise<VinData> {
  "use cache";
  cacheLife({ stale: 300, revalidate: 300, expire: 3600 });

  if (isMockMode()) {
    return await fetchMockVinData(vin);
  }

  try {
    return await getVdpClient().get<VinData>(`/vdp/vehicles/${vin}`);
  } catch (error) {
    if (error instanceof ArrowServerError) {
      console.error("[VDPService] Upstream error (vin-data):", error.message);
    } else {
      console.error("[VDPService] Unexpected error (vin-data):", error);
    }
    return await fetchMockVinData(vin);
  }
}

export async function fetchVehicleData(id: string): Promise<VehicleData> {
  "use cache";
  cacheLife({ stale: 300, revalidate: 300, expire: 3600 });

  if (isMockMode()) {
    return await fetchMockVehicleData(id);
  }

  try {
    return await getVdpClient().get<VehicleData>(`/vdp/vehicle-details/${id}`);
  } catch (error) {
    if (error instanceof ArrowServerError) {
      console.error("[VDPService] Upstream error (vehicle-data):", error.message);
    } else {
      console.error("[VDPService] Unexpected error (vehicle-data):", error);
    }
    return await fetchMockVehicleData(id);
  }
}
