import { Card, CardContent, cn } from "@tfs-ucmp/ui";
import Image from "next/image";
import Link from "next/link";
import type { ReactElement } from "react";
import config from "./buying-process-config.json";
import type { ProcessStep } from "./types";

interface BuyingProcessCardProps {
  steps: ProcessStep[];
}

const iconMap = config.iconPaths;

export function BuyingProcessCard({ steps }: BuyingProcessCardProps): ReactElement {
  return (
    <div className="w-full">
      <div className="grid grid-cols-2 gap-[var(--spacing-xs)] lg:grid lg:grid-cols-4 lg:gap-[var(--spacing-md)]">
        {steps.map((step) => {
          const iconSrc = iconMap[step.icon];
          return (
            <Card
              className={cn("group h-full rounded-md border-0 bg-card shadow-lg")}
              key={step.icon}
            >
              <CardContent className="flex h-full flex-col items-center px-[var(--spacing-sm)] py-[var(--spacing-lg)] text-center">
                <div className="mb-[var(--spacing-lg)] flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 sm:mb-[var(--spacing-5)]">
                  <Image
                    alt={step.title}
                    className="flex-shrink-0"
                    height={36}
                    src={iconSrc}
                    width={36}
                  />
                </div>
                <h3 className="mb-[var(--spacing-sm)] font-semibold text-[length:var(--font-size-xl)] text-[var(--color-core-surfaces-foreground)]">
                  {step.title}
                </h3>
                <p className="text-[length:var(--font-size-sm)] text-[var(--color-core-surfaces-foreground)] leading-relaxed">
                  {step.description}
                </p>
                {step.linkText && step.linkHref && (
                  <Link
                    className="mt-auto pt-[var(--spacing-md)] font-semibold text-[length:var(--font-size-sm)] text-primary underline underline-offset-4 opacity-0 transition-opacity hover:text-primary-hover group-hover:opacity-100"
                    href={step.linkHref}
                  >
                    {step.linkText}
                  </Link>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
