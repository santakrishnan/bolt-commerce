/**
 * Arrow — Core Type Definitions
 *
 * Types shared across the Arrow module: fingerprint metadata,
 * FED-safe data shapes, profile context state, and event tracking.
 *
 * Legacy API contract types (ProfileProxyRequest/Response/Error) live
 * in `app/api/session/types.ts` alongside the route that uses them.
 */

// ============================================================================
// Fingerprint Metadata
// ============================================================================

/**
 * Fingerprint metadata from the SDK identification result.
 */
export interface FingerprintMetadata {
  confidence?: number;
  requestId?: string;
  visitorFound?: boolean;
}

// ============================================================================
// FED-safe Fingerprint Types
// ============================================================================

/**
 * Location data exposed to the frontend.
 *
 * Contains only the geographic fields components need for
 * dealer proximity, store locator, and location-based content.
 */
export interface FedLocationData {
  city?: string;
  country?: string;
  countryCode?: string;
  postalCode?: string;
  state?: string;
  stateCode?: string;
  timezone?: string;
}

/**
 * FED-safe fingerprint data — the ONLY fingerprint information
 * exposed to React context and client-side state.
 *
 * Security: The full `FingerprintEventData` (IP, user-agent, browser
 * details, bot scores, VPN, proxy, tampering, raw device attributes)
 * is NEVER sent to the client. It stays server-side for BED service
 * calls only.
 *
 * This lean shape contains:
 * - `visitorId` — needed for tracking identity
 * - `incognito` — needed for UI adaptation
 * - `location` — needed for dealer proximity / localization
 */
export interface FedFingerprintData {
  incognito?: boolean;
  location?: FedLocationData;
  visitorId: string;
}

// ============================================================================
// Profile Context Types
// ============================================================================

/**
 * Profile Context State
 *
 * Core state managed by ProfileProvider, including tracking IDs,
 * enriched SDK fingerprint details (geo, browser, trust signals),
 * and loading/error flags.
 */
export interface ProfileContextState {
  error: Error | null;
  /** FED-safe fingerprint data: only visitorId, incognito, and location. */
  fingerprintDetails?: FedFingerprintData;
  fingerprintId: string | null;
  fingerprintMetadata?: FingerprintMetadata;
  isInitialized: boolean;
  isLoading: boolean;
  profileId: string | null;
  sessionId: string | null;
}

/**
 * Profile Context Value (includes state + methods)
 */
export interface ProfileContextValue extends ProfileContextState {
  getTrackingIds(): {
    sessionId: string | null;
    fingerprintId: string | null;
    profileId: string | null;
  };
  refreshIds(): Promise<void>;
}

// ============================================================================
// Event Tracking Types
// ============================================================================

/**
 * Event Tracker Request
 */
export interface EventTrackerRequest {
  eventName: string;
  fingerprintId: string | null;
  profileId: string | null;
  properties?: Record<string, unknown>;
  sessionId: string;
  timestamp: number;
}
