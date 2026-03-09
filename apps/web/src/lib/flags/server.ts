/**
 * Feature Flags - Server-Side Functions
 *
 * This module provides server-side feature flag functions that can read cookies.
 * Only use this in Server Components.
 */

import { cookies } from "next/headers";
import {
  DEFAULT_USER,
  DEFAULT_USER_TYPE,
  type FeatureFlags,
  FLAG_COOKIE_NAME,
  type MockUser,
  mockUsers,
} from "./config";

/**
 * Get the current mock user based on cookie or default
 * This is used server-side to read the user from cookies
 */
export async function getCurrentUser(): Promise<MockUser> {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get(FLAG_COOKIE_NAME);

    if (userCookie?.value && mockUsers[userCookie.value]) {
      console.log(`🚩 Feature Flags: Using user from cookie: ${userCookie.value}`);
      const user = mockUsers[userCookie.value];
      if (user) {
        return user;
      }
    }
  } catch {
    // cookies() may fail in some contexts, fall back to default
  }

  const user = mockUsers[DEFAULT_USER_TYPE];
  return user ?? DEFAULT_USER;
}

/**
 * Get a specific feature flag value (Server-side)
 * In production, this would call Vercel's feature flag SDK
 *
 * @example
 * const showBanner = await getFlag("showPersonalizedHeroBanner");
 */
export async function getFlag<K extends keyof FeatureFlags>(flagName: K): Promise<FeatureFlags[K]> {
  const user = await getCurrentUser();
  return user.flags[flagName];
}

/**
 * Get all feature flags for the current user (Server-side)
 * In production, this would call Vercel's feature flag SDK
 */
export async function getAllFlags(): Promise<FeatureFlags> {
  const user = await getCurrentUser();
  return user.flags;
}

/**
 * Get current user info for personalization (Server-side)
 */
export async function getUserInfo(): Promise<{
  firstName: string;
  lastName: string;
  isAuthenticated: boolean;
}> {
  const user = await getCurrentUser();
  return {
    firstName: user.firstName,
    lastName: user.lastName,
    isAuthenticated: user.isAuthenticated === true,
  };
}
