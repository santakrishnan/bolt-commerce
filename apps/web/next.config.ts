import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  cacheComponents: true,
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
