/**
 * Visitor Profile Service Types
 *
 * Types for the unified visitor profile service that handles:
 * - Profile resolution (POST /profiles/resolve — used during session init)
 * - Visitor profile retrieval (GET /profiles/:visitorId — used on page load)
 */

import type { FingerprintEventData } from "../fingerprint/types";

// ─── Profile resolution (existing, absorbed from services/profile) ──────────

/** Payload sent to the upstream BED Profile Service for resolution. */
export interface ProfileResolvePayload {
  fingerprintId: string;
  sessionId: string;
  metadata?: {
    confidence?: number;
    requestId?: string;
    visitorFound?: boolean;
  };
  fingerprintDetails: FingerprintEventData | null;
}

/** Response shape when resolving a profile. */
export interface ProfileResolveResult {
  profileId: string;
}

/** Raw response from the upstream BED /profiles/resolve endpoint. */
export interface ProfileResolveApiResponse {
  profileId?: string;
  id?: string;
}

// ─── Visitor profile retrieval (new) ────────────────────────────────────────

/** Location data within a visitor profile. */
export interface VisitorLocation {
  city?: string;
  state?: string;
  stateCode?: string;
  country?: string;
  countryCode?: string;
  postalCode?: string;
  timezone?: string;
  latitude?: number;
  longitude?: number;
}

/** Device/browser information within a visitor profile. */
export interface VisitorDevice {
  browserName?: string;
  browserVersion?: string;
  os?: string;
  osVersion?: string;
  device?: string;
}

/** Trust/risk signals within a visitor profile. */
export interface VisitorTrustSignals {
  incognito?: boolean;
  bot?: boolean;
  vpn?: boolean;
  proxy?: boolean;
  suspectScore?: number;
}

/**
 * User-journey flags derived from upstream profile data.
 *
 * These replace the old `useUserConfig()` / `/api/user-config` approach —
 * the flags now travel as part of the canonical `VisitorProfile`.
 */
export interface VisitorUserFlags {
  prequalified?: boolean;
  tradeIn?: boolean;
  testDrive?: boolean;
}

/**
 * Full visitor profile — the shape returned by the
 * GET /api/visitor-profile?visitorId=xxx endpoint.
 *
 * Populated server-side from the BED Visitor Profile Service.
 * Contains aggregated profile data across multiple visits.
 */
export interface VisitorProfile {
  visitorId: string;
  profileId: string | null;
  firstSeen: string;
  lastSeen: string;
  visitCount: number;
  location?: VisitorLocation;
  device?: VisitorDevice;
  trust?: VisitorTrustSignals;
  /** User-journey flags (prequalified, tradeIn, testDrive). */
  userFlags?: VisitorUserFlags;
  tags?: string[];
  /** Arbitrary metadata attached to the profile upstream. */
  metadata?: Record<string, unknown>;
}

/** Response from the BED /profiles/:visitorId endpoint. */
export interface VisitorProfileApiResponse {
  profile?: VisitorProfile;
  error?: string;
}
