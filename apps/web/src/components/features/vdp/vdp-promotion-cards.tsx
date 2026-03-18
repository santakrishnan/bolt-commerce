"use client";

import { useEffect, useState } from "react";
import { getCookie } from "~/lib/cookie-cache";
import { FLAG_COOKIE_NAME } from "~/lib/flags/config";
import { PrequalifyCard } from "./prequalify-card";
import { TestDriveCard } from "./test-drive-card";
import { TradeInCard } from "./trade-in-card";

const CARD_TEST_PREQUAL_TRADE_OFFER_FLAG = "cardTestPrequalTradeInOffer";

interface VdpPromotionCardsProps {
  showPrequal?: boolean;
  showTestDrive?: boolean;
  showTradeIn?: boolean;
  testDriveButtonText?: string;
}

export function VdpPromotionCards({
  showPrequal = true,
  showTradeIn = true,
  showTestDrive = true,
  testDriveButtonText,
}: VdpPromotionCardsProps) {
  const [isCardTestEnabled, setIsCardTestEnabled] = useState(false);

  useEffect(() => {
    setIsCardTestEnabled(getCookie(FLAG_COOKIE_NAME) === CARD_TEST_PREQUAL_TRADE_OFFER_FLAG);
  }, []);

  const prequalButtonText = isCardTestEnabled ? "Apply My Trade-In" : "Get Pre-Qualified";
  const tradeInButtonText = isCardTestEnabled
    ? "Accept My Trade-In Offer"
    : "Get My Trade-In Offer";

  return (
    <>
      {showPrequal && (
        <PrequalifyCard
          buttonText={prequalButtonText}
          description={isCardTestEnabled ? "Up to $45k in financing available" : undefined}
          detailed={isCardTestEnabled}
          title={isCardTestEnabled ? "You're Pre Qualified" : undefined}
        />
      )}
      {showTradeIn && (
        <TradeInCard
          buttonText={tradeInButtonText}
          description={
            isCardTestEnabled ? "Don't miss out, your guaranteed price is waiting" : undefined
          }
          detailed={isCardTestEnabled}
          title={isCardTestEnabled ? "Your Trade-In Offer is Ready" : undefined}
        />
      )}
      {showTestDrive && isCardTestEnabled && <TestDriveCard buttonText={testDriveButtonText} />}
    </>
  );
}
