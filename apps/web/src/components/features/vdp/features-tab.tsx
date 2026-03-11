"use client";

import { Button, cn, VectorRightOutlineIcon } from "@tfs-ucmp/ui";
import { useState } from "react";
import type { FeatureCategory } from "~/lib/data/vehicle";

interface FeaturesTabProps {
  features: FeatureCategory[];
  initialCount: number;
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

export function FeaturesTab({ features, initialCount }: FeaturesTabProps) {
  const [expanded, setExpanded] = useState(false);
  const visibleCategories = expanded ? features : features.slice(0, initialCount);

  return (
    <>
      <div className="mb-[var(--spacing-lg)] flex items-center justify-between md:pr-[var(--spacing-xl)] lg:mb-[var(--spacing-2xl)]">
        <h3 className="font-semibold text-[length:var(--text-xl)] text-[var(--color-core-surface-foreground)] text-body leading-heading md:pl-[var(--spacing-xl)] lg:font-semibold lg:text-[length:var(--font-size-lg)] lg:text-heading">
          Key Features
        </h3>
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
      </div>

      <div className="rounded-[var(--radius-md)] bg-surface shadow-sm">
        <div className="block p-[var(--spacing-md)] md:grid md:grid-cols-2 md:gap-x-[var(--spacing-3xl)] md:p-[var(--spacing-xl)] lg:grid-cols-4 lg:gap-x-[var(--spacing-3xl)]">
          {visibleCategories.map((category) => (
            <div key={category.name}>
              <h4 className="flex h-[var(--spacing-sd)] items-center font-semibold text-[length:var(--font-size-sm)] text-heading leading-6">
                {category.name}
              </h4>
              <div className="mt-[var(--spacing-lg)] space-y-3">
                {category.features.map((feature) => (
                  <FeatureItem key={feature} text={feature} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
