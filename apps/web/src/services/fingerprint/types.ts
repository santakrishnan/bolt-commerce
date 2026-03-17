/**
 * Fingerprint Service Types
 *
 * Type definitions for the Fingerprint Server API integration.
 */

export interface FingerprintBrowserDetails {
  browser_major_version?: string;
  browser_name?: string;
  device?: string;
  os?: string;
  os_version?: string;
}

export interface FingerprintIdentification {
  confidence: {
    score: number;
  };
  visitor_found: boolean;
  visitor_id: string;
}

export interface FingerprintIpGeolocation {
  /** Server API v4 flat snake_case fields */
  accuracy_radius?: number;
  city_name?: string;
  continent_code?: string;
  continent_name?: string;
  country_code?: string;
  country_name?: string;
  latitude?: number;
  longitude?: number;
  postal_code?: string;
  subdivisions?: Array<{ iso_code?: string; name?: string }>;
  timezone?: string;
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
  bot?: string;
  browser_details?: FingerprintBrowserDetails;
  event_id: string;
  identification?: FingerprintIdentification;
  incognito?: boolean;
  ip_address?: string;
  ip_info?: FingerprintIpInfo;
  proxy?: boolean;
  suspect_score?: number;
  tampering?: boolean;
  timestamp: number;
  url?: string;
  user_agent?: string;
  visitor_id: string;
  vpn?: boolean;
}

/**
 * Raw shape returned by the Fingerprint Server API v4 /v4/events/:event_id endpoint.
 * The v4 response is flat — no more nested `products` / `data` / `result` wrappers.
 * Only the fields we consume are typed here.
 */
export interface FingerprintApiResponse {
  /** v4 bot result: "bad" | "good" | "not_detected" */
  bot?: string;
  browser_details?: FingerprintBrowserDetails;
  event_id?: string;
  identification?: {
    visitor_id?: string;
    confidence?: { score?: number };
    visitor_found?: boolean;
  };
  incognito?: boolean;
  ip_address?: string;
  ip_info?: FingerprintIpInfo;
  proxy?: boolean;
  suspect_score?: number;
  tampering?: boolean;
  timestamp?: number;
  url?: string;
  user_agent?: string;
  vpn?: boolean;
}
