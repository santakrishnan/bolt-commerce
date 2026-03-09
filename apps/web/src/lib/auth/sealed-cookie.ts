/**
 * Arrow Session Cookies — Individual httpOnly cookies
 *
 * Each tracking identifier is stored in its own cookie with a
 * browser-enforced TTL (`maxAge`). Values are Base64url-encoded
 * for opacity. The `jose` library is available as a project
 * dependency for future JWE / JWS encryption needs.
 *
 * Cookie layout:
 * | Cookie name           | Value          | TTL     |
 * |-----------------------|----------------|---------|
 * | `_arrow_session_id`   | sessionId      | 90 days |
 * | `_arrow_fp_id`        | fingerprintId  | 24 hrs  |
 * | `_arrow_profile_id`   | profileId      | 24 hrs  |
 * | `_arrow_fp_eid`       | eventId        | 24 hrs  |
 *
 * Benefits:
 * - **Individual TTLs**: each cookie has its own browser-enforced `maxAge`
 * - **httpOnly + Secure + SameSite=Lax**: mitigates XSS & CSRF
 * - **`__Host-` prefix** in production (no subdomain leaks)
 *
 * @see jose — available for future encryption needs
 */

import { ARROW_COOKIE, ARROW_TTL } from "~/lib/arrow/constants";

// ─── Session data assembled from individual cookies ─────────────────────────

export interface SessionPayload {
  /** Server-generated session ID (UUID v4) */
  sessionId: string;
  /** Fingerprint visitor ID */
  fingerprintId: string;
  /** Resolved profile ID (nullable) */
  profileId: string | null;
  /** Fingerprint event ID for server-side detail lookups */
  eventId?: string;
}

// ─── Encode / Decode (Base64url — no encryption for now) ────────────────────

/**
 * Encode a plain string value into a Base64url cookie value.
 * The result is opaque-looking and safe for cookie transport.
 */
export function encodeCookieValue(value: string): string {
  return Buffer.from(value, "utf-8").toString("base64url");
}

/**
 * Decode a Base64url cookie value back into a plain string.
 * Returns `null` if decoding fails or the value is empty.
 */
export function decodeCookieValue(token: string): string | null {
  try {
    const value = Buffer.from(token, "base64url").toString("utf-8");
    return value || null;
  } catch {
    return null;
  }
}

// ─── Per-cookie configuration ───────────────────────────────────────────────

export interface CookieConfig {
  /** Final cookie name (includes `__Host-` prefix in production) */
  name: string;
  /** Browser-enforced TTL in seconds */
  maxAge: number;
  httpOnly: boolean;
  secure: boolean;
  sameSite: "lax";
  path: string;
}

/**
 * Build cookie options for a single Arrow cookie.
 *
 * In production the `__Host-` prefix enforces:
 * - `Secure` must be true
 * - `Path` must be `/`
 * - No `Domain` attribute (prevents subdomain leaks)
 */
function buildCookieConfig(baseName: string, ttl: number): CookieConfig {
  const isProduction = process.env.NODE_ENV === "production";
  return {
    name: isProduction ? `__Host-${baseName}` : baseName,
    maxAge: ttl,
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
  };
}

/**
 * Returns the cookie configuration for every Arrow cookie.
 *
 * Each entry maps to a distinct cookie with its own `maxAge`.
 */
export function getCookieConfigs() {
  return {
    session: buildCookieConfig(ARROW_COOKIE.SESSION_ID, ARROW_TTL.SESSION),
    fingerprint: buildCookieConfig(ARROW_COOKIE.FP_ID, ARROW_TTL.FINGERPRINT),
    profile: buildCookieConfig(ARROW_COOKIE.PROFILE_ID, ARROW_TTL.PROFILE),
    event: buildCookieConfig(ARROW_COOKIE.FP_EID, ARROW_TTL.EVENT),
  };
}
