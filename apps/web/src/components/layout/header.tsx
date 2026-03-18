"use client";

import { Button, MenuIcon } from "@tfs-ucmp/ui";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useLocation } from "~/components/providers/location-provider";
import { lockBodyScroll, unlockBodyScroll } from "~/lib/body-scroll-lock";
import { getCurrentUserSync, getFlagSync } from "~/lib/flags/client";
import { ROUTES } from "~/lib/routes/constants";
import { AvatarButton, MobileUserButton, SignInButton } from "./header/auth-buttons";
import { FavoritesButton } from "./header/favorites-button";
import { HeaderNav } from "./header/header-nav";
import { LocationBlock } from "./header/location-block";
import { MobileMenu } from "./header/mobile-menu";

export function Header() {
  const {
    state: { isResolved: locationReady },
  } = useLocation();
  const pathname = usePathname();
  const isHomePage = pathname === ROUTES.HOME;
  const isMyGaragePage = pathname === ROUTES.MY_GARAGE;
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);

  // Get current user for authentication state.
  // We must initialise with SSR-safe values (no localStorage on the server)
  // and then update after mount to avoid a hydration mismatch.
  const [showUserAvatar, setShowUserAvatar] = useState(false);
  const [userFirstName, setUserFirstName] = useState("Guest");

  useEffect(() => {
    const currentUser = getCurrentUserSync();
    // Show avatar only when the personalized hero banner flag is enabled
    const showPersonalized = getFlagSync("showPersonalizedHeroBanner");
    setShowUserAvatar(showPersonalized);
    setUserFirstName(currentUser.firstName);
  }, []);

  useEffect(() => {
    const update = () => setIsScrolled(window.scrollY > 150);
    update();

    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) {
      lockBodyScroll();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (mobileMenuOpen) {
        unlockBodyScroll();
      }
    };
  }, [mobileMenuOpen]);

  // Use solid/white styles for all pages except home and my-garage (these use transparent until scrolled)
  // Also force solid when the location modal is open so the header background is white behind the backdrop
  const useSolidStyles = !(isHomePage || isMyGaragePage) || isScrolled || locationModalOpen;

  // Sync overscroll background with header style using Tailwind classes
  useEffect(() => {
    const { classList } = document.documentElement;
    classList.toggle("bg-white", useSolidStyles);
    classList.toggle("bg-black", !useSolidStyles);
  }, [useSolidStyles]);

  return (
    <>
      <header
        className={cn(
          "absolute top-0 right-0 left-0 z-[35] w-full",
          useSolidStyles ? "slide-down fixed bg-white" : "border-transparent bg-transparent"
        )}
      >
        <div className="mx-auto flex h-16 max-w-[var(--container-2xl)] items-center px-4 sm:h-20 sm:px-6 lg:px-20">
          {/* Left: Logo */}
          <div className="flex items-center lg:flex-1 xl:flex-1">
            <Link className="flex items-center gap-2.5" href={ROUTES.HOME}>
              <div aria-hidden="true" className="h-10 w-10 bg-icon-primary" />
              <span
                className={cn(
                  "font-bold text-base uppercase leading-normal lg:text-[23px] lg:leading-none",
                  useSolidStyles ? "text-text-dark" : "text-white"
                )}
                style={{ fontFamily: "var(--font-toyota-type)" }}
              >
                ARROW
              </span>
            </Link>
          </div>

          {/* Center: Nav links */}
          <HeaderNav useSolidStyles={useSolidStyles} />

          {/* Right: MOBILE + DESKTOP action clusters */}
          <div className="flex flex-1 items-center justify-end">
            {/* Mobile right cluster: heart, user, hamburger */}
            <div className="flex items-center gap-3 lg:hidden">
              {locationReady && <FavoritesButton useSolidStyles={useSolidStyles} />}

              <MobileUserButton
                firstName={userFirstName}
                showAvatar={showUserAvatar}
                useSolidStyles={useSolidStyles}
              />

              <Button
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                className={cn(
                  "h-9 w-9 rounded-full border transition-colors",
                  useSolidStyles
                    ? "border-border-light hover:bg-muted"
                    : "border-overlay hover:bg-background-overlay-hover"
                )}
                onClick={() => setMobileMenuOpen((s) => !s)}
                size="icon"
                type="button"
                variant="ghost"
              >
                <MenuIcon
                  className={cn(
                    "h-5 w-5 transition-colors",
                    useSolidStyles ? "text-icon-primary" : "text-white"
                  )}
                />
              </Button>
            </div>

            {/* Desktop right cluster */}
            <div className="hidden items-center gap-6 lg:flex lg:gap-4">
              <LocationBlock
                onModalOpenChange={setLocationModalOpen}
                useSolidStyles={useSolidStyles}
              />

              {locationReady && <FavoritesButton useSolidStyles={useSolidStyles} />}

              {showUserAvatar ? (
                <AvatarButton firstName={userFirstName} useSolidStyles={useSolidStyles} />
              ) : (
                <SignInButton useSolidStyles={useSolidStyles} />
              )}
            </div>
          </div>
        </div>

        {/* Mobile menu overlay */}
        {mobileMenuOpen && <MobileMenu onClose={() => setMobileMenuOpen(false)} />}
      </header>
      {/* Add top padding only when header is solid (not transparent) */}
      {useSolidStyles && <div aria-hidden="true" className="h-16 sm:h-20" />}
    </>
  );
}
