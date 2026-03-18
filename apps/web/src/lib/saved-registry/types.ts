/**
 * Shared types for the Saved Registry service layer.
 *
 * These types are used by both the server-side service (mock / BED)
 * and the client-side API service that calls the proxy routes.
 */

export interface SearchEntry {
  id: string;
  query: string;
  timestamp: string;
  type: "nlp" | "filter";
  url: string;
}

/**
 * Standard envelope returned by all saved-registry proxy routes.
 * `data` carries the payload; `error` is populated on failure.
 */
export interface SavedRegistryResponse<T> {
  data: T;
  error?: string;
}
