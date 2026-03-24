import type { ReactNode } from "react";

interface SrpShellProps {
  children?: ReactNode;
  initialBodyType?: string;
}

/**
 * SrpShell — pure RSC layout wrapper for the Search Results Page.
 *
 * No "use client" directive — this component renders entirely on the server so
 * the browser receives meaningful HTML on the first byte.
 *
 * The hero heading and search bar are owned by SearchHero (client component)
 * so they can handle interactive state (search input, filters, sticky header).
 * This shell provides the outer layout that streams immediately via Suspense.
 */
export function SrpShell({ children }: SrpShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {children}
    </div>
  );
}
