import {
  ArrowInspectedSectionWrapper,
  BuyingProcess,
  CustomerJourneyCarousel,
  HomeHero,
  VehicleQuickLinksGrid,
  VehicleTypeSelectorWrapper,
} from "~/components/features/landing";
import { MyGarageWrapper } from "~/components/layout/my-garage/my-garagewrapper";
import { AnimatedSection } from "~/components/shared/animated-section";
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
  // Check if user should see MyGarage content (server-side flag logic)
  const shouldShowGarage = await redirectToMyGarage();
  const userInfo = await getUserInfo();

  if (shouldShowGarage) {
    // Render MyGarage content directly on the homepage (SSR)
    // For authenticated users: show their name
    // For unauthenticated users: hide name but still show cards
    return (
      <MyGarageWrapper
        knownUserOverrides={{ showCards: false }}
        showUserName={userInfo.isAuthenticated}
      />
    );
  }

  // Fetch feature flags using Vercel Flags SDK
  // showPersonalizedHeroBanner: true = show "Welcome Back" personalized hero
  const showPersonalizedBanner = await showPersonalizedHeroBanner();
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
      <AnimatedSection staggerChildren>
        <HomeHero
          knownUser={knownUserOverrides}
          showSearch={!showPersonalizedBanner}
          showStats={true}
          showSubtitle={true}
        />
      </AnimatedSection>
      {!shouldHideSections && (
        <>
          <AnimatedSection delay={0.1} staggerChildren>
            <VehicleTypeSelectorWrapper />
          </AnimatedSection>
          <AnimatedSection delay={0.1} staggerChildren>
            <BuyingProcess />
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <VehicleFinderQuickLinks />
          </AnimatedSection>
          <AnimatedSection delay={0.1} staggerChildren>
            <CustomerJourneyCarouselSection />
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <ArrowInspectedSectionWrapper />
          </AnimatedSection>
        </>
      )}
    </div>
  );
}

async function VehicleFinderQuickLinks() {
  return (
    <section className="w-full bg-[var(--color-core-surfaces-background)] pt-[var(--spacing-2xl)] sm:pt-[var(--spacing-3xl)] lg:pt-[var(--spacing-4xl)]">
      <div className="container mx-auto max-w-[var(--container-2xl)] px-[var(--spacing-md)] sm:px-[var(--spacing-lg)] lg:px-[var(--spacing-4xl)]">
        <h2 className="mb-[var(--spacing-xl)] text-center font-semibold text-[length:var(--text-xl)] sm:mb-[var(--spacing-10)] lg:text-[length:var(--text-2xl)]">
          Find your vehicle
        </h2>
        <VehicleQuickLinksGrid className="mb-[var(--spacing-lg)] sm:mb-[var(--spacing-3xl)]" />
      </div>
    </section>
  );
}

async function CustomerJourneyCarouselSection() {
  const promotionFlags = {
    showPrequalifyBanner: !(await customerPreQualified()),
    showTestDriveBanner: !(await customerTestDriveScheduled()),
    showTradeInBanner: !(await customerTradeInSubmitted()),
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
