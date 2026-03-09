/**
 * Arrow Fingerprint Types
 *
 * Type definitions for the lean fingerprint data shapes exposed
 * to the Arrow context. These are populated from the FED-safe
 * `FedFingerprintData` returned by the session API.
 */

// ─── Filtered shapes exposed to the Arrow context ───────────────────────────

/** Core identification attributes stored in context */
export interface ArrowFingerprintIdentity {
  visitorId: string;
  confidence: number;
  visitorFound: boolean;
  requestId?: string;
}

/** Browser info subset stored in context */
export interface ArrowBrowserInfo {
  browserName?: string;
  browserVersion?: string;
  os?: string;
  osVersion?: string;
  device?: string;
}

/** Geolocation subset stored in context */
export interface ArrowGeoLocation {
  city?: string;
  country?: string;
  countryCode?: string;
  state?: string;
  stateCode?: string;
  postalCode?: string;
  timezone?: string;
  latitude?: number;
  longitude?: number;
}

/** Security / trust signals stored in context */
export interface ArrowTrustSignals {
  bot?: string;
  incognito?: boolean;
  vpn?: boolean;
  proxy?: boolean;
  tampering?: boolean;
  suspectScore?: number;
}

/** The complete filtered fingerprint data stored in Arrow context */
export interface ArrowFingerprintData {
  identity: ArrowFingerprintIdentity;
  browser?: ArrowBrowserInfo;
  geo?: ArrowGeoLocation;
  trust?: ArrowTrustSignals;
  ip?: string;
  /** Raw event ID for server-side lookups */
  eventId: string;
  /** Timestamp of the fingerprint event */
  timestamp: number;
}

// ─── Utility extractors ─────────────────────────────────────────────────────

/**
 * Extract only the geo subset from `ArrowFingerprintData`.
 * Useful for location display components.
 */
export function extractGeoFromArrowData(
  data: ArrowFingerprintData | undefined
): ArrowGeoLocation | undefined {
  return data?.geo;
}

/**
 * Extract only the identity subset from `ArrowFingerprintData`.
 * Useful for logging / analytics without exposing geo or trust signals.
 */
export function extractIdentityFromArrowData(
  data: ArrowFingerprintData | undefined
): ArrowFingerprintIdentity | undefined {
  return data?.identity;
}
