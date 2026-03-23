import {
  customerPreQualified,
  getUserInfo,
  redirectToMyGarage,
  showPersonalizedHeroBanner,
} from "@config/flags/flags";
import {
  ArrowInspectedSectionWrapper,
  ArrowInspectedSkeleton,
  BuyingProcess,
  CustomerJourneyCarouselSection,
  CustomerJourneySkeleton,
  HomeHero,
  VehicleFinderQuickLinks,
  VehicleFinderSkeleton,
  VehicleTypeSelectorSkeleton,
  VehicleTypeSelectorWrapper,
} from "@features/landing";
import { MyGarageWrapper } from "@features/my-garage";
import knownUserData from "@shared/data/known-user.json";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const AnimatedSection = dynamic(() =>
  import("@shared/components/animated-section").then((mod) => ({
    default: mod.AnimatedSection,
  }))
);

/**
 * Sync shell rendered as the PPR static fallback — what users see instantly
 * before any dynamic data (flags, cookies) resolves. Matches the default
 * anonymous-user view: hero with search bar + skeleton placeholders for
 * every async section below the fold. BuyingProcess is included as real
 * content since it's fully sync (reads static JSON).
 */
function HomePageShell() {
  return (
    <div className="bg-[var(--color-core-surfaces-background)]">
      <HomeHero showSearch={true} showStats={true} showSubtitle={true} />
      <VehicleTypeSelectorSkeleton />
      <BuyingProcess />
      <VehicleFinderSkeleton />
      <CustomerJourneySkeleton />
      <ArrowInspectedSkeleton />
    </div>
  );
}

/**
 * Page export is sync so the Suspense fallback (HomePageShell) is reachable
 * during prerender. The async flag-reading logic lives in HomePageContent,
 * which streams in once cookies() resolves.
 */
export default function HomePage() {
  return (
    <Suspense fallback={<HomePageShell />}>
      <HomePageContent />
    </Suspense>
  );
}

/**
 * Async component that reads feature flags (via cookies) and renders
 * the appropriate variant: garage view, personalized hero, or default
 * landing page with individually-streamed sections.
 */
async function HomePageContent() {
  const [shouldShowGarage, userInfo, showPersonalizedBanner, isPreQualified] = await Promise.all([
    redirectToMyGarage(),
    getUserInfo(),
    showPersonalizedHeroBanner(),
    customerPreQualified(),
  ]);

  if (shouldShowGarage) {
    return (
      <MyGarageWrapper
        knownUserOverrides={{ showCards: false }}
        showUserName={showPersonalizedBanner && userInfo.isAuthenticated}
      />
    );
  }

  const shouldHideSections = userInfo.isAuthenticated && isPreQualified;

  const knownUserOverrides = showPersonalizedBanner
    ? {
        ...knownUserData,
        userName: userInfo.firstName,
        showCards: true,
        showContinueShopping: true,
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
