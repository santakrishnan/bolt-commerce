import Image from "next/image";
import type React from "react";

export interface VehicleDealerInfoProps {
  dealerName: string;
  dealerLocation: string;
  distance: string;
  className?: string;
  avatarClassName?: string;
  logoSrc?: string;
  logoClassName?: string;
}

export const VehicleDealerInfo: React.FC<VehicleDealerInfoProps> = ({
  dealerName,
  dealerLocation,
  distance,
  className = "",
  avatarClassName = "flex h-7 w-7 items-center justify-center rounded-[var(--radius-full)] bg-brand lg:h-(--size-avatar-sm) lg:w-(--size-avatar-sm)",
  logoSrc = "/images/vdp/Toyota-logo.svg",
  logoClassName = "h-5 w-4.75 lg:h-6 lg:w-5.75",
}) => {
  return (
    <div className={className}>
      <div className="flex items-end justify-between">
        <div className="flex items-center gap-xs lg:gap-sm">
          <div className={avatarClassName}>
            <Image alt="Toyota" className={logoClassName} height={20} src={logoSrc} width={19} />
          </div>
          <div>
            <p className="font-semibold text-brand-text-dealer text-sm-alt leading-[130%] tracking-[-0.14px] lg:text-sm">
              {dealerName}
            </p>
            <p className="font-normal text-brand-text-secondary text-xs-alt leading-normal lg:text-xs">
              {dealerLocation}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2xs font-normal text-brand-text-secondary text-xs-alt leading-normal lg:text-xs">
          <Image
            alt="Map"
            className="h-3 w-3 lg:h-3.5 lg:w-3.5"
            height={12}
            src="/images/vdp/map-icon.svg"
            width={12}
          />
          <span>{distance}</span>
        </div>
      </div>
    </div>
  );
};
