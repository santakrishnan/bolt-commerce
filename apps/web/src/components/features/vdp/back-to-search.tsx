"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import type React from "react";
import { useIsMobile } from "~/hooks/use-is-mobile";
import { ROUTES } from "~/lib/routes/constants";

export const BackToSearch: React.FC = () => {
  const isMobile = useIsMobile();
  const router = useRouter();

  const handleBack = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.defaultPrevented) {
      return;
    }
    // Allow modifier keys and non-left clicks to open in new tab/window
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
      return;
    }

    e.preventDefault();
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(ROUTES.USED_CARS);
    }
  };

  return (
    <a
      aria-label="Back to search"
      className="flex cursor-pointer items-center gap-(--spacing-sm) text-foreground text-sm hover:text-body-muted"
      href={ROUTES.USED_CARS}
      onClick={handleBack}
    >
      <Image
        alt="Back to search results"
        aria-hidden="true"
        className="mt-[calc(var(--spacing-2xs))] h-[var(--spacing-sm,12px)] w-[calc(var(--spacing-xs,8px)_+_2px)]"
        height={12}
        src="/images/vdp/chevron-left.svg"
        width={10}
      />
      <span className="font-normal text-[var(--color-core-surfaces-foreground)] text-base">
        {isMobile ? "Back to Search" : "Back to Search Result"}
      </span>
    </a>
  );
};
