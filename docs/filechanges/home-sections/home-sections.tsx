import { customerTestDriveScheduled, customerTradeInSubmitted } from "@config/flags/flags";
import { VehicleQuickLinksGrid } from "@features/landing";
import { Heading } from "@tfs-ucmp/ui";
import dynamic from "next/dynamic";

const CustomerJourneyCarousel = dynamic(() =>
  import("@features/landing/components/customer-journey-carousel/customer-journey-carousel").then(
    (mod) => ({ default: mod.CustomerJourneyCarousel })
  )
);

/** Heading + quick-links grid for the "Find your vehicle" section. */
export function VehicleFinderQuickLinks() {
  return (
    <section className="w-full bg-[var(--color-core-surfaces-background)] pt-[var(--spacing-2xl)] sm:pt-[var(--spacing-3xl)] lg:pt-[var(--spacing-4xl)]">
      <div className="container mx-auto max-w-[var(--container-2xl)] px-[var(--spacing-md)] sm:px-[var(--spacing-lg)] lg:px-[var(--spacing-4xl)]">
        <Heading
          className="mb-[var(--spacing-xl)] text-center text-[length:var(--text-xl)] sm:mb-[var(--spacing-10)] md:text-[length:var(--text-xl)] lg:text-[length:var(--text-2xl)]"
          level={1}
          weight="semibold"
        >
          Find your vehicle
        </Heading>
        <VehicleQuickLinksGrid className="mb-[var(--spacing-lg)] sm:mb-[var(--spacing-3xl)]" />
      </div>
    </section>
  );
}

/** Fetches remaining journey flags and renders the carousel if any steps are incomplete. */
export async function CustomerJourneyCarouselSection({
  isPreQualified,
}: {
  isPreQualified: boolean;
}) {
  const [isTestDriveScheduled, isTradeInSubmitted] = await Promise.all([
    customerTestDriveScheduled(),
    customerTradeInSubmitted(),
  ]);

  const promotionFlags = {
    showPrequalifyBanner: !isPreQualified,
    showTestDriveBanner: !isTestDriveScheduled,
    showTradeInBanner: !isTradeInSubmitted,
  };

  if (
    !(
      promotionFlags.showPrequalifyBanner ||
      promotionFlags.showTestDriveBanner ||
      promotionFlags.showTradeInBanner
    )
  ) {
    return null;
  }

  return (
    <section className="w-full bg-[var(--color-core-surfaces-background)] pb-[var(--spacing-2xl)] sm:pb-[var(--spacing-3xl)] lg:pb-[var(--spacing-4xl)]">
      <div className="container mx-auto max-w-[var(--container-2xl)] px-[var(--spacing-md)] sm:px-[var(--spacing-lg)] lg:px-[var(--spacing-4xl)]">
        <CustomerJourneyCarousel flags={promotionFlags} />
      </div>
    </section>
  );
}
