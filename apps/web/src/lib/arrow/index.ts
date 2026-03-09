/**
 * Arrow — Public API
 *
 * Re-exports everything consumers need from the `~/lib/arrow` module.
 */

export type { ArrowContextValue } from "./arrow-provider";
// ─── Arrow Provider & hook ──────────────────────────────────────────────────
export { ArrowProvider, useArrow, useArrowSafe } from "./arrow-provider";
export type {
  ArrowClient,
  ArrowClientConfig,
  ArrowClientIds,
  ArrowRequestOptions,
} from "./client-api";
// ─── Client-side API helper ─────────────────────────────────────────────────
export {
  ArrowClientError,
  buildArrowHeaders,
  createArrowClient,
  useArrowClient,
} from "./client-api";

// ─── Config (env-var validation) ────────────────────────────────────────────
export type { ClientConfig, ServerConfig, TrackingConfig } from "./config";
export {
  ConfigValidationError,
  getClientConfig,
  getTrackingConfig,
  isClientConfigValid,
  isServerConfigValid,
  validateClientConfig,
  validateServerConfig,
} from "./config";

export type { ArrowCookieName, ArrowHeaderName } from "./constants";
// ─── Constants ──────────────────────────────────────────────────────────────
export { ARROW_COOKIE, ARROW_HEADER, ARROW_TTL } from "./constants";

// ─── Encryption (optional, JWE via jose) ────────────────────────────────────
export {
  ARROW_ENCRYPTED_HEADER,
  decryptPayload,
  encryptPayload,
  resolveEncryptionKey,
} from "./encryption";

// ─── Event Tracking ─────────────────────────────────────────────────────────
export { createEventTracker, useEventTracking } from "./event-tracker";

// ─── Fingerprint Client Provider ────────────────────────────────────────────
export { FingerprintClientProvider } from "./fingerprint-client";

export type {
  ArrowBrowserInfo,
  ArrowFingerprintData,
  ArrowFingerprintIdentity,
  ArrowGeoLocation,
  ArrowTrustSignals,
} from "./fingerprint-filter";
// ─── Fingerprint types & extractors ─────────────────────────────────────────
export { extractGeoFromArrowData, extractIdentityFromArrowData } from "./fingerprint-filter";

// ─── Profile Context ────────────────────────────────────────────────────────
export { ProfileProvider, useProfileContext } from "./profile-context";

// ─── SDK Transforms (Fingerprint v4) ────────────────────────────────────────
export type { SdkV4Result } from "./sdk-transforms";
export { extractSealedResult, isSdkV4Result } from "./sdk-transforms";

export type {
  ArrowServerClient,
  ArrowServerClientConfig,
  ArrowServerIds,
  ArrowServerRequestOptions,
} from "./server-api";
// ─── Server-side API helper ─────────────────────────────────────────────────
export {
  ArrowServerError,
  createArrowServerClient,
  decryptArrowPayload,
  extractArrowIds,
  extractForwardHeaders,
} from "./server-api";

// ─── Types ──────────────────────────────────────────────────────────────────
export type {
  EventTrackerRequest,
  FedFingerprintData,
  FedLocationData,
  FingerprintMetadata,
  ProfileContextState,
  ProfileContextValue,
} from "./types";

export type {
  VisitorProfile,
  VisitorProfileActions,
  VisitorProfileConfig,
  VisitorProfileContextValue,
  VisitorProfileState,
} from "./visitor-profile";
// ─── Visitor Profile (cached) ───────────────────────────────────────────────
export { useVisitorProfile, VisitorProfileProvider } from "./visitor-profile";
