/**
 * Shared React Hooks
 *
 * This module contains reusable React hooks
 * that can be shared across multiple apps.
 *
 * Guidelines:
 * - Follow React hooks naming convention (useXxx)
 * - Handle cleanup in useEffect properly
 * - Document dependencies and return types
 * - Include "use client" directive for client hooks
 *
 * Example:
 *   export { useLocalStorage } from './use-local-storage'
 *   export { useDebounce } from './use-debounce'
 *   export { useMediaQuery } from './use-media-query'
 */

// Debounce hook
export { useDebounce } from "./use-debounce";

// Media query hook
export { useMediaQuery } from "./use-media-query";
