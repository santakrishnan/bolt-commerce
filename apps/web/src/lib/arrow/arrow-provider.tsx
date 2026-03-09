"use client";

/**
 * Arrow Provider
 *
 * Single top-level provider that abstracts the underlying Fingerprint SDK
 * and profile context. Consuming components depend only on Arrow types —
 * the fingerprint vendor can be swapped without touching application code.
 *
 * Usage in layout.tsx:
 * ```tsx
 * <ArrowProvider>
 *   <App />
 * </ArrowProvider>
 * ```
 */

import { createContext, type ReactNode, use, useCallback, useMemo } from "react";
import { FingerprintClientProvider } from "./fingerprint-client";
import type { ArrowFingerprintData } from "./fingerprint-filter";
import { ProfileProvider, useProfileContext } from "./profile-context";
import {
  useVisitorProfile,
  type VisitorProfile,
  type VisitorProfileConfig,
  VisitorProfileProvider,
} from "./visitor-profile";

// ─── Arrow context value ────────────────────────────────────────────────────

export interface ArrowContextValue {
  /** Whether the Arrow system has finished initialising */
  isReady: boolean;
  /** Whether initialisation is in progress */
  isLoading: boolean;

  // ─── IDs ──────────────────────────────────────────────────────────────
  sessionId: string | null;
  fingerprintId: string | null;
  profileId: string | null;

  /** Filtered fingerprint data (only the attributes Arrow needs) */
  fingerprintData: ArrowFingerprintData | undefined;

  // ─── Visitor Profile (cached) ─────────────────────────────────────────
  /** Cached visitor profile from the BED profile service */
  visitorProfile: VisitorProfile | null;
  /** Whether the visitor profile is being fetched */
  isProfileLoading: boolean;
  /** Whether the cached profile has been invalidated (stale) */
  isProfileStale: boolean;

  /** Initialisation error, if any */
  error: Error | null;

  // ─── Helpers ──────────────────────────────────────────────────────────
  /** Convenience getter returning all three tracking IDs */
  getTrackingIds(): {
    sessionId: string | null;
    fingerprintId: string | null;
    profileId: string | null;
  };

  /** Force-refresh IDs from the fingerprint SDK */
  refreshIds(): Promise<void>;

  /**
   * Invalidate the cached visitor profile and trigger a fresh fetch.
   * Call after performing a mutation / event that changes visitor state.
   */
  invalidateProfile(): Promise<void>;

  /** Manually refresh the visitor profile */
  refreshProfile(): Promise<void>;
}

const ArrowContext = createContext<ArrowContextValue | null>(null);

// ─── Inner bridge (reads ProfileContext, exposes ArrowContext) ───────────────

function ArrowBridge({ children }: { children: ReactNode }) {
  const profile = useProfileContext();
  const vp = useVisitorProfile();

  // Map the lean FedFingerprintData into the ArrowFingerprintData shape.
  // profile.fingerprintDetails now contains only visitorId, incognito, location.
  const fingerprintData = useMemo<ArrowFingerprintData | undefined>(() => {
    const fed = profile.fingerprintDetails;
    if (!fed) {
      return undefined;
    }
    return {
      identity: {
        visitorId: fed.visitorId,
        confidence: 0, // not exposed to FED
        visitorFound: true,
      },
      geo: fed.location
        ? {
            city: fed.location.city,
            country: fed.location.country,
            countryCode: fed.location.countryCode,
            state: fed.location.state,
            stateCode: fed.location.stateCode,
            postalCode: fed.location.postalCode,
            timezone: fed.location.timezone,
          }
        : undefined,
      trust: fed.incognito !== undefined ? { incognito: fed.incognito } : undefined,
      eventId: "", // not exposed to FED
      timestamp: 0, // not exposed to FED
    };
  }, [profile.fingerprintDetails]);

  const getTrackingIds = useCallback(
    () => ({
      sessionId: profile.sessionId,
      fingerprintId: profile.fingerprintId,
      profileId: profile.profileId,
    }),
    [profile.sessionId, profile.fingerprintId, profile.profileId]
  );

  const value: ArrowContextValue = useMemo(
    () => ({
      isReady: profile.isInitialized,
      isLoading: profile.isLoading,
      sessionId: profile.sessionId,
      fingerprintId: profile.fingerprintId,
      profileId: profile.profileId,
      fingerprintData,
      visitorProfile: vp.profile,
      isProfileLoading: vp.isLoading,
      isProfileStale: vp.isStale,
      error: profile.error,
      getTrackingIds,
      refreshIds: profile.refreshIds,
      invalidateProfile: vp.invalidateProfile,
      refreshProfile: vp.refreshProfile,
    }),
    [profile, fingerprintData, getTrackingIds, vp]
  );

  return <ArrowContext.Provider value={value}>{children}</ArrowContext.Provider>;
}

// ─── Public provider ────────────────────────────────────────────────────────

interface ArrowProviderProps {
  children: ReactNode;
  /** Optional visitor-profile cache configuration */
  profileConfig?: VisitorProfileConfig;
}

/**
 * Wrap your app with `<ArrowProvider>` to get access to `useArrow()`.
 *
 * Internally composes:
 * 1. `FingerprintClientProvider` (Fingerprint SDK initialisation)
 * 2. `ProfileProvider` (session / profile resolution)
 * 3. `ArrowBridge` (filters & maps to Arrow context)
 */
export function ArrowProvider({ children, profileConfig }: ArrowProviderProps) {
  return (
    <FingerprintClientProvider>
      <ProfileProvider>
        <ArrowProfileBridge config={profileConfig}>
          <ArrowBridge>{children}</ArrowBridge>
        </ArrowProfileBridge>
      </ProfileProvider>
    </FingerprintClientProvider>
  );
}

/**
 * Internal bridge that reads IDs from ProfileContext and passes them
 * to the VisitorProfileProvider so it can auto-fetch.
 *
 * Now that `/api/visitor-profile` is a dedicated endpoint (separate from
 * session bootstrap), autoFetch is enabled by default. The visitor profile
 * is fetched as soon as a `fingerprintId` is available.
 */
function ArrowProfileBridge({
  children,
  config,
}: {
  children: ReactNode;
  config?: VisitorProfileConfig;
}) {
  const { sessionId, fingerprintId, profileId } = useProfileContext();

  const mergedConfig = useMemo<VisitorProfileConfig>(() => ({ ...config }), [config]);

  return (
    <VisitorProfileProvider
      config={mergedConfig}
      fingerprintId={fingerprintId}
      profileId={profileId}
      sessionId={sessionId}
    >
      {children}
    </VisitorProfileProvider>
  );
}

// ─── Hook ───────────────────────────────────────────────────────────────────

/**
 * Access the Arrow context from any client component.
 *
 * Must be rendered inside `<ArrowProvider>`.
 *
 * Uses React 19 `use()` API instead of `useContext()`.
 *
 * @example
 * ```tsx
 * const { sessionId, fingerprintData, isReady } = useArrow();
 * ```
 */
export function useArrow(): ArrowContextValue {
  const ctx = use(ArrowContext);
  if (!ctx) {
    throw new Error("useArrow must be used within <ArrowProvider>");
  }
  return ctx;
}

/**
 * Safe version of `useArrow()` — returns `null` instead of throwing
 * when called outside of `<ArrowProvider>`.
 *
 * Used internally by `useEventTracking()` so event tracking works
 * even when the provider tree is not fully mounted.
 */
export function useArrowSafe(): ArrowContextValue | null {
  return use(ArrowContext);
}
