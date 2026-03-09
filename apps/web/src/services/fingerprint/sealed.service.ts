/**
 * Sealed Results Decryption Service
 *
 * Decrypts the `sealed_result` payload returned by the Fingerprint JS Agent v4
 * using the `@fingerprintjs/fingerprintjs-pro-server-api` SDK.
 *
 * This eliminates the need for a separate Server API call to `/events/:id`.
 * The sealed payload contains the exact same data as the Server API response,
 * encrypted with AES-256-GCM using a symmetric key from the Fingerprint dashboard.
 *
 * @see https://dev.fingerprint.com/docs/sealed-client-results
 */

import {
  DecryptionAlgorithm,
  unsealEventsResponse,
} from "@fingerprintjs/fingerprintjs-pro-server-api";
import type { FingerprintEventData } from "./types";

const isDev = process.env.NODE_ENV === "development";
function noop() {
  /* no-op */
}
const log = isDev ? console.log.bind(console, "[SealedService]") : noop;
const logWarn = isDev ? console.warn.bind(console, "[SealedService]") : noop;
const logError = console.error.bind(console, "[SealedService]");

/**
 * Decrypt a Sealed Client Result and transform it into our canonical shape.
 *
 * @param sealedResultBase64 - The base64-encoded sealed payload from the JS Agent
 * @param eventId - The event_id returned alongside the sealed result (used as fallback identifier)
 * @returns The decrypted and transformed event data, or `null` on failure
 */
export async function unsealFingerprintResult(
  sealedResultBase64: string,
  eventId: string
): Promise<FingerprintEventData | null> {
  const sealedKeyBase64 = process.env.FINGERPRINT_SEALED_KEY;

  if (!sealedKeyBase64) {
    logWarn(
      "FINGERPRINT_SEALED_KEY not configured — cannot decrypt sealed results. " +
        "Falling back to Server API if available."
    );
    return null;
  }

  try {
    log("Decrypting sealed result...");

    const sealedData = Buffer.from(sealedResultBase64, "base64");
    const decryptionKey = Buffer.from(sealedKeyBase64, "base64");

    // Decrypt + decompress using the official Fingerprint SDK
    const unsealedData = await unsealEventsResponse(sealedData, [
      { key: decryptionKey, algorithm: DecryptionAlgorithm.Aes256Gcm },
    ]);

    // The unsealed response has the same structure as the /events Server API response.
    // Transform it into our canonical FingerprintEventData shape.
    const identification = unsealedData.products?.identification?.data;
    const ipInfo = unsealedData.products?.ipInfo?.data;

    const eventData: FingerprintEventData = {
      event_id: eventId,
      visitor_id: identification?.visitorId ?? "",
      timestamp: identification?.timestamp
        ? new Date(identification.timestamp).getTime()
        : Date.now(),
      url: identification?.url,
      ip_address: identification?.ip,
      browser_details: identification?.browserDetails
        ? {
            browser_name: identification.browserDetails.browserName,
            browser_major_version: identification.browserDetails.browserMajorVersion,
            os: identification.browserDetails.os,
            os_version: identification.browserDetails.osVersion,
            device: identification.browserDetails.device,
          }
        : undefined,
      identification: {
        visitor_id: identification?.visitorId ?? "",
        confidence: {
          score: identification?.confidence?.score ?? 0,
        },
        visitor_found: identification?.visitorFound ?? false,
      },
      ip_info: ipInfo
        ? {
            v4: {
              address: identification?.ip,
              geolocation: ipInfo.v4?.address
                ? {
                    accuracy_radius: ipInfo.v4.geolocation?.accuracyRadius,
                    latitude: ipInfo.v4.geolocation?.latitude,
                    longitude: ipInfo.v4.geolocation?.longitude,
                    postal_code: ipInfo.v4.geolocation?.postalCode,
                    timezone: ipInfo.v4.geolocation?.timezone,
                    city_name: ipInfo.v4.geolocation?.city?.name,
                    country_code: ipInfo.v4.geolocation?.country?.code,
                    country_name: ipInfo.v4.geolocation?.country?.name,
                    continent_code: ipInfo.v4.geolocation?.continent?.code,
                    continent_name: ipInfo.v4.geolocation?.continent?.name,
                    subdivisions: ipInfo.v4.geolocation?.subdivisions?.map((s) => ({
                      iso_code: s.isoCode,
                      name: s.name,
                    })),
                  }
                : undefined,
            },
          }
        : undefined,
      bot: unsealedData.products?.botd?.data?.bot?.result,
      incognito: identification?.incognito,
      vpn: unsealedData.products?.vpn?.data?.result,
      proxy: unsealedData.products?.proxy?.data?.result,
      tampering: unsealedData.products?.tampering?.data?.result,
      suspect_score: unsealedData.products?.suspectScore?.data?.result,
    };

    log("Sealed result decrypted successfully:", {
      visitor_id: eventData.visitor_id,
      confidence: eventData.identification?.confidence.score,
      hasGeo: !!eventData.ip_info,
      bot: eventData.bot,
      incognito: eventData.incognito,
    });

    return eventData;
  } catch (error) {
    logError("Failed to decrypt sealed result:", error);
    return null;
  }
}
