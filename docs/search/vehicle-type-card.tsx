import { Card, CardContent, cn, Heading } from "@tfs-ucmp/ui";
import { cva, type VariantProps } from "class-variance-authority";
import Image from "next/image";

const cardVariants = cva(
  [
    "group relative cursor-pointer overflow-clip rounded-[var(--radius-md)]",
    "border-none shadow-none transition-all duration-200 ease-in-out",
  ],
  {
    variants: {
      selected: {
        true: "bg-[var(--color-core-surfaces-card)]",
        false: "bg-transparent hover:bg-[var(--color-core-surfaces-card)]",
      },
    },
    defaultVariants: {
      selected: false,
    },
  }
);

export interface VehicleTypeCardProps extends VariantProps<typeof cardVariants> {
  className?: string;
  description?: string;
  image: string;
  name: string;
  selected?: boolean;
}

export function VehicleTypeCard({
  image,
  name,
  description,
  selected = false,
  className,
}: VehicleTypeCardProps) {
  return (
    <Card className={cn(cardVariants({ selected }), className)}>
      <CardContent className="flex flex-col items-center gap-[var(--spacing-xl)] px-0 py-[var(--spacing-xl)]">
        {/* Image container — fixed 116px height, Figma spec */}
        <div className="flex h-[116px] w-full items-center justify-center overflow-hidden">
          <div className="relative h-[116px] w-full">
            <Image
              alt={name}
              className="object-contain transition-transform duration-200 group-hover:scale-105"
              fill
              sizes="(max-width: 1024px) 50vw, 25vw"
              src={image}
            />
          </div>
        </div>

        {/* Text block — 12px gap between name and description */}
        <div className="flex w-full flex-col items-center gap-[var(--spacing-sm)] text-center">
          <Heading
            className="text-center text-[length:var(--font-size-xl)] text-[var(--color-core-surfaces-foreground)] uppercase leading-[1.15]"
            level={3}
            weight="semibold"
          >
            {name}
          </Heading>

          {description && (
            <p className="text-center font-normal text-[length:var(--font-size-sm)] text-[var(--color-core-surfaces-foreground)] leading-[1.25] tracking-[-0.14px]">
              {description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
