import { Button, cn } from "@tfs-ucmp/ui";
import Image from "next/image";

interface VehicleDetailsBannerProps {
  imageUrl: string;
  title: string;
  description: string;
  buttonLabel?: string;
  buttonVariant?: "default" | "destructive" | "outline";
  onButtonClick?: () => void;
  className?: string;
}

export function VehicleDetailsBanner({
  imageUrl,
  title,
  description,
  buttonLabel,
  buttonVariant = "default",
  onButtonClick,
  className,
}: VehicleDetailsBannerProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-start gap-[var(--spacing-md,16px)] rounded-[var(--radius-md,8px)] border-[color:var(--color-border-subtle,#E5E5E5)] border-[length:var(--border-width-1,1px)] bg-[color:var(--color-card,#FFF)] px-[var(--spacing-md,16px)] py-[var(--spacing-md,16px)] sm:px-[var(--spacing-lg,24px)] md:flex-row md:items-center md:justify-between md:px-[var(--spacing-xl,32px)] md:py-[var(--spacing-lg,24px)]",
        className
      )}
    >
      <div className="flex items-center gap-[var(--spacing-md,16px)] md:gap-[var(--spacing-xl,32px)]">
        <div className="shrink-0">
          <Image
            alt=""
            aria-hidden="true"
            className="h-[var(--spacing-10,40px)] w-[var(--spacing-10,40px)] md:h-[var(--spacing-2xl,48px)] md:w-[var(--spacing-2xl,48px)]"
            height={48}
            src={imageUrl}
            width={48}
          />
        </div>

        <div className="flex flex-col gap-[var(--spacing-xs,8px)]">
          <h3 className="font-[number:var(--font-weight-semibold,600)] text-[color:var(--color-core-surfaces-foreground,#0A0A0A)] text-[length:var(--font-size-md,16px)] leading-[var(--spacing-lg)] [font-family:var(--font-family-sans)] [leading-trim:both] [text-edge:cap] md:text-[length:var(--font-size-lg,24px)]">
            {title}
          </h3>
          <p className="self-stretch font-[number:var(--font-weight-normal,400)] text-[color:var(--color-states-muted-foreground,#525252)] text-[length:var(--font-size-sm,14px)] leading-none tracking-[-0.16px] [font-family:var(--font-family-sans)] md:text-[length:var(--font-size-md,16px)]">
            {description}
          </p>
        </div>
      </div>

      {buttonLabel ? (
        <div className="w-full md:w-auto">
          <Button
            className={cn(
              "flex h-[var(--spacing-10,40px)] w-full items-center justify-center rounded-[var(--radius-full,9999px)] px-[var(--spacing-xl,32px)] py-0 text-center font-[number:var(--font-weight-semibold,600)] text-[length:var(--font-size-sm,14px)] leading-[125%] tracking-[-0.14px] [font-family:var(--font-family-sans)] [leading-trim:both] [text-edge:cap] md:w-auto",
              buttonVariant === "default" &&
                "bg-[var(--color-actions-primary)] text-white hover:bg-[var(--color-actions-primary)]/90"
            )}
            onClick={onButtonClick}
            type="button"
            variant={buttonVariant}
          >
            {buttonLabel}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
