/**
 * VDP Feature Flags - Client-Side Functions
 *
 * Provides client-side helpers that read from localStorage (synced from cookie).
 * Use only in Client Components (with "use client" directive).
 */

import {
  VDP_DEFAULT_FLAGS,
  VDP_DEFAULT_SCENARIO_ID,
  VDP_FLAG_COOKIE_NAME,
  type VdpStatusFlags,
  vdpFlagsToVehicleStatus,
  vdpScenarios,
} from "./vdp-config";

/**
 * Get the current VDP status flags synchronously (Client-side).
 * Reads from localStorage which is kept in sync with the cookie by the FAB.
 */
export function getVdpFlagsSync(): VdpStatusFlags {
  if (typeof window !== "undefined") {
    const scenarioId = localStorage.getItem(VDP_FLAG_COOKIE_NAME);
    if (scenarioId && vdpScenarios[scenarioId]) {
      const scenario = vdpScenarios[scenarioId];
      if (scenario) {
        return scenario.flags;
      }
    }
  }

  const scenario = vdpScenarios[VDP_DEFAULT_SCENARIO_ID];
  return scenario?.flags ?? VDP_DEFAULT_FLAGS;
}

/**
 * Get a specific VDP flag value synchronously (Client-side)
 */
export function getVdpFlagSync<K extends keyof VdpStatusFlags>(flagName: K): VdpStatusFlags[K] {
  const flags = getVdpFlagsSync();
  return flags[flagName];
}

/**
 * Get VehicleStatusData derived from the current VDP flags (Client-side).
 * Use to initialize activeVehicleStatus state in Client Components.
 */
export function getVehicleStatusFromFlagsSync() {
  const flags = getVdpFlagsSync();
  return vdpFlagsToVehicleStatus(flags);
}
