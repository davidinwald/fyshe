import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@fyshe/api", "@fyshe/auth", "@fyshe/db", "@fyshe/ui", "@fyshe/validators"],
};

export default nextConfig;
