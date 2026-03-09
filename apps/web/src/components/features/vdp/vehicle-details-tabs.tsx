"use client";

import { cn, Tabs, TabsList, TabsTrigger } from "@tfs-ucmp/ui";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import type {
  FeatureCategory,
  HistoryData,
  PriceHistoryEntry,
  PricingData,
  VehicleSpecData,
} from "~/lib/data/vehicle";
import FeaturesDisplay from "../../../app/used-cars/[[...params]]/views/tabbedviews/features-display";
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

/** Base className shared by all tab trigger buttons */
const tabBaseClassName =
  "relative flex shrink-0 cursor-pointer items-center whitespace-nowrap gap-2.5 rounded-none border-b-2 border-transparent bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none pt-[--spacing-5] px-[--spacing-md] pb-3.5 text-[length:--font-size-md] font-normal first:ml-25 transition-colors duration-200 lg:pt-0 lg:px-[--spacing-lg] lg:pb-[--spacing-sm] lg:text-[length:--font-size-md] lg:leading-normal md:first:ml-0";

const xVal = 500;
/** Slide variants for tab content transitions */
const contentVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? xVal : -xVal,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -xVal : xVal,
    opacity: 0,
  }),
};

/**
 * VehicleDetailsTabs Component
 * Displays vehicle information organized in tabs with framer-motion animations:
 * - Spring-animated sliding indicator via layoutId
 * - Directional slide + fade transition for tab content
 */
export function VehicleDetailsTabs({
  className,
  specs,
  features,
  featuresInitialCount,
  pricingData,
  priceHistory,
  historyData,
  featuresTableView = false,
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
      content: featuresTableView ? (
        <FeaturesDisplay categories={features} defaultView="table" />
      ) : (
        <FeaturesTab features={features} initialCount={featuresInitialCount} />
      ),
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
  const [direction, setDirection] = useState(0);
  const activeIndex = tabDefs.findIndex((tab) => tab.id === activeId);

  return (
    <div className={cn("w-full", className)}>
      {/* Tab Navigation (shadcn) */}
      <Tabs
        className="w-full"
        onValueChange={(id) => {
          const newIndex = tabDefs.findIndex((tab) => tab.id === id);
          setDirection(newIndex > activeIndex ? 1 : -1);
          setActiveId(id);
        }}
        value={activeId}
      >
        <div className="relative mb-[--spacing-xl] w-full border-[--color-states-muted] border-b lg:mb-[--spacing-2xl] lg:text-[length:--font-size-md]">
          <div
            className="overflow-x-auto md:overflow-x-visible"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            <TabsList className="flex h-auto flex-nowrap items-start self-stretch rounded-none border-0 bg-transparent py-0 pr-0 pl-[--spacing-lg] lg:items-center lg:justify-center lg:gap-10 lg:pl-0">
              {tabDefs.map((tab, index) => (
                <TabsTrigger
                  className={cn(
                    tabBaseClassName,
                    activeIndex === index
                      ? "font-bold text-heading shadow-none lg:font-semibold"
                      : "text-body hover:text-heading"
                  )}
                  key={tab.id}
                  value={tab.id}
                >
                  {tab.label}
                  {activeIndex === index && (
                    <motion.div
                      className="absolute right-0 bottom-0 left-0 h-[--border-width-3,3px] bg-[--color-brand]"
                      initial={false}
                      layoutId="vehicleActiveTab"
                      transition={{
                        x: { type: "tween", duration: 0.2, ease: "easeInOut" },
                        opacity: { duration: 0.2 },
                      }}
                    />
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>
      </Tabs>

      {/* Tab Content — directional slide + fade (unchanged) */}
      <div className="relative overflow-hidden">
        <AnimatePresence custom={direction} initial={false} mode="wait">
          <motion.div
            animate="center"
            className={tabDefs[activeIndex]?.contentClassName ?? ""}
            custom={direction}
            exit="exit"
            initial="enter"
            key={activeIndex}
            transition={{
              x: { type: "tween", duration: 0.2, ease: "easeInOut" },
              opacity: { duration: 0.2 },
            }}
            variants={contentVariants}
          >
            {tabDefs[activeIndex]?.content ?? null}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
