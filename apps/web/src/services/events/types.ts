/**
 * Events Service Types
 *
 * Types for tracking events to an upstream analytics / event service.
 */

/** Tracking identifiers forwarded from the client via request headers. */
export interface EventTrackingIds {
  sessionId: string;
  fingerprintId: string | null;
  profileId: string | null;
}

/** Normalised payload the service receives from the route handler. */
export interface TrackEventPayload {
  event: string;
  properties?: Record<string, unknown>;
  timestamp: number;
  trackingIds: EventTrackingIds;
}

/** Result returned by the service on success. */
export interface TrackEventResult {
  eventId: string;
}
