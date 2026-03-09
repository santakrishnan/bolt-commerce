"use client";

import { useVisitorData } from "@fingerprintjs/fingerprintjs-pro-react";
import { createContext, type ReactNode, use, useCallback, useEffect, useState } from "react";
import { extractSealedResult } from "./sdk-transforms";
import type { FedFingerprintData, ProfileContextState, ProfileContextValue } from "./types";

const isDev = process.env.NODE_ENV === "development";
function noop() {
  /* no-op */
}
const log = isDev ? console.log.bind(console, "[ProfileContext]") : noop;
const logError = console.error.bind(console, "[ProfileContext]");

/**
 * Profile Context
 *
 * React context that manages tracking IDs and provides them to all components.
 *
 * **Flow:**
 * 1. POST /api/session `{ mode: "bootstrap" }` — server checks cookies
 *    - Cookies valid → server returns `{ initialized: true, fingerprintDetails }`
 *      where `fingerprintDetails` is the lean FED-safe shape (visitorId, incognito, location)
 *      stored in an httpOnly cookie. **No SDK call needed.**
 *    - Cookies invalid/expired → server returns `{ initialized: false }`
 * 2. Only when bootstrap fails: call Fingerprint SDK → extract sealed result →
 *    POST `{ mode: "initialize" }` → server decrypts, resolves profile,
 *    returns FED-safe data + sets cookies.
 *
 * **Security:** The full `FingerprintEventData` (IP, user-agent, browser details,
 * bot scores, VPN, proxy, tampering) NEVER reaches the client. Only
 * `visitorId`, `incognito`, and `location` are exposed to React state.
 *
 * Requirements: 1.1–1.6, 2.1–2.4, 3.1–3.6, 5.1–5.6
 */

const ProfileContext = createContext<ProfileContextValue | null>(null);

interface ProfileProviderProps {
  children: ReactNode;
}

// Module-level guard — survives React Strict Mode double-mount.
// See: https://react.dev/learn/you-might-not-need-an-effect#initializing-the-application
let didInit = false;

export function ProfileProvider({ children }: ProfileProviderProps) {
  const [state, setState] = useState<ProfileContextState>({
    isInitialized: false,
    isLoading: true,
    sessionId: null,
    fingerprintId: null,
    profileId: null,
    error: null,
  });

  // Use Fingerprint.js React hook.
  // - immediate: false — don't fire on mount. Only called when bootstrap fails.
  const { getData } = useVisitorData<true>({ extendedResult: true }, { immediate: false });

  // ─── Initialize from SDK (also used by refreshIds) ────────────────────

  /**
   * Called ONLY when bootstrap fails (no cookies or TTL expired).
   *
   * 1. Call Fingerprint SDK → get `visitorId`, `eventId`, `sealedResult`
   * 2. POST /api/session `{ mode: "initialize", sealedResult, ... }`
   * 3. Server decrypts sealed result → resolves profile → returns FED data
   * 4. Server sets httpOnly cookie for future bootstraps
   */
  const initializeFromSdk = useCallback(
    async (signal?: AbortSignal) => {
      const fpData = await getData();

      if (!fpData) {
        throw new Error("Fingerprint SDK returned no data");
      }

      const { visitorId, requestId: eventId } = fpData;
      const confidence = fpData.confidence?.score;
      const sealedResult = extractSealedResult(fpData as never);

      // v4 Zero Trust Mode: visitorId may be absent — server extracts from sealed data
      if (!(visitorId || sealedResult)) {
        throw new Error(
          "Fingerprint SDK returned no visitorId and no sealed result. " +
            "Check your API key and dashboard configuration."
        );
      }

      log("SDK obtained:", {
        visitorId: visitorId ?? "(Zero Trust — from sealed result)",
        eventId,
        confidence,
        hasSealedResult: !!sealedResult,
      });

      const response = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        signal,
        body: JSON.stringify({
          mode: "initialize",
          fingerprintId: visitorId ?? undefined,
          eventId,
          sealedResult,
          fingerprintMetadata: {
            confidence,
            requestId: eventId,
            visitorFound: fpData.visitorFound,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Profile proxy init failed: ${response.status}`);
      }

      const data = await response.json();

      // Server returns only FED-safe data (visitorId, incognito, location)
      const fedData: FedFingerprintData | undefined = data.fingerprintDetails;

      setState({
        isInitialized: true,
        isLoading: false,
        sessionId: data.sessionId,
        fingerprintId: data.fingerprintId,
        profileId: data.profileId,
        fingerprintMetadata: {
          confidence,
          requestId: eventId,
          visitorFound: fpData.visitorFound,
        },
        fingerprintDetails: fedData,
        error: null,
      });
    },
    [getData]
  );

  // ─── One-time initialization (module-level guard + AbortController) ───

  useEffect(() => {
    if (didInit) {
      return;
    }
    didInit = true;

    const controller = new AbortController();

    async function initialize() {
      try {
        // Step 1: Bootstrap — server checks cookies, returns FED data if valid
        log("Bootstrap: checking server cookies...");

        const res = await fetch("/api/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          signal: controller.signal,
          body: JSON.stringify({ mode: "bootstrap" }),
        });

        if (res.ok) {
          const data = await res.json();

          if (data.initialized) {
            log("Session restored from cookies");
            const details: FedFingerprintData | undefined = data.fingerprintDetails;

            if (details) {
              log("FED fingerprint data available:", {
                visitorId: details.visitorId,
                hasLocation: !!details.location,
                incognito: details.incognito,
              });
            }

            setState((prev) => ({
              ...prev,
              isInitialized: true,
              isLoading: false,
              fingerprintDetails: details,
              error: null,
            }));
            return; // Done — NO SDK call needed
          }
        }

        // Step 2: No valid cookies — call SDK, then initialize
        log("No valid session, calling Fingerprint SDK...");
        await initializeFromSdk(controller.signal);
      } catch (error) {
        // AbortError is expected on unmount — ignore silently
        if (controller.signal.aborted) {
          return;
        }
        logError("Initialization failed:", error);
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: error as Error,
        }));
      }
    }

    initialize();

    return () => {
      controller.abort();
    };
  }, [initializeFromSdk]);

  // ─── Derived helpers ──────────────────────────────────────────────────

  const getTrackingIds = useCallback(
    () => ({
      sessionId: state.sessionId,
      fingerprintId: state.fingerprintId,
      profileId: state.profileId,
    }),
    [state.sessionId, state.fingerprintId, state.profileId]
  );

  const refreshIds = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      log("Refreshing IDs...");
      await initializeFromSdk();
    } catch (error) {
      logError("Failed to refresh IDs:", error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error as Error,
      }));
    }
  }, [initializeFromSdk]);

  const value: ProfileContextValue = {
    ...state,
    getTrackingIds,
    refreshIds,
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

/**
 * Access the Profile context from any client component.
 *
 * Uses React 19 `use()` API instead of `useContext()`.
 */
export function useProfileContext(): ProfileContextValue {
  const context = use(ProfileContext);
  if (!context) {
    throw new Error("useProfileContext must be used within ProfileProvider");
  }
  return context;
}
