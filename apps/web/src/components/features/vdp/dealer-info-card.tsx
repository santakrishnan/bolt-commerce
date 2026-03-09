"use client";

import { Button, Card, CardContent, cn, StarIcon } from "@tfs-ucmp/ui";
import Image from "next/image";
import type { DealerInfo } from "../../../lib/data/dealer/dealer-data";

interface DealerInfoCardProps {
  dealer: DealerInfo;
  onReviewsClick?: () => void;
  onTestDriveClick?: () => void;
  className?: string;
}

export function DealerInfoCard({
  dealer,
  onReviewsClick,
  onTestDriveClick,
  className,
}: DealerInfoCardProps) {
  return (
    <Card
      className={cn(
        "w-full rounded-none border-0 bg-[var(--color-core-surfaces-card)] py-[var(--spacing-10)] shadow-none lg:py-[var(--spacing-4xl)]",
        className
      )}
    >
      {/* Outer container for centering */}
      <div className="flex w-full justify-center">
        {/* Inner container with fixed dimensions for large screens */}
        <div className="flex w-full max-w-[1280px] flex-col gap-[var(--spacing-lg)] lg:h-[400px] lg:flex-row lg:gap-[clamp(62px,8.6vw,124px)]">
          {/* Dealership Image */}
          <div className="w-full px-0 lg:h-full lg:min-w-0 lg:flex-[3] lg:px-0">
            <div className="relative aspect-[4/3] h-full w-full overflow-hidden rounded-xl lg:aspect-[2/1]">
              {/* Placeholder shown if image fails to load */}
              <div className="absolute inset-0 z-0 flex items-center justify-center">
                <svg
                  aria-hidden="true"
                  className="h-24 w-24"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                  />
                </svg>
              </div>
              <Image
                alt={dealer.name}
                className="relative z-10 object-cover"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                src={dealer.dealershipImage}
              />
            </div>
          </div>

          {/* Dealer Information */}
          <CardContent className="flex w-full flex-col items-start justify-center space-y-4 px-0 pb-[var(--spacing-xl)] lg:min-w-0 lg:flex-[1] lg:space-y-4 lg:p-0">
            {/* Dealer Name */}
            <h3 className="mb-[var(--spacing-xl)] font-bold text-[length:var(--font-size-xl)] text-[var(--color-core-surfaces-foreground)] lg:text-[length:var(--font-size-lg)]">
              {dealer.name}
            </h3>

            {/* Location */}
            <div className="flex items-start gap-[var(--spacing-xs)]">
              <Image
                alt=""
                aria-hidden="true"
                className="mt-0.5 h-5 w-5 flex-shrink-0"
                height={20}
                src="/images/vdp/Dealer-location.svg"
                width={20}
              />
              <span className="text-[length:var(--font-size-md)] text-[var(--color-states-muted-foreground)]">
                {dealer.address}
              </span>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-[var(--spacing-xs)]">
              <Image
                alt=""
                aria-hidden="true"
                className="h-5 w-5 flex-shrink-0"
                height={20}
                src="/images/vdp/Dealer-phone.svg"
                width={20}
              />
              <a
                className="text-[length:var(--font-size-md)] text-[var(--color-states-muted-foreground)]"
                href={`tel:${dealer.phone}`}
              >
                {dealer.phone}
              </a>
            </div>

            {/* Hours */}
            <div className="flex items-center gap-[var(--spacing-xs)]">
              <Image
                alt=""
                aria-hidden="true"
                className="h-5 w-5 flex-shrink-0"
                height={20}
                src="/images/vdp/Dealer-clock.svg"
                width={20}
              />
              <span className="text-[length:var(--font-size-md)] text-[var(--color-states-muted-foreground)]">
                {dealer.hours}
              </span>
            </div>

            {/* Rating */}
            <div className="mb-0 flex items-center gap-[var(--spacing-xs)]">
              <span className="font-semibold text-[length:var(--font-size-md)] text-[var(--color-core-surfaces-foreground)]">
                {dealer.rating.toFixed(1)}
              </span>
              <div
                aria-label={`${dealer.rating.toFixed(1)} out of 5 stars`}
                className="flex gap-0.5"
                role="img"
              >
                {[1, 2, 3, 4, 5].map((i) => (
                  <StarIcon
                    className={`h-[calc(var(--spacing-sm)*1.5)] w-[calc(var(--spacing-sm)*1.5)] ${
                      i <= Math.round(dealer.rating) ? "text-black" : "text-gray-300"
                    }`}
                    fill={i <= Math.round(dealer.rating) ? "currentColor" : "none"}
                    key={i}
                    size={18}
                  />
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex w-full flex-col gap-[var(--spacing-xs)] pt-[var(--spacing-xl)]">
              <Button
                className={cn(
                  "w-full rounded-full bg-[var(--color-actions-secondary)] px-[var(--spacing-xl)] py-0 text-[var(--color-actions-secondary-foreground)]"
                )}
                onClick={onReviewsClick}
                size="default"
              >
                View Reviews
              </Button>
              <Button
                className={cn(
                  "w-full rounded-full border-[var(--color-actions-tertiary-border)] bg-[var(--color-actions-secondary-foreground)] px-[var(--spacing-xl)] py-0 text-[var(--color-actions-tertiary-foreground)]"
                )}
                onClick={onTestDriveClick}
                size="default"
                variant="outline"
              >
                Schedule a Test Drive
              </Button>
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  );
}
