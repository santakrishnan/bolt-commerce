import { getUsedCarsPageTitle } from "@config/messages/used-cars";
import type { SrpUrlFilters } from "@config/routes/used-cars";
import type { ReactNode } from "react";

interface SrpShellProps {
  children?: ReactNode;
  /** Route-derived filters — used to render a server-side heading on first byte. */
  filters?: SrpUrlFilters;
}

/**
 * SrpShell — pure RSC layout wrapper for the Search Results Page.
 *
 * No "use client" directive — this component renders entirely on the server so
 * the browser receives meaningful HTML on the first byte.
 *
 * Renders a server-side heading from route-derived filters (e.g., body type,
 * make/model) so the page has visible content before SearchWrapper resolves.
 * This is an SSR + SEO win — the heading is in the HTML on the very first byte.
 *
 * Supported URL patterns:
 *   /used-cars               → "Used Cars for Sale"
 *   /used-cars/truck         → "Used Truck Cars for Sale"
 *   /used-cars/toyota        → "Used Toyota Cars for Sale"
 *   /used-cars/toyota/camry  → "Used Toyota Camry for Sale"
 */
export function SrpShell({ children, filters = {} }: SrpShellProps) {
  const title = getUsedCarsPageTitle({ type: "srp", filters });

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Server-rendered heading — visible on first byte, before SearchWrapper resolves.
          Visually hidden (sr-only) because SearchHero renders the visible heading client-side.
          Remains in the DOM for SEO crawlers and accessibility (screen readers). */}
      <h1 className="sr-only">{title}</h1>
      {children}
    </div>
  );
}
