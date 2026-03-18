/**
 * Client API service for saved/favorite vehicles.
 *
 * All operations go through the saved-registry proxy:
 *   GET    /api/saved-registry/vehicles          → getAllSavedVehicles()
 *   POST   /api/saved-registry/vehicles          → saveVehicle(vin)
 *   DELETE /api/saved-registry/vehicles/:vin     → unsaveVehicle(vin)
 *   DELETE /api/saved-registry/vehicles          → clearAllSavedVehicles()
 *
 * The proxy handles visitor identification via cookies and forwards
 * requests to the BED Saved Vehicle Service (currently mocked).
 *
 * Function signatures are unchanged from the previous IndexedDB
 * implementation — query factories and providers work without changes.
 */

import { API_ROUTES } from "~/lib/routes/constants";

// ── Helpers ──────────────────────────────────────────────────────────

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

// ── Public API (same signatures as before) ───────────────────────────

/** Retrieve the full list of saved VINs. */
export function getAllSavedVehicles(): Promise<string[]> {
  return fetchJson<string[]>(API_ROUTES.SAVED_VEHICLES);
}

/**
 * Save a vehicle by VIN.
 * Returns the updated list of saved VINs.
 */
export function saveVehicle(vin: string): Promise<string[]> {
  return fetchJson<string[]>(API_ROUTES.SAVED_VEHICLES, {
    method: "POST",
    body: JSON.stringify({ vin }),
  });
}

/**
 * Remove a saved vehicle by VIN.
 * Returns the updated list of saved VINs.
 */
export function unsaveVehicle(vin: string): Promise<string[]> {
  return fetchJson<string[]>(`${API_ROUTES.SAVED_VEHICLES}/${encodeURIComponent(vin)}`, {
    method: "DELETE",
  });
}

/** Clear every saved vehicle. Returns an empty array. */
export function clearAllSavedVehicles(): Promise<string[]> {
  return fetchJson<string[]>(API_ROUTES.SAVED_VEHICLES, {
    method: "DELETE",
  });
}
