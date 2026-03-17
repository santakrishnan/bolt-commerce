import type React from "react";

export interface VehiclePriceProps {
  className?: string;
  originalPrice?: number | null;
  price: number;
  priceClassName?: string;
}

export const VehiclePrice: React.FC<VehiclePriceProps> = ({
  price,
  originalPrice,
  className = "mt-2xs flex items-baseline gap-xs",
  priceClassName = "font-bold text-2xl text-brand leading-[115%]",
}) => {
  return (
    <div className={className}>
      <span className={priceClassName}>${(price ?? 0).toLocaleString()}</span>
      {originalPrice != null && originalPrice > (price ?? 0) && (
        <>
          <span className="text-body-muted text-sm">was</span>
          <span className="text-[length:var(--text-sm)] text-body-muted line-through">
            ${originalPrice.toLocaleString()}
          </span>
        </>
      )}
    </div>
  );
};
