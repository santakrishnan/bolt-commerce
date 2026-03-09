/**
 * Feature Flags - Client-Side Functions
 *
 * This module provides client-side feature flag functions that read from localStorage.
 * Use this in Client Components (with "use client" directive).
 */

import {
  DEFAULT_USER,
  DEFAULT_USER_TYPE,
  type FeatureFlags,
  FLAG_COOKIE_NAME,
  type MockUser,
  mockUsers,
} from "./config";

/**
 * Get current user synchronously (for client components)
 * Reads from localStorage which is synced from cookies
 */
export function getCurrentUserSync(): MockUser {
  // Client-side: Check if we're in browser and read from localStorage as cache
  if (typeof window !== "undefined") {
    const userType = localStorage.getItem(FLAG_COOKIE_NAME);
    if (userType && mockUsers[userType]) {
      const user = mockUsers[userType];
      if (user) {
        return user;
      }
    }
  }

  const user = mockUsers[DEFAULT_USER_TYPE];
  return user ?? DEFAULT_USER;
}

/**
 * Synchronous flag getter for client components
 * Note: In production, use Vercel's useFeatureFlag hook instead
 */
export function getFlagSync<K extends keyof FeatureFlags>(flagName: K): FeatureFlags[K] {
  const user = getCurrentUserSync();
  return user.flags[flagName];
}

/**
 * Get user info synchronously for client components
 */
export function getUserInfoSync(): {
  firstName: string;
  lastName: string;
  isAuthenticated: boolean;
} {
  const user = getCurrentUserSync();
  return {
    firstName: user.firstName,
    lastName: user.lastName,
    isAuthenticated: user.id !== "anonymous",
  };
}
