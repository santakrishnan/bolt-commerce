"use client";

import { AppButton } from "~/components/shared/button";
import Image from "next/image";

export const CardTestDrive = () => {
  return (
    <div className="flex flex-col gap-[var(--spacing-md)] border-[color:var(--color-structure-interaction-subtle-border)]">
      <div className="center flex gap-[var(--spacing-md)]">
        <div className="flex items-center justify-center">
          <Image
            alt="Toyota logo"
            className="h-[var(--size-avatar-sm)] w-[var(--size-avatar-sm)]"
            height={32}
            src="/images/vdp/Toyota-logo.svg"
            width={32}
          />
        </div>
        <div className="flex flex-1 flex-col gap-[calc(var(--spacing-5)/2)]">
          <p className="font-[var(--font-weight-semibold)] text-[length:var(--text-sm)] text-[var(--color-text-primary)] leading-[130%] tracking-[var(--tracking-tight)]">
            Schedule a Test drive today.
          </p>
          <div className="flex w-full items-center justify-between">
            <p className="flex font-[var(--font-weight-normal)] text-[length:var(--text-xs)] text-[var(--color-body-muted)] leading-normal">
              See It In Person. Schedule a test drive at Toyota of Fort Worth.
            </p>
            <div className="flex shrink-0 items-center gap-[var(--spacing-2xs)]">
              <Image
                alt="Location"
                className="h-[var(--spacing-sm)] w-[var(--spacing-sm)]"
                height={12}
                src="/images/garage/location.svg"
                width={12}
              />
              <p className="font-[var(--font-weight-normal)] text-[length:var(--text-xs)] text-[var(--color-body-muted)] leading-normal">
                6 mi
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[var(--color-surface)] pb-[var(--spacing-5)] lg:block lg:pb-0">
        <AppButton variant="tertiary" size="md" className="w-full">
          Book an Appointment
        </AppButton>
      </div>
    </div>
  );
};
