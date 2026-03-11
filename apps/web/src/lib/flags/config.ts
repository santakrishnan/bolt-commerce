/**
 * Feature Flags - Shared Configuration
 *
 * This module contains shared types and mock user data for feature flags.
 * It can be imported by both server and client components.
 *
 * Testing in browser:
 * - Use the 🚩 debug panel (bottom-right corner)
 * - Or set cookie: feature-flags-user=returning
 *
 * @see https://vercel.com/docs/workflow-collaboration/feature-flags
 */

export const FLAG_COOKIE_NAME = "feature-flags-user";

// ============================================================================
// TYPES
// ============================================================================

export interface FeatureFlags {
  // Hero Banner Display
  showDefaultLandingHero: boolean;
  showPersonalizedHeroBanner: boolean;

  // Customer Status
  customerPreQualified: boolean;
  customerTestDriveScheduled: boolean;
  customerTradeInSubmitted: boolean;

  // Navigation & Redirect
  redirectToMyGarage: boolean;
}

export interface MockUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  flags: FeatureFlags;
  lastVisit?: number; // Unix timestamp (ms)
  isAuthenticated?: boolean;
  prequalified?: boolean;
  daysRemaining?: number; // Days remaining for prequalification offer (out of 30)
}

// ============================================================================
// MOCK USER DATA
// ============================================================================

/**
 * Mock users for testing different feature flag combinations
 */
export const mockUsers: Record<string, MockUser> = {
  // First-time visitor - sees default landing page
  firstTimeVisitor: {
    id: "first-time-visitor",
    firstName: "Guest",
    lastName: "",
    email: "",
    flags: {
      showDefaultLandingHero: true,
      showPersonalizedHeroBanner: false,
      customerPreQualified: false,
      customerTestDriveScheduled: false,
      customerTradeInSubmitted: false,
      redirectToMyGarage: false,
    },
    lastVisit: undefined,
    isAuthenticated: false,
    prequalified: false,
  },

  // Returning user (unauthenticated) - redirects to My Garage, both cards show completed state
  returningUnauthenticated: {
    id: "returning-unauthenticated-001",
    firstName: "Emily",
    lastName: "Davis",
    email: "emily.d@example.com",
    flags: {
      // >3hrs: redirect to my-garage
      showDefaultLandingHero: false,
      showPersonalizedHeroBanner: false,
      customerPreQualified: true,
      customerTestDriveScheduled: true,
      customerTradeInSubmitted: true,
      redirectToMyGarage: true,
    },
    lastVisit: Date.now() - 4 * 60 * 60 * 1000, // 4 hours ago
    isAuthenticated: false,
    prequalified: true,
    daysRemaining: 27, // Green status (>50%)
  },

  // Authenticated & prequalified user - shows personalized banner with BUY NOW CTA
  authenticatedPrequalified: {
    id: "authenticated-prequalified-002",
    firstName: "James",
    lastName: "Wilson",
    email: "james.wilson@example.com",
    flags: {
      // Authenticated + prequal: show personalized banner
      showDefaultLandingHero: false,
      showPersonalizedHeroBanner: true,
      customerPreQualified: true,
      customerTestDriveScheduled: true,
      customerTradeInSubmitted: true,
      redirectToMyGarage: false,
    },
    lastVisit: Date.now() - 5 * 60 * 60 * 1000, // 5 hours ago
    isAuthenticated: true,
    prequalified: true,
    daysRemaining: 12, // Yellow status (≤50%)
  },

  // Authenticated but not prequalified - redirects to My Garage, both cards show action needed
  authenticatedNotPrequalified: {
    id: "authenticated-not-prequalified-003",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@example.com",
    flags: {
      showDefaultLandingHero: false,
      showPersonalizedHeroBanner: false,
      customerPreQualified: false,
      customerTestDriveScheduled: false,
      customerTradeInSubmitted: false,
      redirectToMyGarage: true,
    },
    lastVisit: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
    isAuthenticated: true,
    prequalified: false,
  },

  // Card Variation: Prequalified + No Trade-In
  prequalifiedNoTrade: {
    id: "prequalified-no-trade-004",
    firstName: "Michael",
    lastName: "Chen",
    email: "michael.chen@example.com",
    flags: {
      showDefaultLandingHero: false,
      showPersonalizedHeroBanner: false,
      customerPreQualified: true,
      customerTestDriveScheduled: false,
      customerTradeInSubmitted: false,
      redirectToMyGarage: true,
    },
    lastVisit: Date.now() - 6 * 60 * 60 * 1000, // 6 hours ago
    isAuthenticated: true,
    prequalified: true,
    daysRemaining: 5, // Red status (≤33%)
  },

  // Card Variation: Not Prequalified + Has Trade-In
  notPrequalifiedWithTrade: {
    id: "not-prequalified-with-trade-005",
    firstName: "Lisa",
    lastName: "Martinez",
    email: "lisa.martinez@example.com",
    flags: {
      showDefaultLandingHero: false,
      showPersonalizedHeroBanner: false,
      customerPreQualified: false,
      customerTestDriveScheduled: false,
      customerTradeInSubmitted: true,
      redirectToMyGarage: true,
    },
    lastVisit: Date.now() - 3 * 60 * 60 * 1000, // 3 hours ago
    isAuthenticated: true,
    prequalified: false,
  },

  // Card Variation: Prequalified + Has Trade-In (unauthenticated)
  unauthPrequalifiedWithTrade: {
    id: "unauth-prequalified-with-trade-006",
    firstName: "David",
    lastName: "Brown",
    email: "david.brown@example.com",
    flags: {
      showDefaultLandingHero: false,
      showPersonalizedHeroBanner: false,
      customerPreQualified: true,
      customerTestDriveScheduled: false,
      customerTradeInSubmitted: true,
      redirectToMyGarage: true,
    },
    lastVisit: Date.now() - 8 * 60 * 60 * 1000, // 8 hours ago
    isAuthenticated: false,
    prequalified: true,
    daysRemaining: 20, // Green status (>50%)
  },

  // Card Variation: Not Prequalified + No Trade-In (unauthenticated)
  unauthNotPrequalifiedNoTrade: {
    id: "unauth-not-prequalified-no-trade-007",
    firstName: "Jennifer",
    lastName: "Taylor",
    email: "jennifer.taylor@example.com",
    flags: {
      showDefaultLandingHero: false,
      showPersonalizedHeroBanner: false,
      customerPreQualified: false,
      customerTestDriveScheduled: false,
      customerTradeInSubmitted: false,
      redirectToMyGarage: true,
    },
    lastVisit: Date.now() - 10 * 60 * 60 * 1000, // 10 hours ago
    isAuthenticated: false,
    prequalified: false,
  },
};

// ============================================================================
// DEFAULT USER CONFIGURATION
// ============================================================================

/**
 * Default user type (used as fallback)
 * Options: "firstTimeVisitor" | "returningUnauthenticated" | "authenticatedPrequalified" | "authenticatedNotPrequalified" | "prequalifiedNoTrade" | "notPrequalifiedWithTrade" | "unauthPrequalifiedWithTrade" | "unauthNotPrequalifiedNoTrade"
 */
export const DEFAULT_USER_TYPE: keyof typeof mockUsers = "firstTimeVisitor";

// Default first-time visitor user for fallback
export const DEFAULT_USER: MockUser = {
  id: "first-time-visitor",
  firstName: "Guest",
  lastName: "",
  email: "",
  flags: {
    showDefaultLandingHero: true,
    showPersonalizedHeroBanner: false,
    customerPreQualified: false,
    customerTestDriveScheduled: false,
    customerTradeInSubmitted: false,
    redirectToMyGarage: false,
  },
};
