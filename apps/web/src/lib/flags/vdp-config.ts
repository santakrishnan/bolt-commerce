/**
 * VDP Feature Flags - Shared Configuration
 *
 * This module contains shared types and scenario data for VDP vehicle status flags.
 * It mirrors the pattern from config.ts but is scoped to the Vehicle Detail Page.
 *
 * The 4 flags map directly to VehicleStatusData booleans, controlling which
 * VehicleDetailsBanner is rendered at the top of the VDP.
 *
 * Testing in browser:
 * - Use the 🚩 VDP status debug panel (bottom-right corner of VDP page)
 * - Or set cookie: vdp-status-flag=browseSimilar
 *
 * @see https://vercel.com/docs/workflow-collaboration/feature-flags
 */

export const VDP_FLAG_COOKIE_NAME = "vdp-status-flag";

// ============================================================================
// TYPES
// ============================================================================

export interface VdpStatusFlags {
  /** Banner: "This Vehicle Is No Longer Available" → CTA: Browse Similar Vehicles */
  "vdp-no-longer-available": boolean;
  /** Banner: "Vehicle History Report Pending" → CTA: View History Report */
  "vdp-history-report-pending": boolean;
  /** Banner: "160-Point Inspection In Progress" → no CTA */
  "vdp-inspection-in-progress": boolean;
  /** Banner: "Limited Photos Available" → CTA: Request More Photos */
  "vdp-limited-photos": boolean;
  /** Toggle for new Features Table View */
  "features-table-view"?: boolean;
}

export interface VdpScenario {
  id: string;
  label: string;
  description: string;
  flags: VdpStatusFlags;
}

// ============================================================================
// SCENARIOS
// ============================================================================

export const vdpScenarios: Record<string, VdpScenario> = {
  // No banner active — default/normal state
  none: {
    id: "none",
    label: "No Status Banner",
    description: "Vehicle is available with full details. No status banner shown.",
    flags: {
      "vdp-no-longer-available": false,
      "vdp-history-report-pending": false,
      "vdp-inspection-in-progress": false,
      "vdp-limited-photos": false,
      "features-table-view": true,
    },
  },

  // noLongerAvailable → Browse Similar Vehicles
  browseSimilar: {
    id: "browseSimilar",
    label: "Browse Similar Vehicles",
    description:
      "Vehicle is no longer available. Shows 'This Vehicle Is No Longer Available' banner.",
    flags: {
      "vdp-no-longer-available": true,
      "vdp-history-report-pending": false,
      "vdp-inspection-in-progress": false,
      "vdp-limited-photos": false,
      "features-table-view": false,
    },
  },

  // historyReportPending → View History Report
  viewHistory: {
    id: "viewHistory",
    label: "View History Report",
    description: "History report is pending. Shows 'Vehicle History Report Pending' banner.",
    flags: {
      "vdp-no-longer-available": false,
      "vdp-history-report-pending": true,
      "vdp-inspection-in-progress": false,
      "vdp-limited-photos": false,
      "features-table-view": false,
    },
  },

  // inspectionInProgress → 160-point inspection
  inspectionInProgress: {
    id: "inspectionInProgress",
    label: "Our 160-point inspection is in progress",
    description: "Inspection is underway. Shows '160-Point Inspection In Progress' banner.",
    flags: {
      "vdp-no-longer-available": false,
      "vdp-history-report-pending": false,
      "vdp-inspection-in-progress": true,
      "vdp-limited-photos": false,
      "features-table-view": false,
    },
  },

  // limitedPhotos → Request More Photos
  requestPhotos: {
    id: "requestPhotos",
    label: "Request More Photos",
    description: "Limited photos available. Shows 'Limited Photos Available' banner.",
    flags: {
      "vdp-no-longer-available": false,
      "vdp-history-report-pending": false,
      "vdp-inspection-in-progress": false,
      "vdp-limited-photos": true,
      "features-table-view": false,
    },
  },
};

// ============================================================================
// DEFAULT
// ============================================================================

export const VDP_DEFAULT_SCENARIO_ID: keyof typeof vdpScenarios = "none";

export const VDP_DEFAULT_FLAGS: VdpStatusFlags = vdpScenarios[VDP_DEFAULT_SCENARIO_ID]?.flags ?? {
  "vdp-no-longer-available": false,
  "vdp-history-report-pending": false,
  "vdp-inspection-in-progress": false,
  "vdp-limited-photos": false,
  "features-table-view": false,
};

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Convert VdpStatusFlags to the VehicleStatusData shape used by VehiclePDP.
 * The flag keys map 1-to-1 with VehicleStatusData properties.
 */
export function vdpFlagsToVehicleStatus(flags: VdpStatusFlags) {
  return {
    noLongerAvailable: flags["vdp-no-longer-available"],
    historyReportPending: flags["vdp-history-report-pending"],
    inspectionInProgress: flags["vdp-inspection-in-progress"],
    limitedPhotos: flags["vdp-limited-photos"],
    featuresTableView: flags["features-table-view"] ?? false,
  };
}
