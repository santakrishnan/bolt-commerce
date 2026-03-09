/**
 * Fingerprint Data Resolution — Hybrid v4 Strategy
 *
 * Resolves `FingerprintEventData` using a three-tier strategy:
 *
 * 1. **Sealed Client Results** (primary) — decrypt the `sealed_result` blob
 *    from the JS Agent v4 client response. AES-256-GCM local decryption,
 *    no external API call, no Server API quota usage.
 *
 * 2. **Fingerprint Server API** (fallback) — if sealed decryption fails or
 *    `sealed_result` is absent, call GET /events/:eventId with the secret
 *    API key. Uses Next.js `use cache` for aggressive caching.
 *
 * 3. **Client data** (v3 legacy fallback) — when both server paths fail and
 *    the client sent v3-style `fingerprintData`, transform it directly.
 *    This path is deprecated and will be removed when v3 SDK support ends.
 *
 * SDK v4 changes:
 * - Geolocation, bot, VPN, proxy, incognito, browser details are NOT
 *   available in the client response — only via sealed/server paths.
 * - `visitor_id` may be absent if Zero Trust Mode is active.
 */

import type { FingerprintEventData } from "~/services/fingerprint";
import { fetchFingerprintDetails } from "~/services/fingerprint";
import { unsealFingerprintResult } from "~/services/fingerprint/sealed.service";
import type { FingerprintClientData } from "./types";

const isDev = process.env.NODE_ENV === "development";
function noop() {
  /* no-op */
}
const log = isDev ? console.log.bind(console, "[FingerprintResolver]") : noop;

/**
 * Transform client-provided v3 SDK data into the canonical
 * `FingerprintEventData` shape.
 *
 * @deprecated v3 SDK is deprecated. This is retained only as a last-resort
 * fallback during migration. Will be removed when v3 support ends.
 */
export function transformClientData(
  fingerprintId: string,
  eventId: string,
  clientData: FingerprintClientData
): FingerprintEventData {
  return {
    event_id: eventId,
    visitor_id: fingerprintId,
    timestamp: Date.now(),
    ip_address: clientData.ip,
    browser_details: clientData.browserDetails
      ? {
          browser_name: clientData.browserDetails.browserName,
          browser_major_version: clientData.browserDetails.browserMajorVersion,
          os: clientData.browserDetails.os,
          os_version: clientData.browserDetails.osVersion,
          device: clientData.browserDetails.device,
        }
      : undefined,
    identification: {
      visitor_id: fingerprintId,
      confidence: {
        score: clientData.confidence ?? 0,
      },
      visitor_found: clientData.visitorFound ?? false,
    },
    ip_info: clientData.ipLocation
      ? {
          v4: {
            address: clientData.ip,
            geolocation: {
              accuracy_radius: clientData.ipLocation.accuracyRadius,
              latitude: clientData.ipLocation.latitude,
              longitude: clientData.ipLocation.longitude,
              postal_code: clientData.ipLocation.postalCode,
              timezone: clientData.ipLocation.timezone,
              city_name: clientData.ipLocation.city?.name,
              country_code: clientData.ipLocation.country?.code,
              country_name: clientData.ipLocation.country?.name,
              continent_code: clientData.ipLocation.continent?.code,
              continent_name: clientData.ipLocation.continent?.name,
              subdivisions: clientData.ipLocation.subdivisions?.map((s) => ({
                iso_code: s.isoCode,
                name: s.name,
              })),
            },
          },
        }
      : undefined,
    bot: clientData.bot,
    incognito: clientData.incognito,
    vpn: clientData.vpn,
    proxy: clientData.proxy,
    tampering: clientData.tampering,
    suspect_score: clientData.suspectScore,
  };
}

/**
 * Resolve fingerprint event data using the hybrid v4 strategy.
 *
 * Priority:
 * 1. Sealed Client Results — decrypt locally (fastest, no API quota)
 * 2. Server API — GET /events/:eventId (cached, requires FINGERPRINT_SECRET_API_KEY)
 * 3. Client data — v3 legacy fallback (deprecated)
 *
 * @returns The resolved `FingerprintEventData`, or `null` if all strategies fail
 */
export async function resolveFingerprint(
  fingerprintId: string,
  eventId: string | undefined,
  sealedResult?: string,
  clientData?: FingerprintClientData
): Promise<FingerprintEventData | null> {
  // 1. Sealed Client Results (primary — v4 SDK)
  if (sealedResult && eventId) {
    try {
      const sealedData = await unsealFingerprintResult(sealedResult, eventId);
      if (sealedData) {
        log("Resolved via Sealed Client Results (local decryption, no API call)");
        return sealedData;
      }
      log("Sealed decryption returned null — falling back to Server API");
    } catch (err) {
      log("Sealed decryption failed — falling back to Server API:", err);
    }
  }

  // 2. Fingerprint Server API (fallback — requires FINGERPRINT_SECRET_API_KEY)
  if (eventId) {
    try {
      const serverData = await fetchFingerprintDetails(eventId);
      if (serverData) {
        log("Resolved via Fingerprint Server API (includes all Smart Signals)");
        return serverData;
      }
      log("Server API returned no data — falling back to client data");
    } catch (err) {
      log("Server API call failed — falling back to client data:", err);
    }
  }

  // 3. Client data — v3 legacy fallback (deprecated)
  if (clientData) {
    log("Resolved via client-provided data (v3 legacy — no geo/bot/incognito in v4)");
    return transformClientData(fingerprintId, eventId ?? fingerprintId, clientData);
  }

  return null;
}
