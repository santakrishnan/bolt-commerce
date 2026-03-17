import { queryOptions } from "@tanstack/react-query";
import { getAllSavedVehicles } from "~/services/saved-vehicles-api";

/**
 * Query key factory for saved vehicles.
 *
 * Centralises the query key and options so every consumer (FavoritesProvider,
 * header badge, favorites page, my-garage) reads from the same cache entry.
 *
 * When the real API replaces the mock, swap `queryFn` here — all consumers
 * update automatically.
 */
export const savedVehicleQueries = {
  all: () =>
    queryOptions({
      queryKey: ["saved-vehicles"] as const,
      queryFn: getAllSavedVehicles,
      // Show empty list while the first fetch runs — does NOT suppress the fetch
      // (unlike initialData which would treat [] as "fresh" for staleTime duration)
      placeholderData: [] as string[],
    }),
} as const;
