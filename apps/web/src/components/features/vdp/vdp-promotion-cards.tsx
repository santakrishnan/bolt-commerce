"use client";

import { usePromotionFlags } from "~/hooks/use-promotion-flags";

import type { PromotionCardId } from "./promotion-registry";
import { PROMOTION_CARDS } from "./promotion-registry";
import { PrequalifyCard } from "./prequalify-card";
import { TestDriveCard } from "./test-drive-card";
import { TradeInCard } from "./trade-in-card";

// ─── Card component lookup ───────────────────────────────────────────

const CARD_COMPONENTS = {
  prequalify: PrequalifyCard,
  testDrive: TestDriveCard,
  tradeIn: TradeInCard,
} as const;

// ─── Props ───────────────────────────────────────────────────────────

interface VdpPromotionCardsProps {
  showPrequal?: boolean;
  showTestDrive?: boolean;
  showTradeIn?: boolean;
  testDriveButtonText?: string;
}

// ─── Visibility map from parent props ────────────────────────────────

function buildVisibilityMap(props: VdpPromotionCardsProps): Record<PromotionCardId, boolean> {
  return {
    prequalify: props.showPrequal ?? true,
    testDrive: props.showTestDrive ?? true,
    tradeIn: props.showTradeIn ?? true,
  };
}

// ─── Component ───────────────────────────────────────────────────────

/**
 * VdpPromotionCards
 *
 * Renders promotion cards based on parent props, visitor profile context,
 * and registry guards. Which cards exist, when they hide, and who can
 * see them is defined in `promotion-registry.ts`.
 */
export function VdpPromotionCards(props: VdpPromotionCardsProps) {
  const { context, isLoading } = usePromotionFlags();

  if (isLoading) {
    return null;
  }

  const visibility = buildVisibilityMap(props);

  const visibleCards = PROMOTION_CARDS
    .filter((entry) => visibility[entry.id]) // pass 1: parent props
    .filter((entry) => !entry.guard || entry.guard(context)) // pass 2: guard
    .sort((a, b) => a.priority - b.priority);

  if (visibleCards.length === 0) {
    return null;
  }

  return (
    <>
      {visibleCards.map((entry) => {
        const Card = CARD_COMPONENTS[entry.id];
        const isDetailed = context.isCardTestEnabled;
        const overrides = isDetailed ? entry.cardTestOverrides : undefined;

        if (entry.id === "testDrive") {
          return (
            <Card
              buttonText={props.testDriveButtonText ?? entry.defaultButtonText}
              key={entry.id}
            />
          );
        }

        return (
          <Card
            buttonText={overrides?.buttonText ?? entry.defaultButtonText}
            description={overrides?.description}
            detailed={isDetailed}
            key={entry.id}
            title={overrides?.title}
          />
        );
      })}
    </>
  );
}
