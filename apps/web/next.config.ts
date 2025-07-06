import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["zustand", "@tanstack/react-query"],
  },
  
  // 3d-engine 패키지 transpile
  transpilePackages: [
    '@korean-3d-text/3d-engine'
  ],
};

export default nextConfig;
