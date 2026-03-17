"use client";

import { Button, cn, VectorRightOutlineIcon } from "@tfs-ucmp/ui";
import { useState } from "react";
import type {
  FeatureCategory,
  HistoryData,
  VehicleDetail,
  VehicleSpecData,
  VehicleStatusData,
} from "~/lib/data/vehicle";
import { VehicleMetaBar, type VehicleMetaBarChipComponents } from "./vehicle-meta-bar";

interface FeaturesTabProps {
  features: FeatureCategory[];
  initialCount: number;
  vehicle: VehicleDetail;
  specs: VehicleSpecData[];
  historyData: HistoryData;
  vehicleStatus: VehicleStatusData;
  metaBarChipComponents?: VehicleMetaBarChipComponents;
}

const COLUMNS_PER_ROW = 4;

function splitCategoriesIntoRows(categories: FeatureCategory[]): FeatureCategory[][] {
  const rows: FeatureCategory[][] = [];

  for (let i = 0; i < categories.length; i += COLUMNS_PER_ROW) {
    rows.push(categories.slice(i, i + COLUMNS_PER_ROW));
  }

  return rows;
}

function FeatureItem({ text }: { text: string }) {
  return (
    <div className="mb-[var(--spacing-md)] flex w-full items-center">
      <div className="mt-0.5 flex-shrink-0">
        <VectorRightOutlineIcon className="text-[var(--color-states-muted-foreground)]" size={20} />
      </div>
      <span className="ml-[var(--spacing-md)] font-normal text-[length:var(--font-size-sm)] text-[var(--color-core-surface-foreground)] leading-6">
        {text}
      </span>
    </div>
  );
}

export function FeaturesTab({
  features,
  initialCount,
  vehicle,
  specs,
  historyData,
  vehicleStatus,
  metaBarChipComponents,
}: FeaturesTabProps) {
  const [expanded, setExpanded] = useState(features.length > initialCount);
  const visibleCategories = expanded ? features : features.slice(0, initialCount);
  const rows = splitCategoriesIntoRows(visibleCategories);
  const hasExpandableContent = features.length > initialCount;

  return (
    <>
      <VehicleMetaBar
        chipComponents={metaBarChipComponents}
        historyData={historyData}
        specs={specs}
        vehicle={vehicle}
        vehicleStatus={vehicleStatus}
      />

      <div className="mb-[var(--spacing-lg)] flex items-center justify-between md:pr-[var(--spacing-xl)] lg:mb-[var(--spacing-2xl)]">
        <h3 className="font-semibold text-[length:var(--text-xl)] text-[var(--color-core-surface-foreground)] text-body leading-heading md:pl-[var(--spacing-xl)] lg:font-semibold lg:text-[length:var(--font-size-lg)] lg:text-heading">
          Key Features
        </h3>
        {hasExpandableContent ? (
          <Button
            aria-expanded={expanded}
            className={cn(
              "flex items-center justify-center rounded-full border border-[var(--color-actions-tertiary-border)] bg-[var(--color-core-surfaces-background)] px-[var(--spacing-xl)] py-0 text-center font-semibold text-[length:var(--font-size-sm)] text-body hover:bg-transparent hover:text-inherit focus:bg-transparent active:bg-transparent lg:h-10 lg:max-w-50 lg:shrink-0 lg:border lg:border-heading lg:px-[var(--spacing-xl)] lg:py-0 lg:font-semibold lg:text-[length:var(--font-size-sm)] lg:text-heading lg:leading-normal"
            )}
            onClick={() => setExpanded((s) => !s)}
            variant="outline"
          >
            {expanded ? "View Less" : "View All Features"}
          </Button>
        ) : null}
      </div>

      <div className="space-y-4">
        {rows.map((row) => {
          const rowKey = row.map((category) => category.name).join("|");

          return (
            <div className="rounded-[10px] bg-surface px-[32px] py-[30px] shadow-sm" key={rowKey}>
              <div className="grid grid-cols-1 items-start gap-x-[var(--spacing-3xl)] gap-y-[var(--spacing-xl)] md:grid-cols-2 lg:grid-cols-4">
                {row.map((category) => (
                  <div key={`${rowKey}-${category.name}`}>
                    <h4 className="flex min-h-[var(--spacing-sd)] items-center font-semibold text-[length:var(--font-size-sm)] text-heading leading-6">
                      {category.name}
                    </h4>
                    <div className="mt-[var(--spacing-lg)] space-y-3">
                      {category.features.length === 0 ? (
                        <p className="text-[#AAA] text-[13px] italic leading-5">
                          No features listed
                        </p>
                      ) : (
                        category.features.map((feature) => (
                          <FeatureItem key={`${category.name}-${feature}`} text={feature} />
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {rows.length === 0 ? (
          <div className="rounded-[10px] bg-surface px-[32px] py-[30px] shadow-sm">
            <p className="text-[#AAA] text-[13px] italic leading-5">No features listed</p>
          </div>
        ) : null}
      </div>
    </>
  );
}
