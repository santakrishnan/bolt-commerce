/**
 * VDP Feature Flags - Server-Side Functions
 *
 * Provides server-side helpers that read the VDP status cookie.
 * Use only in Server Components or Route Handlers.
 */

import { cookies } from "next/headers";
import {
  VDP_DEFAULT_FLAGS,
  VDP_DEFAULT_SCENARIO_ID,
  VDP_FLAG_COOKIE_NAME,
  type VdpStatusFlags,
  vdpFlagsToVehicleStatus,
  vdpScenarios,
} from "./vdp-config";

/**
 * Get the current VDP status flags based on cookie (Server-side)
 */
export async function getVdpFlags(): Promise<VdpStatusFlags> {
  try {
    const cookieStore = await cookies();
    const scenarioCookie = cookieStore.get(VDP_FLAG_COOKIE_NAME);

    if (scenarioCookie?.value && vdpScenarios[scenarioCookie.value]) {
      console.log(`🚩 VDP Flags: Using scenario from cookie: ${scenarioCookie.value}`);
      const scenario = vdpScenarios[scenarioCookie.value];
      if (scenario) {
        return scenario.flags;
      }
    }
  } catch {
    // cookies() may fail in some contexts, fall back to default
  }

  const scenario = vdpScenarios[VDP_DEFAULT_SCENARIO_ID];
  return scenario?.flags ?? VDP_DEFAULT_FLAGS;
}

/**
 * Get a specific VDP flag value (Server-side)
 */
export async function getVdpFlag<K extends keyof VdpStatusFlags>(
  flagName: K
): Promise<VdpStatusFlags[K]> {
  const flags = await getVdpFlags();
  return flags[flagName];
}

/**
 * Get VehicleStatusData derived from the current VDP flags (Server-side).
 * Pass the result directly as the `vehicleStatus` prop to VehiclePDP.
 */
export async function getVehicleStatusFromFlags() {
  const flags = await getVdpFlags();
  return vdpFlagsToVehicleStatus(flags);
}
