import Image from "next/image";
import { AnimatedCounter } from "~/components/shared/animated-counter";

interface HomeHeroStatsProps {
  vehicleCount: number;
}
const stats = [
  {
    icon: "/images/heroes/vehicle-vin.svg",
    value: "100%",
    label: "Verified VIN",
  },
  {
    icon: "/images/heroes/money-back.svg",
    value: "7-DAY",
    label: "Money Back",
  },
  {
    icon: "/images/heroes/customer-rating.svg",
    value: "4.9",
    label: "Customer Rating",
  },
];

export function HomeHeroStats({ vehicleCount }: HomeHeroStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-[var(--spacing-md)] rounded-[var(--radius-2xl)] pt-[var(--spacing-sm)] pb-[var(--spacing-lg)] md:grid-cols-4 md:gap-[var(--spacing-2xl)] lg:px-[125px]">
      <div className="flex items-center gap-[var(--spacing-lg)] md:gap-[var(--spacing-lg)] lg:w-[200px] xl:w-[200px]">
        <div className="flex h-12 w-12 items-center justify-center rounded-full">
          <Image
            alt="Vehicle availability"
            className="h-10 w-10 lg:h-[var(--spacing-2xl)] lg:w-[var(--spacing-2xl)]"
            height={48}
            src="/images/heroes/vehicle-availability.svg"
            width={48}
          />
        </div>
        <div>
          <div
            className="font-normal text-[length:var(--font-size-xl)] text-primary-foreground"
            style={{ minWidth: "6.5ch", display: "inline-block" }}
          >
            <AnimatedCounter suffix="+" value={vehicleCount} />
          </div>
          <div className="text-[length:var(--font-size-xs)] text-primary-foreground/80 leading-[17.5px] tracking-[-0.14px] md:text-sm">
            Vehicles Available
          </div>
        </div>
      </div>

      {stats.map((stat) => {
        return (
          <div
            className="flex items-center gap-[var(--spacing-lg)] md:gap-[var(--spacing-md)] lg:w-[200px] xl:w-[200px]"
            key={stat.label}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full">
              <Image
                alt={stat.label}
                className="h-10 w-10 lg:h-[var(--spacing-2xl)] lg:w-[var(--spacing-2xl)]"
                height={48}
                src={stat.icon}
                width={48}
              />
            </div>
            <div>
              <div className="font-normal text-[length:var(--font-size-xl)] text-primary-foreground">
                {stat.value}
              </div>
              <div className="text-[length:var(--font-size-xs)] text-primary-foreground/80 leading-[17.5px] tracking-[-0.14px] md:text-[length:var(--font-size-sm)]">
                {stat.label}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
