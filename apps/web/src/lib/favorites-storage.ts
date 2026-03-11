/**
 * Cookie-based storage for saved/favorite vehicles.
 *
 * Cookie Name : "saved_vehicles"
 * Cookie Value: JSON-stringified array of VIN strings
 * Example     : ["JTDEPMAE5PJ100001","2T3P1RFV8NW100002"]
 *
 * Uses cached cookie utility for optimal performance following Vercel best practices.
 */

import { getCookie, setCookie } from "./cookie-cache";

const COOKIE_NAME = "saved_vehicles";
const MAX_SAVED = 30;
const MAX_AGE_SECONDS = 30 * 24 * 60 * 60; // 30 days

// ── helpers ──────────────────────────────────────────────────────────

function parseCookie(): string[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = getCookie(COOKIE_NAME);
    if (!raw) {
      return [];
    }
    const value = decodeURIComponent(raw);
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [];
  }
}

function writeCookie(vins: string[]): void {
  if (typeof window === "undefined") {
    return;
  }
  const value = encodeURIComponent(JSON.stringify(vins));
  setCookie(COOKIE_NAME, value, {
    maxAge: MAX_AGE_SECONDS,
    path: "/",
    sameSite: "Lax",
  });
}

// ── public API ───────────────────────────────────────────────────────

/** Return the current array of saved VINs. */
export function getSavedVehicles(): string[] {
  return parseCookie();
}

/**
 * Add a VIN to the saved list.
 * Returns `true` if it was added, `false` if it already existed or the list is at capacity.
 */
export function addVehicle(vin: string): boolean {
  const vins = parseCookie();
  if (vins.includes(vin)) {
    return false;
  }
  if (vins.length >= MAX_SAVED) {
    return false;
  }
  vins.push(vin);
  writeCookie(vins);
  return true;
}

/**
 * Remove a VIN from the saved list.
 * Returns `true` if it was removed, `false` if it was not found.
 */
export function removeVehicle(vin: string): boolean {
  const vins = parseCookie();
  const idx = vins.indexOf(vin);
  if (idx === -1) {
    return false;
  }
  vins.splice(idx, 1);
  writeCookie(vins);
  return true;
}

/** Check whether a VIN is currently saved. */
export function isVehicleSaved(vin: string): boolean {
  return parseCookie().includes(vin);
}

/** Return the number of saved vehicles. */
export function getSavedCount(): number {
  return parseCookie().length;
}

/** Remove all saved vehicles. */
export function clearAllSaved(): void {
  writeCookie([]);
}
