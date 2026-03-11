import { cn } from "@tfs-ucmp/ui";
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
      <h1
        className={cn(
          "text-center font-bold uppercase leading-tight tracking-tight",
          "text-[length:var(--font-size-2xl)] text-[var(--color-core-surfaces-inverse-foreground)]",
          "md:text-left md:text-[length:var(--font-size-4xl)] lg:leading-none",
          className
        )}
      >
        {title ?? (
          <>
            <span className="block">FIND YOUR</span>
            <span className="block">NEXT VEHICLE</span>
          </>
        )}
      </h1>
      {showSubtitle && (
        <p className="text-center text-[length:var(--font-size-sm)] text-[var(--color-core-surfaces-inverse-foreground)]/90 md:text-left md:text-base">
          {subtitle ?? "With Transparent Pricing And Trusted Quality"}
        </p>
      )}
    </div>
  );
}
