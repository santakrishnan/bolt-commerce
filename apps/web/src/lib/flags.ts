/**
 * Feature Flags - Main Export
 *
 * This module uses the Vercel Flags SDK for feature flag management.
 *
 * Usage:
 * - For server components: import flags directly from "~/lib/flags/flags"
 * - For client components: import from "~/lib/flags/client"
 * - For shared config/types: import from "~/lib/flags/config"
 *
 * @see https://vercel.com/docs/workflow-collaboration/feature-flags
 * @see https://flags-sdk.dev/
 */

// Export types and config (safe for both server and client)
export {
  DEFAULT_USER,
  DEFAULT_USER_TYPE,
  type FeatureFlags,
  FLAG_COOKIE_NAME,
  type MockUser,
  mockUsers,
} from "./flags/config";

// Re-export SDK flags for convenience
export {
  carouselAnimationVariant,
  customerPreQualified,
  customerTestDriveScheduled,
  customerTradeInSubmitted,
  getUserInfo,
  redirectToMyGarage,
  showDefaultLandingHero,
  showPersonalizedHeroBanner,
} from "./flags/flags";
