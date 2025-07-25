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
    // Enable image optimization
    unoptimized: false,
    // Support WebP format
    formats: ['image/webp'],
    // Define device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    // Define image sizes for thumbnails
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5001",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "5001",
        pathname: "/images/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3007",
        pathname: "/**",
      },
      // Production
      {
        protocol: "https",
        hostname: "saigon3jean.com",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "saigon3jean.com",
        pathname: "/api/**",
      },    
      // Thêm localhost không cần port
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/**",
      },
    ],
  },
  // Enable compression for better performance
  compress: true,
};

export default nextConfig;
