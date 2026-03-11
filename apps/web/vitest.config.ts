import path from "node:path";
import nextjsConfig from "@arrow/vitest-config/nextjs";
import { defineConfig, mergeConfig } from "vitest/config";

export default defineConfig(
  mergeConfig(nextjsConfig, {
    test: {
      name: "web",
    },
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "../../packages/ui/src"),
        "~": path.resolve(import.meta.dirname, "./src"),
        ui: path.resolve(import.meta.dirname, "../../packages/ui/src"),
      },
    },
  })
);
