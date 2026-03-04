import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: process.env.STANDALONE === "true" ? "standalone" : undefined,
  transpilePackages: ["@fyshe/api", "@fyshe/auth", "@fyshe/db", "@fyshe/ui", "@fyshe/validators"],
};

export default nextConfig;
