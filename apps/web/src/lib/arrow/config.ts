/**
 * Tracking Configuration Module
 *
 * This module provides runtime validation and type-safe access to
 * environment variables required for the tracking system.
 *
 * Requirements: 1.3, 4.1, 6.2, 10.1, 10.2
 */

/**
 * Server-side configuration (not exposed to client)
 */
export interface ServerConfig {
  fingerprintServiceUrl: string;
  fingerprintApiKey: string;
}

/**
 * Client-side configuration (exposed via NEXT_PUBLIC_ prefix)
 */
export interface ClientConfig {
  profileServiceUrl: string;
  eventServiceUrl: string;
}

/**
 * Complete tracking configuration
 */
export interface TrackingConfig {
  server: ServerConfig;
  client: ClientConfig;
}

/**
 * Validation error for missing or invalid environment variables
 */
export class ConfigValidationError extends Error {
  readonly missingVars: string[];
  readonly invalidVars: string[];

  constructor(missingVars: string[], invalidVars: string[]) {
    const messages: string[] = [];

    if (missingVars.length > 0) {
      messages.push(`Missing required environment variables: ${missingVars.join(", ")}`);
    }

    if (invalidVars.length > 0) {
      messages.push(`Invalid environment variables: ${invalidVars.join(", ")}`);
    }

    super(messages.join("; "));
    this.name = "ConfigValidationError";
    this.missingVars = missingVars;
    this.invalidVars = invalidVars;
  }
}

/**
 * Validates that a value is a non-empty string
 */
function isValidString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * Validates that a value is a valid URL
 */
function isValidUrl(value: unknown): boolean {
  if (!isValidString(value)) {
    return false;
  }

  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validates server-side configuration
 *
 * This should only be called on the server (e.g., in API routes)
 * as it accesses server-only environment variables.
 *
 * @throws {ConfigValidationError} If required variables are missing or invalid
 */
export function validateServerConfig(): ServerConfig {
  const missingVars: string[] = [];
  const invalidVars: string[] = [];

  const fingerprintServiceUrl = process.env.FINGERPRINT_SERVICE_URL;
  const fingerprintApiKey = process.env.FINGERPRINT_API_KEY;

  // Check for missing variables
  if (!fingerprintServiceUrl) {
    missingVars.push("FINGERPRINT_SERVICE_URL");
  }
  if (!fingerprintApiKey) {
    missingVars.push("FINGERPRINT_API_KEY");
  }

  // Check for invalid variables
  if (fingerprintServiceUrl && !isValidUrl(fingerprintServiceUrl)) {
    invalidVars.push("FINGERPRINT_SERVICE_URL (must be a valid URL)");
  }
  if (fingerprintApiKey && !isValidString(fingerprintApiKey)) {
    invalidVars.push("FINGERPRINT_API_KEY (must be a non-empty string)");
  }

  // Throw if validation failed
  if (missingVars.length > 0 || invalidVars.length > 0) {
    throw new ConfigValidationError(missingVars, invalidVars);
  }

  // At this point, both variables are validated as non-empty strings
  return {
    fingerprintServiceUrl: fingerprintServiceUrl as string,
    fingerprintApiKey: fingerprintApiKey as string,
  };
}

/**
 * Validates client-side configuration
 *
 * This can be called on both client and server as it only accesses
 * NEXT_PUBLIC_ prefixed environment variables.
 *
 * Note: Client-side variables have defaults, so validation only
 * checks if provided values are valid URLs.
 *
 * @throws {ConfigValidationError} If provided variables are invalid
 */
export function validateClientConfig(): ClientConfig {
  const invalidVars: string[] = [];

  const profileServiceUrl = process.env.NEXT_PUBLIC_PROFILE_SERVICE_URL;
  const eventServiceUrl = process.env.NEXT_PUBLIC_EVENT_SERVICE_URL;

  // Check for invalid variables (if provided)
  if (profileServiceUrl && !isValidUrl(profileServiceUrl)) {
    invalidVars.push("NEXT_PUBLIC_PROFILE_SERVICE_URL (must be a valid URL)");
  }
  if (eventServiceUrl && !isValidUrl(eventServiceUrl)) {
    invalidVars.push("NEXT_PUBLIC_EVENT_SERVICE_URL (must be a valid URL)");
  }

  // Throw if validation failed
  if (invalidVars.length > 0) {
    throw new ConfigValidationError([], invalidVars);
  }

  return {
    profileServiceUrl: profileServiceUrl || "/api/profile",
    eventServiceUrl: eventServiceUrl || "/api/events",
  };
}

/**
 * Gets the complete tracking configuration with validation
 *
 * Server-side only - validates both server and client config.
 *
 * @throws {ConfigValidationError} If required variables are missing or invalid
 */
export function getTrackingConfig(): TrackingConfig {
  return {
    server: validateServerConfig(),
    client: validateClientConfig(),
  };
}

/**
 * Gets client-side configuration with validation
 *
 * Safe to call on both client and server.
 *
 * @throws {ConfigValidationError} If provided variables are invalid
 */
export function getClientConfig(): ClientConfig {
  return validateClientConfig();
}

/**
 * Checks if server configuration is available and valid
 *
 * Returns true if all required server variables are present and valid,
 * false otherwise. Does not throw errors.
 */
export function isServerConfigValid(): boolean {
  try {
    validateServerConfig();
    return true;
  } catch {
    return false;
  }
}

/**
 * Checks if client configuration is valid
 *
 * Returns true if all provided client variables are valid,
 * false otherwise. Does not throw errors.
 */
export function isClientConfigValid(): boolean {
  try {
    validateClientConfig();
    return true;
  } catch {
    return false;
  }
}
