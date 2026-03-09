/**
 * SDK Data Transformations
 *
 * Pure functions for Fingerprint v4 SDK client-side response handling.
 *
 * In v4, `getData()` returns a minimal response: `{ requestId, visitorId?, sealedResult? }`.
 * Enriched signals (geo, bot, VPN, incognito, browser details) are unavailable
 * client-side and must be resolved server-side by decrypting the sealed result
 * or calling the Server API.
 */

// ─── v4 SDK result shape ────────────────────────────────────────────────────

export interface SdkV4Result {
  /** Unique event identifier — used as requestId / eventId. */
  requestId: string;
  /** Visitor ID — may be absent when Zero Trust Mode is active. */
  visitorId?: string;
  /** Suspect score (0–1) if available from client. */
  suspectScore?: number;
  /** Base64-encoded sealed result for server-side decryption. */
  sealedResult?: string;
  /** Whether this result came from the local SDK cache. */
  cacheHit?: boolean;
  /** Confidence score (may be present in v4 depending on plan). */
  confidence?: { score: number };
  /** Whether the visitor was actually found. */
  visitorFound?: boolean;
}

// ─── Type guard ─────────────────────────────────────────────────────────────

/**
 * Type guard: returns `true` when the result is from the v4 SDK.
 * Checks for the presence of `sealedResult` or the absence of legacy
 * v3-only fields (`browserName`, `ipLocation`).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isSdkV4Result(result: any): result is SdkV4Result {
  return "sealedResult" in result || !("browserName" in result || "ipLocation" in result);
}

// ─── Sealed result extraction ───────────────────────────────────────────────

/**
 * Extract the base64-encoded sealed result from a v4 SDK response.
 *
 * @returns The sealed result string, or `undefined` if not v4 or missing.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function extractSealedResult(fpData: any): string | undefined {
  if (isSdkV4Result(fpData)) {
    return fpData.sealedResult;
  }
  return undefined;
}
