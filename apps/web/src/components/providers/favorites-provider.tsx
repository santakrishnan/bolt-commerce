"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  isVehicleSaved as _isVehicleSaved,
  addVehicle,
  clearAllSaved,
  getSavedVehicles,
  removeVehicle,
} from "~/lib/favorites-storage";

// ── Context shape ────────────────────────────────────────────────────

interface FavoritesContextValue {
  /** Current list of saved VINs. */
  savedVins: string[];
  /** Whether the cookie has been read (avoids flash of empty state). */
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
  const [savedVins, setSavedVins] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Hydrate from cookie on mount
  useEffect(() => {
    setSavedVins(getSavedVehicles());
    setIsLoaded(true);
  }, []);

  const handleAdd = useCallback((vin: string) => {
    const added = addVehicle(vin);
    if (added) {
      setSavedVins(getSavedVehicles());
    }
  }, []);

  const handleRemove = useCallback((vin: string) => {
    const removed = removeVehicle(vin);
    if (removed) {
      setSavedVins(getSavedVehicles());
    }
  }, []);

  const handleToggle = useCallback(
    (vin: string) => {
      if (_isVehicleSaved(vin)) {
        handleRemove(vin);
      } else {
        handleAdd(vin);
      }
    },
    [handleAdd, handleRemove]
  );

  const handleIsVehicleSaved = useCallback((vin: string) => savedVins.includes(vin), [savedVins]);

  const handleClearAll = useCallback(() => {
    clearAllSaved();
    setSavedVins([]);
  }, []);

  const value = useMemo<FavoritesContextValue>(
    () => ({
      savedVins,
      isLoaded,
      addVehicle: handleAdd,
      removeVehicle: handleRemove,
      toggleVehicle: handleToggle,
      isVehicleSaved: handleIsVehicleSaved,
      savedCount: savedVins.length,
      clearAll: handleClearAll,
    }),
    [
      savedVins,
      isLoaded,
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
