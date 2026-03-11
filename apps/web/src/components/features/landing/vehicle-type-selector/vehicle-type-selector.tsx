"use client";

import { cn } from "@tfs-ucmp/ui";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useEventTracking } from "~/lib/arrow";
import type { VehicleType } from "~/lib/data";
import { VehicleTypeCard } from "./vehicle-type-card";

export interface VehicleTypeSelectorProps {
  vehicleTypes: VehicleType[];
  onSelect?: (vehicleId: string) => void;
  defaultSelected?: string;
  className?: string;
}

export function VehicleTypeSelector({
  vehicleTypes,
  onSelect,
  defaultSelected,
  className,
}: VehicleTypeSelectorProps) {
  const [selected, setSelected] = useState<string | null>(defaultSelected || null);
  const { trackEvent } = useEventTracking();
  const router = useRouter();

  const handleSelect = (vehicleId: string) => {
    setSelected(vehicleId);
    onSelect?.(vehicleId);

    const vehicle = vehicleTypes.find((v) => v.id === vehicleId);
    trackEvent("vehicle_type_selected", {
      vehicleTypeId: vehicleId,
      vehicleTypeName: vehicle?.name ?? vehicleId,
      section: "landing_vehicle_type_selector",
    });

    router.push(`/used-cars/${vehicleId}`);
  };

  return (
    <section
      className={cn(
        "flex min-h-[var(--vh-section-mobile)] w-full flex-col gap-[var(--spacing-2xl)] self-stretch bg-[var(--color-core-surfaces-background)] py-[var(--spacing-2xl)] sm:min-h-[var(--vh-section-desktop)] sm:py-[var(--spacing-3xl)] lg:min-h-[var(--vh-section-desktop)] lg:items-center lg:justify-center lg:p-[var(--spacing-4xl)]",
        className
      )}
    >
      <div className="container mx-auto w-full max-w-[var(--container-2xl)]">
        <h2 className="mb-[var(--spacing-lg)] text-center font-semibold text-[length:var(--font-size-xl)] text-foreground sm:mb-[var(--spacing-xl)] lg:text-[length:var(--font-size-2xl)]">
          What type of vehicle?
        </h2>
        <div className="grid grid-cols-2 gap-[var(--spacing-sm)] lg:grid-cols-4">
          {vehicleTypes.map((vehicle) => (
            <VehicleTypeCard
              description={vehicle.description}
              image={vehicle.image}
              key={vehicle.id}
              name={vehicle.name}
              onClick={() => handleSelect(vehicle.id)}
              selected={selected === vehicle.id}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
