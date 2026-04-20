import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image Remote Patterns for Backend on Port 5000 - FIXED IPv6/IPv4 issue
  images: {
    unoptimized: true, //
    remotePatterns: [     
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
    ],
    loader: 'default',
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
    
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
};

export default nextConfig;
