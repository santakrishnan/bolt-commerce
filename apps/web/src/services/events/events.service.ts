/**
 * Events Service
 *
 * Handles event tracking logic: generating event IDs and forwarding events to
 * an upstream analytics service (or falling back to a mock/log-only mode when
 * the service URL is not configured).
 */

import type { TrackEventPayload, TrackEventResult } from "./types";

/** Generates a unique event ID. */
function generateEventId(): string {
  return `evt_${Date.now()}_${Math.random().toString(36).substring(7)}`;
}

/**
 * Forwards the event to the upstream analytics / event service.
 * Returns `null` when the upstream call fails.
 */
async function callEventServiceApi(
  serviceUrl: string,
  payload: TrackEventPayload
): Promise<TrackEventResult | null> {
  try {
    const response = await fetch(serviceUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.EVENT_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error(
        "[EventsService] Upstream event service error:",
        response.status,
        response.statusText
      );
      return null;
    }

    const data = await response.json();
    return { eventId: data.eventId ?? generateEventId() };
  } catch (error) {
    console.error("[EventsService] Upstream event service unavailable:", error);
    return null;
  }
}

/**
 * Tracks an event.
 *
 * Strategy:
 * - When `EVENT_TRACKING_URL` is not set, logs the event locally and returns a
 *   generated event ID (mock/dev mode).
 * - Otherwise forwards the event to the upstream service and falls back to a
 *   generated ID if the call fails.
 */
export async function trackEvent(payload: TrackEventPayload): Promise<TrackEventResult> {
  const serviceUrl = process.env.EVENT_TRACKING_URL;

  // Log event in all environments for observability
  console.log("[EventsService] Tracking event:", {
    event: payload.event,
    properties: payload.properties,
    timestamp: payload.timestamp,
    sessionId: payload.trackingIds.sessionId,
    fingerprintId: payload.trackingIds.fingerprintId,
    profileId: payload.trackingIds.profileId,
  });

  if (!serviceUrl) {
    const eventId = generateEventId();
    console.log("[EventsService] Mock mode — generated event ID:", eventId);
    return { eventId };
  }

  const result = await callEventServiceApi(serviceUrl, payload);
  return { eventId: result?.eventId ?? generateEventId() };
}
