/**
 * Color map — maps color names to their Tailwind background classes.
 * Used by consumers (e.g. sidebar-filters) to render a color dot
 * inside a `CustomChips` prefix prop.
 */
export const colorMap: Record<string, string> = {
  White: "bg-white border border-gray-300",
  Black: "bg-black",
  "Midnight Gray": "bg-gray-600",
  "Metallic Green": "bg-green-600",
  "Deep Red": "bg-red-700",
  Graphite: "bg-gray-800",
  "Luminous Yellow": "bg-yellow-400",
  "Ocean Blue": "bg-blue-600",
  "Electric Blue": "bg-blue-400",
};
