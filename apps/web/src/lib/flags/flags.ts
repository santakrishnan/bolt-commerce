/**
 * Feature Flags - Vercel Flags SDK Implementation
 *
 * This module defines feature flags using the Vercel Flags SDK pattern.
 * Each flag is defined using the `flag()` function with a `decide` function
 * that determines the flag value based on user context.
 *
 * @see https://vercel.com/docs/workflow-collaboration/feature-flags
 * @see https://flags-sdk.dev/
 */

import { flag } from "flags/next";
import { cookies } from "next/headers";
import { DEFAULT_USER, FLAG_COOKIE_NAME, mockUsers } from "./config";

// ============================================================================
// HELPER: Get current user from cookie
// ============================================================================

async function getCurrentUserFromCookie() {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get(FLAG_COOKIE_NAME);

    if (userCookie?.value && mockUsers[userCookie.value]) {
      const user = mockUsers[userCookie.value];
      if (user) {
        console.log(`🚩 Flags SDK: Using user "${userCookie.value}" (${user.firstName})`);
        return user;
      }
    }
  } catch {
    // cookies() may fail in some contexts
  }

  return DEFAULT_USER;
}

// ============================================================================
// HERO BANNER DISPLAY FLAGS
// ============================================================================

/**
 * Show default landing hero
 * When true: Shows "Find Your New Vehicle" hero for first-time visitors
 */
export const showDefaultLandingHero = flag({
  key: "showDefaultLandingHero",
  description: "Show the default landing page hero for first-time visitors",
  decide: async () => {
    const user = await getCurrentUserFromCookie();
    return user.flags.showDefaultLandingHero;
  },
});

/**
 * Show personalized hero banner
 * When true: Shows "Welcome Back, {Name}!" hero with personalized content for authenticated users
 */
export const showPersonalizedHeroBanner = flag({
  key: "showPersonalizedHeroBanner",
  description: "Show personalized hero banner for authenticated users",
  decide: async () => {
    const user = await getCurrentUserFromCookie();
    return user.flags.showPersonalizedHeroBanner;
  },
});

// ============================================================================
// CUSTOMER STATUS FLAGS
// ============================================================================

/**
 * Customer prequalification status
 * When true: Customer IS prequalified
 * When false: Customer has NOT been prequalified
 */
export const customerPreQualified = flag({
  key: "customerPreQualified",
  description: "Customer prequalification status (true = prequalified, false = not prequalified)",
  decide: async () => {
    const user = await getCurrentUserFromCookie();
    return user.flags.customerPreQualified;
  },
});

/**
 * Customer test drive scheduled status
 * When true: Customer HAS scheduled a test drive
 * When false: Customer has NOT scheduled a test drive
 */
export const customerTestDriveScheduled = flag({
  key: "customerTestDriveScheduled",
  description: "Customer test drive status (true = scheduled, false = not scheduled)",
  decide: async () => {
    const user = await getCurrentUserFromCookie();
    return user.flags.customerTestDriveScheduled;
  },
});

/**
 * Customer trade-in submitted status
 * When true: Customer HAS submitted trade-in
 * When false: Customer has NOT submitted trade-in
 */
export const customerTradeInSubmitted = flag({
  key: "customerTradeInSubmitted",
  description: "Customer trade-in status (true = submitted, false = not submitted)",
  decide: async () => {
    const user = await getCurrentUserFromCookie();
    return user.flags.customerTradeInSubmitted;
  },
});

// ============================================================================
// NAVIGATION & REDIRECT FLAGS
// ============================================================================

/**
 * Redirect to My Garage
 * When true: Redirect to /my-garage instead of showing landing page
 */
export const redirectToMyGarage = flag({
  key: "redirectToMyGarage",
  description: "Redirect to My Garage page instead of landing page",
  decide: async () => {
    const user = await getCurrentUserFromCookie();
    return user.flags.redirectToMyGarage;
  },
});

// ============================================================================
// USER INFO HELPER (not a flag, but uses same cookie context)
// ============================================================================

/**
 * Get current user info for personalization
 */
export async function getUserInfo(): Promise<{
  firstName: string;
  lastName: string;
  isAuthenticated: boolean;
}> {
  const user = await getCurrentUserFromCookie();
  return {
    firstName: user.firstName,
    lastName: user.lastName,
    isAuthenticated: user.isAuthenticated === true,
  };
}

// ============================================================================
// PRECOMPUTE EXPORT (for static page generation)
// ============================================================================

/**
 * Precompute configuration for static page variants
 * This allows Next.js to pre-generate pages for different flag combinations
 */
export const precompute = [showDefaultLandingHero, showPersonalizedHeroBanner];
