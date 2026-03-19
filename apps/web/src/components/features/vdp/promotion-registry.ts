/**
 * Promotion Card Registry
 *
 * Declarative configuration for VDP promotion cards.
 * - To add a new card: add ONE entry to PROMOTION_CARDS.
 * - To disable feature-flag overrides: set ENABLE_FLAG_OVERRIDES = false.
 *
 * Cards have two visual modes controlled by `isCardTestEnabled` in context:
 *   - simple:   plain AppButton (default visitors)
 *   - detailed: ActionCard with icon, title, description (card-test users)
 */

// ─── Strategy Toggle ─────────────────────────────────────────────────
// Flip to `false` to disable feature-flag overrides entirely.
// When false, visibility is driven purely by VisitorProfile.userFlags.
export const ENABLE_FLAG_OVERRIDES = true;

// ─── Card-test cookie value ──────────────────────────────────────────
// The specific cookie value that activates detailed card mode.
export const CARD_TEST_FLAG_VALUE = "cardTestPrequalTradeInOffer";

// ─── Types ───────────────────────────────────────────────────────────

export type PromotionCardId = "prequalify" | "tradeIn" | "testDrive";

/** Context passed to guard functions for eligibility checks. */
export interface PromotionContext {
  isAuthenticated: boolean;
  isCardTestEnabled: boolean;
}

/** Content overrides for detailed (card-test) mode. */
export interface CardTestOverrides {
  buttonText: string;
  description: string;
  title: string;
}

export interface PromotionCardEntry {
  /** Unique identifier for this card. */
  id: PromotionCardId;
  /** Display priority (lower = rendered first). */
  priority: number;
  /** Default button text (simple mode). */
  defaultButtonText: string;
  /** Content overrides when card-test mode is active. */
  cardTestOverrides?: CardTestOverrides;
  /** Optional guard — card only eligible when guard returns true.
   *  If omitted, the card is always eligible. */
  guard?: (ctx: PromotionContext) => boolean;
}

// ─── Registry ────────────────────────────────────────────────────────
// To add a new card: add ONE entry here. Nothing else changes.

export const PROMOTION_CARDS: readonly PromotionCardEntry[] = [
  {
    id: "prequalify",
    priority: 10,
    defaultButtonText: "Get Pre-Qualified",
    cardTestOverrides: {
      buttonText: "Apply My Trade-In",
      title: "You're Pre Qualified",
      description: "Up to $45k in financing available",
    },
  },
  {
    id: "tradeIn",
    priority: 20,
    defaultButtonText: "Get My Trade-In Offer",
    cardTestOverrides: {
      buttonText: "Accept My Trade-In Offer",
      title: "Your Trade-In Offer is Ready",
      description: "Don't miss out, your guaranteed price is waiting",
    },
  },
  {
    id: "testDrive",
    priority: 30,
    defaultButtonText: "Book an Appointment",
    guard: (ctx) => ctx.isCardTestEnabled,
  },
];
