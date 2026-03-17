"use client";

import { Button, UserIcon } from "@tfs-ucmp/ui";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ROUTES } from "~/lib/routes/constants";

export const SignInButton = ({ useSolidStyles }: { useSolidStyles: boolean }) => (
  <Button
    className={cn(
      "h-9 gap-1.5 rounded-full border px-4 transition-colors",
      useSolidStyles
        ? "border-border-light bg-white text-black hover:bg-gray-50"
        : "border-white/30 bg-transparent text-white hover:bg-white/10"
    )}
  >
    <Link className="flex flex-row items-center gap-2" href={ROUTES.SIGN_IN}>
      <UserIcon
        className={cn(
          "h-4 w-4 transition-colors",
          useSolidStyles ? "text-actions-primary" : "text-white"
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

export const AvatarButton = ({ firstName, useSolidStyles = true }: AvatarButtonProps) => {
  const initial = firstName.charAt(0).toUpperCase();
  const displayName = firstName.length > 6 ? `${firstName.slice(0, 6)}...` : firstName;

  return (
    <Link
      className={cn(
        "flex h-9 items-center gap-2 rounded-full border px-3 transition-colors",
        useSolidStyles
          ? "border-border-light hover:bg-gray-50"
          : "border-white/30 hover:bg-white/10"
      )}
      href={ROUTES.MY_GARAGE}
    >
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-actions-primary font-semibold text-sm text-white">
        {initial}
      </div>
      <span className={cn("text-sm", useSolidStyles ? "text-foreground" : "text-white")}>
        {displayName}
      </span>
    </Link>
  );
};

interface MobileUserButtonProps {
  firstName: string;
  showAvatar: boolean;
  useSolidStyles: boolean;
}

export const MobileUserButton = ({
  showAvatar,
  firstName,
  useSolidStyles,
}: MobileUserButtonProps) => {
  if (showAvatar) {
    return (
      <Link
        aria-label="User profile"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-red-600 font-semibold text-sm text-white"
        href={ROUTES.MY_GARAGE}
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
      <Link aria-label="Sign in" href={ROUTES.SIGN_IN}>
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
