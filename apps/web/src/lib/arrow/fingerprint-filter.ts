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
  confidence: number;
  requestId?: string;
  visitorFound: boolean;
  visitorId: string;
}

/** Browser info subset stored in context */
export interface ArrowBrowserInfo {
  browserName?: string;
  browserVersion?: string;
  device?: string;
  os?: string;
  osVersion?: string;
}

/** Geolocation subset stored in context */
export interface ArrowGeoLocation {
  city?: string;
  country?: string;
  countryCode?: string;
  latitude?: number;
  longitude?: number;
  postalCode?: string;
  state?: string;
  stateCode?: string;
  timezone?: string;
}

/** Security / trust signals stored in context */
export interface ArrowTrustSignals {
  bot?: string;
  incognito?: boolean;
  proxy?: boolean;
  suspectScore?: number;
  tampering?: boolean;
  vpn?: boolean;
}

/** The complete filtered fingerprint data stored in Arrow context */
export interface ArrowFingerprintData {
  browser?: ArrowBrowserInfo;
  /** Raw event ID for server-side lookups */
  eventId: string;
  geo?: ArrowGeoLocation;
  identity: ArrowFingerprintIdentity;
  ip?: string;
  /** Timestamp of the fingerprint event */
  timestamp: number;
  trust?: ArrowTrustSignals;
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
