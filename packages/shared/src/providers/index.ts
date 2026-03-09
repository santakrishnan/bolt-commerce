/**
 * Shared React Providers
 *
 * This module contains reusable React context providers
 * that can be shared across multiple apps.
 *
 * Guidelines:
 * - Follow React 19 patterns (state/actions/meta structure)
 * - Export both Provider component and useContext hook
 * - Make providers composable and configurable
 * - Include "use client" directive for client components
 *
 * Example:
 *   export { AuthProvider, useAuth } from './auth-provider'
 *   export { FeatureFlagProvider, useFeatureFlags } from './feature-flag-provider'
 */

export type { Theme, ThemeContextValue, ThemeProviderProps } from "./theme-provider";
// Theme provider
export { ThemeProvider, useTheme } from "./theme-provider";
