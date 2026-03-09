"use client";

import { useEffect, useState } from "react";
import type { ArrowFingerprintData, VisitorProfile } from "~/lib/arrow";
import { useArrow, useEventTracking } from "~/lib/arrow";

// ─── Sub-components ────────────────────────────────────────────────────────

function VisitorIntelligenceSection({ data }: { data: ArrowFingerprintData }) {
  return (
    <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 font-semibold text-2xl text-gray-800">Visitor Intelligence</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Identity */}
        <div className="rounded bg-gray-50 p-4">
          <h3 className="mb-2 font-semibold text-gray-700">Identity</h3>
          <p className="text-gray-600 text-sm">
            Confidence: {(data.identity.confidence * 100).toFixed(1)}%
          </p>
          <p className="text-gray-600 text-sm">
            Visitor Found: {data.identity.visitorFound ? "✓ Yes" : "✗ No"}
          </p>
          {data.identity.requestId && (
            <p className="mt-1 break-all font-mono text-gray-500 text-xs">
              {data.identity.requestId}
            </p>
          )}
        </div>

        {/* Browser */}
        {data.browser && (
          <div className="rounded bg-gray-50 p-4">
            <h3 className="mb-2 font-semibold text-gray-700">Browser</h3>
            <p className="text-gray-600 text-sm">
              {data.browser.browserName} {data.browser.browserVersion}
            </p>
            <p className="text-gray-600 text-sm">
              {data.browser.os} {data.browser.osVersion}
            </p>
            {data.browser.device && <p className="text-gray-600 text-sm">{data.browser.device}</p>}
          </div>
        )}

        {/* Geo */}
        {data.geo && (
          <div className="rounded bg-gray-50 p-4">
            <h3 className="mb-2 font-semibold text-gray-700">Location</h3>
            {(data.geo.city || data.geo.country) && (
              <p className="text-gray-600 text-sm">
                {[data.geo.city, data.geo.state, data.geo.country].filter(Boolean).join(", ")}
              </p>
            )}
            {data.geo.timezone && <p className="text-gray-600 text-sm">TZ: {data.geo.timezone}</p>}
          </div>
        )}

        {/* Trust */}
        {data.trust && (
          <div className="rounded bg-gray-50 p-4">
            <h3 className="mb-2 font-semibold text-gray-700">Trust Signals</h3>
            <div className="space-y-1">
              {data.trust.bot !== undefined && (
                <p className="text-gray-600 text-sm">
                  Bot:{" "}
                  <span
                    className={
                      data.trust.bot === "not_detected" ? "text-green-600" : "text-red-600"
                    }
                  >
                    {data.trust.bot}
                  </span>
                </p>
              )}
              {(
                [
                  ["VPN", data.trust.vpn],
                  ["Proxy", data.trust.proxy],
                  ["Incognito", data.trust.incognito],
                ] as [string, boolean | undefined][]
              ).map(([lbl, val]) => (
                <p className="text-gray-600 text-sm" key={lbl}>
                  {lbl}:{" "}
                  <span className={val ? "text-yellow-600" : "text-green-600"}>
                    {val ? "Yes" : "No"}
                  </span>
                </p>
              ))}
              {data.trust.suspectScore !== undefined && (
                <p className="text-gray-600 text-sm">
                  Suspect Score:{" "}
                  <span className="font-bold text-gray-900">{data.trust.suspectScore}</span>/100
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function VisitorProfileSection({
  profile,
  isLoading,
  isStale,
  onRefresh,
  onInvalidate,
}: {
  profile: VisitorProfile | null | undefined;
  isLoading: boolean;
  isStale: boolean;
  onRefresh: () => void;
  onInvalidate: () => void;
}) {
  return (
    <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-2xl text-gray-800">Visitor Profile</h2>
        <div className="flex gap-2">
          <button
            className="rounded bg-gray-100 px-3 py-1.5 text-gray-600 text-xs transition-colors hover:bg-gray-200 disabled:opacity-50"
            disabled={isLoading}
            onClick={onRefresh}
            type="button"
          >
            {isLoading ? "Loading…" : "Refresh"}
          </button>
          <button
            className="rounded bg-purple-100 px-3 py-1.5 text-purple-700 text-xs transition-colors hover:bg-purple-200 disabled:opacity-50"
            disabled={isLoading}
            onClick={onInvalidate}
            type="button"
          >
            Invalidate Cache
          </button>
        </div>
      </div>
      {isStale && (
        <p className="mb-3 text-xs text-yellow-600">⚠ Profile cache is stale — refreshing…</p>
      )}
      {profile ? (
        <div className="space-y-2 text-sm">
          <p>
            <span className="font-medium text-gray-600">Profile ID:</span>{" "}
            <code className="font-mono text-gray-800">{profile.profileId}</code>
          </p>
          {profile.segment && (
            <p>
              <span className="font-medium text-gray-600">Segment:</span>{" "}
              <span className="text-gray-800">{profile.segment}</span>
            </p>
          )}
          <p>
            <span className="font-medium text-gray-600">Known Visitor:</span>{" "}
            <span className={profile.isKnown ? "text-green-600" : "text-gray-600"}>
              {profile.isKnown ? "✓ Yes" : "No"}
            </span>
          </p>
          {profile.updatedAt && (
            <p>
              <span className="font-medium text-gray-600">Last Updated:</span>{" "}
              <span className="text-gray-800">{new Date(profile.updatedAt).toLocaleString()}</span>
            </p>
          )}
        </div>
      ) : (
        <p className="text-gray-400 text-sm">
          {isLoading ? "Fetching profile…" : "No visitor profile available"}
        </p>
      )}
    </div>
  );
}

function EventTrackingSection({
  eventCount,
  isLoading,
  onTrack,
  onRefreshIds,
}: {
  eventCount: number;
  isLoading: boolean;
  onTrack: (name: string) => void;
  onRefreshIds: () => void;
}) {
  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-2xl text-gray-800">Track Events</h2>
        <div className="flex items-center gap-4">
          <span className="text-gray-500 text-sm">{eventCount} tracked</span>
          <button
            className="rounded bg-blue-100 px-3 py-1.5 text-blue-700 text-xs transition-colors hover:bg-blue-200 disabled:opacity-50"
            disabled={isLoading}
            onClick={onRefreshIds}
            type="button"
          >
            Refresh IDs
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {(
          [
            ["Track Button Click", "button_click", "bg-blue-500 hover:bg-blue-600"],
            ["Track Product View", "product_view", "bg-green-500 hover:bg-green-600"],
            ["Track Add to Cart", "add_to_cart", "bg-purple-500 hover:bg-purple-600"],
            ["Track Search", "search", "bg-orange-500 hover:bg-orange-600"],
          ] as [string, string, string][]
        ).map(([label, event, cls]) => (
          <button
            className={`rounded-lg px-6 py-3 font-medium text-white transition-colors ${cls}`}
            key={event}
            onClick={() => onTrack(event)}
            type="button"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────

/**
 * Tracking Demo Page
 *
 * Demonstrates the new simplified tracking API with mock services.
 */
export default function TrackingDemoPage() {
  const {
    isReady,
    isLoading,
    error,
    sessionId,
    fingerprintId,
    profileId,
    fingerprintData,
    visitorProfile,
    isProfileLoading,
    isProfileStale,
    refreshIds,
    invalidateProfile,
    refreshProfile,
  } = useArrow();
  const { trackEvent } = useEventTracking();
  const [eventCount, setEventCount] = useState(0);

  // Track page view on mount
  useEffect(() => {
    if (isReady) {
      trackEvent("page_view", {
        page: "/tracking-demo",
        timestamp: Date.now(),
      });
    }
  }, [isReady, trackEvent]);

  const handleTrackEvent = (eventName: string) => {
    trackEvent(eventName, {
      source: "demo-page",
      timestamp: Date.now(),
    });
    setEventCount((prev) => prev + 1);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-gray-900 border-b-2" />
          <p className="text-gray-600">Initialising Arrow…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="max-w-md rounded-lg border border-red-200 bg-red-50 p-6">
          <h2 className="mb-2 font-bold text-lg text-red-800">Arrow Error</h2>
          <p className="text-red-600">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 font-bold text-4xl text-gray-900">User Behavior Tracking Demo</h1>

        {/* Arrow status badge */}
        <div
          className={`mb-6 rounded-lg border p-4 ${
            isReady ? "border-green-200 bg-green-50" : "border-yellow-200 bg-yellow-50"
          }`}
        >
          <p className={`font-medium text-sm ${isReady ? "text-green-700" : "text-yellow-700"}`}>
            {isReady ? "✓ Arrow ready" : "Arrow: initialising…"}
          </p>
        </div>

        {/* Status Card */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 font-semibold text-2xl text-gray-800">Tracking Status</h2>
          <div className="space-y-3">
            <div className="flex items-center">
              <span className="w-32 font-medium text-gray-700">Status:</span>
              <span
                className={`rounded-full px-3 py-1 font-medium text-sm ${
                  isReady ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {isReady ? "✓ Ready" : "Not Ready"}
              </span>
            </div>
            <div className="flex items-center">
              <span className="w-32 font-medium text-gray-700">Events:</span>
              <span className="text-gray-900">{eventCount} tracked</span>
            </div>
          </div>
        </div>

        {/* IDs Card */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 font-semibold text-2xl text-gray-800">Tracking IDs</h2>
          <div className="space-y-4">
            <div>
              <p className="mb-1 block font-medium text-gray-600 text-sm">
                Session ID (90-day TTL)
              </p>
              <code className="block break-all rounded bg-gray-100 px-3 py-2 font-mono text-gray-800 text-sm">
                {sessionId || "N/A"}
              </code>
            </div>
            <div>
              <p className="mb-1 block font-medium text-gray-600 text-sm">
                Fingerprint ID (24-hour TTL)
              </p>
              <code className="block break-all rounded bg-gray-100 px-3 py-2 font-mono text-gray-800 text-sm">
                {fingerprintId || "N/A"}
              </code>
            </div>
            <div>
              <p className="mb-1 block font-medium text-gray-600 text-sm">
                Profile ID (24-hour TTL)
              </p>
              <code className="block break-all rounded bg-gray-100 px-3 py-2 font-mono text-gray-800 text-sm">
                {profileId || "N/A"}
              </code>
            </div>
          </div>
        </div>

        {/* ── Arrow Fingerprint Data ── */}
        {fingerprintData && <VisitorIntelligenceSection data={fingerprintData} />}

        {/* ── Visitor Profile ── */}
        <VisitorProfileSection
          isLoading={isProfileLoading}
          isStale={isProfileStale}
          onInvalidate={invalidateProfile}
          onRefresh={refreshProfile}
          profile={visitorProfile}
        />

        {/* Event Tracking Card */}
        <EventTrackingSection
          eventCount={eventCount}
          isLoading={isLoading}
          onRefreshIds={refreshIds}
          onTrack={handleTrackEvent}
        />

        {/* Info Card */}
        <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50 p-5">
          <h3 className="mb-1 font-semibold text-blue-900">About the Arrow context</h3>
          <p className="text-blue-800 text-sm">
            This page reads from <code>useArrow()</code>. All tracking IDs, filtered fingerprint
            data, and the cached visitor profile are sourced from <code>ArrowContext</code> —
            configured in <code>~/lib/arrow</code>. Check the browser console to see tracked events.
          </p>
        </div>
      </div>
    </div>
  );
}
