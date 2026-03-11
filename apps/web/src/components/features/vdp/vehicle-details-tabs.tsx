"use client";

import { cn, Tabs, TabsList, TabsTrigger } from "@tfs-ucmp/ui";
import { useState } from "react";
import type {
  FeatureCategory,
  HistoryData,
  PriceHistoryEntry,
  PricingData,
  VehicleSpecData,
} from "~/lib/data/vehicle";
import { FeaturesTab } from "./features-tab";
import { HistoryTab } from "./history-tab";
import { OverviewTab } from "./overview-tab";
import { PricingTab } from "./pricing-tab";

interface VehicleDetailsTabsProps {
  className?: string;
  specs: VehicleSpecData[];
  features: FeatureCategory[];
  featuresInitialCount: number;
  pricingData: PricingData;
  priceHistory: PriceHistoryEntry[];
  historyData: HistoryData;
  showInspectionSection?: boolean;
  featuresTableView?: boolean;
}

const tabTriggerClassName =
  "flex-shrink-0 whitespace-nowrap rounded-none border-transparent border-b-[3px] bg-transparent px-[var(--spacing-lg)] pb-[var(--spacing-sm)] pt-0 font-normal text-[var(--color-core-surfaces-foreground)] text-[length:var(--font-size-md)] leading-normal data-[state=active]:border-[var(--color-actions-accent)] data-[state=active]:bg-transparent data-[state=active]:font-semibold data-[state=active]:text-[var(--color-core-surfaces-foreground)] data-[state=active]:shadow-none";

export function VehicleDetailsTabs({
  className,
  specs,
  features,
  featuresInitialCount,
  pricingData,
  priceHistory,
  historyData,
  featuresTableView: _featuresTableView = false,
}: VehicleDetailsTabsProps) {
  const tabDefs = [
    {
      id: "overview",
      label: "Overview",
      content: <OverviewTab specs={specs} />,
      contentClassName: "mt-0 md:px-[var(--spacing-md)] lg:px-0",
    },
    {
      id: "features",
      label: "Features & Details",
      content: <FeaturesTab features={features} initialCount={featuresInitialCount} />,
      contentClassName: "mt-0",
    },
    {
      id: "pricing",
      label: "Pricing",
      content: <PricingTab priceHistory={priceHistory} pricingData={pricingData} />,
      contentClassName: "mt-0",
    },
    {
      id: "history",
      label: "History",
      content: <HistoryTab historyData={historyData} />,
      contentClassName: "mt-0",
    },
  ];
  const [activeId, setActiveId] = useState(tabDefs[0]?.id ?? "overview");
  const activeIndex = tabDefs.findIndex((tab) => tab.id === activeId);

  return (
    <div className={cn("w-full", className)}>
      <Tabs className="w-full" onValueChange={(id) => setActiveId(id)} value={activeId}>
        <div className="relative mb-12 w-full border-gray-200 border-b">
          <div
            className="overflow-x-auto px-[var(--spacing-2xs)] md:overflow-x-visible md:px-0"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            <TabsList className="flex h-auto flex-nowrap gap-[var(--spacing-10)] rounded-none border-0 bg-transparent p-0">
              {tabDefs.map((tab, _index) => (
                <TabsTrigger className={cn(tabTriggerClassName)} key={tab.id} value={tab.id}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>
      </Tabs>

      <div className="relative overflow-hidden">
        <div className={tabDefs[activeIndex]?.contentClassName ?? ""} key={activeIndex}>
          {tabDefs[activeIndex]?.content ?? null}
        </div>
      </div>
    </div>
  );
}
