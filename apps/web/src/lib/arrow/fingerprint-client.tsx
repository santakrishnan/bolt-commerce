"use client";

import { FpjsProvider } from "@fingerprintjs/fingerprintjs-pro-react";
import type { ReactNode } from "react";

const isDev = process.env.NODE_ENV === "development";
function noop() {
  /* no-op */
}
const log = isDev ? console.log.bind(console, "[Fingerprint]") : noop;
const logError = console.error.bind(console, "[Fingerprint]");

/**
 * Fingerprint.js Client Provider
 *
 * Wraps the application with the Fingerprint.js SDK React provider.
 *
 * **SDK v4 migration notes:**
 * - The React wrapper (`@fingerprintjs/fingerprintjs-pro-react`) automatically
 *   loads the latest JS Agent version. When the underlying agent is v4, the
 *   response from `getData()` returns a minimal payload with `sealedResult`
 *   instead of full enriched data.
 * - No provider configuration changes are needed — the v4 changes are in the
 *   agent response shape, handled in `sdk-transforms.ts` and `profile-context.tsx`.
 * - Future: migrate to `@fingerprint/react` (v4 native React SDK) when available.
 *
 * Proxy Configuration (Next.js Rewrites):
 * - Uses Next.js rewrites in next.config.ts to proxy Fingerprint.js requests
 * - /fpjs-cdn/* → https://fpnpmcdn.net/* (CDN assets)
 * - /fpjs-api/* → https://api.fpjs.io/* (API calls)
 * - This bypasses ad blockers by routing through your domain
 *
 * Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6
 */

interface FingerprintClientProviderProps {
  children: ReactNode;
}

export function FingerprintClientProvider({ children }: FingerprintClientProviderProps) {
  const apiKey = process.env.NEXT_PUBLIC_FINGERPRINT_API_KEY;

  if (!apiKey) {
    logError("API key not configured. Set NEXT_PUBLIC_FINGERPRINT_API_KEY in .env.local");
    return <>{children}</>;
  }

  log("Initializing with API key:", `${apiKey.substring(0, 8)}...`);

  const region = process.env.NEXT_PUBLIC_FINGERPRINT_REGION as "us" | "eu" | "ap" | undefined;

  // Check if proxy is enabled via rewrites
  const useProxy = process.env.NEXT_PUBLIC_USE_FPJS_PROXY === "true";

  if (useProxy) {
    // Use relative URL to avoid hydration mismatch between server/client.
    // /fpjs-cdn/* rewrites to fpnpmcdn.net for script loading.
    // /fpjs-api/* rewrites to api.fpjs.io for identification API calls.
    log("Using Next.js rewrites for proxy — endpoint: /fpjs-api");

    return (
      <FpjsProvider
        loadOptions={{
          apiKey,
          endpoint: "/fpjs-api",
          scriptUrlPattern: "/fpjs-cdn/v<version>/<apiKey>/loader_v<loaderVersion>.js",
          region,
        }}
      >
        {children}
      </FpjsProvider>
    );
  }

  // Use custom endpoint if configured (no proxy)
  const customEndpoint = process.env.NEXT_PUBLIC_FINGERPRINT_ENDPOINT;

  if (customEndpoint) {
    log("Using custom endpoint:", customEndpoint);
    return (
      <FpjsProvider
        loadOptions={{
          apiKey,
          endpoint: customEndpoint,
          region,
        }}
      >
        {children}
      </FpjsProvider>
    );
  }

  // Use default Fingerprint.js endpoints
  log("Using default Fingerprint.js endpoints");
  return (
    <FpjsProvider
      loadOptions={{
        apiKey,
        region,
      }}
    >
      {children}
    </FpjsProvider>
  );
}
