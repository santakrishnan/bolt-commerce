import { cn } from "@tfs-ucmp/ui";
import { getVehicleFinderCounts, type VehicleFinderCounts } from "~/lib/data";
import { vehicleFinderOptions } from "./data";
import { VehicleQuickLinkCard } from "./vehicle-quick-link-card";

interface VehicleQuickLinksGridProps {
  className?: string;
  cardBackgroundColor?: string;
}

export async function VehicleQuickLinksGrid({
  className,
  cardBackgroundColor,
}: VehicleQuickLinksGridProps) {
  const counts = await getVehicleFinderCounts();

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
            vehicleCount: counts[option.id as keyof VehicleFinderCounts],
          }}
        />
      ))}
    </div>
  );
}
