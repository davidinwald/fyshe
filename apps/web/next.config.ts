import withSerwistInit from "@serwist/next";
import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const withSerwist = withSerwistInit({
  swSrc: "src/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  output: process.env.VERCEL ? "standalone" : undefined,
  outputFileTracingRoot: path.join(__dirname, "../../"),
  outputFileTracingIncludes: {
    "/*": ["../../packages/db/src/generated/**/*"],
  },
  transpilePackages: ["@fyshe/api", "@fyshe/auth", "@fyshe/db", "@fyshe/ui", "@fyshe/validators"],
};

export default withSerwist(nextConfig);
