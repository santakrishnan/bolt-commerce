/**
 * Cookie-based storage for saved/favorite vehicles.
 *
 * Cookie Name : "saved_vehicles"
 * Cookie Value: JSON-stringified array of VIN strings
 * Example     : ["JTDEPMAE5PJ100001","2T3P1RFV8NW100002"]
 */

const COOKIE_NAME = "saved_vehicles";
const MAX_SAVED = 30;
const MAX_AGE_SECONDS = 30 * 24 * 60 * 60; // 30 days

// ── helpers ──────────────────────────────────────────────────────────

function parseCookie(): string[] {
  if (typeof document === "undefined") {
    return [];
  }
  try {
    const match = document.cookie.split("; ").find((row) => row.startsWith(`${COOKIE_NAME}=`));
    if (!match) {
      return [];
    }
    const value = decodeURIComponent(match.split("=")[1] ?? "");
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [];
  }
}

function writeCookie(vins: string[]): void {
  if (typeof document === "undefined") {
    return;
  }
  const value = encodeURIComponent(JSON.stringify(vins));
  const secure = window.location.protocol === "https:" ? ";Secure" : "";
  // biome-ignore lint: direct cookie assignment is required for browser storage
  document.cookie = `${COOKIE_NAME}=${value};path=/;max-age=${MAX_AGE_SECONDS};SameSite=Lax${secure}`;
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
