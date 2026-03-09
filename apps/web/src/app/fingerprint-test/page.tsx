"use client";

import { useArrow } from "~/lib/arrow";

/**
 * Fingerprint Test Page
 *
 * Reads from the Arrow context to show what the SDK resolved and what the
 * Arrow layer filtered into its lean `fingerprintData` shape.
 *
 * Arrow architecture:
 * 1. FingerprintClientProvider (FpjsProvider) initialises the SDK
 * 2. ProfileProvider resolves session / fingerprint / profile IDs
 * 3. ArrowProvider filters the raw response → fingerprintData
 */
function StatusBanner({
  isLoading,
  isReady,
  error,
}: {
  isLoading: boolean;
  isReady: boolean;
  error: Error | null;
}) {
  let bannerClass = "border-red-200 bg-red-50";
  let textClass = "text-red-700";
  let label = "Arrow: not yet initialised";

  if (isLoading) {
    bannerClass = "border-yellow-200 bg-yellow-50";
    textClass = "text-yellow-700";
    label = "Arrow: initialising\u2026";
  } else if (isReady) {
    bannerClass = "border-green-200 bg-green-50";
    textClass = "text-green-700";
    label = "Arrow: ready";
  }

  return (
    <div className={`mb-6 rounded-lg border p-4 ${bannerClass}`}>
      <div className="flex items-center gap-3">
        {isLoading && (
          <div className="h-5 w-5 animate-spin rounded-full border-yellow-500 border-b-2" />
        )}
        <p className={`font-medium text-sm ${textClass}`}>{label}</p>
      </div>
      {error && <p className="mt-2 text-red-600 text-sm">{error.message}</p>}
    </div>
  );
}

function TrustSignalValue({ val }: { val: boolean | undefined }) {
  if (val === undefined) {
    return <span>\u2014</span>;
  }
  return <span className={val ? "text-yellow-600" : "text-green-600"}>{val ? "Yes" : "No"}</span>;
}

export default function FingerprintTestPage() {
  const {
    isReady,
    isLoading,
    error,
    sessionId,
    fingerprintId,
    profileId,
    fingerprintData,
    refreshIds,
  } = useArrow();

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-2 font-bold text-4xl text-gray-900">Arrow — Fingerprint Test</h1>
        <p className="mb-8 text-gray-500 text-sm">
          Data below is read from <code>useArrow()</code> — the filtered Arrow context layer,{" "}
          <em>not</em> the raw Fingerprint SDK.
        </p>

        {/* Status banner */}
        <StatusBanner error={error} isLoading={isLoading} isReady={isReady} />

        {/* Refresh button */}
        <div className="mb-6">
          <button
            className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-sm text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isLoading}
            onClick={() => refreshIds()}
            type="button"
          >
            {isLoading ? "Refreshing…" : "Refresh Fingerprint IDs"}
          </button>
        </div>

        {/* ── Tracking IDs ── */}
        <section className="mb-6 rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-gray-800 text-xl">Tracking IDs</h2>
          <div className="space-y-3">
            {(
              [
                ["Session ID", sessionId, "90-day TTL"],
                ["Fingerprint ID", fingerprintId, "24-hour TTL"],
                ["Profile ID", profileId, "24-hour TTL"],
              ] as [string, string | null, string][]
            ).map(([label, value, ttl]) => (
              <div key={label}>
                <p className="mb-0.5 font-medium text-gray-500 text-xs">
                  {label} <span className="font-normal text-gray-400">— {ttl}</span>
                </p>
                <code className="block break-all rounded bg-gray-100 px-3 py-2 font-mono text-gray-800 text-sm">
                  {value ?? "—"}
                </code>
              </div>
            ))}
          </div>
        </section>

        {/* ── Identity ── */}
        {fingerprintData && (
          <section className="mb-6 rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 font-semibold text-gray-800 text-xl">Identity</h2>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-3">
              <div>
                <dt className="font-medium text-gray-500">Visitor ID</dt>
                <dd className="mt-0.5 break-all font-mono text-gray-800 text-xs">
                  {fingerprintData.identity.visitorId}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Confidence</dt>
                <dd className="mt-0.5 text-gray-800">
                  {(fingerprintData.identity.confidence * 100).toFixed(1)}%
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Visitor Found</dt>
                <dd className="mt-0.5 text-gray-800">
                  {fingerprintData.identity.visitorFound ? "✓ Yes" : "✗ No"}
                </dd>
              </div>
              {fingerprintData.identity.requestId && (
                <div className="col-span-full">
                  <dt className="font-medium text-gray-500">Request ID (Event ID)</dt>
                  <dd className="mt-0.5 break-all font-mono text-gray-800 text-xs">
                    {fingerprintData.identity.requestId}
                  </dd>
                </div>
              )}
            </dl>
          </section>
        )}

        {/* ── Browser ── */}
        {fingerprintData?.browser && (
          <section className="mb-6 rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 font-semibold text-gray-800 text-xl">Browser</h2>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-3">
              {(
                [
                  [
                    "Browser",
                    `${fingerprintData.browser.browserName ?? ""} ${fingerprintData.browser.browserVersion ?? ""}`.trim(),
                  ],
                  [
                    "OS",
                    `${fingerprintData.browser.os ?? ""} ${fingerprintData.browser.osVersion ?? ""}`.trim(),
                  ],
                  ["Device", fingerprintData.browser.device],
                ] as [string, string | undefined][]
              )
                .filter(([, v]) => v)
                .map(([label, value]) => (
                  <div key={label}>
                    <dt className="font-medium text-gray-500">{label}</dt>
                    <dd className="mt-0.5 text-gray-800">{value}</dd>
                  </div>
                ))}
            </dl>
          </section>
        )}

        {/* ── Geo ── */}
        {fingerprintData?.geo && (
          <section className="mb-6 rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 font-semibold text-gray-800 text-xl">Geolocation</h2>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-3">
              {(
                [
                  ["City", fingerprintData.geo.city],
                  ["State", fingerprintData.geo.state],
                  [
                    "Country",
                    `${fingerprintData.geo.country ?? ""}${fingerprintData.geo.countryCode ? ` (${fingerprintData.geo.countryCode})` : ""}`.trim() ||
                      undefined,
                  ],
                  ["Postal Code", fingerprintData.geo.postalCode],
                  ["Timezone", fingerprintData.geo.timezone],
                  ["Latitude", fingerprintData.geo.latitude?.toString()],
                  ["Longitude", fingerprintData.geo.longitude?.toString()],
                ] as [string, string | undefined][]
              )
                .filter(([, v]) => v)
                .map(([label, value]) => (
                  <div key={label}>
                    <dt className="font-medium text-gray-500">{label}</dt>
                    <dd className="mt-0.5 text-gray-800">{value}</dd>
                  </div>
                ))}
            </dl>
          </section>
        )}

        {/* ── Trust Signals ── */}
        {fingerprintData?.trust && (
          <section className="mb-6 rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 font-semibold text-gray-800 text-xl">Trust Signals</h2>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-3">
              {fingerprintData.trust.bot !== undefined && (
                <div>
                  <dt className="font-medium text-gray-500">Bot</dt>
                  <dd
                    className={`mt-0.5 font-medium ${
                      fingerprintData.trust.bot === "not_detected"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {fingerprintData.trust.bot}
                  </dd>
                </div>
              )}
              {(
                [
                  ["Incognito", fingerprintData.trust.incognito],
                  ["VPN", fingerprintData.trust.vpn],
                  ["Proxy", fingerprintData.trust.proxy],
                  ["Tampering", fingerprintData.trust.tampering],
                ] as [string, boolean | undefined][]
              ).map(([label, val]) => (
                <div key={label}>
                  <dt className="font-medium text-gray-500">{label}</dt>
                  <dd className="mt-0.5 font-medium">
                    <TrustSignalValue val={val} />
                  </dd>
                </div>
              ))}
              {fingerprintData.trust.suspectScore !== undefined && (
                <div>
                  <dt className="font-medium text-gray-500">Suspect Score</dt>
                  <dd className="mt-0.5 font-bold text-gray-900">
                    {fingerprintData.trust.suspectScore}
                    <span className="ml-1 font-normal text-gray-400 text-xs">/100</span>
                  </dd>
                </div>
              )}
            </dl>
          </section>
        )}

        {/* Empty state */}
        {!isLoading && isReady && !fingerprintData && (
          <div className="rounded-lg border border-gray-200 bg-white p-6 text-center text-gray-500 text-sm shadow-sm">
            No fingerprint data available yet. Try refreshing IDs above.
          </div>
        )}

        {/* Info */}
        <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 p-5">
          <h3 className="mb-1 font-semibold text-blue-900">About Arrow filtering</h3>
          <p className="text-blue-800 text-sm">
            The raw Fingerprint Pro SDK response is passed through{" "}
            <code>filterFingerprintResponse()</code> in{" "}
            <code>~/lib/arrow/fingerprint-filter.ts</code> before being stored in{" "}
            <code>ArrowContext</code>. Only the attributes the app needs (identity, browser, geo,
            trust) are kept in context — sensitive or unnecessary fields are dropped.
          </p>
        </div>
      </div>
    </div>
  );
}
