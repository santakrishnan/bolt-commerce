/**
 * Events Track Route — HTTP contract types
 *
 * Describes the request / response shapes for POST /api/events/track.
 * Service-level types live in src/services/events/.
 */

export interface EventTrackRequest {
  event: string;
  properties?: Record<string, unknown>;
  timestamp: number;
}

export interface EventTrackResponse {
  eventId: string;
  message: string;
  success: boolean;
}

export interface EventTrackError {
  code: string;
  error: string;
}
