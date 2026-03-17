import type React from "react";

export interface VehicleSpecsGridProps {
  className?: string;
  drivetrain: string;
  miles: string;
  mpg: string;
  stock: string;
  vin: string;
}

export const VehicleSpecsGrid: React.FC<VehicleSpecsGridProps> = ({
  miles,
  drivetrain,
  mpg,
  stock,
  vin,
  className = "grid grid-cols-3 gap-sm lg:gap-md",
}) => {
  return (
    <div className={className}>
      <div className="flex flex-col gap-[var(--spacing-xs)]">
        <p className="font-semibold text-body text-xs leading-[125%] opacity-[var(--opacity-50)]">
          Miles
        </p>
        <p className="font-semibold text-body text-sm leading-[125%] tracking-[-0.14px]">{miles}</p>
      </div>
      <div className="flex flex-col gap-[var(--spacing-xs)]">
        <p className="font-semibold text-body text-xs leading-[125%] opacity-[var(--opacity-50)]">
          Drivetrain
        </p>
        <p className="font-semibold text-body text-sm leading-[125%] tracking-[-0.14px]">
          {drivetrain}
        </p>
      </div>
      <div className="flex flex-col gap-[var(--spacing-xs)]">
        <p className="font-semibold text-body text-xs leading-[125%] opacity-[var(--opacity-50)]">
          MPG
        </p>
        <p className="font-semibold text-body text-sm leading-[125%] tracking-[-0.14px]">{mpg}</p>
      </div>
      <div className="flex flex-col gap-[var(--spacing-xs)]">
        <p className="font-semibold text-body text-xs leading-[125%] opacity-[var(--opacity-50)]">
          Stock #
        </p>
        <p className="font-semibold text-body text-sm leading-[125%] tracking-[-0.14px]">{stock}</p>
      </div>
      <div className="col-span-2 flex flex-col gap-[var(--spacing-xs)]">
        <p className="font-semibold text-body text-xs leading-[125%] opacity-[var(--opacity-50)]">
          VIN
        </p>
        <p className="font-semibold text-body text-sm leading-[125%] tracking-[-0.14px]">{vin}</p>
      </div>
    </div>
  );
};
