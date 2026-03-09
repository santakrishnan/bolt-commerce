/**
 * Capitalize the first letter of a string.
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Format a slug into a human-readable uppercase label.
 * e.g. "xle-awd" → "XLE AWD"
 */
export function formatSlugLabel(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.toUpperCase())
    .join(" ");
}

export type PriceCategory = "Excellent" | "Good" | "Fair" | "High";

/**
 * Determine how a vehicle's price compares to the market average.
 *
 * @param currentPercentage – where the price sits on the 0-100 range
 *   (0 = well below market, 100 = well above).
 * @returns `{ category, color }` where `color` is a Tailwind bg-* class.
 */
export function getPriceCategory(currentPercentage: number): {
  category: PriceCategory;
  color: string;
} {
  if (currentPercentage > 75) {
    return { category: "High", color: "bg-orange-500" };
  }
  if (currentPercentage > 50) {
    return { category: "Fair", color: "bg-gray-700" };
  }
  if (currentPercentage > 25) {
    return { category: "Good", color: "bg-success" };
  }
  return { category: "Excellent", color: "bg-success" };
}
