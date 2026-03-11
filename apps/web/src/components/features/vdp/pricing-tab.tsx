"use client";

import { Button, cn } from "@tfs-ucmp/ui";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import type { PriceHistoryEntry, PricingData } from "~/lib/data/vehicle";
import { PriceHistoryTable } from "./price-history-table";
import { PriceRangeMeter } from "./price-range-meter";

interface PricingTabProps {
  pricingData: PricingData;
  priceHistory: PriceHistoryEntry[];
}

export function PricingTab({ pricingData, priceHistory }: PricingTabProps) {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  return (
    <>
      <div className="rounded-t-lg md:px-[var(--spacing-md)] lg:mb-[var(--spacing-2xl)] lg:px-[var(--spacing-xl)]">
        <div className="mb-[var(--spacing-lg)] flex flex-col gap-[var(--spacing-md)] sm:flex-row sm:items-center sm:justify-between md:px-[var(--spacing-xl)] lg:px-0">
          <h3 className="text-[length:var(--text-xl)] text-[var(--color-core-surface-foreground)]font-semibold text-body leading-heading lg:font-semibold lg:text-[length:var(--font-size-lg)] lg:text-[var(--color-core-surface-foreground)] lg:leading-heading">
            Pricing
          </h3>
          <div className="hidden flex-wrap items-center text-[length:var(--font-size-sm)] sm:flex">
            <div className="flex items-center gap-[var(--spacing-xs)]">
              <Image
                alt=""
                aria-hidden="true"
                className="h-[var(--spacing-md)] w-[var(--spacing-md)]"
                height={14}
                src="/images/vdp/Vector_9.svg"
                width={14}
              />
              <span className="text-body-muted">
                <span className="font-semibold text-foreground">{pricingData.daysOnSite} days</span>{" "}
                on Arrow
              </span>
            </div>
            <div className="mx-[var(--spacing-sm)] h-[var(--spacing-5)] w-px bg-divider" />
            <div className="flex items-center gap-[var(--spacing-xs)]">
              <Image
                alt=""
                aria-hidden="true"
                className="h-[var(--spacing-md)] w-[var(--spacing-md)]"
                height={14}
                src="/images/vdp/Vector_11.svg"
                width={14}
              />

              <span className="text-body-muted">
                <span className="font-semibold text-foreground">{pricingData.views}</span> Views
              </span>
            </div>
            <div className="mx-[var(--spacing-sm)] h-[var(--spacing-5)] w-px bg-divider" />
            <div className="flex items-center gap-[var(--spacing-xs)]">
              <Image
                alt=""
                aria-hidden="true"
                className="h-[var(--spacing-md)] w-[var(--spacing-md)]"
                height={14}
                src="/images/vdp/Vector_10.svg"
                width={14}
              />

              <span className="text-body-muted">
                <span className="font-semibold text-foreground">{pricingData.saves}</span> saves
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="md:px-[var(--spacing-md)] lg:px-0">
        <div className="rounded-md bg-surface px-[var(--spacing-xl)] py-[var(--spacing-xl)]">
          <div className="flex flex-col items-start gap-[var(--spacing-4xl)] lg:flex-row lg:items-start lg:gap-[var(--spacing-3xl)]">
            <div className="w-full shrink-0 lg:w-[324px] lg:max-w-[324px]">
              <div className="flex flex-col">
                <div className="mb-[var(--spacing-md)] flex items-center">
                  <div className="flex items-center justify-center gap-1.75 rounded bg-success px-[var(--spacing-xs)] py-[var(--spacing-2xs)] text-center font-semibold text-[length:var(--text-2xs)] text-primary-foreground leading-normal">
                    <div className="flex aspect-7/6 h-[var(--spacing-sm)] items-center justify-center">
                      <Image
                        alt="Excellent Price"
                        height={12}
                        src="/images/vdp/Vector_1.svg"
                        width={14}
                      />
                    </div>
                    <div className="text-center font-semibold text-[length:var(--text-2xs)] text-white leading-normal">
                      Excellent Price
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-[var(--spacing-md)]" />
              </div>
              <p className="font-semibold text-[length:var(--font-size-sm)] text-body leading-normal">
                This vehicle is significantly lower than average market price
              </p>
            </div>

            <div className="w-full flex-1 lg:ml-[var(--spacing-4xl)] lg:max-w-2xl">
              <PriceRangeMeter
                avgPrice={pricingData.avgPrice}
                currentPrice={pricingData.currentPrice}
              />
            </div>
          </div>

          <div className="my-[var(--spacing-xl)] h-px bg-divider" />
          <div className="rounded-b-lg">
            <div className="rounded-lg bg-surface">
              <Button
                aria-controls="price-history-panel"
                aria-expanded={isHistoryOpen}
                className={cn(
                  "h-auto w-full justify-between rounded-none px-0 py-0 text-left font-normal transition-colors hover:bg-transparent hover:text-inherit focus:bg-transparent active:bg-transparent",
                  isHistoryOpen ? "mb-[var(--spacing-xl)]" : "mb-0"
                )}
                onClick={() => setIsHistoryOpen((prev) => !prev)}
                type="button"
                variant="ghost"
              >
                <div className="flex items-center gap-[var(--spacing-sm)]">
                  <div className="flex items-center justify-center">
                    <Image
                      alt=""
                      aria-hidden="true"
                      className="h-[var(--spacing-7)] w-[var(--spacing-7)]"
                      height={28}
                      src="/images/vdp/price_icon.svg"
                      width={28}
                    />
                  </div>
                  <span className="font-semibold text-[length:var(--font-size-lg)] text-body leading-7 lg:text-heading">
                    Price History
                  </span>
                </div>
                <motion.div
                  animate={{ rotate: isHistoryOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Image
                    alt=""
                    aria-hidden="true"
                    className="h-3.5 w-1.8 shrink-0"
                    height={20}
                    src="/images/vdp/Down_Arrow.svg"
                    width={10}
                  />
                </motion.div>
              </Button>

              <AnimatePresence initial={false}>
                {isHistoryOpen && (
                  <motion.div
                    animate={{ height: "auto", opacity: 1 }}
                    className="overflow-hidden"
                    exit={{ height: 0, opacity: 0 }}
                    id="price-history-panel"
                    initial={{ height: 0, opacity: 0 }}
                    key="price-history"
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                  >
                    <div className="pt-0">
                      <PriceHistoryTable entries={priceHistory} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
