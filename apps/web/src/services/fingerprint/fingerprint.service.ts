/**
 * Fingerprint Service — Server API Fallback (Tier 2)
 *
 * Calls the Fingerprint Server API v4 (GET /v4/events/:event_id) to retrieve
 * the full event response including Smart Signals (geolocation, bot, VPN,
 * proxy, tampering, incognito, browser details).
 *
 * In the hybrid v4 strategy this is the **second-priority** resolution path:
 *   1. Sealed Client Results (primary — local AES-256-GCM, no API call)
 *   2. **Server API v4** (this service, fallback when sealed decryption unavailable)
 *   3. Client data (legacy, deprecated)
 *
 * Uses Next.js 16 `use cache` directive with `cacheLife('days')` since
 * fingerprint events are immutable by ID.
 */

import { cacheLife, cacheTag } from "next/cache";
import type { FingerprintApiResponse, FingerprintEventData } from "./types";

const isDev = process.env.NODE_ENV === "development";
function noop() {
  /* no-op */
}
const log = isDev ? console.log.bind(console, "[FingerprintService]") : noop;
const logWarn = isDev ? console.warn.bind(console, "[FingerprintService]") : noop;
const logError = console.error.bind(console, "[FingerprintService]");

/** Falls back to the global Fingerprint API when no custom endpoint is set. */
const FINGERPRINT_API_BASE_URL = process.env.FINGERPRINT_API_BASE_URL ?? "https://api.fpjs.io";

/**
 * Transforms a raw Fingerprint Server API v4 response into the canonical
 * `FingerprintEventData` shape.
 */
function transformFingerprintApiResponse(
  eventId: string,
  data: FingerprintApiResponse
): FingerprintEventData {
  const identification = data.identification;

  return {
    event_id: data.event_id ?? eventId,
    visitor_id: identification?.visitor_id ?? "",
    timestamp: data.timestamp ?? Date.now(),
    url: data.url,
    ip_address: data.ip_address,
    user_agent: data.user_agent,
    browser_details: data.browser_details,
    identification: {
      visitor_id: identification?.visitor_id ?? "",
      confidence: {
        score: identification?.confidence?.score ?? 0,
      },
      visitor_found: identification?.visitor_found ?? false,
    },
    ip_info: data.ip_info,
    bot: data.bot,
    incognito: data.incognito,
    vpn: data.vpn,
    proxy: data.proxy,
    tampering: data.tampering,
    suspect_score: data.suspect_score,
  };
}

/**
 * Fetches full visitor event details from the Fingerprint Server API.
 *
 * This is the **Tier 2 fallback** in the hybrid v4 strategy — called only when
 * Sealed Client Results decryption is unavailable or fails.
 *
 * Uses Next.js 16 `use cache` directive with:
 * - `cacheLife('days')` — fingerprint events are immutable by ID, cache aggressively
 * - `cacheTag('fingerprint', 'fp-event-{id}')` — enables targeted invalidation
 *
 * Returns `null` when:
 * - `FINGERPRINT_SECRET_API_KEY` is not configured
 * - The API returns a non-2xx response
 * - A network / parsing error occurs
 */
export async function fetchFingerprintDetails(
  eventId: string
): Promise<FingerprintEventData | null> {
  "use cache";
  cacheLife("days");
  cacheTag("fingerprint", `fp-event-${eventId}`);

  const apiKey = process.env.FINGERPRINT_SECRET_API_KEY;

  if (!apiKey) {
    logWarn("FINGERPRINT_SECRET_API_KEY not configured, skipping Server API call");
    return null;
  }
  console.log("Fetching fingerprint details for event ID:", eventId);
  try {
    log("Fetching visitor details from Fingerprint Server API...");

    const response = await fetch(`${FINGERPRINT_API_BASE_URL}/v4/events/${eventId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      logError("Fingerprint Server API error:", response.status, response.statusText);
      return null;
    }

    const data: FingerprintApiResponse = await response.json();

    const eventData = transformFingerprintApiResponse(eventId, data);

    log("Fingerprint Server API response received:", {
      visitor_id: eventData.visitor_id,
      confidence: eventData.identification?.confidence.score,
      bot: eventData.bot,
    });

    return eventData;
  } catch (error) {
    logError("Failed to fetch Fingerprint details:", error);
    return null;
  }
}
