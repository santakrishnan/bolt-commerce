import type React from "react";

export interface VehicleColorsProps {
  className?: string;
  exteriorName: string;
  exteriorSwatchStyle?: React.CSSProperties;
  interiorName: string;
  interiorSwatchStyle?: React.CSSProperties;
}

export const VehicleColors: React.FC<VehicleColorsProps> = ({
  exteriorName,
  interiorName,
  exteriorSwatchStyle,
  interiorSwatchStyle,
  className = "flex gap-lg lg:gap-17.5",
}) => {
  return (
    <div className={className}>
      <div className="flex items-center gap-xs">
        <div
          className="h-6 w-6 rounded-[var(--radius-full)] lg:h-(--size-swatch) lg:w-(--size-swatch)"
          style={exteriorSwatchStyle}
        />
        <div className="flex flex-col">
          <p className="font-semibold text-2xs text-brand-text capitalize opacity-[var(--opacity-50)] lg:text-xs">
            Exterior
          </p>
          <span className="font-semibold text-brand-text text-xs leading-normal lg:text-sm">
            {exteriorName}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-xs">
        <div
          className="h-6 w-6 rounded-[var(--radius-full)] lg:h-(--size-swatch) lg:w-(--size-swatch)"
          style={interiorSwatchStyle}
        />
        <div className="flex flex-col">
          <p className="font-semibold text-2xs text-brand-text capitalize opacity-[var(--opacity-50)] lg:text-xs">
            Interior
          </p>
          <span className="font-semibold text-brand-text text-xs leading-normal lg:text-sm">
            {interiorName}
          </span>
        </div>
      </div>
    </div>
  );
};
