import { Card, CardContent, cn } from "@tfs-ucmp/ui";
import Image from "next/image";
import type { InspectionFeature } from "~/data/inspection/features";

interface InspectionFeatureCardProps {
  feature: InspectionFeature;
  className?: string;
}

const iconMap = {
  "arrow-circle": "/images/arrow-inspected/icon-inspection.svg",
  "certified-document": "/images/arrow-inspected/icon-vin-check.svg",
  "verified-badge": "/images/arrow-inspected/icon-no-damage.svg",
  guarantee: "/images/arrow-inspected/icon-return.svg",
};

export function InspectionFeatureCard({ feature, className }: InspectionFeatureCardProps) {
  const iconSrc = iconMap[feature.icon];

  return (
    <Card className={cn("h-full border-none shadow-none", className)}>
      <CardContent className="flex h-full flex-col rounded-[var(--spacing-xs)] bg-white p-0">
        <div className="relative aspect-[320/213] w-full overflow-hidden rounded-t-[var(--spacing-xs)]">
          <Image
            alt={feature.title}
            className="object-cover"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
            src={feature.image}
          />
        </div>
        <div className="flex flex-1 flex-col gap-[var(--spacing-md)] rounded-b-xl p-[var(--spacing-5)]">
          <div className="flex items-center gap-[var(--spacing-5)]">
            <Image
              alt={feature.title}
              className="h-6 w-6 flex-shrink-0 lg:h-8 lg:w-8"
              height={32}
              src={iconSrc}
              width={32}
            />
            <h3 className="font-bold text-base text-text-primary leading-normal lg:font-semibold lg:text-[length:var(--font-size-xl)] lg:leading-[115%]">
              {feature.title}
            </h3>
          </div>
          <p className="font-normal text-sm text-text-primary leading-normal tracking-[-0.42px] lg:text-[var(--Core-surfaces-card-foreground)] lg:text-[var(--font-size-sm,14px)] lg:leading-[125%] lg:tracking-[-0.14px]">
            {feature.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
