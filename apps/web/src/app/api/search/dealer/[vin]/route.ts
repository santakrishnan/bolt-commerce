import { type NextRequest, NextResponse } from "next/server";
import { extractArrowIds, extractForwardHeaders } from "~/lib/arrow/server-api";
import { type DealerNotes, sampleDealerNotes } from "~/lib/data/dealer/dealer-data";
import { vehicleTypes } from "~/lib/data/vehicles/vehicle-types";
import { fetchVinData, type VehicleDetail } from "~/services/vdp";

const isDev = process.env.NODE_ENV === "development";
function noop() {
  /* no-op */
}
const log = isDev ? console.log.bind(console, "[SearchDealerAPI]") : noop;
const SUV_RE = /rav4|highlander|sequoia|venza|cross|suv/;
const SEDAN_RE = /camry|corolla|prius|sedan/;
const TRUCK_RE = /tacoma|tundra|truck/;

function getBodyTypeById(id: string): string {
  return vehicleTypes.find((type) => type.id === id)?.id ?? "vehicle";
}

interface RouteContext {
  params: Promise<{ vin: string }>;
}

function buildVehicleTitle(vehicle: VehicleDetail): string {
  return (
    vehicle.title ||
    [vehicle.year, vehicle.make, vehicle.model, vehicle.trim].filter(Boolean).join(" ")
  );
}

function inferBodyType(vehicle: VehicleDetail): string {
  const haystack = `${vehicle.model} ${vehicle.trim} ${vehicle.title ?? ""}`.toLowerCase();

  if (SUV_RE.test(haystack)) {
    return getBodyTypeById("suv");
  }
  if (SEDAN_RE.test(haystack)) {
    return getBodyTypeById("sedan");
  }
  if (TRUCK_RE.test(haystack)) {
    return getBodyTypeById("truck");
  }

  return "vehicle";
}

function buildSampleDealerNotes(vinData: Awaited<ReturnType<typeof fetchVinData>>): DealerNotes {
  const vehicleTitle = buildVehicleTitle(vinData.vehicle);
  const bodyType = inferBodyType(vinData.vehicle);
  const vehicleDealer = vinData.vehicle.dealer;

  return {
    vehicleDescription: `This well-maintained ${vehicleTitle} comes with low miles and is in excellent condition. It has been thoroughly inspected and certified by our team of expert technicians. The vehicle features all the latest safety technology and comfort features you'd expect from a premium ${bodyType}. Don't miss this opportunity to own a reliable and stylish vehicle at a great price.`,
    vehicleImage: vinData.vehicle.images[0] ?? sampleDealerNotes.vehicleImage,
    dealer: {
      ...sampleDealerNotes.dealer,
      id: `dealer-${vinData.vehicle.vin.toLowerCase()}`,
      name: vehicleDealer.name || sampleDealerNotes.dealer.name,
      address: vehicleDealer.location || sampleDealerNotes.dealer.address,
    },
  };
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { vin } = await context.params;
    log("REQ", {
      method: request.method,
      path: request.nextUrl.pathname,
      vin,
      sessionId: request.headers.get("x-arrow-session-id"),
      fingerprintId: request.headers.get("x-arrow-fp-id"),
      profileId: request.headers.get("x-arrow-profile-id"),
    });

    if (!vin) {
      log("RES", { status: 400, code: "MISSING_VIN" });
      return NextResponse.json(
        { data: null, error: "VIN is required", code: "MISSING_VIN" },
        { status: 400 }
      );
    }

    const ids = extractArrowIds(request);
    const forwardHeaders = extractForwardHeaders(request);
    const vinData = await fetchVinData(vin, { ids, forwardHeaders });
    const dealerData = buildSampleDealerNotes(vinData);
    log("RES", {
      status: 200,
      vin,
      dealerId: dealerData.dealer.id,
      dealerName: dealerData.dealer.name,
      vehicleImage: dealerData.vehicleImage,
    });

    return NextResponse.json({ data: dealerData });
  } catch (error) {
    console.error("[SearchDealerAPI] GET error:", error);
    return NextResponse.json(
      { data: null, error: "Failed to fetch dealer details", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
