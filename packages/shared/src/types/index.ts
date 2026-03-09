/**
 * Shared Types
 *
 * This module contains reusable TypeScript types and interfaces
 * that can be shared across multiple apps and packages.
 *
 * Guidelines:
 * - Use `interface` for object shapes (extendable)
 * - Use `type` for unions, intersections, primitives
 * - Export type-only exports with `export type`
 * - Group related types in namespaces if needed
 *
 * Example:
 *   export type { ApiResponse, ApiError } from './api'
 *   export type { User, UserRole } from './user'
 */

// Common utility types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type MaybePromise<T> = T | Promise<T>;

// Service configuration types
export interface ServiceConfig {
  baseUrl: string;
  timeout?: number;
  headers?: Record<string, string>;
}

// Provider context pattern types (React 19 style)
export interface ProviderContextValue<
  TState,
  TActions = Record<string, unknown>,
  TMeta = Record<string, unknown>,
> {
  state: TState;
  actions: TActions;
  meta: TMeta;
}

// Result type for operations that can fail
export type Result<T, E = Error> = { success: true; data: T } | { success: false; error: E };
