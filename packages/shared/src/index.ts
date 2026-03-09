/**
 * @tfs-ucmp/shared
 *
 * Shared services, providers, utilities, and hooks for the Arrow monorepo.
 *
 * Usage:
 *   import { createService, useLocalStorage } from '@tfs-ucmp/shared'
 *   import { ApiService } from '@tfs-ucmp/shared/services'
 *   import { AuthProvider } from '@tfs-ucmp/shared/providers'
 *   import { debounce } from '@tfs-ucmp/shared/utils'
 *   import type { ServiceConfig } from '@tfs-ucmp/shared/types'
 */

export * from "./hooks";
export * from "./providers";
// Re-export all modules for convenience
export * from "./services";
export * from "./types";
export * from "./utils";
