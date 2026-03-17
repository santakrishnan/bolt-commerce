"use client";

import { Button } from "@tfs-ucmp/ui";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

interface ShareButtonProps {
  vehicleUrl?: string;
  src?: string;
  alt?: string;
  className?: string;
  imageClassName?: string;
  height?: number;
  width?: number;
  onClick?: (e: React.MouseEvent) => void;
  stopPropagation?: boolean;
}

const SHARE_COPIED_MESSAGE = "Copied to Clipboard!";

export function ShareButton({
  vehicleUrl,
  src = "/images/garage/share.svg",
  alt = "Share",
  className,
  imageClassName,
  height = 36,
  width = 36,
  onClick,
  stopPropagation = true,
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) {
      return;
    }
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (stopPropagation) {
        e.stopPropagation();
      }

      if (vehicleUrl) {
        const fullUrl = `${window.location.origin}${vehicleUrl}`;
        navigator.clipboard.writeText(fullUrl).then(() => {
          setCopied(true);
        });
      }

      onClick?.(e);
    },
    [vehicleUrl, onClick, stopPropagation]
  );

  return (
    <div className="relative">
      <Button
        aria-label={alt}
        className={`${className ?? "h-9 w-9 rounded-full bg-white"} hover:bg-transparent hover:text-inherit`}
        onClick={handleClick}
        size="icon"
        type="button"
        variant="ghost"
      >
        <Image alt={alt} className={imageClassName} height={height} src={src} width={width} />
      </Button>
      {copied && (
        <span className="absolute top-full left-0 z-50 mt-1 -translate-x-1/2 whitespace-nowrap rounded-md bg-black px-1 py-1 text-white text-xs shadow-lg">
          {SHARE_COPIED_MESSAGE}
        </span>
      )}
    </div>
  );
}
