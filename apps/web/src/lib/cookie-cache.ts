/**
 * Cached Cookie Utility — Best Practices Implementation
 *
 * Provides a cached interface for client-side cookie operations following
 * Vercel React best practices for performance optimization.
 *
 * Features:
 * - **Memory cache**: Avoids expensive `document.cookie` reads
 * - **Cache invalidation**: Handles multi-tab scenarios
 * - **Unified API**: Consistent interface across the codebase
 * - **Secure by default**: Uses Secure flag on HTTPS
 *
 * @see https://vercel.com/docs/concepts/functions/edge-functions/cookies
 * @see Vercel React Best Practices — Cache Storage API Calls
 */

// ─── Cache Storage ───────────────────────────────────────────────────

/**
 * In-memory cache for cookie values.
 * Lazily populated on first access and invalidated on visibility changes.
 */
let cookieCache: Record<string, string> | null = null;

/**
 * Parse all cookies from `document.cookie` into a cache object.
 * This is expensive but only done once (until cache invalidation).
 */
function parseCookies(): Record<string, string> {
  if (typeof document === "undefined") {
    return {};
  }

  try {
    const cookies: Record<string, string> = {};
    const cookieString = document.cookie;

    if (!cookieString) {
      return cookies;
    }

    for (const cookie of cookieString.split("; ")) {
      const [name, ...rest] = cookie.split("=");
      if (name) {
        cookies[name] = rest.join("=") || "";
      }
    }

    return cookies;
  } catch {
    return {};
  }
}

/**
 * Clear the cookie cache.
 * Called when cookies may have changed externally (e.g., tab visibility change).
 */
function clearCache(): void {
  cookieCache = null;
}

// ─── Cache Invalidation Strategy ────────────────────────────────────────────

/**
 * Invalidate cache when the page becomes visible again.
 * This handles cases where cookies were modified in other tabs.
 */
if (typeof document !== "undefined") {
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      clearCache();
    }
  });
}

// ─── Public API ──────────────────────────────────────────────────────────────

export interface CookieOptions {
  /** Cookie expiration in seconds (maxAge) */
  maxAge?: number;
  /** Cookie expiration as Date object (expires) */
  expires?: Date;
  /** Cookie path (default: "/") */
  path?: string;
  /** Use Secure flag (default: auto-detected from protocol) */
  secure?: boolean;
  /** SameSite attribute (default: "Lax") */
  sameSite?: "Strict" | "Lax" | "None";
}

/**
 * Get a cookie value from the cache.
 * Returns `null` if the cookie doesn't exist.
 *
 * This is a cached operation — the first call parses `document.cookie`,
 * subsequent calls read from memory.
 *
 * @example
 * const userId = getCookie("user_id");
 */
export function getCookie(name: string): string | null {
  // Populate cache on first access
  if (cookieCache === null) {
    cookieCache = parseCookies();
  }

  return cookieCache[name] ?? null;
}

/**
 * Set a cookie and update the cache.
 * Uses modern Cookie Store API when available, falls back to `document.cookie`.
 *
 * @example
 * setCookie("user_id", "12345", { maxAge: 86400 });
 *
 * @example
 * setCookie("theme", "dark", { expires: new Date("2025-12-31") });
 */
export function setCookie(name: string, value: string, options: CookieOptions = {}): void {
  if (typeof window === "undefined") {
    return;
  }

  const {
    maxAge,
    expires,
    path = "/",
    secure = window.location.protocol === "https:",
    sameSite = "Lax",
  } = options;

  // Try Cookie Store API first (modern browsers)
  if ("cookieStore" in window) {
    try {
      // Calculate expiration (prefer maxAge over expires)
      let expiresTimestamp: number | undefined;
      if (maxAge !== undefined) {
        expiresTimestamp = Date.now() + maxAge * 1000;
      } else if (expires !== undefined) {
        expiresTimestamp = expires.getTime();
      }

      const cookieStoreOptions: {
        name: string;
        value: string;
        path: string;
        expires?: number;
        sameSite?: "strict" | "lax" | "none";
      } = {
        name,
        value,
        path,
      };

      if (expiresTimestamp !== undefined) {
        cookieStoreOptions.expires = expiresTimestamp;
      }

      if (sameSite !== undefined) {
        cookieStoreOptions.sameSite = sameSite.toLowerCase() as "strict" | "lax" | "none";
      }

      // Note: Cookie Store API doesn't support 'secure' option directly
      // It automatically uses Secure on HTTPS contexts
      (window as Window & { cookieStore: { set: (opts: object) => Promise<void> } }).cookieStore
        .set(cookieStoreOptions)
        .catch(() => {
          // Fall through to document.cookie on error
          setViaDom(name, value, { maxAge, expires, path, secure, sameSite });
        });

      // Update cache immediately
      if (cookieCache === null) {
        cookieCache = parseCookies();
      }
      cookieCache[name] = value;

      return;
    } catch {
      // Fall through to document.cookie
    }
  }

  // Fallback: Use document.cookie
  setViaDom(name, value, { maxAge, expires, path, secure, sameSite });

  // Update cache immediately
  if (cookieCache === null) {
    cookieCache = parseCookies();
  }
  cookieCache[name] = value;
}

/**
 * Remove a cookie by setting it with past expiration.
 *
 * @example
 * removeCookie("user_id");
 */
export function removeCookie(name: string, options: Pick<CookieOptions, "path"> = {}): void {
  const { path = "/" } = options;

  // Try Cookie Store API first
  if ("cookieStore" in window) {
    try {
      (
        window as Window & {
          cookieStore: { delete: (opts: { name: string; path: string }) => Promise<void> };
        }
      ).cookieStore
        .delete({ name, path })
        .catch(() => {
          // Fall through to document.cookie on error
          setViaDom(name, "", { maxAge: -1, path });
        });

      // Update cache immediately
      if (cookieCache !== null) {
        delete cookieCache[name];
      }

      return;
    } catch {
      // Fall through to document.cookie
    }
  }

  // Fallback: expire via document.cookie
  setViaDom(name, "", { maxAge: -1, path });

  // Update cache immediately
  if (cookieCache !== null) {
    delete cookieCache[name];
  }
}

/**
 * Get all cookies as a key-value object.
 * This is a cached operation.
 *
 * @example
 * const allCookies = getAllCookies();
 * console.log(allCookies); // { user_id: "12345", theme: "dark" }
 */
export function getAllCookies(): Record<string, string> {
  if (cookieCache === null) {
    cookieCache = parseCookies();
  }

  return { ...cookieCache };
}

/**
 * Check if a cookie exists.
 *
 * @example
 * if (hasCookie("user_id")) {
 *   console.log("User is logged in");
 * }
 */
export function hasCookie(name: string): boolean {
  return getCookie(name) !== null;
}

/**
 * Manually clear the cookie cache.
 * Useful when you know cookies were modified externally.
 *
 * @example
 * // After server-side cookie modification
 * clearCookieCache();
 * const newValue = getCookie("user_id");
 */
export function clearCookieCache(): void {
  clearCache();
}

// ─── Internal Helpers ────────────────────────────────────────────────────────

/**
 * Set a cookie using `document.cookie` (fallback method).
 * This is used when Cookie Store API is unavailable or fails.
 */
function setViaDom(name: string, value: string, options: CookieOptions): void {
  if (typeof document === "undefined") {
    return;
  }

  const { maxAge, expires, path = "/", secure = false, sameSite = "Lax" } = options;

  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (maxAge !== undefined) {
    cookieString += `; max-age=${maxAge}`;
  } else if (expires !== undefined) {
    cookieString += `; expires=${expires.toUTCString()}`;
  }

  cookieString += `; path=${path}`;

  if (secure) {
    cookieString += "; Secure";
  }

  cookieString += `; SameSite=${sameSite}`;

  // biome-ignore lint/suspicious/noDocumentCookie: Required for cookie manipulation
  document.cookie = cookieString;
}
