/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "src/test/",
        "**/*.d.ts",
        "**/*.config.*",
        "src/pages/_app.tsx",
        "src/pages/_document.tsx",
        "src/components/map/**",
        "src/hooks/useMapData.tsx",
        "src/hooks/usePoliceDataClusters.tsx",
        "src/hooks/usePoliceDataForMap.tsx",
      ],
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
