"use client";

import { useCallback, useRef } from "react";
import { useArrowSafe } from "./arrow-provider";
import { ARROW_HEADER } from "./constants";
import { ARROW_ENCRYPTED_HEADER, encryptPayload, resolveEncryptionKey } from "./encryption";

/**
 * Event Tracking Utility
 *
 * Provides utilities for tracking events. The hook reads IDs from
 * ArrowContext when available but always fires the event (with
 * "anonymous" session fallback if IDs are unavailable).
 *
 * When `NEXT_PUBLIC_ARROW_ENCRYPTION_KEY` is configured, the event
 * body is automatically encrypted as a JWE compact string.
 *
 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5
 */

interface EventTrackRequest {
  eventName: string;
  properties?: Record<string, unknown>;
  sessionId: string;
  fingerprintId: string | null;
  profileId: string | null;
  timestamp: number;
}

interface EventTracker {
  trackEvent(request: EventTrackRequest): Promise<void>;
}

export function createEventTracker(): EventTracker {
  const baseUrl = process.env.NEXT_PUBLIC_EVENT_SERVICE_URL || "/api/events";
  const encryptionKey = resolveEncryptionKey();

  return {
    async trackEvent(request: EventTrackRequest): Promise<void> {
      const payload = {
        event: request.eventName,
        properties: request.properties,
        timestamp: request.timestamp,
      };

      // Encrypt body when key is available
      const isEncrypted = !!encryptionKey;
      const body = isEncrypted
        ? await encryptPayload(payload, encryptionKey!)
        : JSON.stringify(payload);

      const headers: Record<string, string> = {
        "Content-Type": isEncrypted ? "text/plain" : "application/json",
      };
      // Only send ID headers when we have real values — lets the server
      // fall back to httpOnly cookies for IDs we don't have in JS memory.
      if (request.sessionId && request.sessionId !== "anonymous") {
        headers[ARROW_HEADER.SESSION_ID] = request.sessionId;
      }
      if (request.fingerprintId) {
        headers[ARROW_HEADER.FP_ID] = request.fingerprintId;
      }
      if (request.profileId) {
        headers[ARROW_HEADER.PROFILE_ID] = request.profileId;
      }
      if (isEncrypted) {
        headers[ARROW_ENCRYPTED_HEADER] = "true";
      }

      const response = await fetch(`${baseUrl}/track`, {
        method: "POST",
        headers,
        body,
      });

      if (!response.ok) {
        throw new Error(`Event tracking failed: ${response.statusText}`);
      }
    },
  };
}

/**
 * Hook for easy event tracking.
 *
 * Uses useArrow() to get tracking IDs. If ArrowProvider is not mounted
 * (context is null), events still fire with "anonymous" session.
 */
export function useEventTracking() {
  const arrow = useArrowSafe();
  const sessionId = arrow?.sessionId ?? null;
  const fingerprintId = arrow?.fingerprintId ?? null;
  const profileId = arrow?.profileId ?? null;
  const invalidateProfile = arrow?.invalidateProfile ?? null;

  const eventTracker = useRef(createEventTracker());

  const trackEvent = useCallback(
    async (eventName: string, properties?: Record<string, unknown>) => {
      try {
        await eventTracker.current.trackEvent({
          eventName,
          properties,
          sessionId: sessionId ?? "anonymous",
          fingerprintId,
          profileId,
          timestamp: Date.now(),
        });

        // Bust the visitor-profile cache so the next page load
        // fetches a fresh profile from the server.
        invalidateProfile?.().catch((err) => {
          console.error("[Arrow] Failed to invalidate profile after event:", err);
        });
      } catch (error) {
        console.error("[Arrow] Failed to track event:", error);
      }
    },
    [sessionId, fingerprintId, profileId, invalidateProfile]
  );

  return { trackEvent };
}
