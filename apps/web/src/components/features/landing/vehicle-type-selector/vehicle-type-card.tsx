"use client";

import { Card, CardContent, cn } from "@tfs-ucmp/ui";
import { cva, type VariantProps } from "class-variance-authority";
import Image from "next/image";

const cardVariants = cva(
  [
    "group relative cursor-pointer transition-all duration-200 ease-in-out",
    "min-h-[140px] sm:min-h-[160px]",
    "border-none shadow-none",
  ],
  {
    variants: {
      selected: {
        true: "bg-[var(--color-core-surfaces-background)]",
        false:
          "bg-[var(--color-core-surfaces-background)] hover:bg-[var(--color-destructive-foreground)]",
      },
    },
    defaultVariants: {
      selected: false,
    },
  }
);

export interface VehicleTypeCardProps extends VariantProps<typeof cardVariants> {
  image: string;
  name: string;
  description?: string;
  onClick?: () => void;
  selected?: boolean;
  className?: string;
}

export function VehicleTypeCard({
  image,
  name,
  description,
  onClick,
  selected = false,
  className,
}: VehicleTypeCardProps) {
  const handleClick = () => {
    onClick?.();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick?.();
    }
  };

  return (
    <Card
      aria-label={`Select ${name}`}
      aria-pressed={selected}
      className={cn(cardVariants({ selected }), className)}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      <CardContent className="flex flex-col items-center justify-center rounded-[var(--radius-md)] p-[var(--spacing-md)] sm:p-[var(--spacing-lg)]">
        <div className="relative mx-auto mb-[var(--spacing-md)] aspect-[165/124] h-[70px] w-full max-w-[165px] overflow-hidden sm:mb-[var(--spacing-8)] sm:h-[116px] lg:aspect-[320/122] lg:max-w-[320px]">
          <Image
            alt={name}
            className="object-contain transition-transform duration-200 group-hover:scale-105"
            fill
            sizes="(max-width: 1024px) 100vw, 320px"
            src={image}
          />
        </div>

        <h3 className="mb-[var(--spacing-xs)] truncate text-center font-semibold text-[length:var(--font-size-md)] text-[var(--color-core-surfaces-foreground)] uppercase sm:text-[length:var(--font-size-xl)]">
          {name}
        </h3>

        {description && (
          <p className="truncate text-center font-normal text-[length:var(--font-size-sm)] text-[var(--color-core-surfaces-foreground)] sm:text-[length:var(--font-size-sm)]">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
