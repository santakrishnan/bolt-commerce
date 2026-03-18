import { queryOptions } from "@tanstack/react-query";
import { getAllSavedVehicles } from "~/services/saved-vehicles-api";

/**
 * Query key factory for saved vehicles.
 *
 * Centralises the query key and options so every consumer (FavoritesProvider,
 * header badge, favorites page, my-garage) reads from the same cache entry.
 *
 * `queryFn` calls the saved-registry proxy (`/api/saved-registry/vehicles`)
 * which forwards to the BED Saved Vehicle Service (currently mocked).
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
