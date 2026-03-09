import { z } from "zod";

/**
 * Shared route-segment validators/parsers for vehicle URLs.
 *
 * Reused by both catch-all used-cars routing and dedicated VDP parsing.
 */

/** Placeholder used in URLs when trim is not available. */
export const TRIM_PLACEHOLDER = "-";

/** Lowercase alphanumeric slug with hyphens (e.g. "toyota", "corolla-se", "suv") */
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Standard 17-character VIN (alphanumeric, excluding I, O, Q) */
const VIN_PATTERN = /^[A-HJ-NPR-Z0-9]{17}$/;

/** Normalized slug parser (lowercases first). */
export const slugSegmentSchema = z
  .string()
  .transform((v) => v.toLowerCase())
  .refine((v) => SLUG_PATTERN.test(v), "Invalid slug");

/** Trim can be a slug OR '-' placeholder when trim is unavailable. */
export const trimSegmentSchema = z
  .string()
  .transform((v) => v.toLowerCase())
  .refine((v) => v === TRIM_PLACEHOLDER || SLUG_PATTERN.test(v), "Invalid trim");

/** 4-digit year between 1900 and current year + 2 */
export const yearSegmentSchema = z
  .string()
  .regex(/^\d{4}$/, "Year must be 4 digits")
  .transform(Number)
  .refine((y) => y >= 1900 && y <= new Date().getFullYear() + 2, "Year out of range");

/** VIN parser (normalizes to uppercase). */
export const vinSegmentSchema = z
  .string()
  .transform((v) => v.toUpperCase())
  .refine((v) => VIN_PATTERN.test(v), "Invalid VIN");

const detailsSegmentsSchema = z
  .tuple([
    slugSegmentSchema,
    slugSegmentSchema,
    trimSegmentSchema,
    yearSegmentSchema,
    vinSegmentSchema,
  ])
  .transform(([make, model, trim, year, vin]) => ({ make, model, trim, year, vin }));

export type VehicleDetailsSegments = z.output<typeof detailsSegmentsSchema>;

/**
 * Parse `[make, model, trim, year, vin]` route segments.
 * Returns null when malformed.
 */
export function parseVehicleDetailsSegments(segments: string[]): VehicleDetailsSegments | null {
  const result = detailsSegmentsSchema.safeParse(segments);
  return result.success ? result.data : null;
}

/** Try to parse a slug and return undefined on failure. */
export function tryParseSlug(value: string | undefined): string | undefined {
  const result = slugSegmentSchema.safeParse(value);
  return result.success ? result.data : undefined;
}
