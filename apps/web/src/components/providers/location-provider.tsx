"use client";

import { createContext, use, useCallback, useMemo, useState } from "react";
import stateConfig from "~/data/state-hero-config.json";
import { useArrow } from "~/lib/arrow";
import { useArrowClient } from "~/lib/arrow/client-api";
import { API_ROUTES, MANUAL_ZIP_COOKIE, ZIP_RE } from "~/lib/routes/constants";

type StateKey = keyof typeof stateConfig.states;
type BackgroundImageKey = keyof typeof stateConfig.backgroundImages;

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
    /** Whether location has been resolved from cookie or fingerprint (not just the default) */
    isResolved: boolean;
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
  // meta removed — no loading flag exposed
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
export function LocationProvider({
  children,
  initialZip = null,
}: {
  children: React.ReactNode;
  /** Server-read cookie value — passed from layout.tsx so the first HTML paint is correct. */
  initialZip?: string | null;
}) {
  const defaultState = stateConfig.defaultState as StateKey;
  const defaultZip = stateConfig.states[defaultState].zipCode;

  const { fingerprintData, isReady: arrowReady } = useArrow();
  const api = useArrowClient();

  // initialZip is read from the cookie on the server (layout.tsx) and passed as a prop.
  // This means the server-rendered HTML already contains the correct zip — zero flash.
  const [manualZip, setManualZip] = useState<string | null>(initialZip);

  // Derive display values from fingerprint context + optional override
  const geo = fingerprintData?.geo;
  const fpZip = geo?.postalCode ?? "";
  const fpCity = geo?.city ?? "";
  const fpState = geo?.stateCode ?? "";

  const isManualZip = manualZip !== null;
  const displayZip = manualZip ?? (ZIP_RE.test(fpZip) ? fpZip : defaultZip);
  const displayCity = manualZip ? "" : fpCity; // clear city when user overrides
  const displayState = manualZip ? "" : fpState;

  // Location is resolved when we have a saved zip OR the Arrow fingerprint system
  // has finished initializing. Until resolved, consumers show a placeholder instead
  // of the default "75001" zip — eliminating the flash of stale content.
  const isResolved = manualZip !== null || arrowReady;

  /**
   * Override zip and save to cookie.
   * Fires a tracking event when zip code is changed.
   */
  const setZip = useCallback(
    (zip: string) => {
      const clean = zip.trim();
      if (!(clean && ZIP_RE.test(clean))) {
        return;
      }
      const previousZip = manualZip ?? fpZip;
      const heroState = resolveHeroState(clean);

      setManualZip(clean);
      saveManualZipToCookie(clean);

      // Track zip code change event
      api
        .post(API_ROUTES.EVENTS_TRACK, {
          event: "location_zip_changed",
          properties: {
            previousZip,
            newZip: clean,
            heroState,
            isManualOverride: true,
          },
          timestamp: Date.now(),
        })
        .catch((error: unknown) => {
          console.error("[LocationProvider] Failed to track zip change event:", error);
        });
    },
    [manualZip, fpZip, api]
  );

  /**
   * Clear manual zip override and revert to fingerprint data.
   * Fires a tracking event when reverting to fingerprint location.
   */
  const clearManualZip = useCallback(() => {
    const previousZip = manualZip;
    const revertedZip = ZIP_RE.test(fpZip) ? fpZip : defaultZip;
    const heroState = resolveHeroState(revertedZip);

    setManualZip(null);
    clearManualZipCookie();

    // Track revert to fingerprint location event
    if (previousZip) {
      api
        .post(API_ROUTES.EVENTS_TRACK, {
          event: "location_zip_cleared",
          properties: {
            previousZip,
            revertedZip,
            heroState,
            revertedToFingerprint: ZIP_RE.test(fpZip),
          },
          timestamp: Date.now(),
        })
        .catch((error: unknown) => {
          console.error("[LocationProvider] Failed to track zip clear event:", error);
        });
    }
  }, [manualZip, fpZip, defaultZip, api]);

  const heroState = resolveHeroState(displayZip);
  const heroData = stateConfig.states[heroState];
  const defaultHeroData = stateConfig.states[defaultState];

  // Get description from hero data when using manual zip
  const description = isManualZip ? heroData?.description : undefined;

  // Resolve background images via backgroundImageKey
  const imageKey = (heroData?.backgroundImageKey ??
    defaultHeroData.backgroundImageKey) as BackgroundImageKey;
  const imageSet = stateConfig.backgroundImages[imageKey];

  const value: LocationContextValue = useMemo(
    () => ({
      state: {
        displayZip,
        displayCity,
        displayState,
        heroState,
        backgroundImage: imageSet?.desktop ?? "",
        mobileBackgroundImage: imageSet?.mobile ?? "",
        isManualZip,
        description,
        isResolved,
      },
      actions: { setZip, clearManualZip },
    }),
    [
      displayZip,
      displayCity,
      displayState,
      heroState,
      imageSet,
      isManualZip,
      description,
      isResolved,
      setZip,
      clearManualZip,
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
