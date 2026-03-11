import { cn } from "@tfs-ucmp/ui";
import type { InspectionFeature } from "~/lib/data";
import { ArrowInspectedCarousel } from "./arrow-inspected-carousel";
import { InspectionFeatureCard } from "./inspection-feature-card";

export interface ArrowInspectedSectionProps {
  inspectionFeatures: InspectionFeature[];
  headerClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  containerClassName?: string;
  className?: string;
  carouselClassName?: string;
  gridClassName?: string;
  title?: string;
  description?: string;
}

export function ArrowInspectedSection({
  inspectionFeatures,
  headerClassName,
  titleClassName,
  descriptionClassName,
  containerClassName,
  className,
  carouselClassName,
  gridClassName,
  title = "Arrow Inspected®",
  description = "Every Vehicle Is Backed By Toyota's Commitment To Quality And Transparency",
}: ArrowInspectedSectionProps) {
  return (
    <section
      className={cn(
        "w-full bg-[var(--color-core-surfaces-background)] pt-0 pb-[var(--spacing-2xl)] sm:pb-[var(--spacing-3xl)] lg:flex lg:pb-[var(--spacing-4xl)]",
        className
      )}
    >
      <div
        className={cn(
          "mx-auto max-w-[var(--container-2xl)] px-[var(--spacing-md)] sm:px-[var(--spacing-lg)] lg:px-[var(--spacing-4xl)]",
          containerClassName
        )}
      >
        <div
          className={cn(
            "mx-auto mb-[var(--spacing-xl)] flex max-w-3xl flex-col gap-[var(--spacing-md)] text-center sm:mb-[var(--spacing-2xl)] lg:gap-[var(--spacing-md)]",
            headerClassName
          )}
        >
          <h2
            className={cn(
              "font-bold text-[length:var(--font-size-lg)] leading-tight tracking-tight lg:text-[length:var(--font-size-2xl)]",
              titleClassName
            )}
          >
            {title}
          </h2>
          <p
            className={cn(
              "text-[var(--color-core-surfaces-foreground)] text-base leading-relaxed sm:text-base",
              descriptionClassName
            )}
          >
            {description}
          </p>
        </div>

        <div
          className={cn(
            "-mx-[var(--spacing-md)] sm:-mx-[var(--spacing-lg)] md:hidden lg:-mx-[var(--spacing-xl)]",
            carouselClassName
          )}
        >
          <div className="pl-[var(--spacing-md)] sm:pl-[var(--spacing-lg)] lg:pl-[var(--spacing-xl)]">
            <ArrowInspectedCarousel inspectionFeatures={inspectionFeatures} />
          </div>
        </div>

        <div
          className={cn(
            "hidden auto-rows-fr gap-[var(--spacing-sm)] md:grid md:grid-cols-2 lg:grid-cols-4",
            gridClassName
          )}
        >
          {inspectionFeatures.map((feature) => (
            <InspectionFeatureCard feature={feature} key={feature.id} />
          ))}
        </div>
      </div>
    </section>
  );
}
