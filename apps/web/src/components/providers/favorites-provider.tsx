"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useCallback, useContext, useMemo } from "react";
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

  // ── Helper: always read the freshest cache value ──────────────────
  // Avoids stale-closure issues inside mutation callbacks and handlers.
  const readCache = useCallback(
    () => queryClient.getQueryData<string[]>(SAVED_VEHICLES_KEY) ?? [],
    [queryClient]
  );

  // ── Mutation: save (like) a vehicle — fire-and-forget ─────────────
  const { mutate: doSave } = useMutation({
    mutationFn: saveVehicle,
    onMutate: async (vin: string) => {
      // Cancel outstanding fetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: SAVED_VEHICLES_KEY });
      const previous = readCache();
      // Optimistic update — add immediately
      if (!previous.includes(vin)) {
        queryClient.setQueryData<string[]>(SAVED_VEHICLES_KEY, [...previous, vin]);
      }
      return { previous };
    },
    onError: (_err, _vin, context) => {
      // Rollback on failure
      if (context?.previous) {
        queryClient.setQueryData(SAVED_VEHICLES_KEY, context.previous);
      }
    },
    onSettled: () => {
      // Re-sync with server truth in background
      queryClient.invalidateQueries({ queryKey: SAVED_VEHICLES_KEY });
    },
  });

  // ── Mutation: unsave (unlike) a vehicle — fire-and-forget ─────────
  const { mutate: doUnsave } = useMutation({
    mutationFn: unsaveVehicle,
    onMutate: async (vin: string) => {
      await queryClient.cancelQueries({ queryKey: SAVED_VEHICLES_KEY });
      const previous = readCache();
      queryClient.setQueryData<string[]>(
        SAVED_VEHICLES_KEY,
        previous.filter((v) => v !== vin)
      );
      return { previous };
    },
    onError: (_err, _vin, context) => {
      if (context?.previous) {
        queryClient.setQueryData(SAVED_VEHICLES_KEY, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: SAVED_VEHICLES_KEY });
    },
  });

  // ── Mutation: clear all — fire-and-forget ─────────────────────────
  const { mutate: doClear } = useMutation({
    mutationFn: clearAllSavedVehicles,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: SAVED_VEHICLES_KEY });
      const previous = readCache();
      queryClient.setQueryData<string[]>(SAVED_VEHICLES_KEY, []);
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(SAVED_VEHICLES_KEY, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: SAVED_VEHICLES_KEY });
    },
  });

  // ── Stable action handlers ────────────────────────────────────────
  // doSave / doUnsave / doClear are stable references from useMutation,
  // so these callbacks won't trigger unnecessary re-renders.

  const handleAdd = useCallback((vin: string) => doSave(vin), [doSave]);

  const handleRemove = useCallback((vin: string) => doUnsave(vin), [doUnsave]);

  /** Toggle reads directly from the query cache so it never uses a stale closure. */
  const handleToggle = useCallback(
    (vin: string) => {
      const current = readCache();
      if (current.includes(vin)) {
        doUnsave(vin);
      } else {
        doSave(vin);
      }
    },
    [readCache, doSave, doUnsave]
  );

  const handleIsVehicleSaved = useCallback((vin: string) => savedVins.includes(vin), [savedVins]);

  const handleClearAll = useCallback(() => doClear(), [doClear]);

  // ── Context value (same shape — no consumer changes needed) ───────
  // isLoaded is always true: initialData guarantees data is present on
  // the very first render, so gating on isFetched is unnecessary and
  // could hide the badge when the mock-API fetch hasn't resolved yet.

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
