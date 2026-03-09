import Image from "next/image";
import { BuyingProcessCarousel } from "./buying-process-carousel";

const processSteps = [
  {
    icon: "refresh" as const,
    title: "Fast & Simple Process",
    description: "From browsing to booking a test drive, everything is seamless and quick.",
    linkText: "Find Out More",
    linkHref: "/used-cars",
  },
  {
    icon: "search" as const,
    title: "Transparent from the Start",
    description: "Clear pricing, no hidden fees. See the full breakdown before you commit.",
    linkText: "Find Out More",
    linkHref: "/used-cars",
  },
  {
    icon: "shield" as const,
    title: "Inspected by Toyota",
    description: "Backed by our rigorous 160-point quality standards and decades of expertise.",
    linkText: "Find Out More",
    linkHref: "/used-cars",
  },
  {
    icon: "clipboard" as const,
    title: "Buy with Confidence",
    description: "Every listing includes a detailed condition report and full history.",
    linkText: "Find Out More",
    linkHref: "/used-cars",
  },
];

export function BuyingProcess() {
  return (
    <section className="relative h-[680px] w-full overflow-hidden lg:h-[820px] lg:min-h-screen">
      <div className="absolute inset-0">
        <Image
          alt="Family with car"
          className="h-full w-full object-cover object-[10%_85%] sm:hidden"
          fill
          priority
          src="/images/buying-process/buying_process_mobile.png"
        />
        <Image
          alt="Family with car"
          className="hidden h-full w-full object-cover object-[15%_90%] sm:block"
          fill
          priority
          src="/images/buying-process/buying-process-bg.png"
        />
        <div className="absolute inset-0 bg-foreground/40" />
      </div>
      <div className="relative z-10 mx-auto flex h-full max-w-[var(--container-2xl)] flex-col items-center justify-end px-[var(--spacing-md)] pb-[var(--spacing-lg)] sm:px-[var(--spacing-lg)] lg:px-[var(--spacing-4xl)] lg:pb-[var(--spacing-3xl)]">
        <h2 className="mb-[var(--spacing-xl)] text-center font-semibold text-[length:var(--font-size-xl)] text-[var(--color-core-surfaces-background)] lg:mb-[var(--spacing-2xl)] lg:text-[length:var(--font-size-2xl)]">
          How to buy your next Toyota
        </h2>
        <BuyingProcessCarousel steps={processSteps} />
      </div>
    </section>
  );
}
