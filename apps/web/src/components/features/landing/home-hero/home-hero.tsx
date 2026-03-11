import { cn } from "@tfs-ucmp/ui";
import type React from "react";
import { Suspense } from "react";
import { fetchHeroStats } from "~/services/landing";
import { HomeHeroKnownUserContent } from "./home-hero-known-user-content";
import { HomeHeroSearch } from "./home-hero-search";
import { HomeHeroStatic } from "./home-hero-static";
import { HomeHeroStats } from "./home-hero-stats";
import { HomeHeroTitle } from "./home-hero-title";
import type { HomeHeroProps } from "./types";

async function HomeHeroStatsAsync(): Promise<React.JSX.Element> {
  const stats = await fetchHeroStats();
  return <HomeHeroStats stats={stats} />;
}

function HomeHeroStatsLoading(): React.JSX.Element {
  return (
    <div className="flex h-[var(--spacing-4xl)] items-center justify-center rounded-[var(--radius-lg)] bg-[var(--color-surface)]/10 px-[var(--spacing-xs)] backdrop-blur-sm">
      <div className="h-4 w-32 animate-pulse rounded bg-[var(--color-surface)]/20" />
    </div>
  );
}

export function HomeHero({
  title,
  subtitle,
  showSubtitle = true,
  showStats = true,
  showSearch = true,
  heightClassName,
  knownUser,
  useLocationBackground = false,
}: HomeHeroProps) {
  // Use full viewport height since header is transparent/overlaid on home page
  const defaultHeightClass = "min-h-[var(--vh-full)]";

  return (
    <section
      className={cn(
        "relative w-full",
        knownUser &&
          !useLocationBackground &&
          "bg-[var(--color-inverse-background)] lg:bg-transparent",
        heightClassName || defaultHeightClass
      )}
    >
      <HomeHeroStatic isKnownUser={!!knownUser} useLocationBackground={useLocationBackground} />

      <div
        className={cn(
          "relative z-10 mx-auto flex max-w-[var(--container-2xl)] flex-col px-[var(--spacing-md)] py-[var(--spacing-md)] sm:px-[var(--spacing-lg)] md:justify-between lg:px-[var(--spacing-4xl)] lg:py-[var(--spacing-2xl)]",
          heightClassName ? "h-full overflow-hidden" : defaultHeightClass
        )}
      >
        {knownUser ? (
          <div
            className={cn(
              "w-full",
              heightClassName ? "mt-auto" : "mt-[var(--spacing-5xl)] md:mt-auto"
            )}
          >
            <HomeHeroKnownUserContent {...knownUser} />
            {showSearch && (
              <div className="mt-[var(--spacing-xs)] lg:mt-[var(--spacing-md)]">
                <HomeHeroSearch />
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="mt-auto flex max-h-[45vh] flex-col justify-end space-y-[var(--spacing-md)] md:mt-auto md:max-h-none lg:flex-1 lg:justify-center lg:pt-[var(--spacing-xl)]">
              <HomeHeroTitle
                className={showStats ? "" : "text-[length:var(--font-size-10)] leading-[48px]"}
                showSubtitle={showSubtitle}
                subtitle={subtitle}
                title={title}
              />
              {showSearch && <HomeHeroSearch />}
            </div>

            {showStats && (
              <div className="mt-[var(--spacing-lg)] flex justify-center lg:absolute lg:inset-x-0 lg:bottom-[var(--spacing-md)] lg:mt-0">
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
