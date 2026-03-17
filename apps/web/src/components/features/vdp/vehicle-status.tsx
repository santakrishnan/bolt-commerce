"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { CardPrequalify } from "~/components/features/vdp/prequalify-card";
import { CardTradeIn } from "~/components/features/vdp/trade-in-card";
import type { FeatureFlags } from "~/lib/flags/config";
import { FLAG_COOKIE_NAME, mockUsers } from "~/lib/flags/config";

export const VehicleCTAButtons: React.FC = () => {
  const [flags, setFlags] = useState<FeatureFlags | null>(null);

  useEffect(() => {
    const userKey = localStorage.getItem(FLAG_COOKIE_NAME);
    const user = userKey ? mockUsers[userKey] : null;
    setFlags(user?.flags ?? null);
  }, []);

  if (!flags) {
    return null;
  }

  return (
    <>
      {!flags.customerPreQualified && <CardPrequalify />}
      {!flags.customerTradeInSubmitted && <CardTradeIn />}
      {/* {!flags.customerTestDriveScheduled && <CardTestDrive />} */}
    </>
  );
};
