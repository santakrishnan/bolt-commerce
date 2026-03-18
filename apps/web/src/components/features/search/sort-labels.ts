export const SORT_LABELS: Record<"recommended" | "low-high" | "high-low", string> = {
  recommended: "Recommended",
  "low-high": "Low to High",
  "high-low": "High to Low",
};

export type SortOption = keyof typeof SORT_LABELS;
