"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  Button,
  cn,
  VectorRightOutlineIcon,
} from "@tfs-ucmp/ui";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import type { FeatureCategory } from "~/lib/data/vehicle";

interface FeaturesTabProps {
  features: FeatureCategory[];
  initialCount: number;
}

export function FeaturesTab({ features, initialCount }: FeaturesTabProps) {
  const [showAll, setShowAll] = useState(false);
  const [openCategories, setOpenCategories] = useState<string[]>([]);

  const visibleCategories = showAll ? features : features.slice(0, initialCount);

  const expandAll = () => setOpenCategories(visibleCategories.map((c) => c.name));
  const collapseAll = () => setOpenCategories([]);
  const allOpen =
    visibleCategories.length > 0 && visibleCategories.every((c) => openCategories.includes(c.name));

  return (
    <div className="rounded-lg">
      <div className="mb-[var(--spacing-lg)] flex items-center justify-between md:pr-[var(--spacing-xl)] lg:mb-[var(--spacing-2xl)]">
        <h3 className="font-semibold text-[length:var(--text-xl)] text-body leading-heading md:px-[var(--spacing-xl)] lg:font-semibold lg:text-[length:var(--font-size-lg)] lg:text-heading lg:leading-heading">
          Key Features
        </h3>
        {!showAll && features.length > initialCount && (
          <Button
            className={cn(
              "flex items-center justify-center gap-0 rounded-full border border-[var(--color-actions-tertiary-border)] bg-[var(--color-core-surfaces-background)] px-[var(--spacing-xl)] py-0 text-center font-semibold text-[length:var(--font-size-sm)] text-body hover:bg-background lg:h-10 lg:max-w-50 lg:shrink-0 lg:border lg:border-heading lg:px-[var(--spacing-xl)] lg:font-semibold lg:text-[length:var(--font-size-sm)] lg:text-heading lg:leading-normal"
            )}
            onClick={() => setShowAll(true)}
            variant="outline"
          >
            View All Features
          </Button>
        )}
      </div>

      <div className="rounded-lg bg-surface px-[var(--spacing-lg)] py-[var(--spacing-lg)] lg:px-[var(--spacing-xl)] lg:py-[var(--spacing-xl)]">
        <div className="mb-4 flex justify-end">
          <Button
            className={cn(
              "h-auto px-0 py-0 font-medium text-[color:var(--color-brand-text)] text-[length:var(--font-size-xs)]"
            )}
            onClick={() => (allOpen ? collapseAll() : expandAll())}
            type="button"
            variant="ghost"
          >
            {allOpen ? "Collapse All" : "Expand All"}
          </Button>
        </div>

        <Accordion
          className="w-full space-y-2"
          onValueChange={setOpenCategories}
          type="multiple"
          value={openCategories}
        >
          <AnimatePresence initial={false}>
            {visibleCategories.map((category: FeatureCategory, index: number) => {
              const isOpen = openCategories.includes(category.name);
              return (
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  initial={{ opacity: 0, y: 4 }}
                  key={category.name}
                  transition={{ delay: index * 0.03 }}
                >
                  <AccordionItem
                    className={cn(
                      "overflow-hidden rounded-lg border",
                      isOpen
                        ? "border-[var(--color-brand-border-light)] bg-[var(--color-brand-surface)]"
                        : "border-[var(--color-brand-border-light)] bg-[var(--color-core-surfaces-card)]"
                    )}
                    value={category.name}
                  >
                    <AccordionTrigger
                      className={cn(
                        "flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-[var(--color-structure-interaction-inverse-decorative)] hover:no-underline"
                      )}
                    >
                      <div className="flex items-center gap-[var(--spacing-sm)]">
                        <span className="font-semibold text-[color:var(--color-brand-text)]">
                          {category.name}
                        </span>
                        <Badge
                          className={cn(
                            "rounded-full border-transparent bg-[var(--color-actions-secondary)] px-2 py-0.5 text-[color:var(--color-primary-foreground)] text-[length:var(--font-size-xs)] shadow-sm"
                          )}
                          variant="secondary"
                        >
                          {category.features.length}
                        </Badge>
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className="px-0 pb-0">
                      <div className="grid grid-cols-1 gap-[var(--spacing-sm)] px-4 pb-4 md:grid-cols-2 lg:grid-cols-3">
                        {category.features.map((feature: string) => (
                          <div
                            className="flex items-start gap-[var(--spacing-md)] px-0 py-[var(--spacing-sm)]"
                            key={feature}
                          >
                            <div className="mt-0.5 shrink-0">
                              <VectorRightOutlineIcon
                                className="text-[color:var(--color-brand-text)]"
                                size={20}
                              />
                            </div>
                            <span className="text-start font-normal text-[length:var(--font-size-sm)] text-body leading-6">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </Accordion>
      </div>
    </div>
  );
}
