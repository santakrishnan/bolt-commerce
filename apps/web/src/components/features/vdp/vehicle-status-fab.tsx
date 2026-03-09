"use client";

import { useEffect, useState } from "react";
import type { VehicleStatusData } from "~/lib/data/vehicle";
import {
  VDP_DEFAULT_SCENARIO_ID,
  VDP_FLAG_COOKIE_NAME,
  type VdpStatusFlags,
  vdpFlagsToVehicleStatus,
  vdpScenarios,
} from "~/lib/flags/vdp-config";

interface VehicleStatusFABProps {
  onStatusChange: (status: VehicleStatusData) => void;
}

const scenarioOptions = [
  {
    key: "browseSimilar",
    label: "Browse Similar Vehicles",
    description:
      "Vehicle is no longer available. Shows 'This Vehicle Is No Longer Available' banner.",
  },
  {
    key: "viewHistory",
    label: "View History Report",
    description: "History report is pending. Shows 'Vehicle History Report Pending' banner.",
  },
  {
    key: "inspectionInProgress",
    label: "Our 160-point inspection is in progress",
    description: "Inspection underway. Shows '160-Point Inspection In Progress' banner.",
  },
  {
    key: "requestPhotos",
    label: "Request More Photos",
    description: "Limited photos. Shows 'Limited Photos Available' banner.",
  },
] as const;

export function VehicleStatusFAB({ onStatusChange }: VehicleStatusFABProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeScenarioId, setActiveScenarioId] = useState<string>(VDP_DEFAULT_SCENARIO_ID);

  // Hydrate from cookie on mount (mirrors FeatureFlagDebug pattern)
  useEffect(() => {
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${VDP_FLAG_COOKIE_NAME}=`));
    if (cookie) {
      const value = cookie.split("=")[1];
      if (value && vdpScenarios[value]) {
        setActiveScenarioId(value);
        localStorage.setItem(VDP_FLAG_COOKIE_NAME, value);
      }
    }
  }, []);

  const handleScenarioChange = (scenarioId: string) => {
    const scenario = vdpScenarios[scenarioId];
    if (!scenario) {
      return;
    }

    // Persist to cookie
    if ("cookieStore" in window) {
      (window as Window & { cookieStore: { set: (opts: object) => void } }).cookieStore.set({
        name: VDP_FLAG_COOKIE_NAME,
        value: scenarioId,
        path: "/",
        expires: Date.now() + 86_400 * 1000,
      });
    } else {
      // biome-ignore lint/suspicious/noDocumentCookie: Fallback for browsers without Cookie Store API
      document.cookie = `${VDP_FLAG_COOKIE_NAME}=${scenarioId}; path=/; max-age=86400`;
    }

    // Sync to localStorage for client reads
    localStorage.setItem(VDP_FLAG_COOKIE_NAME, scenarioId);

    // Update local state
    setActiveScenarioId(scenarioId);

    // Propagate converted VehicleStatusData — no page reload needed
    onStatusChange(vdpFlagsToVehicleStatus(scenario.flags));
  };

  const getActiveFlags = (scenarioId: string): VdpStatusFlags | undefined => {
    return vdpScenarios[scenarioId]?.flags;
  };

  // Only show in development
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <div className="fixed right-4 bottom-4 z-[9999]">
      {/* Toggle Button */}
      <button
        className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700"
        onClick={() => setIsOpen(!isOpen)}
        title="VDP Status Debug"
        type="button"
      >
        🚩
      </button>

      {/* Debug Panel */}
      {isOpen && (
        <div className="absolute right-0 bottom-16 w-80 rounded-lg border border-gray-200 bg-white p-4 shadow-xl">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-sm">🚩 VDP Status Flags</h3>
            <button
              className="text-gray-400 hover:text-gray-600"
              onClick={() => setIsOpen(false)}
              type="button"
            >
              ✕
            </button>
          </div>

          {/* Scenario Selector */}
          <div className="mb-4">
            <span className="mb-1 block font-medium text-gray-700 text-xs">Vehicle Status:</span>
            <select
              aria-label="Select VDP status scenario"
              className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
              onChange={(e) => handleScenarioChange(e.target.value)}
              value={activeScenarioId}
            >
              <option value="none">No Status Banner</option>
              {scenarioOptions.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </select>
            <ul className="mt-2 space-y-1 text-gray-600 text-xs">
              {scenarioOptions.map((option) => (
                <li
                  className={option.key === activeScenarioId ? "font-semibold text-blue-700" : ""}
                  key={option.key}
                >
                  <span className="block">{option.label}</span>
                  <span className="block text-gray-400">{option.description}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Active Flags Display */}
          <div className="space-y-2">
            <p className="font-medium text-gray-700 text-xs">Active Flags:</p>
            <div className="max-h-48 space-y-1 overflow-y-auto rounded bg-gray-50 p-2 font-mono text-xs">
              {getActiveFlags(activeScenarioId) &&
                Object.entries(getActiveFlags(activeScenarioId) ?? {}).map(([flag, value]) => (
                  <div className="flex items-center justify-between" key={flag}>
                    <span className="text-gray-600">{flag}</span>
                    <span className={value ? "text-green-600" : "text-red-600"}>
                      {value ? "✓" : "✗"}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* Quick Info */}
          <div className="mt-3 rounded bg-blue-50 p-2 text-blue-800 text-xs">
            <strong>Tip:</strong> Changes apply instantly — no page reload needed.
          </div>
        </div>
      )}
    </div>
  );
}
