import { Button, StarIcon } from "@tfs-ucmp/ui";

interface RatingDistribution {
  stars: number;
  count: number;
  id: string;
}

interface VehicleRatingProps {
  title: string;
  rating: number;
  reviewCount: number;
  distribution: RatingDistribution[];
}

export function VehicleRating({ title, rating, reviewCount, distribution }: VehicleRatingProps) {
  // Find max count for bar scaling
  const maxCount = 500;
  return (
    <div className="flex w-full flex-col gap-[var(--spacing-10)] p-[var(--spacing-lg)] lg:flex-row lg:items-center lg:gap-[var(--spacing-xs)]">
      {/* Left: Title, rating, stars, button */}
      <div className="flex flex-col items-center md:min-w-[421px] lg:items-start">
        <div className="mb-[var(--spacing-sm)] font-[var(--font-weight-semibold)] text-[length:var(--font-size-md)]">
          {title}
        </div>
        <div className="mb-[var(--spacing-sm)] flex items-center gap-[var(--spacing-md)]">
          <span className="font-[var(--font-weight-semibold)] text-[length:var(--text-4xl)]">
            {rating.toFixed(1)}
          </span>
          <div
            aria-label={`${rating.toFixed(1)} out of 5 stars`}
            className="ml-[var(--spacing-xs)] flex gap-[var(--spacing-xs)]"
            role="img"
          >
            {[1, 2, 3, 4, 5].map((i) => (
              <StarIcon
                className={`h-[var(--spacing-5)] w-[var(--spacing-5)] ${i <= Math.round(rating) ? "text-black" : "text-gray-300"}`}
                fill={i <= Math.round(rating) ? "currentColor" : "none"}
                key={i}
                size={20}
              />
            ))}
          </div>
        </div>
        <Button
          className="rounded-[var(--radius-large)] border-black px-[var(--spacing-xl)] py-[var(--spacing-md)] font-[var(--font-weight-medium)] text-[length:var(--text-sm)]"
          variant="outline"
        >
          View More ({reviewCount} Reviews)
        </Button>
      </div>
      {/* Right: Rating distribution bars */}
      <div className="w-full flex-1">
        <div className="flex flex-col gap-[var(--spacing-xs)]">
          {distribution.map((d, _idx) => (
            <div className="flex items-center gap-[var(--spacing-md)]" key={d.stars}>
              <span
                className="w-[var(--spacing-2xl)] text-right font-[var(--font-weight-normal)] text-[length:var(--text-xs)] lg:text-[length:var(--text-sm)]"
                id={`rating-bar-${d.stars}`}
              >
                {d.stars} stars
              </span>
              <div
                className="relative h-[var(--spacing-xs)] flex-1 overflow-hidden rounded-[var(--radius-md)] bg-[var(--color-background-grey)]"
                role={`${d.id}-meter`}
              >
                <div
                  className="absolute top-0 left-0 h-[var(--spacing-xs)] rounded-[var(--radius-md)] bg-[var(--color-actions-primary)]"
                  style={{
                    width: `${d.count && maxCount ? (d.count / maxCount) * 100 : 0}%`,
                  }}
                />
              </div>
              <span className="w-[var(--spacing-10)] text-left font-[var(--font-weight-normal)] text-[length:var(--text-xs)] text-body-muted lg:text-[length:var(--text-sm)]">
                {d.count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
