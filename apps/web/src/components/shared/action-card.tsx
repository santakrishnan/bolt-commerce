import { Card, CardDescription, CardFooter, CardHeader, CardTitle, cn } from "@tfs-ucmp/ui";
import type * as React from "react";
import { AppButton } from "~/components/shared/button";

interface ActionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  descriptionTrailing?: React.ReactNode;
  buttonText: React.ReactNode;
  buttonVariant?: React.ComponentProps<typeof AppButton>["variant"];
  buttonSize?: React.ComponentProps<typeof AppButton>["size"];
  buttonClassName?: string;
  onButtonClick?: () => void;
  className?: string;
}

export function ActionCard({
  icon,
  title,
  description,
  descriptionTrailing,
  buttonText,
  buttonVariant = "primary",
  buttonClassName,
  buttonSize = "md",
  onButtonClick,
  className,
}: ActionCardProps) {
  return (
    <Card
      className={cn(
        "flex flex-col gap-(--spacing-md) rounded-none border-(--color-structure-interaction-subtle-border) border-0 border-b pt-0 pb-(--spacing-lg) shadow-none",
        className
      )}
    >
      <CardHeader className="flex-row items-center gap-xs space-y-0 p-0 lg:gap-sm">
        <div className="flex shrink-0 items-center justify-center">{icon}</div>
        <div className="flex flex-col gap-0">
          <CardTitle className="font-semibold text-brand-text-dealer text-sm-alt leading-[130%] tracking-[-0.14px] lg:text-sm">
            {title}
          </CardTitle>
          <div className="flex items-start justify-between gap-(--spacing-2xs)">
            <CardDescription className="font-normal text-brand-text-secondary text-xs-alt leading-normal lg:text-xs">
              {description}
            </CardDescription>
            {descriptionTrailing}
          </div>
        </div>
      </CardHeader>

      <CardFooter className="bg-(--color-surface) p-0 pb-5 lg:pb-0">
        <AppButton
          className={buttonClassName}
          onClick={onButtonClick}
          size={buttonSize}
          variant={buttonVariant}
        >
          {buttonText}
        </AppButton>
      </CardFooter>
    </Card>
  );
}
