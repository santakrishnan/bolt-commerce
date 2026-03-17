"use client";

import { Button } from "@tfs-ucmp/ui";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useFavorites } from "~/components/providers/favorites-provider";

interface FavoriteButtonProps {
  /** VIN of the vehicle to toggle — hooks into the global favorites context. */
  vin: string;
  className?: string;
}

/**
 * Self-contained heart button that reads liked-state and toggles
 * saved-vehicle status through the global `useFavorites()` context.
 *
 * Drop it anywhere inside the `<FavoritesProvider>` tree — no prop-drilling
 * or local state required.
 */
export function FavoriteButton({ vin, className }: FavoriteButtonProps) {
  const { isVehicleSaved, toggleVehicle } = useFavorites();
  const liked = isVehicleSaved(vin);
  const [animating, setAnimating] = useState(false);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      toggleVehicle(vin);
      setAnimating(true);
    },
    [toggleVehicle, vin]
  );

  useEffect(() => {
    if (!animating) {
      return undefined;
    }
    const timer = setTimeout(() => setAnimating(false), 500);
    return () => clearTimeout(timer);
  }, [animating]);

  return (
    <Button
      aria-label={liked ? "Remove from favorites" : "Add to favorites"}
      className={`heart-button h-9 w-9 rounded-full bg-white hover:bg-gray-50 ${animating ? "animate" : ""} ${className ?? ""}`}
      onClick={handleClick}
      size="icon"
      type="button"
      variant="ghost"
    >
      <Image
        alt="Favorite"
        height={36}
        src={`/images/garage/heart${liked ? "-filled" : ""}.svg`}
        width={36}
      />
    </Button>
  );
}
