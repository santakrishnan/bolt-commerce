/**
 * Arrow Server API Helper
 *
 * A server-side HTTP client for Next.js route handlers and server components.
 * Used to call upstream BED (Back-End for Data) services with:
 *
 * - Automatic Arrow header forwarding (session, fingerprint, profile IDs)
 * - Configurable auth (Bearer token, API key header, etc.)
 * - Structured error handling with typed error codes
 * - Request timeout & retry logic
 * - Request / response logging in development
 *
 * Usage in a route handler:
 * ```ts
 * import { createArrowServerClient } from "~/lib/arrow/server-api";
 *
 * const bedClient = createArrowServerClient({
 *   baseUrl: process.env.BED_API_URL!,
 *   authToken: process.env.BED_API_KEY,
 * });
 *
 * export async function POST(request: NextRequest) {
 *   const ids = extractArrowIds(request);
 *   const result = await bedClient.post("/profiles/resolve", payload, { ids });
 *   return NextResponse.json(result);
 * }
 * ```
 */

import type { NextRequest } from "next/server";
import { ARROW_COOKIE, ARROW_HEADER } from "~/lib/arrow/constants";
import { decodeCookieValue } from "~/lib/auth/sealed-cookie";
import { ARROW_ENCRYPTED_HEADER, decryptPayload, resolveEncryptionKey } from "./encryption";

// ─── Encrypted payload helper for route handlers ───────────────────────────

/**
 * Read and optionally decrypt the JSON body from an incoming Next.js request.
 *
 * If the `X-Arrow-Encrypted: true` header is present, the raw text body is
 * treated as a JWE compact string and decrypted using `ARROW_ENCRYPTION_KEY`.
 * Otherwise, the body is parsed as plain JSON.
 *
 * Use this in route handlers that accept encrypted POST bodies:
 * ```ts
 * export async function POST(request: NextRequest) {
 *   const body = await decryptArrowPayload<MyPayload>(request);
 *   // body is decrypted and typed
 * }
 * ```
 */
export async function decryptArrowPayload<T = unknown>(request: NextRequest): Promise<T> {
  const isEncrypted = request.headers.get(ARROW_ENCRYPTED_HEADER) === "true";

  if (!isEncrypted) {
    return (await request.json()) as T;
  }

  const key = resolveEncryptionKey();
  if (!key) {
    throw new ArrowServerError(
      "Encrypted request received but ARROW_ENCRYPTION_KEY is not configured",
      400,
      "ENCRYPTION_KEY_MISSING",
      "Arrow"
    );
  }

  const jwe = await request.text();
  try {
    return await decryptPayload<T>(jwe, key);
  } catch (error) {
    throw new ArrowServerError(
      `Failed to decrypt payload: ${(error as Error).message}`,
      400,
      "DECRYPTION_FAILED",
      "Arrow"
    );
  }
}

// ─── Types ──────────────────────────────────────────────────────────────────

export interface ArrowServerIds {
  sessionId: string | null;
  fingerprintId: string | null;
  profileId: string | null;
  eventId?: string | null;
}

export interface ArrowServerClientConfig {
  /** Base URL for the upstream BED service (required) */
  baseUrl: string;
  /** Bearer token attached as `Authorization: Bearer <token>` */
  authToken?: string;
  /** Alternative: API key attached as a custom header */
  apiKey?: { headerName: string; value: string };
  /** Extra headers merged into every request */
  defaultHeaders?: Record<string, string>;
  /** Request timeout in milliseconds (default: 15 000) */
  timeout?: number;
  /** Number of retries on 5xx / network errors (default: 1) */
  retries?: number;
  /** Base delay between retries in ms — doubled each attempt (default: 500) */
  retryDelay?: number;
  /** Service label used in log messages (default: "BED") */
  serviceName?: string;
}

export interface ArrowServerRequestOptions {
  /** Arrow tracking IDs to forward as headers */
  ids?: ArrowServerIds;
  /** Extra headers for this specific request */
  headers?: Record<string, string>;
  /** Override timeout per-request */
  timeout?: number;
  /** Next.js fetch options (revalidate, tags, etc.) */
  next?: NextFetchRequestConfig;
}

/** Subset of Next.js extended fetch options */
interface NextFetchRequestConfig {
  revalidate?: number | false;
  tags?: string[];
}

// ─── Error class ────────────────────────────────────────────────────────────

export class ArrowServerError extends Error {
  readonly status: number;
  readonly code: string;
  readonly service: string;
  readonly body?: unknown;

  constructor(message: string, status: number, code: string, service: string, body?: unknown) {
    super(message);
    this.name = "ArrowServerError";
    this.status = status;
    this.code = code;
    this.service = service;
    this.body = body;
  }

  /** Is this a retryable error? (5xx or network) */
  get isRetryable(): boolean {
    return this.status === 0 || this.status >= 500;
  }

  /** JSON-safe representation for structured logging */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      code: this.code,
      service: this.service,
      body: this.body,
    };
  }
}

// ─── ID extraction from incoming Next.js request ────────────────────────────

/**
 * Extract Arrow tracking IDs from an incoming Next.js request.
 *
 * Reads custom `X-Arrow-*` headers first (set by `client-api.ts`).
 * Falls back to httpOnly cookies when headers are absent (e.g., bootstrap
 * requests where the client doesn't have IDs in JS memory yet).
 */
export function extractArrowIds(request: NextRequest): ArrowServerIds {
  const cookieValue = (cookieName: string): string | null => {
    const raw = request.cookies.get(cookieName)?.value;
    return raw ? (decodeCookieValue(raw) ?? raw) : null;
  };

  const fromHeaderOrCookie = (headerName: string, cookieName: string): string | null => {
    const header = request.headers.get(headerName);
    // Ignore sentinel "anonymous" value — fall through to cookie
    if (header && header !== "anonymous") {
      return header;
    }
    return cookieValue(cookieName);
  };

  return {
    sessionId: fromHeaderOrCookie(ARROW_HEADER.SESSION_ID, ARROW_COOKIE.SESSION_ID),
    fingerprintId: fromHeaderOrCookie(ARROW_HEADER.FP_ID, ARROW_COOKIE.FP_ID),
    profileId: fromHeaderOrCookie(ARROW_HEADER.PROFILE_ID, ARROW_COOKIE.PROFILE_ID),
    eventId: fromHeaderOrCookie(ARROW_HEADER.FP_EID, ARROW_COOKIE.FP_EID),
  };
}

// ─── Forwardable request headers ────────────────────────────────────────────

/**
 * Allowlist of incoming browser headers that are safe and useful to forward
 * to upstream BED services.
 *
 * This is the **single place** to control what the Next.js BFF proxies through.
 * Add or remove entries here — every service that calls `extractForwardHeaders`
 * inherits the change.
 *
 * Why these headers?
 * - `user-agent`       — device / browser context for analytics & bot detection
 * - `accept-language`  — locale for i18n-aware responses
 * - `referer`          — traffic source / funnel position
 * - `x-forwarded-for`  — real client IP behind CDN / load-balancer
 * - `x-real-ip`        — alternative real-IP header (nginx, Vercel)
 * - `cf-connecting-ip`  — Cloudflare real client IP
 * - `x-request-id`     — distributed tracing correlation
 * - `x-correlation-id`  — alternative correlation header
 * - Arrow `X-Arrow-*`  — our own tracking headers (session, fp, profile, event)
 */
const FORWARDABLE_HEADERS: ReadonlySet<string> = new Set([
  "user-agent",
  "accept-language",
  "referer",
  "x-forwarded-for",
  "x-real-ip",
  "cf-connecting-ip",
  "x-request-id",
  "x-correlation-id",
  // Arrow tracking headers (lowercase for case-insensitive matching)
  ARROW_HEADER.SESSION_ID.toLowerCase(),
  ARROW_HEADER.FP_ID.toLowerCase(),
  ARROW_HEADER.PROFILE_ID.toLowerCase(),
  ARROW_HEADER.FP_EID.toLowerCase(),
]);

/**
 * Extract the subset of incoming request headers that are safe to forward
 * to upstream BED services.
 *
 * Only headers in the `FORWARDABLE_HEADERS` allowlist are included.
 * This prevents leaking sensitive browser headers (e.g., `Cookie`,
 * `Authorization`, `Host`) to external services.
 *
 * @param request - Incoming Next.js request
 * @returns Plain object of header name → value (only non-empty values)
 */
export function extractForwardHeaders(request: NextRequest): Record<string, string> {
  const forwarded: Record<string, string> = {};

  for (const [name, value] of request.headers.entries()) {
    if (FORWARDABLE_HEADERS.has(name.toLowerCase()) && value) {
      forwarded[name] = value;
    }
  }

  return forwarded;
}

// ─── Server client ──────────────────────────────────────────────────────────

export interface ArrowServerClient {
  get<T = unknown>(path: string, opts?: ArrowServerRequestOptions): Promise<T>;
  post<T = unknown>(path: string, body?: unknown, opts?: ArrowServerRequestOptions): Promise<T>;
  put<T = unknown>(path: string, body?: unknown, opts?: ArrowServerRequestOptions): Promise<T>;
  patch<T = unknown>(path: string, body?: unknown, opts?: ArrowServerRequestOptions): Promise<T>;
  delete<T = unknown>(path: string, opts?: ArrowServerRequestOptions): Promise<T>;
}

const isDev = process.env.NODE_ENV === "development";

/**
 * Create a server-side Arrow HTTP client for calling upstream BED APIs.
 */
export function createArrowServerClient(config: ArrowServerClientConfig): ArrowServerClient {
  const {
    baseUrl,
    authToken,
    apiKey,
    defaultHeaders = {},
    timeout: defaultTimeout = 15_000,
    retries = 1,
    retryDelay = 500,
    serviceName = "BED",
  } = config;

  const logPrefix = `[Arrow→${serviceName}]`;

  /** Build full headers for one request */
  function buildHeaders(
    ids?: ArrowServerIds,
    extra?: Record<string, string>
  ): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...defaultHeaders,
    };

    // Auth
    if (authToken) {
      headers.Authorization = `Bearer ${authToken}`;
    }
    if (apiKey) {
      headers[apiKey.headerName] = apiKey.value;
    }

    // Arrow tracking IDs
    if (ids?.sessionId) {
      headers[ARROW_HEADER.SESSION_ID] = ids.sessionId;
    }
    if (ids?.fingerprintId) {
      headers[ARROW_HEADER.FP_ID] = ids.fingerprintId;
    }
    if (ids?.profileId) {
      headers[ARROW_HEADER.PROFILE_ID] = ids.profileId;
    }
    if (ids?.eventId) {
      headers[ARROW_HEADER.FP_EID] = ids.eventId;
    }

    if (extra) {
      Object.assign(headers, extra);
    }

    return headers;
  }

  /** Sleep helper for retry backoff */
  function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /** Parse an error response into an ArrowServerError */
  async function parseErrorResponse(
    response: Response,
    method: string,
    path: string
  ): Promise<ArrowServerError> {
    let errorBody: unknown;
    try {
      errorBody = await response.json();
    } catch {
      errorBody = await response.text().catch(() => null);
    }
    const code = (errorBody as Record<string, string>)?.code ?? `HTTP_${response.status}`;
    return new ArrowServerError(
      `${serviceName} API error: ${response.status} ${response.statusText} — ${method} ${path}`,
      response.status,
      code,
      serviceName,
      errorBody
    );
  }

  /** Wrap a caught error as an ArrowServerError */
  function wrapCaughtError(error: unknown, path: string, reqTimeout: number): ArrowServerError {
    if ((error as Error).name === "AbortError") {
      return new ArrowServerError(
        `${serviceName} request to ${path} timed out after ${reqTimeout}ms`,
        0,
        "TIMEOUT",
        serviceName
      );
    }
    return new ArrowServerError(
      `${serviceName} network error: ${(error as Error).message}`,
      0,
      "NETWORK_ERROR",
      serviceName
    );
  }

  /** Check if error is retryable and if so, wait and signal to continue */
  async function shouldRetry(error: ArrowServerError, attempt: number): Promise<boolean> {
    if (error.isRetryable && attempt < retries) {
      if (isDev) {
        console.warn(`${logPrefix} Retryable error, retrying in ${retryDelay * 2 ** attempt}ms...`);
      }
      await sleep(retryDelay * 2 ** attempt);
      return true;
    }
    return false;
  }

  /** Build the fetch init object for a single request */
  function buildFetchInit(
    method: string,
    body: unknown,
    signal: AbortSignal,
    opts?: ArrowServerRequestOptions
  ): RequestInit & { next?: NextFetchRequestConfig } {
    const fetchInit: RequestInit & { next?: NextFetchRequestConfig } = {
      method,
      headers: buildHeaders(opts?.ids, opts?.headers),
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    };
    if (opts?.next) {
      fetchInit.next = opts.next;
    }
    return fetchInit;
  }

  /** Execute a single fetch attempt and return the parsed result */
  async function executeSingleAttempt<T>(
    url: string,
    method: string,
    path: string,
    body: unknown,
    reqTimeout: number,
    opts?: ArrowServerRequestOptions
  ): Promise<{ data: T } | { error: ArrowServerError }> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), reqTimeout);

    try {
      if (isDev) {
        console.log(`${logPrefix} ${method} ${path}`);
      }

      const response = await fetch(url, buildFetchInit(method, body, controller.signal, opts));

      if (!response.ok) {
        return { error: await parseErrorResponse(response, method, path) };
      }

      if (response.status === 204) {
        return { data: undefined as T };
      }

      const data = (await response.json()) as T;

      if (isDev) {
        console.log(`${logPrefix} ${method} ${path} → ${response.status}`);
      }

      return { data };
    } catch (error) {
      if (error instanceof ArrowServerError) {
        return { error };
      }
      return { error: wrapCaughtError(error, path, reqTimeout) };
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /** Core fetch with timeout, retries, and error handling */
  async function request<T>(
    method: string,
    path: string,
    body?: unknown,
    opts?: ArrowServerRequestOptions
  ): Promise<T> {
    const url = `${baseUrl}${path}`;
    const reqTimeout = opts?.timeout ?? defaultTimeout;
    let lastError: ArrowServerError | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      const result = await executeSingleAttempt<T>(url, method, path, body, reqTimeout, opts);

      if ("data" in result) {
        return result.data;
      }

      lastError = result.error;

      if (await shouldRetry(lastError, attempt)) {
        continue;
      }

      throw lastError;
    }

    // Should never reach here, but TypeScript wants a return
    throw lastError ?? new ArrowServerError("Unexpected error", 0, "UNKNOWN", serviceName);
  }

  return {
    get: <T = unknown>(path: string, opts?: ArrowServerRequestOptions) =>
      request<T>("GET", path, undefined, opts),
    post: <T = unknown>(path: string, body?: unknown, opts?: ArrowServerRequestOptions) =>
      request<T>("POST", path, body, opts),
    put: <T = unknown>(path: string, body?: unknown, opts?: ArrowServerRequestOptions) =>
      request<T>("PUT", path, body, opts),
    patch: <T = unknown>(path: string, body?: unknown, opts?: ArrowServerRequestOptions) =>
      request<T>("PATCH", path, body, opts),
    delete: <T = unknown>(path: string, opts?: ArrowServerRequestOptions) =>
      request<T>("DELETE", path, undefined, opts),
  };
}
