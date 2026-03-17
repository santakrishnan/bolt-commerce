/**
 * Centralized route path constants.
 *
 * All navigation paths used throughout the application should be imported
 * from here rather than hardcoded as string literals. This ensures
 * consistency, prevents typos, and makes refactoring easier.
 */

// ── Page Routes ──────────────────────────────────────────────────────

export const ROUTES = {
  HOME: "/",
  USED_CARS: "/used-cars",
  USED_CARS_DETAILS: "/used-cars/details",
  FAVORITES: "/favorites",
  MY_GARAGE: "/my-garage",
  SIGN_IN: "/sign-in",
  DEALER_NOTES: "/dealer-notes",
  /**
   * Temporary sample VDP path used as a placeholder in nav links
   * until real navigation routes are implemented.
   * TODO: Remove once actual nav routes are wired up.
   */
  TEMP_SAMPLE_VDP: "/used-cars/toyota/camry/se/2024/1G1AF1F57A7192174",
} as const;

// ── Location ─────────────────────────────────────────────────────────

/** Cookie name for the user's manual zip override (set in LocationProvider, read in layout) */
export const MANUAL_ZIP_COOKIE = "arrow_manual_zip";

/** Validates a 5-digit US zip code */
export const ZIP_RE = /^\d{5}$/;

// ── API Routes ───────────────────────────────────────────────────────

export const API_ROUTES = {
  SESSION: "/api/session",
  PROFILE: "/api/profile",
  EVENTS: "/api/events",
  EVENTS_TRACK: "/api/events/track",
  SEARCH: "/api/search",
  VISITOR_PROFILE: "/api/visitor-profile",
} as const;
