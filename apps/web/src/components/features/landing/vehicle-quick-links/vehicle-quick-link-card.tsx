import { Card, CardContent, cn } from "@tfs-ucmp/ui";
import Image from "next/image";
import Link from "next/link";
import { AnimatedCounter } from "~/components/shared/animated-counter";
import type { VehicleFinderOption } from "./data";

interface VehicleQuickLinkCardProps {
  option: VehicleFinderOption;
  className?: string;
  backgroundColor?: string;
}

const iconMap = {
  "price-tag": "/images/find-vehicle/icon-under-20k.svg",
  badge: "/images/find-vehicle/icon-excellent-deals.svg",
  "arrow-down": "/images/find-vehicle/icon-price-drop.svg",
  speedometer: "/images/find-vehicle/icon-low-miles.svg",
};

export function VehicleQuickLinkCard({
  option,
  className,
  backgroundColor,
}: VehicleQuickLinkCardProps) {
  const iconSrc = iconMap[option.icon];

  return (
    <Link href={`/used-cars?q=${option.title.replace(/\s+/g, "-")}`}>
      <Card
        className={cn(
          "min-h-35 rounded-[var(--spacing-xs)] border-border-subtle shadow-none transition-all duration-200 sm:min-h-40",
          "cursor-pointer hover:border-border-subtle-hover hover:shadow-md",
          backgroundColor || "bg--white/70",
          className
        )}
      >
        <CardContent className="flex flex-col items-center justify-center gap-[var(--spacing-lg)] px-[var(--spacing-md)] py-[var(--spacing-xl)] text-center">
          <Image
            alt={option.title}
            className="flex-shrink-0"
            height={48}
            src={iconSrc}
            width={48}
          />
          <div className="flex flex-col items-center gap-[var(--spacing-sm)]">
            <h3 className="text-center font-semibold text-base text-text-medium leading-[110%] tracking-[-0.64px] lg:text-[length:var(--font-size-xl)]">
              {option.title}
            </h3>
            <p className="text-center font-semibold text-base leading-[110%] tracking-[-0.64px]">
              <AnimatedCounter className="text-primary" value={option.vehicleCount} />{" "}
              <span className="text-black">vehicles</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
