/**
 * Arrow Constants
 *
 * Centralised identifiers used across the entire tracking / session system.
 * Change cookie or header names here — every consumer imports from this file.
 */

// ─── Cookie Names ────────────────────────────────────────────────────────────

export const ARROW_COOKIE = {
  /** Server-generated session identifier (UUID v4, 90-day TTL) */
  SESSION_ID: "_arrow_session_id",
  /** Fingerprint visitor identifier (24-hour TTL) */
  FP_ID: "_arrow_fp_id",
  /** Resolved profile identifier (24-hour TTL) */
  PROFILE_ID: "_arrow_profile_id",
  /** Fingerprint event / request identifier (24-hour TTL) */
  FP_EID: "_arrow_fp_eid",
} as const;

// ─── HTTP Header Names ──────────────────────────────────────────────────────

export const ARROW_HEADER = {
  SESSION_ID: "X-Arrow-Session-Id",
  FP_ID: "X-Arrow-Fp-Id",
  PROFILE_ID: "X-Arrow-Profile-Id",
  FP_EID: "X-Arrow-Fp-Eid",
} as const;

// ─── Cookie TTLs (seconds) ──────────────────────────────────────────────────

export const ARROW_TTL = {
  /** Session cookie — 90 days */
  SESSION: 90 * 24 * 60 * 60,
  /** Fingerprint ID cookie — 24 hours */
  FINGERPRINT: 24 * 60 * 60,
  /** Profile ID cookie — 24 hours */
  PROFILE: 24 * 60 * 60,
  /** Event ID cookie — 24 hours */
  EVENT: 24 * 60 * 60,
} as const;

// ─── Convenience type for all cookie values ─────────────────────────────────

export type ArrowCookieName = (typeof ARROW_COOKIE)[keyof typeof ARROW_COOKIE];
export type ArrowHeaderName = (typeof ARROW_HEADER)[keyof typeof ARROW_HEADER];
