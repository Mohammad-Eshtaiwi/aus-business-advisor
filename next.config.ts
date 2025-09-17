import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Disable type checking during build
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
