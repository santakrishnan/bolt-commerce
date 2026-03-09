/**
 * Services
 *
 * Centralised exports for all third-party / upstream service integrations.
 * Each integration lives in its own sub-folder containing:
 *   - `<name>.service.ts` – service functions
 *   - `types.ts`          – TypeScript types & interfaces
 *   - `index.ts`          – barrel re-exports
 *
 * Add new integrations as additional sub-folders following the same pattern.
 */

export * from "./events";
export * from "./fingerprint";
export * from "./search";
export * from "./visitor-profile";
