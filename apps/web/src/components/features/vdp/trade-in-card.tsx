"use client";

import { AppButton } from "~/components/shared/button";
import Image from "next/image";

export const CardTradeIn = () => {
  return (
    <div className="flex flex-col gap-[var(--spacing-md)] border-[color:var(--color-structure-interaction-subtle-border)]">
      <div className="center flex gap-[var(--spacing-md)]">
        <div className="flex items-center justify-center">
          <Image
            alt="Arrow inspected icon"
            className="h-[var(--size-avatar-sm)] w-[var(--size-avatar-sm)]"
            height={32}
            src="/images/vdp/Trade.svg"
            width={32}
          />
        </div>
        <div className="flex flex-col gap-[calc(var(--spacing-5)/2)]">
          <p className="font-[var(--font-weight-semibold)] text-[length:var(--text-sm)] text-[var(--color-text-primary)] leading-[130%] tracking-[var(--tracking-tight)]">
            What's Your Trade-In Value?
          </p>
          <p className="font-[var(--font-weight-normal)] text-[length:var(--text-xs)] text-[var(--color-body-muted)] leading-normal">
            Get a free estimate in minutes and apply it toward your next vehicle.
          </p>
        </div>
      </div>
      <div className="bg-[var(--color-surface)] pb-[var(--spacing-5)] lg:block lg:pb-0">
        <AppButton variant="secondary" size="md" className="w-full">
          Accept My Trade-In Offer
        </AppButton>
      </div>
    </div>
  );
};
