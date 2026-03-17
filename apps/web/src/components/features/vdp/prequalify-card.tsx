"use client";

import { AppButton } from "~/components/shared/button";
import Image from "next/image";

export const CardPrequalify = () => {
  return (
    <div className="flex flex-col gap-[var(--spacing-md)] border-[color:var(--color-structure-interaction-subtle-border)]">
      <div className="center flex gap-[var(--spacing-md)]">
        <div className="flex items-center justify-center">
          <Image
            alt="Arrow inspected icon"
            className="h-[var(--size-avatar-sm)] w-[var(--size-avatar-sm)]"
            height={32}
            src="/images/vdp/Inspected-red.svg"
            width={32}
          />
        </div>
        <div className="flex flex-col gap-[calc(var(--spacing-5)/2)]">
          <p className="font-[var(--font-weight-semibold)] text-[length:var(--text-sm)] text-[var(--color-text-primary)] leading-[130%] tracking-[var(--tracking-tight)]">
            Know Your Buying Power
          </p>
          <p className="font-[var(--font-weight-normal)] text-[length:var(--text-xs)] text-[var(--color-body-muted)] leading-normal">
            Get pre-qualified without any impact to your credit
          </p>
        </div>
      </div>
      <div className="bg-[var(--color-surface)] pb-[var(--spacing-5)] lg:block lg:pb-0">
        <AppButton variant="primary" size="md" className="w-full">
          Get started
        </AppButton>
      </div>
    </div>
  );
};
