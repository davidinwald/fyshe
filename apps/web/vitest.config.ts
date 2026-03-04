import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    exclude: ["e2e/**"],
    passWithNoTests: true,
    reporters: ["default", "junit"],
    outputFile: {
      junit: "../../test-results/web-results.xml",
    },
  },
});
