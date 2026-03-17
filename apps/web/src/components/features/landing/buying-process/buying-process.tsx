import { Heading } from "@tfs-ucmp/ui";
import dynamic from "next/dynamic";
import Image from "next/image";
import { BuyingProcessCard } from "./buying-process-card";

// Lazy-load carousel — mobile-only, uses framer-motion
const BuyingProcessCarousel = dynamic(() =>
  import("./buying-process-carousel").then((mod) => ({
    default: mod.BuyingProcessCarousel,
  }))
);

import config from "./buying-process-config.json";
import type { ProcessStep } from "./types";

const processSteps = config.processSteps as ProcessStep[];

export function BuyingProcess() {
  return (
    <section className="relative min-h-[var(--vh-section-mobile)] w-full overflow-hidden sm:min-h-[var(--vh-section-desktop)]">
      <div className="absolute inset-0">
        <Image
          alt={config.backgroundImages.altText}
          className="h-full w-full object-cover object-[10%_85%] sm:hidden"
          fill
          sizes="100vw"
          src={config.backgroundImages.mobile}
        />
        <Image
          alt={config.backgroundImages.altText}
          className="hidden h-full w-full object-cover object-[15%_90%] sm:block"
          fill
          sizes="100vw"
          src={config.backgroundImages.desktop}
        />
        <div className="absolute inset-0 bg-foreground/40" />
      </div>
      <div className="relative z-10 mx-auto flex h-full min-h-[var(--vh-section-mobile)] max-w-[var(--container-2xl)] flex-col items-center justify-end px-[var(--spacing-md)] pb-[var(--spacing-lg)] sm:min-h-[var(--vh-section-desktop)] sm:px-[var(--spacing-lg)] lg:min-h-[var(--vh-section-desktop)] lg:px-[var(--spacing-4xl)] lg:pb-[var(--spacing-3xl)]">
        <Heading
          className="mb-[var(--spacing-xl)] text-center text-[length:var(--font-size-xl)] text-[var(--color-core-surfaces-background)] md:text-[length:var(--font-size-xl)] lg:mb-[var(--spacing-2xl)] lg:text-[length:var(--font-size-2xl)]"
          level={2}
          weight="semibold"
        >
          {config.heading}
        </Heading>
        {/* Mobile: swipeable carousel, Desktop: 4-card grid — CSS toggle, no JS needed */}
        <div className="w-full sm:hidden">
          <BuyingProcessCarousel steps={processSteps} />
        </div>
        <div className="hidden w-full sm:block">
          <BuyingProcessCard steps={processSteps} />
        </div>
      </div>
    </section>
  );
}
