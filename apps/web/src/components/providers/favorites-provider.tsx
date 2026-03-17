"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useCallback, useContext, useMemo } from "react";
import { useOptimisticListMutation } from "~/hooks/use-optimistic-list-mutation";
import { savedVehicleQueries } from "~/lib/queries/saved-vehicles";
import { clearAllSavedVehicles, saveVehicle, unsaveVehicle } from "~/services/saved-vehicles-api";

// ── Derived constants from query factory ─────────────────────────────

const queryOpts = savedVehicleQueries.all();

// ── Context shape (unchanged — all consumers keep working) ───────────

interface FavoritesContextValue {
  /** Add a VIN (no-op if duplicate or at 30-limit). */
  addVehicle: (vin: string) => void;
  /** Remove all saved vehicles. */
  clearAll: () => void;
  /** Whether the initial fetch has completed. */
  isLoaded: boolean;
  /** Check if a VIN is in the favorites list. */
  isVehicleSaved: (vin: string) => boolean;
  /** Remove a VIN. */
  removeVehicle: (vin: string) => void;
  /** Number of saved vehicles. */
  savedCount: number;
  /** Current list of saved VINs. */
  savedVins: string[];
  /** Toggle a VIN: add if missing, remove if present. */
  toggleVehicle: (vin: string) => void;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

// ── Provider ─────────────────────────────────────────────────────────

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  // ── Query: fetch saved VINs via query factory ─────────────────────
  const { data: savedVins = [], isFetched } = useQuery(queryOpts);

  // ── Mutations using shared optimistic hook ──────────────────────────

  const { mutate: doSave } = useOptimisticListMutation<string, string>({
    queryKey: queryOpts.queryKey,
    mutationFn: (vin) => saveVehicle(vin),
    updater: (prev, vin) => (prev.includes(vin) ? prev : [...prev, vin]),
  });

  const { mutate: doUnsave } = useOptimisticListMutation<string, string>({
    queryKey: queryOpts.queryKey,
    mutationFn: (vin) => unsaveVehicle(vin),
    updater: (prev, vin) => prev.filter((v) => v !== vin),
  });

  const { mutate: doClear } = useOptimisticListMutation<string, void>({
    queryKey: queryOpts.queryKey,
    mutationFn: () => clearAllSavedVehicles(),
    updater: () => [],
  });

  // ── Stable action handlers ────────────────────────────────────────

  const handleAdd = useCallback((vin: string) => doSave(vin), [doSave]);

  const handleRemove = useCallback((vin: string) => doUnsave(vin), [doUnsave]);

  /** Toggle reads directly from the query cache so it never uses a stale closure. */
  const handleToggle = useCallback(
    (vin: string) => {
      const current = queryClient.getQueryData<string[]>(queryOpts.queryKey) ?? [];
      if (current.includes(vin)) {
        doUnsave(vin);
      } else {
        doSave(vin);
      }
    },
    [queryClient, doSave, doUnsave]
  );

  const handleIsVehicleSaved = useCallback((vin: string) => savedVins.includes(vin), [savedVins]);

  const handleClearAll = useCallback(() => doClear(), [doClear]);

  // ── Context value (same shape — no consumer changes needed) ───────

  const value = useMemo<FavoritesContextValue>(
    () => ({
      savedVins,
      isLoaded: isFetched,
      addVehicle: handleAdd,
      removeVehicle: handleRemove,
      toggleVehicle: handleToggle,
      isVehicleSaved: handleIsVehicleSaved,
      savedCount: savedVins.length,
      clearAll: handleClearAll,
    }),
    [
      savedVins,
      isFetched,
      handleAdd,
      handleRemove,
      handleToggle,
      handleIsVehicleSaved,
      handleClearAll,
    ]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

// ── Hook ─────────────────────────────────────────────────────────────

export function useFavorites(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error("useFavorites must be used within a <FavoritesProvider>");
  }
  return ctx;
}
