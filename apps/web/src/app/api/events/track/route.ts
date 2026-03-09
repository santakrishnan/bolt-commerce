import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { decryptArrowPayload, extractArrowIds } from "~/lib/arrow/server-api";
import { trackEvent } from "~/services/events";
import type { EventTrackError, EventTrackRequest, EventTrackResponse } from "./types";

/**
 * POST /api/events/track
 *
 * Thin HTTP handler — validates the request and delegates tracking logic to
 * EventsService. All business logic lives in src/services/events/.
 *
 * Supports optional JWE encryption: when the `X-Arrow-Encrypted` header
 * is `"true"`, the body is decrypted before processing.
 *
 * Tracking IDs are resolved from `X-Arrow-*` headers first, falling back
 * to httpOnly cookies when headers are absent.
 */
export async function POST(request: NextRequest) {
  try {
    // Extract tracking IDs — headers first, cookie fallback
    const { sessionId, fingerprintId, profileId } = extractArrowIds(request);

    // Decrypt body if encrypted, otherwise parse as JSON
    const body = await decryptArrowPayload<EventTrackRequest>(request);

    // Validate required fields
    if (!body.event) {
      return NextResponse.json<EventTrackError>(
        { error: "Event name is required", code: "INVALID_REQUEST" },
        { status: 400 }
      );
    }

    if (!sessionId) {
      return NextResponse.json<EventTrackError>(
        { error: "Session ID is required", code: "MISSING_SESSION_ID" },
        { status: 400 }
      );
    }

    const { eventId } = await trackEvent({
      event: body.event,
      properties: body.properties,
      timestamp: body.timestamp,
      trackingIds: { sessionId, fingerprintId, profileId },
    });

    // Bust the server-side visitor-profile cache so the next page load
    // fetches a fresh profile reflecting any state changes from this event.
    if (fingerprintId) {
      revalidateTag(`visitor-profile-${fingerprintId}`, {
        stale: 300,
        revalidate: 600,
        expire: 3600,
      });
    }

    return NextResponse.json<EventTrackResponse>({
      success: true,
      eventId,
      message: "Event tracked successfully",
    });
  } catch (error) {
    console.error("[Events Track] Error:", error);
    return NextResponse.json<EventTrackError>(
      { error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
