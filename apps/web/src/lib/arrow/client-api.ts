"use client";

/**
 * Arrow Client API Helper
 *
 * A lightweight HTTP client for browser-side code that automatically
 * attaches Arrow tracking headers (session, fingerprint, profile IDs)
 * to every outgoing request made to the BFF proxy API routes.
 *
 * Usage:
 * ```ts
 * const api = createArrowClient({ sessionId, fingerprintId, profileId });
 * const data = await api.post("/api/session", { mode: "bootstrap" });
 * ```
 *
 * Or with the React hook (reads IDs from ArrowContext automatically):
 * ```ts
 * const api = useArrowClient();
 * await api.post("/api/events/track", { event: "page_view" });
 * ```
 */

import { useMemo } from "react";
import { ARROW_HEADER } from "~/lib/arrow/constants";
import { ARROW_ENCRYPTED_HEADER, encryptPayload, resolveEncryptionKey } from "./encryption";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface ArrowClientIds {
  sessionId: string | null;
  fingerprintId: string | null;
  profileId: string | null;
}

export interface ArrowClientConfig {
  /** Base URL prepended to relative paths (default: "") */
  baseUrl?: string;
  /** Extra headers merged into every request */
  defaultHeaders?: Record<string, string>;
  /** Request timeout in milliseconds (default: 30 000) */
  timeout?: number;
}

export interface ArrowRequestOptions extends Omit<RequestInit, "body" | "method"> {
  /** Extra headers for this specific request */
  headers?: Record<string, string>;
  /** Abort signal override */
  signal?: AbortSignal;
  /**
   * Encrypt the request body using JWE (A256KW + A256GCM).
   * Requires `NEXT_PUBLIC_ARROW_ENCRYPTION_KEY` to be set.
   * Only applies to POST / PUT requests with a body.
   */
  encrypt?: boolean;
}

export class ArrowClientError extends Error {
  readonly status: number;
  readonly code: string;
  readonly body?: unknown;

  constructor(message: string, status: number, code: string, body?: unknown) {
    super(message);
    this.name = "ArrowClientError";
    this.status = status;
    this.code = code;
    this.body = body;
  }
}

export interface ArrowClient {
  get<T = unknown>(path: string, opts?: ArrowRequestOptions): Promise<T>;
  post<T = unknown>(path: string, body?: unknown, opts?: ArrowRequestOptions): Promise<T>;
  put<T = unknown>(path: string, body?: unknown, opts?: ArrowRequestOptions): Promise<T>;
  delete<T = unknown>(path: string, opts?: ArrowRequestOptions): Promise<T>;
}

// ─── Factory ────────────────────────────────────────────────────────────────

/**
 * Create an Arrow HTTP client that attaches tracking headers to every request.
 *
 * @param ids     - Current tracking IDs (sessionId, fingerprintId, profileId)
 * @param config  - Optional base URL, default headers, timeout
 */
export function createArrowClient(
  ids: ArrowClientIds,
  config: ArrowClientConfig = {}
): ArrowClient {
  const { baseUrl = "", defaultHeaders = {}, timeout = 30_000 } = config;

  /** Build the tracking + custom headers for a single request */
  function buildHeaders(extra?: Record<string, string>): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...defaultHeaders,
    };

    if (ids.sessionId) {
      headers[ARROW_HEADER.SESSION_ID] = ids.sessionId;
    }
    if (ids.fingerprintId) {
      headers[ARROW_HEADER.FP_ID] = ids.fingerprintId;
    }
    if (ids.profileId) {
      headers[ARROW_HEADER.PROFILE_ID] = ids.profileId;
    }

    if (extra) {
      Object.assign(headers, extra);
    }

    return headers;
  }

  /** Serialise and optionally encrypt the request body */
  async function serialiseBody(
    body: unknown,
    encrypt?: boolean
  ): Promise<{ serialised: string; extraHeaders: Record<string, string> }> {
    const extraHeaders: Record<string, string> = {};

    if (encrypt) {
      const key = resolveEncryptionKey();
      if (!key) {
        throw new ArrowClientError(
          "Encryption requested but NEXT_PUBLIC_ARROW_ENCRYPTION_KEY is not set",
          0,
          "ENCRYPTION_KEY_MISSING"
        );
      }
      const serialised = await encryptPayload(body, key);
      extraHeaders[ARROW_ENCRYPTED_HEADER] = "true";
      extraHeaders["Content-Type"] = "text/plain";
      return { serialised, extraHeaders };
    }

    return { serialised: JSON.stringify(body), extraHeaders };
  }

  /** Parse an error response body */
  async function parseErrorResponse(response: Response): Promise<never> {
    let errorBody: unknown;
    try {
      errorBody = await response.json();
    } catch {
      errorBody = await response.text().catch(() => null);
    }
    const code = (errorBody as Record<string, string>)?.code ?? `HTTP_${response.status}`;
    throw new ArrowClientError(
      `Arrow API error: ${response.status} ${response.statusText}`,
      response.status,
      code,
      errorBody
    );
  }

  /** Internal fetch wrapper with timeout + error handling */
  async function request<T>(
    method: string,
    path: string,
    body?: unknown,
    opts?: ArrowRequestOptions
  ): Promise<T> {
    const url = `${baseUrl}${path}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    let serialisedBody: string | undefined;
    let extraHeaders: Record<string, string> = {};

    if (body !== undefined) {
      const result = await serialiseBody(body, opts?.encrypt);
      serialisedBody = result.serialised;
      extraHeaders = result.extraHeaders;
    }

    try {
      const response = await fetch(url, {
        method,
        headers: buildHeaders({ ...extraHeaders, ...opts?.headers }),
        body: serialisedBody,
        credentials: "include",
        signal: opts?.signal ?? controller.signal,
        ...opts,
      });

      if (!response.ok) {
        await parseErrorResponse(response);
      }

      if (response.status === 204) {
        return undefined as T;
      }

      return (await response.json()) as T;
    } catch (error) {
      if (error instanceof ArrowClientError) {
        throw error;
      }
      if ((error as Error).name === "AbortError") {
        throw new ArrowClientError(`Request to ${path} timed out after ${timeout}ms`, 0, "TIMEOUT");
      }
      throw new ArrowClientError(`Network error: ${(error as Error).message}`, 0, "NETWORK_ERROR");
    } finally {
      clearTimeout(timeoutId);
    }
  }

  return {
    get: <T = unknown>(path: string, opts?: ArrowRequestOptions) =>
      request<T>("GET", path, undefined, opts),
    post: <T = unknown>(path: string, body?: unknown, opts?: ArrowRequestOptions) =>
      request<T>("POST", path, body, opts),
    put: <T = unknown>(path: string, body?: unknown, opts?: ArrowRequestOptions) =>
      request<T>("PUT", path, body, opts),
    delete: <T = unknown>(path: string, opts?: ArrowRequestOptions) =>
      request<T>("DELETE", path, undefined, opts),
  };
}

// ─── React hook (reads IDs from ArrowContext) ───────────────────────────────

/**
 * React hook that returns an `ArrowClient` pre-configured with the current
 * tracking IDs from `useArrow()`.
 *
 * Must be used within `<ArrowProvider>`.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const api = useArrowClient();
 *
 *   const handleClick = async () => {
 *     await api.post("/api/events/track", { event: "button_click" });
 *   };
 *
 *   return <button onClick={handleClick}>Track</button>;
 * }
 * ```
 */
export function useArrowClient(config?: ArrowClientConfig): ArrowClient {
  // Import at module level won't cause circular deps because arrow-provider
  // doesn't import from client-api. The provider and client-api are siblings.
  const { useArrow } = require("./arrow-provider") as {
    useArrow: () => ArrowClientIds;
  };

  const { sessionId, fingerprintId, profileId } = useArrow();

  const client = useMemo(
    () => createArrowClient({ sessionId, fingerprintId, profileId }, config),
    [sessionId, fingerprintId, profileId, config]
  );

  return client;
}

// ─── Standalone helpers (no React context required) ─────────────────────────

/**
 * Build the Arrow tracking headers object for manual use.
 *
 * Useful when you need to attach headers to a non-Arrow fetch call
 * (e.g., third-party SDK, WebSocket init).
 */
export function buildArrowHeaders(ids: ArrowClientIds): Record<string, string> {
  const headers: Record<string, string> = {};

  if (ids.sessionId) {
    headers[ARROW_HEADER.SESSION_ID] = ids.sessionId;
  }
  if (ids.fingerprintId) {
    headers[ARROW_HEADER.FP_ID] = ids.fingerprintId;
  }
  if (ids.profileId) {
    headers[ARROW_HEADER.PROFILE_ID] = ids.profileId;
  }

  return headers;
}
