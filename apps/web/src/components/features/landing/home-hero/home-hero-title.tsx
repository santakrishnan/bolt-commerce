import { cn, Heading } from "@tfs-ucmp/ui";
import type React from "react";
import type { HomeHeroTitleProps } from "./types";

export function HomeHeroTitle({
  title,
  subtitle,
  showSubtitle = true,
  className = "",
}: HomeHeroTitleProps): React.JSX.Element {
  return (
    <div className="space-y-[var(--spacing-md)]">
      <Heading
        className={cn(
          "text-center uppercase leading-tight tracking-tight",
          "text-[var(--color-core-surfaces-inverse-foreground)]",
          "md:text-left lg:leading-none",
          className
        )}
        level={1}
        weight="bold"
      >
        {title ?? (
          <>
            <span className="block">FIND YOUR</span>
            <span className="block">NEXT VEHICLE</span>
          </>
        )}
      </Heading>
      {showSubtitle && (
        <p className="text-center text-[length:var(--font-size-sm)] text-[var(--color-core-surfaces-inverse-foreground)]/90 md:text-left md:text-base">
          {subtitle ?? "With Transparent Pricing And Trusted Quality"}
        </p>
      )}
    </div>
  );
}
