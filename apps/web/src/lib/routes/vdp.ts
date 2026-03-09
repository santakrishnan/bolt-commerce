import { notFound } from "next/navigation";
import {
  parseVehicleDetailsSegments,
  TRIM_PLACEHOLDER,
  type VehicleDetailsSegments,
} from "./vehicle-segments";

/** VDP params used by vehicle detail components. */
export type VdpParams = Omit<VehicleDetailsSegments, "trim"> & {
  trimSlug: string | null;
};

function toVdpParams(parsed: VehicleDetailsSegments): VdpParams {
  return {
    make: parsed.make,
    model: parsed.model,
    trimSlug: parsed.trim === TRIM_PLACEHOLDER ? null : parsed.trim,
    year: parsed.year,
    vin: parsed.vin,
  };
}

/**
 * Parses and validates the catch-all segments for a VDP route.
 *
 * Exception scenarios handled:
 *
 * 1. **Too few segments** (e.g. `/used-cars/toyota`) → 404
 * 2. **Too many segments** (e.g. `/used-cars/toyota/camry/se/2024/VIN/extra`) → 404
 * 3. **Invalid make/model/trim** (non-slug characters) → 404
 * 4. **Missing trim** (`-` placeholder) → parsed as `null`
 * 5. **Invalid year** (non-numeric, out of range) → 404
 * 6. **Invalid VIN** (wrong length or illegal characters) → 404
 *
 * @returns Parsed VDP params, or calls `notFound()` (never returns on failure)
 */
export function parseVdpSegments(segments: string[]): VdpParams {
  const parsed = parseVehicleDetailsSegments(segments);
  if (!parsed) {
    notFound();
  }

  return toVdpParams(parsed);
}

/**
 * Constructs a canonical VDP path from typed params.
 * Useful for redirects when the URL casing or order is wrong.
 */
export function buildVdpPath(params: VdpParams): string {
  const trim = params.trimSlug ?? TRIM_PLACEHOLDER;
  return `/used-cars/details/${params.make}/${params.model}/${trim}/${params.year}/${params.vin}`;
}
