"use client";

import { useEffect, useMemo, useState } from "react";

import {
  CARD_TEST_FLAG_VALUE,
  ENABLE_FLAG_OVERRIDES,
  type PromotionContext,
} from "~/components/features/vdp/promotion-registry";
import { useArrow } from "~/lib/arrow/arrow-provider";
import { getCookie } from "~/lib/cookie-cache";
import { FLAG_COOKIE_NAME, mockUsers } from "~/lib/flags/config";

// ─── Types ───────────────────────────────────────────────────────────

export interface UsePromotionFlagsResult {
  /** Context for guard evaluation and card variant selection. */
  context: PromotionContext;
  /** True while the visitor profile is still loading. */
  isLoading: boolean;
}

// ─── Hook ────────────────────────────────────────────────────────────

/**
 * Resolves promotion card context from the visitor profile,
 * with optional feature-flag overrides from mock-user cookies.
 *
 * Resolution order (highest precedence first):
 *   1. Cookie-based flag overrides (when ENABLE_FLAG_OVERRIDES === true)
 *   2. VisitorProfile from Arrow
 *   3. Defaults (unauthenticated, card-test disabled)
 *
 * Note: The cookie is read in a useEffect because "use client" components
 * still pre-render on the server where document.cookie is unavailable.
 * Without this, useMemo would compute during SSR (no cookie) and never
 * recompute on the client because its deps haven't changed.
 */
export function usePromotionFlags(): UsePromotionFlagsResult {
  const { visitorProfile, isProfileLoading } = useArrow();

  // Sync the mock-user cookie into React state so it survives hydration.
  const [mockUserKey, setMockUserKey] = useState<string | null>(null);

  useEffect(() => {
    if (ENABLE_FLAG_OVERRIDES) {
      setMockUserKey(getCookie(FLAG_COOKIE_NAME));
    }
  }, []);

  return useMemo(() => {
    let isAuthenticated = visitorProfile?.isKnown ?? false;
    let isCardTestEnabled = false;

    // Cookie-based overrides (dev/QA, controlled by toggle)
    if (ENABLE_FLAG_OVERRIDES && mockUserKey) {
      const mockUser = mockUsers[mockUserKey];
      if (mockUser) {
        isAuthenticated = mockUser.isAuthenticated ?? false;
      }
      isCardTestEnabled = mockUserKey === CARD_TEST_FLAG_VALUE;
    }

    return {
      context: { isAuthenticated, isCardTestEnabled },
      isLoading: isProfileLoading,
    };
  }, [visitorProfile, isProfileLoading, mockUserKey]);
}
