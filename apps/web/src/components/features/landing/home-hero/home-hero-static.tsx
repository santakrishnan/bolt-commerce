"use client";

import { cn } from "@tfs-ucmp/ui";
import Image from "next/image";
import { useLocation } from "~/components/providers/location-provider";

const KNOWN_USER_DESKTOP_BG =
  "/images/hero-know-user-content/know-user-images/car-image-temporary.png";
const KNOWN_USER_MOBILE_BG = "/images/hero-know-user-content/know-user-images/Hero%20KRL%20img.png";

interface HomeHeroStaticProps {
  isKnownUser?: boolean;
  useLocationBackground?: boolean;
}

export function HomeHeroStatic({
  isKnownUser = false,
  useLocationBackground = false,
}: HomeHeroStaticProps) {
  const { state: locationState } = useLocation();
  const { backgroundImage, mobileBackgroundImage } = locationState;

  const effectiveKnownUser = isKnownUser && !useLocationBackground;

  const activeBg = effectiveKnownUser ? KNOWN_USER_DESKTOP_BG : backgroundImage;
  const activeMobileBg = effectiveKnownUser ? KNOWN_USER_MOBILE_BG : mobileBackgroundImage;

  const mobileHideClass = effectiveKnownUser ? "lg:hidden" : "md:hidden";
  const desktopShowClass = effectiveKnownUser
    ? "hidden object-cover lg:block"
    : "hidden object-cover md:block";

  const mobileHeightClass = effectiveKnownUser ? "h-[60vh]" : "h-full";

  const bgClass = effectiveKnownUser
    ? "absolute inset-0 bg-black lg:bg-transparent"
    : "absolute inset-0 bg-black md:bg-transparent";

  return (
    <section aria-label="Hero background" className={bgClass}>
      <div className="absolute inset-0 h-full w-full">
        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background: `
              linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 30%),
              linear-gradient(0deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 50%),
              linear-gradient(90deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.3) 75%, rgba(0,0,0,0.8) 100%)
            `,
          }}
        />
        {mobileBackgroundImage && (
          <div className={cn("absolute inset-x-0", mobileHeightClass, mobileHideClass)}>
            <Image
              alt="Hero background"
              className="object-cover object-top"
              fill
              priority
              sizes="100vw"
              src={activeMobileBg}
            />
            {effectiveKnownUser && (
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3"
                style={{
                  background: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, #000 100%)",
                }}
              />
            )}
          </div>
        )}
        {activeBg && (
          <Image
            alt="Hero background"
            className={desktopShowClass}
            fill
            priority
            sizes="100vw"
            src={activeBg}
            style={{ objectPosition: "center" }}
          />
        )}
      </div>
    </section>
  );
}
