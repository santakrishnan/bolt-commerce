/* -------------------------------------------------------------------------- */
/*  Suspense skeleton fallbacks for the homepage — lightweight placeholders   */
/*  that prevent CLS while async sections stream in.                         */
/* -------------------------------------------------------------------------- */

function SkeletonBlock({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-foreground/5 ${className}`} />;
}

/** Vehicle type selector: heading + 2×2 / 4-col grid of type cards */
export function VehicleTypeSelectorSkeleton() {
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
export function VehicleFinderSkeleton() {
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
export function CustomerJourneySkeleton() {
  return (
    <section className="w-full pb-(--spacing-2xl) sm:pb-(--spacing-3xl) lg:pb-(--spacing-4xl)">
      <div className="container mx-auto max-w-(--container-2xl) px-(--spacing-md) sm:px-(--spacing-lg) lg:px-(--spacing-4xl)">
        <SkeletonBlock className="h-60 w-full sm:h-72" />
      </div>
    </section>
  );
}

/** Arrow‑inspected section: heading + horizontal feature cards */
export function ArrowInspectedSkeleton() {
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
