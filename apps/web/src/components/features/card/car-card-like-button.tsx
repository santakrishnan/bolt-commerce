"use client";

import { Button } from "@tfs-ucmp/ui";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

interface LikeButtonProps {
  liked: boolean;
  onToggle: () => void;
}

export function LikeButton({ liked, onToggle }: LikeButtonProps) {
  const [animating, setAnimating] = useState(false);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onToggle();
      setAnimating(true);
    },
    [onToggle]
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
      aria-label="Add to favorites"
      className={`heart-button h-9 w-9 rounded-full bg-white hover:bg-gray-50 ${animating ? "animate" : ""}`}
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
