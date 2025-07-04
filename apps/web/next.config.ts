import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["zustand", "@tanstack/react-query"],
  },
  webpack: (config, { dev, isServer }) => {
    // 서버사이드에서는 three.js 사용하지 않음
    if (isServer) {
      config.externals = [...(config.externals || []), 'three'];
    } else {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };

      // Three.js 모듈 alias 설정
      config.resolve.alias = {
        ...config.resolve.alias,
        'three': require.resolve('three'),
      };
    }

    // ES 모듈 처리
    config.module.rules.push({
      test: /\.m?js$/,
      resolve: {
        fullySpecified: false,
      },
    });

    return config;
  },
  
  
  // 클라이언트 사이드 전용으로 처리
  transpilePackages: [
    '@korean-3d-text/3d-engine'
  ]
};

export default nextConfig;
