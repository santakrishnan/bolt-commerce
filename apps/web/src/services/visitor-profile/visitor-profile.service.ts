/**
 * Visitor Profile Service
 *
 * Unified service for visitor profile operations:
 * - `resolveProfile()` — resolve/create a profile during session init (POST)
 * - `fetchVisitorProfile()` — retrieve a visitor profile by ID (GET)
 *
 * Both operations go through `ArrowServerClient` which handles header
 * forwarding, auth, retries, timeout, and structured error handling.
 *
 * Falls back to mock responses when `PROFILE_SERVICE_URL` is not configured.
 */

import { cacheLife, cacheTag } from "next/cache";
import { v4 as uuidv4 } from "uuid";
import {
  ArrowServerError,
  type ArrowServerIds,
  createArrowServerClient,
} from "~/lib/arrow/server-api";
import type {
  ProfileResolveApiResponse,
  ProfileResolvePayload,
  VisitorProfile,
  VisitorProfileApiResponse,
} from "./types";

// ─── Lazy singleton — created once, reused across requests ──────────────────

let _client: ReturnType<typeof createArrowServerClient> | null = null;

function getProfileClient() {
  if (!_client) {
    _client = createArrowServerClient({
      baseUrl: process.env.PROFILE_SERVICE_URL ?? "",
      authToken: process.env.PROFILE_API_KEY,
      serviceName: "VisitorProfileService",
      timeout: 10_000,
      retries: 1,
    });
  }
  return _client;
}

function isMockMode(): boolean {
  return !process.env.PROFILE_SERVICE_URL || process.env.USE_MOCK_PROFILE === "true";
}

// ─── Mock fallback for local / test ─────────────────────────────────────────

function createMockProfileId(): string {
  return `prof_mock_${uuidv4().substring(0, 16)}`;
}

function createMockVisitorProfile(visitorId: string): VisitorProfile {
  const now = new Date().toISOString();
  return {
    visitorId,
    profileId: createMockProfileId(),
    firstSeen: now,
    lastSeen: now,
    visitCount: 1,
    location: {
      city: "San Francisco",
      state: "California",
      stateCode: "CA",
      country: "United States",
      countryCode: "US",
      postalCode: "94105",
      timezone: "America/Los_Angeles",
      latitude: 37.7749,
      longitude: -122.4194,
    },
    device: {
      browserName: "Chrome",
      browserVersion: "125",
      os: "macOS",
      osVersion: "14.5",
      device: "Desktop",
    },
    trust: {
      incognito: false,
      bot: false,
      vpn: false,
      proxy: false,
      suspectScore: 0.02,
    },
    userFlags: {
      prequalified: false,
      tradeIn: false,
      testDrive: false,
    },
    tags: ["returning-visitor"],
    metadata: { source: "mock" },
  };
}

// ─── Profile Resolution (POST /profiles/resolve) ───────────────────────────

export interface ResolveProfileOptions {
  payload: ProfileResolvePayload;
  /** Arrow tracking IDs forwarded as headers to the BED service. */
  ids?: ArrowServerIds;
  /** Filtered incoming request headers to forward to BED. */
  forwardHeaders?: Record<string, string>;
}

/**
 * Resolve (create/lookup) a visitor profile.
 *
 * Strategy:
 * 1. If mock mode → return a generated mock profile ID.
 * 2. Otherwise POST to the upstream BED Profile Service.
 * 3. Falls back to `null` on failure so downstream code can continue.
 */
export async function resolveProfile({
  payload,
  ids,
  forwardHeaders,
}: ResolveProfileOptions): Promise<string | null> {
  if (isMockMode()) {
    const profileId = createMockProfileId();
    console.log("[VisitorProfileService] Using mock profile:", profileId);
    return profileId;
  }

  try {
    const data = await getProfileClient().post<ProfileResolveApiResponse>(
      "/profiles/resolve",
      payload,
      { ids, headers: forwardHeaders }
    );

    const profileId = data.profileId ?? data.id;

    if (!profileId) {
      console.warn("[VisitorProfileService] Upstream returned no profileId");
      return null;
    }

    console.log("[VisitorProfileService] Profile resolved:", profileId);
    return profileId;
  } catch (error) {
    if (error instanceof ArrowServerError) {
      console.error("[VisitorProfileService] BED error:", error.message);
    } else {
      console.error("[VisitorProfileService] Unexpected error:", error);
    }
    return null;
  }
}

// ─── Visitor Profile Retrieval (GET /profiles/:visitorId) ───────────────────

export interface FetchVisitorProfileOptions {
  visitorId: string;
  /** Arrow tracking IDs forwarded as headers to the BED service. */
  ids?: ArrowServerIds;
  /** Filtered incoming request headers to forward to BED. */
  forwardHeaders?: Record<string, string>;
}

/**
 * Fetch a visitor profile by visitor ID.
 *
 * Strategy:
 * 1. If mock mode → return a generated mock profile.
 * 2. Otherwise GET from the upstream BED Visitor Profile Service.
 * 3. Returns `null` on failure.
 */
export async function fetchVisitorProfile({
  visitorId,
  ids,
  forwardHeaders,
}: FetchVisitorProfileOptions): Promise<VisitorProfile | null> {
  if (isMockMode()) {
    const profile = createMockVisitorProfile(visitorId);
    console.log("[VisitorProfileService] Using mock visitor profile for:", visitorId);
    return profile;
  }

  try {
    const data = await getProfileClient().get<VisitorProfileApiResponse>(
      `/profiles/${encodeURIComponent(visitorId)}`,
      { ids, headers: forwardHeaders }
    );

    if (!data.profile) {
      console.warn("[VisitorProfileService] No profile found for:", visitorId);
      return null;
    }

    return data.profile;
  } catch (error) {
    if (error instanceof ArrowServerError) {
      console.error("[VisitorProfileService] BED error:", error.message);
    } else {
      console.error("[VisitorProfileService] Unexpected error:", error);
    }
    return null;
  }
}

// ─── Cached visitor profile fetch (Next.js 16 `use cache`) ─────────────────

/**
 * Server-cached version of `fetchVisitorProfile()`.
 *
 * Tagged with `visitor-profile` (global) and `visitor-profile-${visitorId}`
 * (per-visitor) so the cache can be surgically invalidated after events.
 *
 * Uses the "profile" cache profile defined in next.config.ts
 * (stale: 5 min, revalidate: 10 min, expire: 1 hour).
 */
// biome-ignore lint/suspicious/useAwait: async is required by the "use cache" Next.js directive
export async function getCachedVisitorProfile(visitorId: string): Promise<VisitorProfile | null> {
  "use cache";
  cacheTag("visitor-profile", `visitor-profile-${visitorId}`);
  cacheLife("profile");

  return fetchVisitorProfile({ visitorId });
}
