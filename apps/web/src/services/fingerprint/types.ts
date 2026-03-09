/**
 * Fingerprint Service Types
 *
 * Type definitions for the Fingerprint Server API integration.
 */

export interface FingerprintBrowserDetails {
  browser_name?: string;
  browser_major_version?: string;
  os?: string;
  os_version?: string;
  device?: string;
}

export interface FingerprintIdentification {
  visitor_id: string;
  confidence: {
    score: number;
  };
  visitor_found: boolean;
}

export interface FingerprintIpGeolocation {
  /** Server API v4 flat snake_case fields */
  accuracy_radius?: number;
  latitude?: number;
  longitude?: number;
  postal_code?: string;
  timezone?: string;
  city_name?: string;
  country_code?: string;
  country_name?: string;
  continent_code?: string;
  continent_name?: string;
  subdivisions?: Array<{ iso_code?: string; name?: string }>;
}

export interface FingerprintIpInfo {
  v4?: {
    address?: string;
    geolocation?: FingerprintIpGeolocation;
  };
}

/**
 * Normalised visitor event data returned by the Fingerprint Server API
 * and surfaced through the session route.
 */
export interface FingerprintEventData {
  event_id: string;
  visitor_id: string;
  timestamp: number;
  url?: string;
  ip_address?: string;
  user_agent?: string;
  browser_details?: FingerprintBrowserDetails;
  identification?: FingerprintIdentification;
  ip_info?: FingerprintIpInfo;
  bot?: string;
  incognito?: boolean;
  vpn?: boolean;
  proxy?: boolean;
  tampering?: boolean;
  suspect_score?: number;
}

/**
 * Raw shape returned by the Fingerprint Server API v4 /v4/events/:event_id endpoint.
 * The v4 response is flat — no more nested `products` / `data` / `result` wrappers.
 * Only the fields we consume are typed here.
 */
export interface FingerprintApiResponse {
  event_id?: string;
  timestamp?: number;
  url?: string;
  ip_address?: string;
  user_agent?: string;
  browser_details?: FingerprintBrowserDetails;
  identification?: {
    visitor_id?: string;
    confidence?: { score?: number };
    visitor_found?: boolean;
  };
  ip_info?: FingerprintIpInfo;
  /** v4 bot result: "bad" | "good" | "not_detected" */
  bot?: string;
  incognito?: boolean;
  suspect_score?: number;
  vpn?: boolean;
  proxy?: boolean;
  tampering?: boolean;
}
