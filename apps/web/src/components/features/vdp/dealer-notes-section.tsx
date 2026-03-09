"use client";

import { Card, cn } from "@tfs-ucmp/ui";
import Image from "next/image";
import type { DealerNotes } from "../../../lib/data/dealer/dealer-data";
import { sampleDealerNotes } from "../../../lib/data/dealer/dealer-data";

interface DealerNotesSectionProps {
  data?: DealerNotes;
}

export function DealerNotesSection({ data = sampleDealerNotes }: DealerNotesSectionProps) {
  return (
    <section className="w-full">
      <Card
        className={cn(
          "w-full border-0 bg-[var(--color-core-surfaces-card)] shadow-none lg:h-[320px] lg:rounded-[var(--radius-md)]"
        )}
      >
        <div className="flex h-full flex-col gap-[var(--spacing-md)] p-[var(--spacing-lg)] pb-[var(--spacing-xl)] lg:flex-row lg:items-center lg:gap-[var(--spacing-3xl)] lg:p-[var(--spacing-xl)]">
          {/* Text Content */}
          <div className="flex-1">
            <h2 className="font-semibold text-[length:var(--font-size-lg)] text-[var(--color-core-surfaces-foreground)] lg:mb-[var(--spacing-xl)]">
              Dealer Notes
            </h2>
            <p className="font-normal text-[length:var(--font-size-sm)] text-[var(--color-states-muted-foreground)] leading-relaxed lg:text-[length:var(--font-size-md)]">
              {data.vehicleDescription}
            </p>
          </div>

          {/* Vehicle Image */}
          <div className="flex-shrink-0 lg:w-64">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-md lg:aspect-[4/3]">
              {/* Placeholder shown if image fails to load */}
              <div className="absolute inset-0 z-0 flex items-center justify-center">
                <svg
                  aria-hidden="true"
                  className="h-[var(--spacing-3xl)] w-[var(--spacing-3xl)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                  />
                </svg>
              </div>
              <Image
                alt="Vehicle"
                className="relative z-10 object-cover"
                fill
                sizes="(max-width: 1024px) 100vw, 256px"
                src={data.vehicleImage}
              />
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}
