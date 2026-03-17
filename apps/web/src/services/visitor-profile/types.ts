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
  fingerprintDetails: FingerprintEventData | null;
  fingerprintId: string;
  metadata?: {
    confidence?: number;
    requestId?: string;
    visitorFound?: boolean;
  };
  sessionId: string;
}

/** Response shape when resolving a profile. */
export interface ProfileResolveResult {
  profileId: string;
}

/** Raw response from the upstream BED /profiles/resolve endpoint. */
export interface ProfileResolveApiResponse {
  id?: string;
  profileId?: string;
}

// ─── Visitor profile retrieval (new) ────────────────────────────────────────

/** Location data within a visitor profile. */
export interface VisitorLocation {
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

/** Device/browser information within a visitor profile. */
export interface VisitorDevice {
  browserName?: string;
  browserVersion?: string;
  device?: string;
  os?: string;
  osVersion?: string;
}

/** Trust/risk signals within a visitor profile. */
export interface VisitorTrustSignals {
  bot?: boolean;
  incognito?: boolean;
  proxy?: boolean;
  suspectScore?: number;
  vpn?: boolean;
}

/**
 * User-journey flags derived from upstream profile data.
 *
 * These replace the old `useUserConfig()` / `/api/user-config` approach —
 * the flags now travel as part of the canonical `VisitorProfile`.
 */
export interface VisitorUserFlags {
  prequalified?: boolean;
  testDrive?: boolean;
  tradeIn?: boolean;
}

/**
 * Full visitor profile — the shape returned by the
 * GET /api/visitor-profile?visitorId=xxx endpoint.
 *
 * Populated server-side from the BED Visitor Profile Service.
 * Contains aggregated profile data across multiple visits.
 */
export interface VisitorProfile {
  device?: VisitorDevice;
  firstSeen: string;
  lastSeen: string;
  location?: VisitorLocation;
  /** Arbitrary metadata attached to the profile upstream. */
  metadata?: Record<string, unknown>;
  profileId: string | null;
  tags?: string[];
  trust?: VisitorTrustSignals;
  /** User-journey flags (prequalified, tradeIn, testDrive). */
  userFlags?: VisitorUserFlags;
  visitCount: number;
  visitorId: string;
}

/** Response from the BED /profiles/:visitorId endpoint. */
export interface VisitorProfileApiResponse {
  error?: string;
  profile?: VisitorProfile;
}
