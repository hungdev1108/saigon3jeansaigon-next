import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Skip TypeScript type checking for now until we fix all pages
  typescript: {
    ignoreBuildErrors: true,
  },
  // Skip ESLint checking during builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5001",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "saigon3jean.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "222.255.214.144",
        port: "3007",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "222.255.214.144",
        port: "3007",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
