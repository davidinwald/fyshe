import withSerwistInit from "@serwist/next";
import type { NextConfig } from "next";

const withSerwist = withSerwistInit({
  swSrc: "src/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  transpilePackages: ["@fyshe/api", "@fyshe/auth", "@fyshe/db", "@fyshe/ui", "@fyshe/validators"],
  serverExternalPackages: ["@prisma/client", "prisma"],
};

export default withSerwist(nextConfig);
