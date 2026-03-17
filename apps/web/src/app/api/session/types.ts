/**
 * Session API — HTTP contract types
 *
 * These types describe the request / response shapes for the
 * /api/session route. Service-level types live in src/services/.
 *
 * Security: The full `FingerprintEventData` NEVER leaves the server.
 * The client receives only the lean `FedFingerprintData` shape
 * (visitorId, incognito, location).
 */

import type { FedFingerprintData } from "~/lib/arrow/types";

/**
 * Enriched fingerprint data sent from client to server.
 *
 * **SDK v4:** Most fields below are unavailable client-side. The client sends
 * `sealedResult` (base64) and the server decrypts it to get all signals.
 * This interface is retained for backward compatibility with any v3 clients
 * and for the server-side hydrated shape after decryption.
 *
 * **SDK v3 (deprecated):** Provided all fields directly.
 */
export interface FingerprintClientData {
  /** Smart Signal add-ons — only present if enabled on the subscription */
  bot?: string;
  browserDetails?: {
    browserName?: string;
    browserMajorVersion?: string;
    os?: string;
    osVersion?: string;
    device?: string;
  };
  confidence?: number;
  /** @deprecated Not available in SDK v4 client response — use sealed/server path */
  incognito?: boolean;
  ip?: string;
  /** @deprecated Not available in SDK v4 client response — use sealed/server path */
  ipLocation?: {
    accuracyRadius?: number;
    latitude?: number;
    longitude?: number;
    postalCode?: string;
    timezone?: string;
    city?: { name?: string };
    country?: { code?: string; name?: string };
    continent?: { code?: string; name?: string };
    subdivisions?: Array<{ isoCode?: string; name?: string }>;
  };
  proxy?: boolean;
  suspectScore?: number;
  tampering?: boolean;
  visitorFound?: boolean;
  vpn?: boolean;
}

export interface ProfileProxyRequest {
  eventId?: string;
  /**
   * Full enriched fingerprint payload from the v3 JS Agent (sent client-side).
   * @deprecated SDK v3 is deprecated — use `sealedResult` for v4 SDK.
   * Retained for backward compatibility during migration.
   */
  fingerprintData?: FingerprintClientData;
  fingerprintId?: string;
  fingerprintMetadata?: {
    confidence?: number;
    requestId?: string;
    visitorFound?: boolean;
  };
  /** `"bootstrap"` checks cookies only; `"initialize"` (default) does full setup. */
  mode?: "bootstrap" | "initialize";
  /**
   * Base64-encoded sealed result from the JS Agent v4 (Sealed Client Results).
   *
   * When present, the server decrypts this locally (AES-256-GCM) to obtain
   * the full /events response — no Fingerprint Server API call needed.
   *
   * If decryption fails or this field is absent, the server falls back to
   * calling the Fingerprint Server API with `eventId`.
   */
  sealedResult?: string;
}

export interface ProfileProxyResponse {
  error?: string;
  /**
   * FED-safe fingerprint data — only visitorId, incognito, and location.
   * The full `FingerprintEventData` stays server-side.
   */
  fingerprintDetails?: FedFingerprintData;
  fingerprintId: string;
  fingerprintMetadata?: {
    confidence?: number;
    requestId?: string;
    visitorFound?: boolean;
  };
  profileId: string | null;
  sessionId: string;
}

export interface ProfileProxyError {
  code: string;
  error: string;
  partialData?: {
    sessionId?: string;
    fingerprintId?: string;
  };
}
