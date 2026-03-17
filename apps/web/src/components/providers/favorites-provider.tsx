"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useCallback, useContext, useMemo } from "react";
import { useOptimisticListMutation } from "~/hooks/use-optimistic-list-mutation";
import {
  clearAllSavedVehicles,
  getAllSavedVehicles,
  saveVehicle,
  unsaveVehicle,
} from "~/services/saved-vehicles-api";

// ── Query key ────────────────────────────────────────────────────────

const SAVED_VEHICLES_KEY = ["saved-vehicles"] as const;

// ── Context shape (unchanged — all consumers keep working) ───────────

interface FavoritesContextValue {
  /** Current list of saved VINs. */
  savedVins: string[];
  /** Whether data is available (always true — initialData guarantees it). */
  isLoaded: boolean;
  /** Add a VIN (no-op if duplicate or at 30-limit). */
  addVehicle: (vin: string) => void;
  /** Remove a VIN. */
  removeVehicle: (vin: string) => void;
  /** Toggle a VIN: add if missing, remove if present. */
  toggleVehicle: (vin: string) => void;
  /** Check if a VIN is in the favorites list. */
  isVehicleSaved: (vin: string) => boolean;
  /** Number of saved vehicles. */
  savedCount: number;
  /** Remove all saved vehicles. */
  clearAll: () => void;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

// ── Provider ─────────────────────────────────────────────────────────

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  // ── Query: fetch saved VINs from mock API ─────────────────────────
  const { data: savedVins = [] } = useQuery({
    queryKey: SAVED_VEHICLES_KEY,
    queryFn: getAllSavedVehicles,
    // Initialise with empty array so the first render is never undefined
    initialData: [] as string[],
  });

  // ── Mutations using shared optimistic hook ──────────────────────────

  const { mutate: doSave } = useOptimisticListMutation<string, string>({
    queryKey: SAVED_VEHICLES_KEY,
    mutationFn: saveVehicle,
    updater: (prev, vin) => (prev.includes(vin) ? prev : [...prev, vin]),
  });

  const { mutate: doUnsave } = useOptimisticListMutation<string, string>({
    queryKey: SAVED_VEHICLES_KEY,
    mutationFn: unsaveVehicle,
    updater: (prev, vin) => prev.filter((v) => v !== vin),
  });

  const { mutate: doClear } = useOptimisticListMutation<string, void>({
    queryKey: SAVED_VEHICLES_KEY,
    mutationFn: clearAllSavedVehicles,
    updater: () => [],
  });

  // ── Stable action handlers ────────────────────────────────────────

  const handleAdd = useCallback((vin: string) => doSave(vin), [doSave]);

  const handleRemove = useCallback((vin: string) => doUnsave(vin), [doUnsave]);

  /** Toggle reads directly from the query cache so it never uses a stale closure. */
  const handleToggle = useCallback(
    (vin: string) => {
      const current = queryClient.getQueryData<string[]>(SAVED_VEHICLES_KEY) ?? [];
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
      isLoaded: true,
      addVehicle: handleAdd,
      removeVehicle: handleRemove,
      toggleVehicle: handleToggle,
      isVehicleSaved: handleIsVehicleSaved,
      savedCount: savedVins.length,
      clearAll: handleClearAll,
    }),
    [savedVins, handleAdd, handleRemove, handleToggle, handleIsVehicleSaved, handleClearAll]
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
