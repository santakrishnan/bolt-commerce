import type React from "react";
import { CustomBadge } from "~/components/shared/custom-badge";
export interface VehicleBadgesProps {
  className?: string;
  inspected: boolean;
  warranty: boolean;
}

export const VehicleBadges: React.FC<VehicleBadgesProps> = ({
  warranty,
  inspected,
  className = "grid grid-cols-3 gap-(--spacing-xs)",
}) => {
  return (
    <div className={className}>
      <CustomBadge
        className="text-(length:--font-size-2xs)"
        text="Excellent Price"
        type="excellentPrice"
      />
      {warranty && (
        <CustomBadge className="text-(length:--font-size-xs)" text="Warranty" type="warranty" />
      )}
      {inspected && (
        <CustomBadge className="text-(length:--font-size-xs)" text="Inspected" type="Inspected" />
      )}
    </div>
  );
};
