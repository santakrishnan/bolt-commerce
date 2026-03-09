import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@tfs-ucmp/shared/providers";
import { Footer } from "~/components/layout/footer";
import { Header } from "~/components/layout/header";
import { CartProvider } from "~/components/providers/cart-provider";
import { FavoritesProvider } from "~/components/providers/favorites-provider";
import { LocationProvider } from "~/components/providers/location-provider";
import { SearchHistoryProvider } from "~/components/providers/search-history-provider";
import { FeatureFlagDebug } from "~/components/shared/feature-flag-debug";
import { ArrowProvider } from "~/lib/arrow";
import { toyotaType } from "~/lib/fonts";

export const metadata: Metadata = {
  title: "Arrow - Modern E-commerce",
  description: "Arrow - Modern E-commerce",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={toyotaType.variable} lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <ArrowProvider>
            <LocationProvider>
              <FavoritesProvider>
                <SearchHistoryProvider>
                  <CartProvider>
                    <Header />
                    {children}
                  </CartProvider>
                </SearchHistoryProvider>
              </FavoritesProvider>
            </LocationProvider>
          </ArrowProvider>
          {/* Footer is a Server Component with no provider dependencies — keep it outside */}
          <Footer />
          {/* Feature Flag Debug Panel - only visible in development */}
          <FeatureFlagDebug />
        </ThemeProvider>
      </body>
    </html>
  );
}
