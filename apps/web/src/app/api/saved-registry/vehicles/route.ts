/**
 * Saved Vehicles API — Proxy Route
 *
 * GET    /api/saved-registry/vehicles       → List all saved VINs
 * POST   /api/saved-registry/vehicles       → Save a vehicle { vin }
 * DELETE /api/saved-registry/vehicles       → Clear all saved vehicles
 *
 * Visitor identity is resolved via `extractArrowIds()` which reads
 * Arrow headers first, then falls back to httpOnly cookies. This
 * supports both `useArrowClient()` callers and plain `credentials: "include"`.
 *
 * ## BED migration
 *
 * When the BED Saved Vehicle Service is ready:
 * 1. Uncomment the `bedClient` below and configure `BED_SAVED_REGISTRY_URL`
 * 2. Replace `vehiclesService.*` calls with `bedClient.get/post/delete`
 * 3. Forward headers with `{ ids, headers: extractForwardHeaders(req) }`
 */

import { type NextRequest, NextResponse } from "next/server";
import { extractArrowIds } from "~/lib/arrow/server-api";
// import { extractForwardHeaders } from "~/lib/arrow/server-api";  // BED migration
import * as vehiclesService from "~/lib/saved-registry/vehicles.service";

// ── BED client (uncomment when BED service is available) ─────────────
//
// import { createArrowServerClient } from "~/lib/arrow/server-api";
//
// const bedClient = createArrowServerClient({
//   baseUrl: process.env.BED_SAVED_REGISTRY_URL!,
//   authToken: process.env.BED_API_KEY,
//   serviceName: "SavedVehicles",
// });

function resolveVisitorId(req: NextRequest): string {
  const { fingerprintId } = extractArrowIds(req);
  return fingerprintId ?? "anonymous";
}

// ── GET — list all saved VINs ────────────────────────────────────────

export async function GET(req: NextRequest) {
  try {
    const visitorId = resolveVisitorId(req);
    const data = await vehiclesService.getAll(visitorId);

    // BED: const ids = extractArrowIds(req);
    //      const { data } = await bedClient.get("/vehicles", {
    //        ids,
    //        headers: extractForwardHeaders(req),
    //      });

    return NextResponse.json({ data });
  } catch (error) {
    console.error("[SavedVehiclesAPI] GET error:", error);
    return NextResponse.json(
      { data: [], error: "Failed to fetch saved vehicles" },
      { status: 500 }
    );
  }
}

// ── POST — save a vehicle ────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const visitorId = resolveVisitorId(req);
    const body = await req.json();
    const vin = body?.vin;

    if (typeof vin !== "string" || !vin.trim()) {
      return NextResponse.json(
        { data: [], error: "Missing or invalid `vin` in request body" },
        { status: 400 }
      );
    }

    const data = await vehiclesService.save(visitorId, vin.trim());

    // BED: const ids = extractArrowIds(req);
    //      const { data } = await bedClient.post("/vehicles", { vin }, {
    //        ids,
    //        headers: extractForwardHeaders(req),
    //      });

    return NextResponse.json({ data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save vehicle";
    console.error("[SavedVehiclesAPI] POST error:", error);
    return NextResponse.json({ data: [], error: message }, { status: 500 });
  }
}

// ── DELETE — clear all saved vehicles ────────────────────────────────

export async function DELETE(req: NextRequest) {
  try {
    const visitorId = resolveVisitorId(req);
    const data = await vehiclesService.clearAll(visitorId);

    // BED: const ids = extractArrowIds(req);
    //      const { data } = await bedClient.delete("/vehicles", {
    //        ids,
    //        headers: extractForwardHeaders(req),
    //      });

    return NextResponse.json({ data });
  } catch (error) {
    console.error("[SavedVehiclesAPI] DELETE error:", error);
    return NextResponse.json(
      { data: [], error: "Failed to clear saved vehicles" },
      { status: 500 }
    );
  }
}
