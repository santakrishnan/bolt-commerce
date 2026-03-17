"use client";

import { Button, HeartIcon } from "@tfs-ucmp/ui";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useFavorites } from "~/components/providers/favorites-provider";
import { ROUTES } from "~/lib/routes/constants";

/** Heart button with badge — only this component re-renders on favorites change. */
export const FavoritesButton = ({ useSolidStyles }: { useSolidStyles: boolean }) => {
  const { savedCount, isLoaded } = useFavorites();
  const isActive = isLoaded && savedCount > 0;

  return (
    <Button
      className={cn(
        "relative h-9 w-9 rounded-full border transition-colors",
        useSolidStyles
          ? "border-border-light hover:bg-muted"
          : "border-overlay hover:bg-background-overlay-hover",
        isActive && "border-icon-primary"
      )}
      size="icon"
      variant="ghost"
    >
      <Link aria-label={`Favorites (${savedCount} saved)`} href={ROUTES.FAVORITES}>
        <HeartIcon
          className={cn(
            "h-5 w-5 transition-colors",
            isActive ? "fill-icon-primary text-icon-primary" : "text-icon-primary"
          )}
        />
      </Link>
      {isActive && (
        <span className="absolute -top-1 -right-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-icon-primary px-1 font-bold text-2xs text-white leading-none">
          {savedCount > 99 ? "99+" : savedCount}
        </span>
      )}
    </Button>
  );
};
