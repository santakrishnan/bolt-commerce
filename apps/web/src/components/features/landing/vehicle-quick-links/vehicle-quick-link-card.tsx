import { Card, CardContent, cn, Heading } from "@tfs-ucmp/ui";
import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "~/lib/routes/constants";
import type { VehicleFinderOption } from "./data";

export interface VehicleQuickLinkCardProps {
  backgroundColor?: string;
  className?: string;
  option: VehicleFinderOption;
}

const iconMap = {
  "price-tag": "/images/find-vehicle/icon-under-20k.svg",
  badge: "/images/find-vehicle/icon-excellent-deals.svg",
  "arrow-down": "/images/find-vehicle/icon-price-drop.svg",
  speedometer: "/images/find-vehicle/icon-low-miles.svg",
};

const WHITESPACE_REGEX = /\s+/g;

export function VehicleQuickLinkCard({
  option,
  className,
  backgroundColor,
}: VehicleQuickLinkCardProps) {
  const iconSrc = iconMap[option.icon];
  const searchQuery = option.title.toLocaleLowerCase().replace(WHITESPACE_REGEX, "-");
  const href = `${ROUTES.USED_CARS}?q=${searchQuery}`;

  return (
    <Link href={href}>
      <Card
        className={cn(
          "min-h-35 rounded-[var(--spacing-xs)] border-border-subtle shadow-none transition-all duration-200 sm:min-h-40",
          "cursor-pointer hover:border-border-subtle-hover hover:shadow-md",
          backgroundColor || "bg-white/70",
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
            <Heading
              className="text-center text-base text-text-medium leading-[110%] tracking-[-0.64px] md:text-base lg:text-[length:var(--font-size-xl)]"
              level={3}
              weight="semibold"
            >
              {option.title}
            </Heading>
            <p className="text-center font-semibold text-base leading-[110%] tracking-[-0.64px]">
              <span className="text-primary">{option.vehicleCount.toLocaleString()}</span>{" "}
              <span className="text-black">vehicles</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
