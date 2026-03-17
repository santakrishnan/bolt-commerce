import { Heading } from "@tfs-ucmp/ui";
import type React from "react";

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
      <Heading className={className} level={1} weight="bold">
        {title}
      </Heading>
    );
  }

  const trimLabel = trim ? ` ${trim}` : "";
  return (
    <Heading className={className} level={1} weight="bold">
      {year} {make} {model}
      {trimLabel}
    </Heading>
  );
};
