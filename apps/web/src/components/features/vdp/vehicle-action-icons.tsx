import type React from "react";
import { FavoriteButton } from "~/components/shared/favourite-button";
import { PrintButton } from "~/components/shared/print-button";
import { ShareButton } from "~/components/shared/share-button";
import type { VehiclePreviewData } from "~/lib/data/vehicle-preview/vehicle-preview";

export interface VehicleActionIconsProps {
  className?: string;
  showFav: boolean;
  showPrint: boolean;
  showShare: boolean;
  vdpUrl?: string;
  vehicle?: Partial<VehiclePreviewData>;
  vin?: string;
}

export const VehicleActionIcons: React.FC<VehicleActionIconsProps> = ({
  showShare = true,
  /** VIN used by the FavoriteButton for global toggle. */
  vin,
  vdpUrl,
  vehicle,
  showPrint = true,
  showFav = true,
  className,
}) => {
  return (
    <div className={`flex items-center gap-(--spacing-lg) ${className || ""}`}>
      {showShare && (
        <ShareButton
          className="cursor-pointer hover:opacity-70"
          imageClassName="h-(--size-icon-md) w-(--size-icon-md) lg:h-6 lg:w-6"
          src="/images/vdp/Vector_6.svg"
          stopPropagation={false}
          vehicleUrl={vdpUrl}
        />
      )}
      {vin && showFav && (
        <FavoriteButton
          className="flex items-center justify-center rounded-full bg-surface hover:bg-background-lighter"
          vin={vin}
        />
      )}
      {showPrint && <PrintButton vehicle={vehicle} />}
    </div>
  );
};
