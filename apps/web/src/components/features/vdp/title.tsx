import type React from "react";
import { Heading } from "@/components/heading";

export interface VehicleTitleProps {
  className?: string;
  make?: string;
  model?: string;
  title?: string;
  trim?: string;
  year?: number | string;
}

export const VehicleTitle: React.FC<VehicleTitleProps> = ({
  title,
  year,
  make,
  model,
  trim,
  className = "text-2xl md:text-2xl text-heading leading-[115%]",
}) => {
  if (title) {
    return (
      <Heading
        className={`${className} text-[length:var(--font-size-lg)] md:text-[length:var(--font-size-lg)] lg:text-[length:var(--font-size-2xl)]`}
        level={1}
        weight="bold"
      >
        {title}
      </Heading>
    );
  }

  const trimLabel = trim ? ` ${trim}` : "";
  return (
    <Heading
      className={`${className} text-[length:var(--font-size-lg)] md:text-[length:var(--font-size-lg)] lg:text-[length:var(--font-size-2xl)]`}
      level={1}
      weight="bold"
    >
      {year} {make} {model}
      {trimLabel}
    </Heading>
  );
};
