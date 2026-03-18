/**
 * Client/server API service for VDP data.
 *
 * Vehicle details go through the Search proxy route:
 *   GET /api/search/vehicle/:id -> getVehicleBundleFromApi(id)
 */

import type { DealerNotes } from "~/lib/data/dealer/dealer-data";
import { API_ROUTES } from "~/lib/routes/constants";
import type { VehicleData, VinData } from "~/services/vdp";

interface VdpApiRequestOptions {
  baseUrl?: string;
  headers?: HeadersInit;
}

export interface VehicleBundle {
  vehicleData: VehicleData;
  vinData: VinData;
}

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    credentials: "include",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Request failed: ${res.status}`);
  }

  const { data } = await res.json();
  return data as T;
}

function buildUrl(path: string, baseUrl?: string): string {
  return baseUrl ? `${baseUrl}${path}` : path;
}

export function getVehicleBundleFromApi(
  id: string,
  options: VdpApiRequestOptions = {}
): Promise<VehicleBundle> {
  return fetchJson<VehicleBundle>(buildUrl(API_ROUTES.SEARCH_VEHICLE(id), options.baseUrl), {
    method: "GET",
    headers: options.headers,
  });
}

export function getDealerDetailsFromApi(
  vin: string,
  options: VdpApiRequestOptions = {}
): Promise<DealerNotes> {
  return fetchJson<DealerNotes>(buildUrl(API_ROUTES.SEARCH_DEALER(vin), options.baseUrl), {
    method: "GET",
    headers: options.headers,
  });
}
