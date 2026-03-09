/**
 * VDP Feature Flags - Vercel Flags SDK Implementation
 *
 * Defines the 4 VDP vehicle status flags using the Vercel Flags SDK pattern.
 * Each flag reads from the vdp-status-flag cookie set by the VDP debug FAB.
 *
 * @see https://vercel.com/docs/workflow-collaboration/feature-flags
 * @see https://flags-sdk.dev/
 */

import { flag } from "flags/next";
import { cookies } from "next/headers";
import { VDP_DEFAULT_FLAGS, VDP_FLAG_COOKIE_NAME, vdpScenarios } from "./vdp-config";

// ============================================================================
// HELPER: Get current VDP flags from cookie
// ============================================================================

async function getVdpFlagsFromCookie() {
  try {
    const cookieStore = await cookies();
    const scenarioCookie = cookieStore.get(VDP_FLAG_COOKIE_NAME);

    if (scenarioCookie?.value && vdpScenarios[scenarioCookie.value]) {
      const scenario = vdpScenarios[scenarioCookie.value];
      if (scenario) {
        console.log(
          `🚩 VDP Flags SDK: Using scenario "${scenarioCookie.value}" (${scenario.label})`
        );
        return scenario.flags;
      }
    }
  } catch {
    // cookies() may fail in some contexts
  }

  return VDP_DEFAULT_FLAGS;
}

// ============================================================================
// VDP STATUS FLAGS
// ============================================================================

/**
 * Vehicle no longer available
 * When true: Shows "This Vehicle Is No Longer Available" banner with Browse Similar Vehicles CTA
 */
export const vdpNoLongerAvailable = flag({
  key: "vdp-no-longer-available",
  description: "Show 'No Longer Available' banner — vehicle has been sold or removed",
  decide: async () => {
    const flags = await getVdpFlagsFromCookie();
    return flags["vdp-no-longer-available"];
  },
});

/**
 * Vehicle history report pending
 * When true: Shows "Vehicle History Report Pending" banner with View History Report CTA
 */
export const vdpHistoryReportPending = flag({
  key: "vdp-history-report-pending",
  description: "Show 'History Report Pending' banner — report is being fetched",
  decide: async () => {
    const flags = await getVdpFlagsFromCookie();
    return flags["vdp-history-report-pending"];
  },
});

/**
 * 160-point inspection in progress
 * When true: Shows "160-Point Inspection In Progress" banner (no CTA)
 */
export const vdpInspectionInProgress = flag({
  key: "vdp-inspection-in-progress",
  description: "Show '160-Point Inspection In Progress' banner",
  decide: async () => {
    const flags = await getVdpFlagsFromCookie();
    return flags["vdp-inspection-in-progress"];
  },
});

/**
 * Limited photos available
 * When true: Shows "Limited Photos Available" banner with Request More Photos CTA
 */
export const vdpLimitedPhotos = flag({
  key: "vdp-limited-photos",
  description: "Show 'Limited Photos Available' banner — fewer photos than normal",
  decide: async () => {
    const flags = await getVdpFlagsFromCookie();
    return flags["vdp-limited-photos"];
  },
});
