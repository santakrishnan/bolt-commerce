import { type NextRequest, NextResponse } from "next/server";
import { extractArrowIds, extractForwardHeaders } from "~/lib/arrow/server-api";
import { fetchVehicleData, fetchVinData } from "~/services/vdp";

const isDev = process.env.NODE_ENV === "development";
function noop() {
  /* no-op */
}
const log = isDev ? console.log.bind(console, "[SearchVehicleAPI]") : noop;

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    log("REQ", {
      method: request.method,
      path: request.nextUrl.pathname,
      id,
      sessionId: request.headers.get("x-arrow-session-id"),
      fingerprintId: request.headers.get("x-arrow-fp-id"),
      profileId: request.headers.get("x-arrow-profile-id"),
    });

    if (!id) {
      log("RES", { status: 400, code: "MISSING_ID" });
      return NextResponse.json(
        { data: null, error: "Vehicle ID is required", code: "MISSING_ID" },
        { status: 400 }
      );
    }

    const ids = extractArrowIds(request);
    const forwardHeaders = extractForwardHeaders(request);

    // Vehicle id is the VIN in this route contract.
    const vinData = await fetchVinData(id, { ids, forwardHeaders });
    const vehicleData = await fetchVehicleData(vinData.vehicle.id, { ids, forwardHeaders });

    log("RES", {
      status: 200,
      id,
      vehicleId: vinData.vehicle.id,
      vin: vinData.vehicle.vin,
      make: vinData.vehicle.make,
      model: vinData.vehicle.model,
    });

    return NextResponse.json({ data: { vinData, vehicleData } });
  } catch (error) {
    console.error("[SearchVehicleAPI] GET error:", error);
    return NextResponse.json(
      { data: null, error: "Failed to fetch vehicle details", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
