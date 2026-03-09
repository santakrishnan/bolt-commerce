"use client";

import { Button, HeartIcon, MapPinIcon, MenuIcon, UserIcon } from "@tfs-ucmp/ui";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { getCurrentUserSync } from "~/lib/flags/client";
import { LocationBlock } from "./header/location-block";

const SignInButton = ({ useSolidStyles }: { useSolidStyles: boolean }) => (
  <Button
    className={cn(
      "h-9 gap-1.5 rounded-full border px-4 transition-colors",
      useSolidStyles
        ? "border-[#ccc] bg-white text-black hover:bg-gray-50"
        : "border-white/30 bg-transparent text-white hover:bg-white/10"
    )}
  >
    <Link className="flex flex-row items-center gap-2" href="/sign-in">
      <UserIcon
        className={cn(
          "h-4 w-4 transition-colors",
          useSolidStyles ? "text-[#EF4444]" : "text-white"
        )}
      />
      <span>Sign In</span>
    </Link>
  </Button>
);

interface AvatarButtonProps {
  firstName: string;
  useSolidStyles?: boolean;
}

const AvatarButton = ({ firstName, useSolidStyles = true }: AvatarButtonProps) => {
  const initial = firstName.charAt(0).toUpperCase();
  const displayName = firstName.length > 6 ? `${firstName.slice(0, 6)}...` : firstName;

  return (
    <Link
      className={cn(
        "flex h-9 items-center gap-2 rounded-full border px-3 transition-colors",
        useSolidStyles ? "border-[#ccc] hover:bg-gray-50" : "border-white/30 hover:bg-white/10"
      )}
      href="/my-garage"
    >
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#EB0A1E] font-semibold text-sm text-white">
        {initial}
      </div>
      <span className={cn("text-sm", useSolidStyles ? "text-foreground" : "text-white")}>
        {displayName}
      </span>
    </Link>
  );
};

interface MobileUserButtonProps {
  showAvatar: boolean;
  firstName: string;
  useSolidStyles: boolean;
}

const MobileUserButton = ({ showAvatar, firstName, useSolidStyles }: MobileUserButtonProps) => {
  if (showAvatar) {
    return (
      <Link
        aria-label="User profile"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-red-600 font-semibold text-sm text-white"
        href="/my-garage"
      >
        {firstName.charAt(0).toUpperCase()}
      </Link>
    );
  }

  return (
    <Button
      className={cn(
        "h-9 w-9 rounded-full border transition-colors",
        useSolidStyles
          ? "border-border-light hover:bg-muted"
          : "border-overlay hover:bg-background-overlay-hover"
      )}
      size="icon"
      variant="ghost"
    >
      <Link aria-label="Sign in" href="/sign-in">
        <UserIcon
          className={cn(
            "h-5 w-5 transition-colors",
            useSolidStyles ? "text-icon-primary" : "text-white"
          )}
        />
      </Link>
    </Button>
  );
};

export function Header() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const isMyGaragePage = pathname === "/my-garage";
  const isSRP = pathname === "/used-cars";
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Get current user for authentication state.
  // We must initialise with SSR-safe values (no localStorage on the server)
  // and then update after mount to avoid a hydration mismatch.
  const [showUserAvatar, setShowUserAvatar] = useState(false);
  const [userFirstName, setUserFirstName] = useState("Guest");

  useEffect(() => {
    const currentUser = getCurrentUserSync();
    const redirectToGarage = currentUser.flags.redirectToMyGarage;
    const isReturningUser = currentUser.flags.showPersonalizedHeroBanner;
    setShowUserAvatar(!redirectToGarage && isReturningUser);
    setUserFirstName(currentUser.firstName);
  }, []);

  useEffect(() => {
    const update = () => setIsScrolled(window.scrollY > 0);
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
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Use solid/white styles for all pages except home and my-garage (these use transparent until scrolled)
  const useSolidStyles = !(isHomePage || isMyGaragePage) || isScrolled;

  // Shared nav link styles
  const navLinkClass = cn(
    "font-normal text-sm leading-none hover:underline hover:underline-offset-4",
    useSolidStyles ? "text-text-dark" : "text-white"
  );

  return (
    <>
      <header
        className={cn(
          "fixed top-0 z-[35] w-full transition-all duration-600",
          useSolidStyles ? "bg-white" : "border-transparent bg-transparent"
        )}
      >
        <div className="mx-auto flex h-16 max-w-[var(--container-2xl)] items-center px-4 sm:h-20 sm:px-6 lg:px-20">
          {/* Left: Logo */}
          <div className="flex items-center lg:mr-5 lg:flex-none xl:flex-1">
            <Link className="flex items-center gap-2.5" href="/">
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
          {/* TODO: Temporary - all nav links point to a sample VDP page until real routes are implemented */}
          <nav className="hidden items-center gap-3 lg:flex xl:gap-12">
            <Link
              className={navLinkClass}
              href="/used-cars/toyota/camry/se/2024/1G1AF1F57A7192174"
              style={{ fontFamily: "var(--font-toyota-type)" }}
            >
              Buy
            </Link>
            <Link
              className={navLinkClass}
              href="/used-cars/toyota/camry/se/2024/1G1AF1F57A7192174"
              style={{ fontFamily: "var(--font-toyota-type)" }}
            >
              Finance
            </Link>
            <Link
              className={navLinkClass}
              href="/used-cars/toyota/camry/se/2024/1G1AF1F57A7192174"
              style={{ fontFamily: "var(--font-toyota-type)" }}
            >
              Why Arrow
            </Link>
          </nav>

          {/* Right: MOBILE (match screenshot), DESKTOP unchanged */}
          <div className="flex flex-1 items-center justify-end">
            {/* Mobile right cluster: heart, user, hamburger */}
            <div className="flex items-center gap-3 lg:hidden">
              <Button
                className={cn(
                  "h-9 w-9 rounded-full border transition-colors",
                  useSolidStyles
                    ? "border-border-light hover:bg-muted"
                    : "border-overlay hover:bg-background-overlay-hover"
                )}
                size="icon"
                variant="ghost"
              >
                <Link aria-label="Favorites" href="/favorites">
                  <HeartIcon
                    // className={cn(
                    //   "h-5 w-5 transition-colors",
                    //   useSolidStyles ? "text-icon-primary" : "text-white"
                    // )}
                    className="h-5 w-5 text-icon-primary"
                  />
                </Link>
              </Button>

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

            {/* Desktop right cluster (unchanged from your code) */}
            <div className="hidden items-center gap-6 lg:flex">
              <div className="hidden items-center gap-1 text-sm sm:flex">
                <MapPinIcon
                  className={cn(
                    "h-4.5 w-4.5 transition-colors",
                    useSolidStyles ? "text-icon-primary" : "text-white"
                  )}
                />
                {/* User-selectable location block */}
                <LocationBlock useSolidStyles={useSolidStyles} />
              </div>

              <Button
                className={cn(
                  "h-9 w-9 rounded-full border transition-colors",
                  useSolidStyles
                    ? "border-border-light hover:bg-muted"
                    : "border-overlay hover:bg-background-overlay-hover"
                )}
                size="icon"
                variant="ghost"
              >
                <Link aria-label="Favorites" href="/favorites">
                  <HeartIcon
                    // className={cn(
                    //   "h-5 w-5 transition-colors",
                    //   useSolidStyles ? "text-icon-primary" : "text-primary"
                    // )}
                    className="h-5 w-5 text-icon-primary"
                  />
                </Link>
              </Button>

              {showUserAvatar || isSRP ? (
                <AvatarButton firstName={userFirstName} useSolidStyles={useSolidStyles} />
              ) : (
                <SignInButton useSolidStyles={useSolidStyles} />
              )}
            </div>
          </div>
        </div>
        {/* Mobile menu overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              aria-label="Close menu"
              className="absolute inset-0 m-0 border-0 bg-black/40 p-0 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
              type="button"
            />
            <nav className="absolute top-0 right-0 h-full w-full max-w-full bg-gradient-to-b from-white/95 to-white p-6 shadow-lg">
              <div className="flex items-center justify-between border-gray-100 border-b pb-4">
                <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                  <span className="font-bold text-lg text-primary">ARROW</span>
                </Link>
                <button
                  aria-label="Close menu"
                  className="rounded p-1 text-gray-700 hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                  type="button"
                >
                  Close
                </button>
              </div>

              <ul className="mt-6 flex flex-col gap-2">
                <li>
                  <Link
                    className="block rounded px-3 py-2 font-medium text-base text-gray-800 hover:bg-gray-50"
                    href="/used-cars/toyota/camry/se/2024/1G1AF1F57A7192174"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Buy
                  </Link>
                </li>
                <li>
                  <Link
                    className="block rounded px-3 py-2 font-medium text-base text-gray-800 hover:bg-gray-50"
                    href="/used-cars/toyota/camry/se/2024/1G1AF1F57A7192174"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Finance
                  </Link>
                </li>
                <li>
                  <Link
                    className="block rounded px-3 py-2 font-medium text-base text-gray-800 hover:bg-gray-50"
                    href="/used-cars/toyota/camry/se/2024/1G1AF1F57A7192174"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Why Arrow
                  </Link>
                </li>
                <li className="mt-4 flex items-center gap-2">
                  <MapPinIcon className={cn("h-4.5 w-4.5 text-primary")} />
                  <LocationBlock useSolidStyles={true} />
                </li>
              </ul>
            </nav>
          </div>
        )}
      </header>
      {/* Add top padding only when header is solid (not transparent) */}
      {useSolidStyles && <div aria-hidden="true" className="h-16 sm:h-20" />}
    </>
  );
}
