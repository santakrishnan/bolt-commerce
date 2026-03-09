import { type NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { extractForwardHeaders } from "~/lib/arrow/server-api";
import type { FedFingerprintData, FedLocationData } from "~/lib/arrow/types";
import type { FingerprintEventData } from "~/services/fingerprint";
import { resolveProfile } from "~/services/visitor-profile";
import { readFedData, readSession, writeFedData, writeSession } from "./session-cookies";
import { resolveFingerprint } from "./transform-fingerprint";
import type { ProfileProxyError, ProfileProxyRequest, ProfileProxyResponse } from "./types";

const isDev = process.env.NODE_ENV === "development";
function noop() {
  /* no-op */
}
const log = isDev ? console.log.bind(console, "[Session]") : noop;
const logError = console.error.bind(console, "[Session]");

// ─── FED-safe filter ────────────────────────────────────────────────────────

/**
 * Filter full `FingerprintEventData` → lean `FedFingerprintData`.
 *
 * Only `visitorId`, `incognito`, and `location` leave the server.
 * Everything else (IP, user-agent, browser details, bot, VPN, proxy,
 * tampering, suspect score, raw device attributes) stays server-side.
 */
function toFedData(details: FingerprintEventData, visitorId: string): FedFingerprintData {
  const geo = details.ip_info?.v4?.geolocation;
  let location: FedLocationData | undefined;

  if (geo) {
    location = {
      city: geo.city_name,
      country: geo.country_name,
      countryCode: geo.country_code,
      state: geo.subdivisions?.[0]?.name,
      stateCode: geo.subdivisions?.[0]?.iso_code,
      postalCode: geo.postal_code,
      timezone: geo.timezone,
    };
  }

  return {
    visitorId,
    incognito: details.incognito,
    location,
  };
}

// ─── Route Handlers ─────────────────────────────────────────────────────────

/**
 * GET /api/session
 *
 * Backward-compatible bootstrap check — reads session cookies and
 * returns existing IDs when valid.
 */
export function GET(request: NextRequest) {
  try {
    log("GET bootstrap check...");

    const session = readSession(request);

    if (session) {
      return NextResponse.json({
        initialized: true,
      });
    }

    return NextResponse.json({ initialized: false });
  } catch (error) {
    logError("GET error:", error);
    return NextResponse.json<ProfileProxyError>(
      { error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/session
 *
 * Unified endpoint supporting two modes:
 *
 * **Bootstrap** (`mode: "bootstrap"`):
 *   Checks existing cookies. If valid session + fingerprint cookies exist,
 *   returns the current IDs without requiring fingerprint data from the client.
 *   This saves a full Fingerprint SDK round-trip on repeat visits.
 *
 * **Initialize** (`mode: "initialize"` or omitted):
 *   Full initialization — requires `fingerprintId` from the client SDK.
 *   Resolves enriched signals via the hybrid v4 strategy:
 *     1. Sealed Client Results (primary — local AES-256-GCM decryption)
 *     2. Fingerprint Server API fallback (GET /events/:eventId)
 *     3. Client data fallback (v3 legacy, deprecated)
 *   Generates session ID, resolves profile, and sets individual httpOnly cookies.
 */
export async function POST(request: NextRequest) {
  try {
    const body: ProfileProxyRequest = await request.json();
    const mode = body.mode ?? "initialize";

    if (mode === "bootstrap") {
      return handleBootstrap(request);
    }

    return handleInitialize(request, body);
  } catch (error) {
    logError("POST error:", error);
    return NextResponse.json<ProfileProxyError>(
      { error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}

// ─── Mode Handlers ──────────────────────────────────────────────────────────

/** Handle `mode: "bootstrap"` — return existing IDs + FED data from session cookies */
function handleBootstrap(request: NextRequest) {
  const session = readSession(request);

  log("Bootstrap mode — session:", {
    hasSession: !!session,
    allCookieNames: request.cookies.getAll().map((c) => c.name),
  });

  if (session) {
    log("Valid session found, returning existing IDs + FED fingerprint data");

    // Read the lean FED fingerprint data stored in its own cookie.
    // If present, the client has everything it needs — NO SDK call required.
    const fedData = readFedData(request);

    return NextResponse.json({
      initialized: true,
      fingerprintDetails: fedData ?? undefined,
    });
  }

  log("No valid sealed session, client must initialize with Fingerprint SDK");
  return NextResponse.json({
    initialized: false,
    _debug: isDev ? { cookiesFound: request.cookies.getAll().map((c) => c.name) } : undefined,
  });
}

/** Handle `mode: "initialize"` — resolve fingerprint via hybrid v4 strategy, resolve profile, set cookies */
async function handleInitialize(request: NextRequest, body: ProfileProxyRequest) {
  const hasIdentifier = body.fingerprintId || body.sealedResult;
  if (!hasIdentifier) {
    return NextResponse.json<ProfileProxyError>(
      { error: "Fingerprint ID or sealed result is required", code: "MISSING_FINGERPRINT" },
      { status: 400 }
    );
  }

  log("Initialize mode — fingerprint:", {
    fingerprintId: body.fingerprintId ?? "(will extract from sealed result)",
    eventId: body.eventId,
    hasSealedResult: !!body.sealedResult,
    hasFingerprintData: !!body.fingerprintData,
    confidence: body.fingerprintMetadata?.confidence,
  });

  // 1. Generate Session ID
  const sessionId = uuidv4();
  log("Generated session ID:", sessionId);

  // 2. Resolve visitor details via hybrid v4 strategy:
  //    Sealed Results → Server API fallback → v3 client data fallback
  const fingerprintDetails = await resolveFingerprint(
    body.fingerprintId ?? "",
    body.eventId,
    body.sealedResult,
    body.fingerprintData
  );

  // When Sealed Results are active, visitor_id is removed from the client response.
  // Extract it from the decrypted sealed data instead.
  const fingerprintId = body.fingerprintId || fingerprintDetails?.visitor_id;

  if (!fingerprintId) {
    return NextResponse.json<ProfileProxyError>(
      {
        error: "Could not determine fingerprint ID from request or sealed result",
        code: "MISSING_FINGERPRINT",
      },
      { status: 400 }
    );
  }

  // 3. Resolve profile (forwards Arrow IDs + filtered request headers to BED service)
  const forwardHeaders = extractForwardHeaders(request);
  const profileId = await resolveProfile({
    payload: {
      fingerprintId,
      sessionId,
      metadata: body.fingerprintMetadata,
      fingerprintDetails,
    },
    ids: {
      sessionId,
      fingerprintId,
      profileId: null,
    },
    forwardHeaders,
  });

  // 4. Filter → FED-safe data (only visitorId, incognito, location)
  //    Full fingerprintDetails stays server-side — never sent to client.
  const fedData: FedFingerprintData | undefined = fingerprintDetails
    ? toFedData(fingerprintDetails, fingerprintId)
    : undefined;

  // 5. Build response + set individual httpOnly cookies
  const response = NextResponse.json<ProfileProxyResponse>({
    sessionId,
    fingerprintId,
    profileId,
    fingerprintMetadata: body.fingerprintMetadata,
    fingerprintDetails: fedData,
  });

  writeSession(response, {
    sessionId,
    fingerprintId,
    profileId,
    eventId: body.eventId,
  });

  // Store FED data in its own httpOnly cookie so bootstrap can return it
  // without needing another fingerprint resolution.
  if (fedData) {
    writeFedData(response, fedData);
  }

  log("Individual session cookies set successfully");
  return response;
}
