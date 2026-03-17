import { Heading } from "@tfs-ucmp/ui";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import {
  ArrowInspectedSectionWrapper,
  BuyingProcess,
  HomeHero,
  VehicleQuickLinksGrid,
  VehicleTypeSelectorWrapper,
} from "~/components/features/landing";
import { MyGarageWrapper } from "~/components/layout/my-garage/my-garagewrapper";

/* -------------------------------------------------------------------------- */
/*  Lazy-load framer-motion components — keeps ~40 KB gzipped out of initial  */
/*  JS bundle. SSR still renders the HTML; only the client JS is deferred.    */
/* -------------------------------------------------------------------------- */
const AnimatedSection = dynamic(() =>
  import("~/components/shared/animated-section").then((mod) => ({
    default: mod.AnimatedSection,
  }))
);

const CustomerJourneyCarousel = dynamic(() =>
  import("~/components/features/landing/customer-journey-carousel/customer-journey-carousel").then(
    (mod) => ({ default: mod.CustomerJourneyCarousel })
  )
);

import knownUserData from "~/data/known-user.json";
import {
  customerPreQualified,
  customerTestDriveScheduled,
  customerTradeInSubmitted,
  getUserInfo,
  redirectToMyGarage,
  showPersonalizedHeroBanner,
} from "~/lib/flags/flags";

export default async function HomePage() {
  // Fetch all independent flags in parallel
  const [shouldShowGarage, userInfo, showPersonalizedBanner] = await Promise.all([
    redirectToMyGarage(),
    getUserInfo(),
    showPersonalizedHeroBanner(),
  ]);

  if (shouldShowGarage) {
    // Render MyGarage content directly on the homepage (SSR)
    // Show username in "Welcome Back" only when showPersonalizedHeroBanner is true
    return (
      <MyGarageWrapper
        knownUserOverrides={{ showCards: false }}
        showUserName={showPersonalizedBanner && userInfo.isAuthenticated}
      />
    );
  }
  const isPreQualified = await customerPreQualified();

  // Only hide sections if user is both authenticated AND prequalified
  const shouldHideSections = userInfo.isAuthenticated && isPreQualified;

  // Default: normal landing page
  const knownUserOverrides = showPersonalizedBanner
    ? {
        ...knownUserData,
        userName: userInfo.firstName, // Use actual user's first name
        showCards: true, // set to true to render cards in known-user hero
        showContinueShopping: true, // set to true to show Continue Shopping button
      }
    : undefined;

  return (
    <div className="bg-[var(--color-core-surfaces-background)]">
      <HomeHero
        knownUser={knownUserOverrides}
        showSearch={!showPersonalizedBanner}
        showStats={true}
        showSubtitle={true}
      />

      {!shouldHideSections && (
        <>
          <Suspense fallback={<VehicleTypeSelectorSkeleton />}>
            <AnimatedSection delay={0.1} staggerChildren>
              <VehicleTypeSelectorWrapper />
            </AnimatedSection>
          </Suspense>
          <AnimatedSection delay={0.1} staggerChildren>
            <BuyingProcess />
          </AnimatedSection>
          <Suspense fallback={<VehicleFinderSkeleton />}>
            <AnimatedSection delay={0.1}>
              <VehicleFinderQuickLinks />
            </AnimatedSection>
          </Suspense>
          <Suspense fallback={<CustomerJourneySkeleton />}>
            <AnimatedSection delay={0.1} staggerChildren>
              <CustomerJourneyCarouselSection isPreQualified={isPreQualified} />
            </AnimatedSection>
          </Suspense>
          <Suspense fallback={<ArrowInspectedSkeleton />}>
            <AnimatedSection delay={0.1}>
              <ArrowInspectedSectionWrapper />
            </AnimatedSection>
          </Suspense>
        </>
      )}
    </div>
  );
}

async function VehicleFinderQuickLinks() {
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

async function CustomerJourneyCarouselSection({ isPreQualified }: { isPreQualified: boolean }) {
  // Fetch remaining flags in parallel (isPreQualified already resolved by parent)
  const [isTestDriveScheduled, isTradeInSubmitted] = await Promise.all([
    customerTestDriveScheduled(),
    customerTradeInSubmitted(),
  ]);

  const promotionFlags = {
    showPrequalifyBanner: !isPreQualified,
    showTestDriveBanner: !isTestDriveScheduled,
    showTradeInBanner: !isTradeInSubmitted,
  };

  // If all journey steps are complete, don't show carousel
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

/* -------------------------------------------------------------------------- */
/*  Suspense skeleton fallbacks — lightweight placeholders to prevent CLS      */
/* -------------------------------------------------------------------------- */

function SkeletonBlock({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-foreground/5 ${className}`} />;
}

/** Vehicle type selector: heading + 2×2 / 4-col grid of type cards */
function VehicleTypeSelectorSkeleton() {
  return (
    <section className="w-full py-(--spacing-2xl) sm:py-(--spacing-3xl) lg:py-(--spacing-4xl)">
      <div className="container mx-auto max-w-(--container-2xl) px-(--spacing-md) sm:px-(--spacing-lg) lg:px-(--spacing-4xl)">
        <SkeletonBlock className="mx-auto mb-(--spacing-lg) h-8 w-48 sm:mb-(--spacing-xl)" />
        <div className="grid grid-cols-2 gap-(--spacing-sm) lg:grid-cols-4">
          <SkeletonBlock className="h-36 sm:h-44" />
          <SkeletonBlock className="h-36 sm:h-44" />
          <SkeletonBlock className="h-36 sm:h-44" />
          <SkeletonBlock className="h-36 sm:h-44" />
        </div>
      </div>
    </section>
  );
}

/** "Find your vehicle" quick‑links: heading + 2×2 / 4-col card grid */
function VehicleFinderSkeleton() {
  return (
    <section className="w-full pt-(--spacing-2xl) sm:pt-(--spacing-3xl) lg:pt-(--spacing-4xl)">
      <div className="container mx-auto max-w-(--container-2xl) px-(--spacing-md) sm:px-(--spacing-lg) lg:px-(--spacing-4xl)">
        <SkeletonBlock className="mx-auto mb-(--spacing-xl) h-8 w-56 sm:mb-10" />
        <div className="mb-(--spacing-lg) grid grid-cols-2 gap-(--spacing-xs) sm:mb-(--spacing-3xl) sm:gap-(--spacing-md) lg:grid-cols-4">
          <SkeletonBlock className="h-40 sm:h-48" />
          <SkeletonBlock className="h-40 sm:h-48" />
          <SkeletonBlock className="h-40 sm:h-48" />
          <SkeletonBlock className="h-40 sm:h-48" />
        </div>
      </div>
    </section>
  );
}

/** Customer journey carousel: single wide strip */
function CustomerJourneySkeleton() {
  return (
    <section className="w-full pb-(--spacing-2xl) sm:pb-(--spacing-3xl) lg:pb-(--spacing-4xl)">
      <div className="container mx-auto max-w-(--container-2xl) px-(--spacing-md) sm:px-(--spacing-lg) lg:px-(--spacing-4xl)">
        <SkeletonBlock className="h-60 w-full sm:h-72" />
      </div>
    </section>
  );
}

/** Arrow‑inspected section: heading + horizontal feature cards */
function ArrowInspectedSkeleton() {
  return (
    <section className="w-full py-(--spacing-2xl) sm:py-(--spacing-3xl) lg:py-(--spacing-4xl)">
      <div className="container mx-auto max-w-(--container-2xl) px-(--spacing-md) sm:px-(--spacing-lg) lg:px-(--spacing-4xl)">
        <SkeletonBlock className="mx-auto mb-(--spacing-xl) h-8 w-64" />
        <SkeletonBlock className="mx-auto mb-(--spacing-md) h-4 w-80" />
        <div className="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2 lg:grid-cols-3">
          <SkeletonBlock className="h-48 sm:h-56" />
          <SkeletonBlock className="h-48 sm:h-56" />
          <SkeletonBlock className="h-48 sm:h-56" />
        </div>
      </div>
    </section>
  );
}
