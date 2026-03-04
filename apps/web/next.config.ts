import withSerwistInit from "@serwist/next";
import type { NextConfig } from "next";

const withSerwist = withSerwistInit({
  swSrc: "src/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  output: process.env.STANDALONE === "true" ? "standalone" : undefined,
  transpilePackages: ["@fyshe/api", "@fyshe/auth", "@fyshe/db", "@fyshe/ui", "@fyshe/validators"],
};

export default withSerwist(nextConfig);
