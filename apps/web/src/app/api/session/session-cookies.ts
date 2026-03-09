/**
 * Session Cookie Helpers
 *
 * Read / write the individual Arrow httpOnly cookies on Next.js
 * request / response objects.
 *
 * Each tracking ID has its own cookie with a browser-enforced `maxAge`.
 * Values are Base64url-encoded via `sealed-cookie.ts`.
 *
 * The FED fingerprint data cookie (`_arrow_fp_fed`) stores only the
 * lean `FedFingerprintData` shape (visitorId, incognito, location) so
 * that bootstrap can return it without any SDK or server call.
 */

import type { NextRequest, NextResponse } from "next/server";
import type { FedFingerprintData } from "~/lib/arrow/types";
import {
  type CookieConfig,
  decodeCookieValue,
  encodeCookieValue,
  getCookieConfigs,
  type SessionPayload,
} from "~/lib/auth/sealed-cookie";

// ─── Single-cookie helpers ──────────────────────────────────────────────────

/** Set one cookie from a CookieConfig + plain-text value */
function setCookie(response: NextResponse, config: CookieConfig, value: string): void {
  response.cookies.set(config.name, encodeCookieValue(value), {
    maxAge: config.maxAge,
    httpOnly: config.httpOnly,
    secure: config.secure,
    sameSite: config.sameSite,
    path: config.path,
  });
}

/** Read one cookie and decode its Base64url value */
function readCookie(request: NextRequest, config: CookieConfig): string | null {
  const raw = request.cookies.get(config.name)?.value;
  if (!raw) {
    return null;
  }
  return decodeCookieValue(raw);
}

// ─── Session-level helpers ──────────────────────────────────────────────────

/**
 * Read all Arrow cookies from the request and assemble a `SessionPayload`.
 *
 * Returns `null` when `sessionId` or `fingerprintId` are missing
 * (either never set or expired by the browser).
 */
export function readSession(request: NextRequest): SessionPayload | null {
  const configs = getCookieConfigs();

  const sessionId = readCookie(request, configs.session);
  const fingerprintId = readCookie(request, configs.fingerprint);

  // Both are required — if either cookie expired the session is invalid
  if (!(sessionId && fingerprintId)) {
    return null;
  }

  return {
    sessionId,
    fingerprintId,
    profileId: readCookie(request, configs.profile),
    eventId: readCookie(request, configs.event) ?? undefined,
  };
}

/**
 * Write all Arrow cookies onto a `NextResponse`.
 *
 * Each ID gets its own cookie with an individual browser-enforced `maxAge`.
 */
export function writeSession(response: NextResponse, payload: SessionPayload): void {
  const configs = getCookieConfigs();

  setCookie(response, configs.session, payload.sessionId);
  setCookie(response, configs.fingerprint, payload.fingerprintId);

  if (payload.profileId) {
    setCookie(response, configs.profile, payload.profileId);
  }
  if (payload.eventId) {
    setCookie(response, configs.event, payload.eventId);
  }
}

// ─── FED fingerprint data cookie ────────────────────────────────────────────

const FED_COOKIE_NAME = "_arrow_fp_fed";
const FED_COOKIE_TTL = 24 * 60 * 60; // 24 hours — same as fingerprint ID

function buildFedCookieConfig(): CookieConfig {
  const isProduction = process.env.NODE_ENV === "production";
  return {
    name: isProduction ? `__Host-${FED_COOKIE_NAME}` : FED_COOKIE_NAME,
    maxAge: FED_COOKIE_TTL,
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
  };
}

/**
 * Read the lean FED fingerprint data from its httpOnly cookie.
 * Returns `null` when the cookie is missing, expired, or corrupt.
 */
export function readFedData(request: NextRequest): FedFingerprintData | null {
  const config = buildFedCookieConfig();
  const raw = readCookie(request, config);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Write the lean FED fingerprint data to an httpOnly cookie.
 * This allows bootstrap to return the data without any SDK/server call.
 */
export function writeFedData(response: NextResponse, data: FedFingerprintData): void {
  const config = buildFedCookieConfig();
  setCookie(response, config, JSON.stringify(data));
}
