import { HomeHero } from "~/components/features/landing";
import { VehicleQuickLinksGrid } from "~/components/features/landing/vehicle-quick-links";
import { MyGarageClient } from "~/components/layout/my-garage/my-garageclient";
import { customerPreQualified, customerTradeInSubmitted, getUserInfo } from "~/lib/flags/flags";
import { fetchGarageCars } from "~/lib/my-garage/fetch-garage-cars";

export async function MyGarageWrapper({
  showUserName = false,
  knownUserOverrides,
}: {
  showUserName?: boolean;
  knownUserOverrides?: { showCards?: boolean };
} = {}) {
  const cars = await fetchGarageCars();
  const userInfo = await getUserInfo();
  const userName = userInfo.firstName.toUpperCase();

  // Get feature flags to determine which card variations to show
  const isPreQualified = await customerPreQualified();
  const hasTradeInSubmitted = await customerTradeInSubmitted();

  // Default days remaining for prequalification offer
  const daysRemaining = 27;

  // Always provide knownUser so HomeHero uses the correct known-user background
  // image and layout. showCards defaults to false unless overridden by the caller.
  const knownUser: Parameters<typeof HomeHero>[0]["knownUser"] = {
    userName: showUserName ? userName : "",
    showCards: false,
    showSubtitle: false,
    ...knownUserOverrides,
  };

  return (
    <>
      <HomeHero
        heightClassName="h-[422px] lg:h-87.5"
        knownUser={knownUser}
        showSearch={true}
        showStats={false}
        showSubtitle={false}
        title={showUserName ? `WELCOME BACK ${userName}!` : "WELCOME BACK!"}
        useLocationBackground={true}
      />
      <MyGarageClient
        cars={cars}
        daysRemaining={daysRemaining}
        hasTradeInSubmitted={hasTradeInSubmitted}
        isPreQualified={isPreQualified}
      >
        <section className="w-full bg-transparent py-[var(--spacing-2xl)] sm:py-[var(--spacing-3xl)] lg:py-[var(--spacing-4xl)]">
          <div className="container mx-auto max-w-[var(--container-2xl)] px-[var(--spacing-md)] sm:px-[var(--spacing-lg)] lg:px-[var(--spacing-4xl)]">
            <h2 className="mb-[var(--spacing-xl)] text-center font-semibold text-[length:var(--text-xl)] sm:mb-[var(--spacing-10)] lg:text-[length:var(--text-2xl)]">
              Find your vehicle
            </h2>
            <VehicleQuickLinksGrid cardBackgroundColor="bg-white" />
          </div>
        </section>
      </MyGarageClient>
    </>
  );
}
