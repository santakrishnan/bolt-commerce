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
  // Customer Status
  customerPreQualified: boolean;
  customerTestDriveScheduled: boolean;
  customerTradeInSubmitted: boolean;

  // Navigation & Redirect
  redirectToMyGarage: boolean;
  // Hero Banner Display
  showDefaultLandingHero: boolean;
  showPersonalizedHeroBanner: boolean;
}

export interface MockUser {
  daysRemaining?: number; // Days remaining for prequalification offer (out of 30)
  email: string;
  firstName: string;
  flags: FeatureFlags;
  id: string;
  isAuthenticated?: boolean;
  lastName: string;
  lastVisit?: number; // Unix timestamp (ms)
  prequalified?: boolean;
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

  // Card test scenario - shows prequal + trade-in CTAs and schedule test drive on VDP
  cardTestPrequalTradeInOffer: {
    id: "card-test-prequal-trade-in-offer-004",
    firstName: "Card",
    lastName: "Test",
    email: "card.test@example.com",
    flags: {
      showDefaultLandingHero: false,
      showPersonalizedHeroBanner: false,
      customerPreQualified: false,
      customerTestDriveScheduled: false,
      customerTradeInSubmitted: false,
      redirectToMyGarage: true,
    },
    lastVisit: Date.now() - 3 * 60 * 60 * 1000,
    isAuthenticated: true,
    prequalified: false,
  },
};

// ============================================================================
// DEFAULT USER CONFIGURATION
// ============================================================================

/**
 * Default user type (used as fallback)
 * Options: "firstTimeVisitor" | "returningUnauthenticated" | "authenticatedPrequalified" | "authenticatedNotPrequalified" | "cardTestPrequalTradeInOffer"
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
