"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getCookie } from "~/lib/cookie-cache";
import { type FeatureFlags, FLAG_COOKIE_NAME, mockUsers } from "~/lib/flags/config";

/**
 * FeatureFlagDebug - A floating debug panel for testing feature flags
 * Only visible in development mode. Hidden on VDP pages (VehicleStatusFAB is shown there instead).
 */
export function FeatureFlagDebug() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<string>("firstTimeVisitor");

  // Scenario mapping for new dropdown
  const scenarioOptions = [
    {
      key: "firstTimeVisitor",
      label: "First Time Visitor",
      description: "First time user or last visit < 3hrs, shows default landing page.",
    },
    {
      key: "returningUnauthenticated",
      label: "Returning Visitor (Unauthenticated)",
      description: "Unauthenticated, both cards completed (prequalified + trade-in submitted).",
    },
    {
      key: "authenticatedPrequalified",
      label: "Authenticated & Prequalified",
      description: "Authenticated user, prequalified, shows personalized banner with BUY NOW CTA.",
    },
    {
      key: "authenticatedNotPrequalified",
      label: "Authenticated (Not Prequalified)",
      description: "Authenticated, both cards need action (not prequalified + no trade-in).",
    },
    {
      key: "prequalifiedNoTrade",
      label: "Card Test: Prequalified + No Trade",
      description: "Authenticated, prequalified card completed, trade-in card needs action.",
    },
    {
      key: "notPrequalifiedWithTrade",
      label: "Card Test: Not Prequalified + Has Trade",
      description: "Authenticated, prequalified card needs action, trade-in card completed.",
    },
    {
      key: "unauthPrequalifiedWithTrade",
      label: "Card Test: Unauth Prequalified + Trade",
      description: "Unauthenticated, prequalified card completed, trade-in card completed.",
    },
    {
      key: "unauthNotPrequalifiedNoTrade",
      label: "Card Test: Unauth Not Prequalified",
      description: "Unauthenticated, both cards need action (not prequalified + no trade-in).",
    },
  ];

  // Read current user from cookie on mount
  useEffect(() => {
    const value = getCookie(FLAG_COOKIE_NAME);
    if (value && mockUsers[value]) {
      setCurrentUser(value);
      // Also sync to localStorage for client components
      localStorage.setItem(FLAG_COOKIE_NAME, value);
    }
  }, []);

  // Hide on VDP pages — VehicleStatusFAB handles flags there
  if (pathname?.startsWith("/used-cars/")) {
    return null;
  }

  const handleUserChange = (userType: string) => {
    // Set cookie (expires in 1 day = 86400 seconds) using Cookie Store API
    if ("cookieStore" in window) {
      (
        window as {
          cookieStore: {
            set: (options: { name: string; value: string; path: string; expires: number }) => void;
          };
        }
      ).cookieStore.set({
        name: FLAG_COOKIE_NAME,
        value: userType,
        path: "/",
        expires: Date.now() + 86_400 * 1000,
      });
    } else {
      // Fallback for browsers without Cookie Store API
      const cookieValue = `${FLAG_COOKIE_NAME}=${userType}; path=/; max-age=86400`;
      // biome-ignore lint/suspicious/noDocumentCookie: Fallback for browsers without Cookie Store API
      document.cookie = cookieValue;
    }
    // Also set localStorage for client components
    localStorage.setItem(FLAG_COOKIE_NAME, userType);
    setCurrentUser(userType);
    // Reload the page to apply the new flags
    window.location.reload();
  };

  const getUserFlags = (userType: string): FeatureFlags | undefined => {
    return mockUsers[userType]?.flags;
  };

  // Only show in development
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <div className="fixed right-4 bottom-4 z-9999">
      {/* Toggle Button */}
      <button
        className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700"
        onClick={() => setIsOpen(!isOpen)}
        title="Feature Flags Debug"
        type="button"
      >
        🚩
      </button>

      {/* Debug Panel */}
      {isOpen && (
        <div className="absolute right-0 bottom-16 max-h-[600px] w-80 overflow-y-auto rounded-lg border border-gray-200 bg-white p-4 shadow-xl">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-sm">🚩 Feature Flags</h3>
            <button
              className="text-gray-400 hover:text-gray-600"
              onClick={() => setIsOpen(false)}
              type="button"
            >
              ✕
            </button>
          </div>

          {/* User Selector */}
          <div className="mb-4">
            <span className="mb-1 block font-medium text-gray-700 text-xs">Test User:</span>
            <select
              aria-label="Select test user scenario"
              className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
              onChange={(e) => handleUserChange(e.target.value)}
              value={currentUser}
            >
              {scenarioOptions.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </select>
            {/* Show only current user's description */}
            <p className="mt-2 text-gray-600 text-xs">
              {scenarioOptions.find((opt) => opt.key === currentUser)?.description}
            </p>
          </div>

          {/* Current Flags Display */}
          <div className="space-y-2">
            <p className="font-medium text-gray-700 text-xs">Active Flags:</p>
            <div className="max-h-32 space-y-1 overflow-y-auto rounded bg-gray-50 p-2 font-mono text-xs">
              {getUserFlags(currentUser) &&
                Object.entries(getUserFlags(currentUser) ?? {}).map(([flag, value]) => (
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
            <strong>Tip:</strong> You can also use URL params:
            <br />
            <code className="text-2xs">?user=returning</code>
          </div>
        </div>
      )}
    </div>
  );
}
