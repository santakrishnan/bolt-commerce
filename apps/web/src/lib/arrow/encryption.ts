/**
 * Arrow — Optional Payload Encryption (JWE via jose)
 *
 * Provides opt-in AES-256-GCM + A256KW encryption for sensitive POST
 * payloads sent from the browser client to BFF API routes.
 *
 * When enabled, the client wraps the JSON body as a JWE compact token.
 * The server-side API route decrypts it before processing.
 *
 * The shared secret is derived from `NEXT_PUBLIC_ARROW_ENCRYPTION_KEY`
 * (client) and `ARROW_ENCRYPTION_KEY` (server). Both must contain the
 * same base64url-encoded 256-bit key.
 *
 * Usage — client side:
 * ```ts
 * const api = useArrowClient();
 * await api.post("/api/session", sensitiveBody, { encrypt: true });
 * ```
 *
 * Usage — server side:
 * ```ts
 * const body = await decryptArrowPayload<MyType>(request);
 * ```
 *
 * Key generation (run once, store in .env):
 * ```sh
 * node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
 * ```
 */

import * as jose from "jose";

// ─── Header used to signal that the body is encrypted ───────────────────────

export const ARROW_ENCRYPTED_HEADER = "X-Arrow-Encrypted";

// ─── Shared key resolution ──────────────────────────────────────────────────

/**
 * Resolve the symmetric key from the environment.
 *
 * - Client: reads `NEXT_PUBLIC_ARROW_ENCRYPTION_KEY`
 * - Server: reads `ARROW_ENCRYPTION_KEY` (falls back to public var)
 *
 * Returns `null` when no key is configured (encryption disabled).
 */
export function resolveEncryptionKey(): Uint8Array | null {
  const raw =
    (typeof process !== "undefined" && process.env?.ARROW_ENCRYPTION_KEY) ||
    (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_ARROW_ENCRYPTION_KEY) ||
    null;

  if (!raw) {
    return null;
  }

  return jose.base64url.decode(raw);
}

// ─── Encrypt (client-side) ──────────────────────────────────────────────────

/**
 * Encrypt a JSON-serialisable payload into a JWE compact string.
 *
 * Algorithm: `A256KW` key wrapping + `A256GCM` content encryption.
 *
 * @param payload - Any JSON-serialisable value
 * @param key     - 256-bit symmetric key
 * @returns       JWE compact serialisation string
 */
export async function encryptPayload(payload: unknown, key: Uint8Array): Promise<string> {
  const plaintext = new TextEncoder().encode(JSON.stringify(payload));

  const jwe = await new jose.CompactEncrypt(plaintext)
    .setProtectedHeader({ alg: "A256KW", enc: "A256GCM" })
    .encrypt(key);

  return jwe;
}

// ─── Decrypt (server-side) ──────────────────────────────────────────────────

/**
 * Decrypt a JWE compact string back into the original payload.
 *
 * @param jwe - JWE compact serialisation string
 * @param key - 256-bit symmetric key (same key used to encrypt)
 * @returns   Parsed JSON payload
 */
export async function decryptPayload<T = unknown>(jwe: string, key: Uint8Array): Promise<T> {
  const { plaintext } = await jose.compactDecrypt(jwe, key);
  return JSON.parse(new TextDecoder().decode(plaintext)) as T;
}
