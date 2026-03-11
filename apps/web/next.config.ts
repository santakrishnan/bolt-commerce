import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  cacheComponents: true,
  cacheLife: {
    /**
     * Landing page data (hero stats, vehicle finder, vehicle count).
     * 15-min stale window, 15-min revalidation, 1-hour hard expiry.
     */
    landing: { stale: 900, revalidate: 900, expire: 3600 },
    /**
     * Visitor profile — shorter stale window for fresher personalisation.
     * 5-min stale, 10-min revalidation, 1-hour hard expiry.
     */
    profile: { stale: 300, revalidate: 600, expire: 3600 },
  },
  transpilePackages: ["@tfs-ucmp/ui", "@tfs-ucmp/ui-theme"],
  poweredByHeader: false,
  compress: true,
  output: "standalone",
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [],
  },
  turbopack: {
    root: path.resolve(import.meta.dirname, "..", ".."),
  },
};

export default nextConfig;
