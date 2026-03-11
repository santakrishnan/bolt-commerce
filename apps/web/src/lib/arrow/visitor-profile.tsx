"use client";

/**
 * Visitor Profile — Client-side cache with action-based invalidation
 *
 * Fetches the visitor's profile state from the BFF on each page and caches it
 * in React state. The cache is invalidated (and re-fetched) when specific
 * actions are performed (e.g. "add_to_garage", "save_search", "login").
 *
 * The invalidation actions are configurable — callers register which event
 * names should trigger a profile refresh. This gives page-level components
 * access to the latest visitor profile without redundant network calls.
 *
 * Usage (via Arrow context):
 * ```tsx
 * const { visitorProfile, invalidateProfile } = useArrow();
 *
 * // Read cached profile state on every page
 * if (visitorProfile?.preferences?.savedSearches?.length) { ... }
 *
 * // After a mutation, invalidate so next read is fresh
 * await invalidateProfile();
 * ```
 */

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ARROW_HEADER } from "~/lib/arrow/constants";

// ─── Types ──────────────────────────────────────────────────────────────────

/**
 * The shape of the visitor profile returned by the BED profile service.
 * Extend this interface as the BED API evolves.
 */
export interface VisitorProfile {
  /** Profile identifier */
  profileId: string;
  /** Visitor segment / tier resolved by the BED */
  segment?: string;
  /** Whether this is a known / returning visitor */
  isKnown?: boolean;
  /** Visitor preferences (saved searches, garage, etc.) */
  preferences?: Record<string, unknown>;
  /** Any feature flags resolved for this visitor */
  features?: Record<string, boolean>;
  /** User-journey flags (prequalified, tradeIn, testDrive). */
  userFlags?: {
    prequalified?: boolean;
    tradeIn?: boolean;
    testDrive?: boolean;
  };
  /** Arbitrary metadata the BED attaches to this profile */
  metadata?: Record<string, unknown>;
  /** ISO timestamp of the last profile update */
  updatedAt?: string;
}

export interface VisitorProfileState {
  /** The cached profile data (null until first fetch completes) */
  profile: VisitorProfile | null;
  /** Whether a fetch is in progress */
  isLoading: boolean;
  /** Last fetch error, if any */
  error: Error | null;
  /** Epoch ms of the last successful fetch */
  lastFetchedAt: number | null;
  /** Whether the cache has been explicitly invalidated and a refresh is pending */
  isStale: boolean;
}

export interface VisitorProfileActions {
  /**
   * Invalidate the cached profile and trigger a fresh fetch.
   * Call this after performing a mutation (event) that changes visitor state.
   */
  invalidateProfile(): Promise<void>;

  /**
   * Manually refresh the profile (same as invalidate + fetch).
   */
  refreshProfile(): Promise<void>;
}

export type VisitorProfileContextValue = VisitorProfileState & VisitorProfileActions;

// ─── Configuration ──────────────────────────────────────────────────────────

export interface VisitorProfileConfig {
  /** API path to fetch the visitor profile (default: "/api/visitor-profile") */
  profileEndpoint?: string;
  /**
   * Cache TTL in milliseconds. Within this window a cached profile
   * is returned without a network call (default: 5 minutes).
   */
  cacheTtlMs?: number;
  /**
   * If true, profile is fetched automatically on mount / page navigation.
   * (default: true)
   */
  autoFetch?: boolean;
}

const DEFAULT_CONFIG: Required<VisitorProfileConfig> = {
  profileEndpoint: "/api/visitor-profile",
  cacheTtlMs: 5 * 60 * 1000, // 5 minutes
  autoFetch: true,
};

// ─── Context ────────────────────────────────────────────────────────────────

const VisitorProfileContext = createContext<VisitorProfileContextValue | null>(null);

// ─── Provider ───────────────────────────────────────────────────────────────

interface VisitorProfileProviderProps {
  children: ReactNode;
  /** Tracking IDs needed to call the profile API */
  sessionId: string | null;
  fingerprintId: string | null;
  profileId: string | null;
  /** Optional configuration overrides */
  config?: VisitorProfileConfig;
}

export function VisitorProfileProvider({
  children,
  sessionId,
  fingerprintId,
  profileId,
  config: userConfig,
}: VisitorProfileProviderProps) {
  const config = useMemo(() => ({ ...DEFAULT_CONFIG, ...userConfig }), [userConfig]);

  const [state, setState] = useState<VisitorProfileState>({
    profile: null,
    isLoading: false,
    error: null,
    lastFetchedAt: null,
    isStale: false,
  });

  // Ref to prevent duplicate in-flight fetches
  const fetchInFlight = useRef(false);
  // Ref to track the current version — incremented on invalidation
  const version = useRef(0);

  /** Build tracking headers for profile fetch */
  const buildProfileHeaders = useCallback((): Record<string, string> => {
    const headers: Record<string, string> = {};
    if (sessionId) {
      headers[ARROW_HEADER.SESSION_ID] = sessionId;
    }
    if (fingerprintId) {
      headers[ARROW_HEADER.FP_ID] = fingerprintId;
    }
    if (profileId) {
      headers[ARROW_HEADER.PROFILE_ID] = profileId;
    }
    return headers;
  }, [sessionId, fingerprintId, profileId]);

  /**
   * Fetch the visitor profile from the BFF.
   * Respects cache TTL unless `force` is true.
   */
  const fetchProfile = useCallback(
    async (force = false) => {
      // Skip if no fingerprint ID yet (visitor not identified)
      if (!fingerprintId) {
        return;
      }

      // Skip if cache is still fresh (unless forced)
      if (!force && state.lastFetchedAt && Date.now() - state.lastFetchedAt < config.cacheTtlMs) {
        return;
      }

      // Prevent duplicate requests
      if (fetchInFlight.current) {
        return;
      }
      fetchInFlight.current = true;

      const currentVersion = ++version.current;

      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const url = `${config.profileEndpoint}?visitorId=${encodeURIComponent(fingerprintId)}`;
        const res = await fetch(url, {
          method: "GET",
          headers: buildProfileHeaders(),
          credentials: "include",
        });

        // Only apply if this is still the latest request
        if (currentVersion !== version.current) {
          return;
        }

        if (!res.ok) {
          throw new Error(`Profile fetch failed: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();

        // Map the visitor-profile API response into VisitorProfile
        const profile: VisitorProfile = data.profile ?? {
          profileId: data.profileId ?? profileId ?? "",
          segment: data.segment,
          isKnown: !!data.profileId,
          preferences: data.preferences,
          features: data.features,
          metadata: data.metadata,
          updatedAt: data.updatedAt ?? new Date().toISOString(),
        };

        setState({
          profile,
          isLoading: false,
          error: null,
          lastFetchedAt: Date.now(),
          isStale: false,
        });
      } catch (err) {
        if (currentVersion !== version.current) {
          return;
        }
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: err as Error,
          isStale: true,
        }));
      } finally {
        fetchInFlight.current = false;
      }
    },
    [fingerprintId, profileId, config, state.lastFetchedAt, buildProfileHeaders]
  );

  /**
   * Invalidate the cache and force a re-fetch.
   */
  const invalidateProfile = useCallback(async () => {
    setState((prev) => ({ ...prev, isStale: true, lastFetchedAt: null }));
    await fetchProfile(true);
  }, [fetchProfile]);

  /**
   * Alias for invalidateProfile — explicit "refresh" semantics.
   */
  const refreshProfile = useCallback(async () => {
    await invalidateProfile();
  }, [invalidateProfile]);

  // ─── Auto-fetch on mount / when fingerprint becomes available ──────────
  useEffect(() => {
    if (config.autoFetch && fingerprintId) {
      fetchProfile();
    }
  }, [fingerprintId, config.autoFetch, fetchProfile]);

  const value: VisitorProfileContextValue = useMemo(
    () => ({
      ...state,
      invalidateProfile,
      refreshProfile,
    }),
    [state, invalidateProfile, refreshProfile]
  );

  return <VisitorProfileContext.Provider value={value}>{children}</VisitorProfileContext.Provider>;
}

// ─── Hook ───────────────────────────────────────────────────────────────────

/**
 * Access the visitor profile cache from any client component.
 *
 * Must be rendered inside `<VisitorProfileProvider>` (or `<ArrowProvider>`
 * which wraps it automatically).
 */
export function useVisitorProfile(): VisitorProfileContextValue {
  const ctx = useContext(VisitorProfileContext);
  if (!ctx) {
    throw new Error("useVisitorProfile must be used within <ArrowProvider>");
  }
  return ctx;
}
