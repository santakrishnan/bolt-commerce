"use client";

import type { VdpParams } from "@config/routes";
import type { VehicleDetail } from "@features/vdp/data";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { VehicleStickyBanner } from "./sticky-banner";

interface VehiclePdpStickyClientProps {
  desktopTargetId: string;
  mobileTargetId: string;
  slugParams: VdpParams;
  vehicle: VehicleDetail;
}

export function VehiclePdpStickyClient({
  vehicle,
  slugParams,
  desktopTargetId,
  mobileTargetId,
}: VehiclePdpStickyClientProps) {
  const pathname = usePathname();

  const [stickyScrollOffset, setStickyScrollOffset] = useState(0);
  const [showStickyCTA, setShowStickyCTA] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down");
  const STICKY_HEIGHT = 72;

  useEffect(() => {
    if (pathname) {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [pathname]);

  useEffect(() => {
    let prevScrollY = 0;

    function handleScroll() {
      const desktopEl = document.getElementById(desktopTargetId);
      const mobileEl = document.getElementById(mobileTargetId);
      const target = desktopEl && desktopEl.offsetParent !== null ? desktopEl : mobileEl;

      if (!target) {
        return;
      }

      const rect = target.getBoundingClientRect();
      const header = document.querySelector("header");
      const headerHeight = header ? header.getBoundingClientRect().height : 80;

      const offset = Math.max(0, headerHeight - rect.top);
      setStickyScrollOffset(offset > 0 ? offset : 0);
      setShowStickyCTA(rect.top < headerHeight);

      const currentY = window.scrollY;
      if (currentY > prevScrollY) {
        setScrollDirection("down");
      } else if (currentY < prevScrollY) {
        setScrollDirection("up");
      }
      prevScrollY = currentY;
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [desktopTargetId, mobileTargetId]);

  return (
    <VehicleStickyBanner
      scrollDirection={scrollDirection}
      showStickyCTA={showStickyCTA}
      slugParams={slugParams}
      stickyHeight={STICKY_HEIGHT}
      stickyScrollOffset={stickyScrollOffset}
      vehicle={vehicle}
    />
  );
}
