import { Heading } from "@tfs-ucmp/ui";
import type React from "react";

export interface VehicleStatCardProps {
  count: string;
  countColor?: string;
  icon: React.ReactNode;
  onClick?: () => void;
  subtitle?: string;
  title: string;
}

export const VehicleStatCard: React.FC<VehicleStatCardProps> = ({
  icon,
  title,
  count,
  countColor = "text-[#E53935]",
  subtitle = "vehicles",
  onClick,
}) => (
  <button
    className="flex min-h-[140px] w-[308px] cursor-pointer flex-col items-center justify-center rounded-lg border border-brand-border-light bg-white px-[56px] py-[32px] shadow-sm transition-shadow hover:shadow-md"
    onClick={onClick}
    type="button"
  >
    <div className="mb-3">{icon}</div>
    <div className="mb-1 text-center font-semibold text-base">{title}</div>
    <div className={`font-bold text-sm ${countColor}`}>
      {count} <span className="font-normal text-gray-500">{subtitle}</span>
    </div>
  </button>
);

export interface VehicleStatsGridProps {
  cards: VehicleStatCardProps[];
  title?: string;
}

export const VehicleStatsGrid: React.FC<VehicleStatsGridProps> = ({
  cards,
  title = "Find your vehicle",
}) => (
  <section className="flex w-full flex-col items-center px-2 py-8">
    <Heading
      className="mb-6 text-center text-2xl md:text-2xl lg:text-[length:var(--text-2xl)]"
      level={2}
      weight="semibold"
    >
      {title}
    </Heading>
    <div className="flex w-full max-w-6xl flex-row justify-center gap-4">
      {cards.map((card: VehicleStatCardProps, _idx: number) => (
        <VehicleStatCard key={card.title} {...card} />
      ))}
    </div>
  </section>
);
