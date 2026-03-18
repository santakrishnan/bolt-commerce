/**
 * Search History API — Proxy Route
 *
 * GET    /api/saved-registry/search-history       → List all entries
 * POST   /api/saved-registry/search-history       → Add an entry { query, url, type? }
 * DELETE /api/saved-registry/search-history       → Clear all entries
 *
 * Visitor identity is resolved via `extractArrowIds()` which reads
 * Arrow headers first, then falls back to httpOnly cookies. This
 * supports both `useArrowClient()` callers and plain `credentials: "include"`.
 *
 * ## BED migration
 *
 * When the BED Recent Search Service is ready:
 * 1. Uncomment the `bedClient` below and configure `BED_SAVED_REGISTRY_URL`
 * 2. Replace `searchHistoryService.*` calls with `bedClient.get/post/delete`
 * 3. Forward headers with `{ ids, headers: extractForwardHeaders(req) }`
 */

import { type NextRequest, NextResponse } from "next/server";
import { extractArrowIds } from "~/lib/arrow/server-api";
// import { extractForwardHeaders } from "~/lib/arrow/server-api";  // BED migration
import * as searchHistoryService from "~/lib/saved-registry/search-history.service";

// ── BED client (uncomment when BED service is available) ─────────────
//
// import { createArrowServerClient } from "~/lib/arrow/server-api";
//
// const bedClient = createArrowServerClient({
//   baseUrl: process.env.BED_SAVED_REGISTRY_URL!,
//   authToken: process.env.BED_API_KEY,
//   serviceName: "SearchHistory",
// });

function resolveVisitorId(req: NextRequest): string {
  const { fingerprintId } = extractArrowIds(req);
  return fingerprintId ?? "anonymous";
}

// ── GET — list all search entries ────────────────────────────────────

export async function GET(req: NextRequest) {
  try {
    const visitorId = resolveVisitorId(req);
    const data = await searchHistoryService.getAll(visitorId);
    return NextResponse.json({ data });
  } catch (error) {
    console.error("[SearchHistoryAPI] GET error:", error);
    return NextResponse.json(
      { data: [], error: "Failed to fetch search history" },
      { status: 500 }
    );
  }
}

// ── POST — add a search entry ────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const visitorId = resolveVisitorId(req);
    const body = await req.json();
    const { query, url, type = "nlp" } = body ?? {};

    if (typeof query !== "string" || typeof url !== "string") {
      return NextResponse.json(
        { data: [], error: "Missing `query` or `url` in request body" },
        { status: 400 }
      );
    }

    const data = await searchHistoryService.add(visitorId, query, url, type);
    return NextResponse.json({ data });
  } catch (error) {
    console.error("[SearchHistoryAPI] POST error:", error);
    return NextResponse.json({ data: [], error: "Failed to add search entry" }, { status: 500 });
  }
}

// ── DELETE — clear all search history ────────────────────────────────

export async function DELETE(req: NextRequest) {
  try {
    const visitorId = resolveVisitorId(req);
    const data = await searchHistoryService.clearAll(visitorId);
    return NextResponse.json({ data });
  } catch (error) {
    console.error("[SearchHistoryAPI] DELETE error:", error);
    return NextResponse.json(
      { data: [], error: "Failed to clear search history" },
      { status: 500 }
    );
  }
}
