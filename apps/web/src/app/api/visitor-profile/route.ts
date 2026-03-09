/**
 * Visitor Profile API Route
 *
 * GET  /api/visitor-profile?visitorId=xxx  — Fetch visitor profile (cached)
 * POST /api/visitor-profile                — Mutations / resolve profile
 *
 * Both methods forward Arrow tracking headers to the upstream BED service.
 * Falls back to mock data when PROFILE_SERVICE_URL is not configured.
 */

import { type NextRequest, NextResponse } from "next/server";
import { extractForwardHeaders } from "~/lib/arrow/server-api";
import { getCachedVisitorProfile, resolveProfile } from "~/services/visitor-profile";

const isDev = process.env.NODE_ENV === "development";
function noop() {
  /* no-op */
}
const log = isDev ? console.log.bind(console, "[VisitorProfileAPI]") : noop;
const logError = console.error.bind(console, "[VisitorProfileAPI]");

// ─── GET /api/visitor-profile?visitorId=xxx ─────────────────────────────────

/**
 * Fetch a visitor profile by visitor ID.
 *
 * Query params:
 * - `visitorId` (required) — the fingerprint visitor ID
 *
 * Returns the full `VisitorProfile` shape from the BED service.
 * Response is suitable for client-side caching (5 min TTL on client).
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const visitorId = searchParams.get("visitorId");

    if (!visitorId) {
      return NextResponse.json(
        { error: "visitorId query parameter is required", code: "MISSING_VISITOR_ID" },
        { status: 400 }
      );
    }

    log("GET visitor profile for:", visitorId);

    // Use the server-cached version — tagged so events can invalidate it.
    // Falls through to the uncached `fetchVisitorProfile()` internally.
    const profile = await getCachedVisitorProfile(visitorId);

    if (!profile) {
      return NextResponse.json(
        { error: "Visitor profile not found", code: "NOT_FOUND" },
        { status: 404 }
      );
    }

    return NextResponse.json({ profile });
  } catch (error) {
    logError("GET error:", error);
    return NextResponse.json(
      { error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}

// ─── POST /api/visitor-profile ──────────────────────────────────────────────

/**
 * Resolve or update a visitor profile.
 *
 * Body:
 * - `action: "resolve"` — resolve/create a profile (used during session init)
 * - Future actions: "update_preferences", "add_tag", etc.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const action = body.action ?? "resolve";

    if (action === "resolve") {
      return handleResolve(request, body);
    }

    return NextResponse.json(
      { error: `Unknown action: ${action}`, code: "UNKNOWN_ACTION" },
      { status: 400 }
    );
  } catch (error) {
    logError("POST error:", error);
    return NextResponse.json(
      { error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}

// ─── Handlers ───────────────────────────────────────────────────────────────

async function handleResolve(request: NextRequest, body: Record<string, unknown>) {
  const fingerprintId = body.fingerprintId as string | undefined;
  const sessionId = body.sessionId as string | undefined;

  if (!(fingerprintId && sessionId)) {
    return NextResponse.json(
      { error: "fingerprintId and sessionId are required", code: "MISSING_IDS" },
      { status: 400 }
    );
  }

  log("Resolving profile for:", { fingerprintId, sessionId });

  const forwardHeaders = extractForwardHeaders(request);
  const profileId = await resolveProfile({
    payload: {
      fingerprintId,
      sessionId,
      metadata: body.metadata as Record<string, unknown> | undefined,
      fingerprintDetails: null,
    },
    ids: {
      sessionId,
      fingerprintId,
      profileId: null,
    },
    forwardHeaders,
  });

  return NextResponse.json({ profileId });
}
