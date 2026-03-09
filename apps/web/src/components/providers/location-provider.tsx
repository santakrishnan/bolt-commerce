"use client";

import { createContext, use, useCallback, useEffect, useMemo, useState } from "react";
import stateConfig from "~/data/state-hero-config.json";
import { useArrow } from "~/lib/arrow";

type StateKey = keyof typeof stateConfig.states;

/** Validates a 5-digit US zip code */
const ZIP_RE = /^\d{5}$/;

/** Cookie key for storing manual zip override */
const MANUAL_ZIP_COOKIE = "arrow_manual_zip";

/**
 * Get manual zip from cookie
 */
function getManualZipFromCookie(): string | null {
  if (typeof document === "undefined") {
    return null;
  }
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [key, value] = cookie.trim().split("=");
    if (key === MANUAL_ZIP_COOKIE && value) {
      return decodeURIComponent(value);
    }
  }
  return null;
}

/**
 * Save manual zip to cookie (expires in 30 days)
 */
/**
 * Save manual zip to cookie (expires in 30 days)
 */
function saveManualZipToCookie(zip: string) {
  if (typeof document === "undefined") {
    return;
  }
  const expires = new Date();
  expires.setDate(expires.getDate() + 30);
  const cookieValue = `${MANUAL_ZIP_COOKIE}=${encodeURIComponent(zip)}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
  (document as { cookie: string }).cookie = cookieValue;
}

/**
 * Clear manual zip cookie
 */
function clearManualZipCookie() {
  if (typeof document === "undefined") {
    return;
  }
  const cookieValue = `${MANUAL_ZIP_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
  (document as { cookie: string }).cookie = cookieValue;
}

/**
 * Resolve which hero state to show for a given zip code.
 * Uses the zipPrefixes min/max ranges in state-hero-config.json.
 * Returns the config default state when no range matches.
 */
function resolveHeroState(zip: string): StateKey {
  const prefix = Number.parseInt(zip.slice(0, 3), 10);
  if (!Number.isNaN(prefix)) {
    for (const [state, range] of Object.entries(stateConfig.zipPrefixes) as [
      StateKey,
      { min: number; max: number },
    ][]) {
      if (prefix >= range.min && prefix <= range.max) {
        return state;
      }
    }
  }
  return stateConfig.defaultState as StateKey;
}

export interface LocationContextValue {
  state: {
    /** Fingerprint-detected or user-entered zip code */
    displayZip: string;
    /** City from fingerprint geo */
    displayCity: string;
    /** State abbreviation from fingerprint geo */
    displayState: string;
    /** Hero state resolved from zip — drives background image */
    heroState: StateKey;
    backgroundImage: string;
    mobileBackgroundImage: string;
    /** True if using manual zip override from cookie */
    isManualZip: boolean;
    /** Description from state config (e.g., "Miami, FL 33101") - shown for manual zip */
    description?: string;
  };
  actions: {
    /**
     * Manually override the displayed zip and save to cookie.
     * This takes precedence over fingerprint data.
     */
    setZip: (zip: string) => void;
    /**
     * Clear manual zip override and revert to fingerprint data.
     */
    clearManualZip: () => void;
  };
  meta: {
    /** True while waiting for fingerprint data */
    isLoading: boolean;
  };
}

const LocationContext = createContext<LocationContextValue | null>(null);

/**
 * LocationProvider
 *
 * Derives all location data from the Arrow fingerprint context:
 *   - `fingerprintData.geo.postalCode` → zip
 *   - `fingerprintData.geo.city`       → city label
 *   - `fingerprintData.geo.stateCode`  → state abbreviation
 *
 * Falls back to `stateConfig.defaultState` until fingerprint resolves.
 *
 * Manual zip overrides are stored in a cookie and take precedence over
 * fingerprint data. The cookie persists for 30 days.
 */
export function LocationProvider({ children }: { children: React.ReactNode }) {
  const defaultState = stateConfig.defaultState as StateKey;
  const defaultZip = stateConfig.states[defaultState].zipCode;

  const { fingerprintData, isReady: arrowReady } = useArrow();

  /** User's manual zip override from cookie */
  const [manualZip, setManualZip] = useState<string | null>(null);

  // Load manual zip from cookie on mount
  useEffect(() => {
    const savedZip = getManualZipFromCookie();
    if (savedZip && ZIP_RE.test(savedZip)) {
      setManualZip(savedZip);
    }
  }, []);

  // Derive display values from fingerprint context + optional override
  const geo = fingerprintData?.geo;
  const fpZip = geo?.postalCode ?? "";
  const fpCity = geo?.city ?? "";
  const fpState = geo?.stateCode ?? "";

  const isManualZip = manualZip !== null;
  const displayZip = manualZip ?? (ZIP_RE.test(fpZip) ? fpZip : defaultZip);
  const displayCity = manualZip ? "" : fpCity; // clear city when user overrides
  const displayState = manualZip ? "" : fpState;
  const isLoading = !arrowReady;

  /**
   * Override zip and save to cookie.
   */
  const setZip = useCallback((zip: string) => {
    const clean = zip.trim();
    if (!(clean && ZIP_RE.test(clean))) {
      return;
    }
    setManualZip(clean);
    saveManualZipToCookie(clean);
  }, []);

  /**
   * Clear manual zip override and revert to fingerprint data.
   */
  const clearManualZip = useCallback(() => {
    setManualZip(null);
    clearManualZipCookie();
  }, []);

  const heroState = resolveHeroState(displayZip);
  const heroData = stateConfig.states[heroState];
  const defaultHeroData = stateConfig.states[defaultState];

  // Get description from hero data when using manual zip
  const description = isManualZip ? heroData?.description : undefined;

  const value: LocationContextValue = useMemo(
    () => ({
      state: {
        displayZip,
        displayCity,
        displayState,
        heroState,
        backgroundImage: heroData?.backgroundImage ?? defaultHeroData.backgroundImage,
        mobileBackgroundImage:
          heroData?.mobileBackgroundImage ?? defaultHeroData.mobileBackgroundImage,
        isManualZip,
        description,
      },
      actions: { setZip, clearManualZip },
      meta: { isLoading },
    }),
    [
      displayZip,
      displayCity,
      displayState,
      heroState,
      heroData,
      defaultHeroData,
      isManualZip,
      description,
      setZip,
      clearManualZip,
      isLoading,
    ]
  );

  return <LocationContext value={value}>{children}</LocationContext>;
}

/**
 * useLocation hook — React 19 use() API.
 * Provides location state and the setZip action to any client component.
 */
export function useLocation() {
  const context = use(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within LocationProvider");
  }
  return context;
}
