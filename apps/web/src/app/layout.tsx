import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Suspense } from "react";
import "./globals.css";
import { ThemeProvider } from "@tfs-ucmp/shared/providers";
import { Footer } from "~/components/layout/footer";
import { Header } from "~/components/layout/header";
import { CartProvider } from "~/components/providers/cart-provider";
import { FavoritesProvider } from "~/components/providers/favorites-provider";
import { LocationProvider } from "~/components/providers/location-provider";
import { QueryProvider } from "~/components/providers/query-provider";
import { SearchHistoryProvider } from "~/components/providers/search-history-provider";
import { FeatureFlagDebug } from "~/components/shared/feature-flag-debug";
import { ArrowProvider } from "~/lib/arrow";
import { composeProviders } from "~/lib/compose-providers";
import { toyotaType } from "~/lib/fonts";
import { MANUAL_ZIP_COOKIE, ZIP_RE } from "~/lib/routes/constants";

export const metadata: Metadata = {
  title: "Arrow - Modern E-commerce",
  description: "Arrow - Modern E-commerce",
};

/**
 * Providers are applied outermost-first.
 * Order: ThemeProvider → ArrowProvider → LocationProvider →
 * QueryProvider → FavoritesProvider → SearchHistoryProvider → CartProvider
 *
 * LocationProvider is rendered via LocationInit (async Server Component)
 * so cookies() is called inside the Suspense boundary, not at layout level.
 */
const OuterProviders = composeProviders(ThemeProvider, ArrowProvider);
const InnerProviders = composeProviders(
  QueryProvider,
  FavoritesProvider,
  SearchHistoryProvider,
  CartProvider
);

/**
 * Async Server Component that reads the manual-zip cookie and passes it
 * to the client LocationProvider. Rendered inside <Suspense> so the
 * cookies() call doesn't block the entire layout.
 */
async function LocationInit({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const savedZip = cookieStore.get(MANUAL_ZIP_COOKIE)?.value;
  const initialZip = savedZip && ZIP_RE.test(savedZip) ? savedZip : null;

  return <LocationProvider initialZip={initialZip}>{children}</LocationProvider>;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={toyotaType.variable} lang="en" suppressHydrationWarning>
      <body>
        <Suspense fallback={null}>
          <OuterProviders>
            <LocationInit>
              <InnerProviders>
                <Header />
                {children}
              </InnerProviders>
            </LocationInit>
          </OuterProviders>
        </Suspense>
        {/* Footer is a Server Component with no provider dependencies — keep it outside */}
        <Footer />
        {/* Feature Flag Debug Panel - excluded from production bundle entirely */}
        {process.env.NODE_ENV !== "production" && (
          <Suspense fallback={null}>
            <FeatureFlagDebug />
          </Suspense>
        )}
      </body>
    </html>
  );
}
