import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Arrow - Modern E-commerce",
  description: "Arrow - Modern E-commerce",
};

/**
 * Providers are applied outermost-first.
 * Order matters: ThemeProvider → ArrowProvider → LocationProvider →
 * QueryProvider → FavoritesProvider → SearchHistoryProvider → CartProvider
 */
const Providers = composeProviders(
  ThemeProvider,
  ArrowProvider,
  LocationProvider,
  QueryProvider,
  FavoritesProvider,
  SearchHistoryProvider,
  CartProvider
);

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={toyotaType.variable} lang="en" suppressHydrationWarning>
      <body>
        <Suspense fallback={null}>
          <Providers>
            <Header />
            {children}
          </Providers>
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
