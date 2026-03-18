/**
 * Single Vehicle API — Proxy Route
 *
 * DELETE /api/saved-registry/vehicles/:vin → Remove a saved vehicle
 */

import { type NextRequest, NextResponse } from "next/server";
import { extractArrowIds } from "~/lib/arrow/server-api";
import * as vehiclesService from "~/lib/saved-registry/vehicles.service";

function resolveVisitorId(req: NextRequest): string {
  const { fingerprintId } = extractArrowIds(req);
  return fingerprintId ?? "anonymous";
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ vin: string }> }) {
  try {
    const { vin } = await params;
    const visitorId = resolveVisitorId(req);
    const data = await vehiclesService.remove(visitorId, vin);

    // BED: const ids = extractArrowIds(req);
    //      const { data } = await bedClient.delete(`/vehicles/${vin}`, {
    //        ids,
    //        headers: extractForwardHeaders(req),
    //      });

    return NextResponse.json({ data });
  } catch (error) {
    console.error("[SavedVehiclesAPI] DELETE /:vin error:", error);
    return NextResponse.json({ data: [], error: "Failed to remove vehicle" }, { status: 500 });
  }
}
