/**
 * Shared Utilities
 *
 * This module contains reusable utility functions
 * for common operations across apps.
 *
 * Guidelines:
 * - Keep utilities pure and side-effect free
 * - Use TypeScript generics for flexibility
 * - Document edge cases and return types
 * - Consider tree-shaking (export individual functions)
 *
 * Example:
 *   export { debounce, throttle } from './timing'
 *   export { deepMerge, pick, omit } from './objects'
 *   export { formatCurrency, formatDate } from './formatters'
 */

// Formatters
export { formatCurrency, formatDate, truncate } from "./formatters";
// String utilities
export { capitalize, formatSlugLabel, toCamelCase, toKebabCase } from "./strings";
// Validators
export { isValidEmail, isValidPhone, isValidURL } from "./validators";
