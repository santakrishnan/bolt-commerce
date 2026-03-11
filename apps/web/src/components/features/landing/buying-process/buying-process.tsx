"use client";

import Image from "next/image";
import { useIsMobile } from "~/hooks";
import { BuyingProcessCard } from "./buying-process-card";
import { BuyingProcessCarousel } from "./buying-process-carousel";
import config from "./buying-process-config.json";
import type { ProcessStep } from "./types";

const processSteps = config.processSteps as ProcessStep[];

export function BuyingProcess() {
  const isMobile = useIsMobile();

  return (
    <section className="relative min-h-[var(--vh-section-mobile)] w-full overflow-hidden sm:min-h-[var(--vh-section-desktop)]">
      <div className="absolute inset-0">
        <Image
          alt={config.backgroundImages.altText}
          className="h-full w-full object-cover object-[10%_85%] sm:hidden"
          fill
          src={config.backgroundImages.mobile}
        />
        <Image
          alt={config.backgroundImages.altText}
          className="hidden h-full w-full object-cover object-[15%_90%] sm:block"
          fill
          src={config.backgroundImages.desktop}
        />
        <div className="absolute inset-0 bg-foreground/40" />
      </div>
      <div className="relative z-10 mx-auto flex h-full min-h-[var(--vh-section-mobile)] max-w-[var(--container-2xl)] flex-col items-center justify-end px-[var(--spacing-md)] pb-[var(--spacing-lg)] sm:min-h-[var(--vh-section-desktop)] sm:px-[var(--spacing-lg)] lg:min-h-[var(--vh-section-desktop)] lg:px-[var(--spacing-4xl)] lg:pb-[var(--spacing-3xl)]">
        <h2 className="mb-[var(--spacing-xl)] text-center font-semibold text-[length:var(--font-size-xl)] text-[var(--color-core-surfaces-background)] lg:mb-[var(--spacing-2xl)] lg:text-[length:var(--font-size-2xl)]">
          {config.heading}
        </h2>
        {isMobile ? (
          <BuyingProcessCarousel steps={processSteps} />
        ) : (
          <BuyingProcessCard steps={processSteps} />
        )}
      </div>
    </section>
  );
}
