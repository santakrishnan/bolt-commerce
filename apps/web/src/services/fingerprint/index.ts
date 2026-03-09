/** Server API fallback — Tier 2 in the hybrid v4 resolution strategy. */
export { fetchFingerprintDetails } from "./fingerprint.service";
/** Sealed Client Results decryption — Tier 1 (primary) in the hybrid v4 strategy. */
export { unsealFingerprintResult } from "./sealed.service";
export type {
  FingerprintApiResponse,
  FingerprintBrowserDetails,
  FingerprintEventData,
  FingerprintIdentification,
  FingerprintIpGeolocation,
  FingerprintIpInfo,
} from "./types";
