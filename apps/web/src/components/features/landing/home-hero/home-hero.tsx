import { Suspense } from "react";
import { getVehicleCount } from "~/lib/data";
import type { HomeHeroKnownUserContentProps } from "./home-hero-known-user-content";
import { HomeHeroKnownUserContent } from "./home-hero-known-user-content";
import { HomeHeroSearchWrapper } from "./home-hero-search-wrapper";
import { HomeHeroStatic } from "./home-hero-static";
import { HomeHeroStats } from "./home-hero-stats";
import { HomeHeroTitle } from "./home-hero-title";

interface HomeHeroProps {
  title?: string;
  showSubtitle?: boolean;
  showStats?: boolean;
  showSearch?: boolean;
  heightClassName?: string;
  knownUser?: HomeHeroKnownUserContentProps;
  useLocationBackground?: boolean;
}

async function HomeHeroStatsAsync() {
  const vehicleCount = await getVehicleCount();
  return <HomeHeroStats vehicleCount={vehicleCount} />;
}

function HomeHeroStatsLoading() {
  return (
    <div className="flex h-[var(--spacing-4xl)] items-center justify-center rounded-[var(--radius-lg)] bg-white/10 px-[var(--spacing-xs)] backdrop-blur-sm">
      <div className="h-4 w-32 animate-pulse rounded bg-white/20" />
    </div>
  );
}

export function HomeHero({
  title,
  showSubtitle = true,
  showStats = true,
  showSearch = true,
  heightClassName,
  knownUser,
  useLocationBackground = false,
}: HomeHeroProps) {
  return (
    <section
      className={`relative w-full ${knownUser && !useLocationBackground ? "bg-black lg:bg-transparent" : ""} ${heightClassName || "min-h-screen"}`}
    >
      <HomeHeroStatic isKnownUser={!!knownUser} useLocationBackground={useLocationBackground} />

      <div
        className={`relative z-10 mx-auto flex max-w-[var(--container-2xl)] flex-col px-[var(--spacing-md)] py-[var(--spacing-md)] sm:px-[var(--spacing-lg)] md:justify-between lg:px-[var(--spacing-4xl)] lg:py-[var(--spacing-2xl)] ${heightClassName ? "h-full overflow-hidden" : "min-h-screen"}`}
      >
        {knownUser ? (
          <div className={`w-full ${heightClassName ? "mt-auto" : "mt-[50vh] md:mt-auto"}`}>
            <HomeHeroKnownUserContent {...knownUser} />
            {showSearch && (
              <div className="mt-[var(--spacing-xs)] lg:mt-[var(--spacing-md)]">
                <HomeHeroSearchWrapper />
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="mt-auto flex max-h-[45vh] flex-col justify-end space-y-4 md:mt-auto md:max-h-none lg:w-180 lg:flex-1 lg:justify-center lg:space-y-8 lg:pt-[var(--spacing-xl)]">
              <HomeHeroTitle
                className={showStats ? "" : "text-[var(--font-size-10)]! leading-[48px]!"}
                showSubtitle={showSubtitle}
                title={title}
              />
              {showSearch && <HomeHeroSearchWrapper />}
            </div>

            {showStats && (
              <div className="mt-6 flex justify-center lg:absolute lg:inset-x-0 lg:bottom-[var(--spacing-md)] lg:mt-0">
                <Suspense fallback={<HomeHeroStatsLoading />}>
                  <HomeHeroStatsAsync />
                </Suspense>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
