import { cn } from "@tfs-ucmp/ui";
import { fetchVehicleFinderCounts, fetchVehicleFinderOptions } from "~/services/landing";
import { VehicleQuickLinkCard } from "./vehicle-quick-link-card";

export interface VehicleQuickLinksGridProps {
  cardBackgroundColor?: string;
  className?: string;
}

export async function VehicleQuickLinksGrid({
  className,
  cardBackgroundColor,
}: VehicleQuickLinksGridProps) {
  const [vehicleFinderOptions, counts] = await Promise.all([
    fetchVehicleFinderOptions(),
    fetchVehicleFinderCounts(),
  ]);

  if (!vehicleFinderOptions || vehicleFinderOptions.length === 0 || !counts) {
    return null;
  }

  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-[var(--spacing-xs)] sm:gap-[var(--spacing-md)] lg:grid-cols-4",
        className
      )}
    >
      {vehicleFinderOptions.map((option) => (
        <VehicleQuickLinkCard
          backgroundColor={cardBackgroundColor}
          key={option.id}
          option={{
            ...option,
            vehicleCount: counts[option.id as keyof typeof counts],
          }}
        />
      ))}
    </div>
  );
}
