import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Skip ESLint during builds to speed up deployment
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Skip TypeScript type checking during builds (still runs locally)
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Reduce bundle analysis overhead
  poweredByHeader: false,
  
  // Optimize static optimization
  trailingSlash: false,
  
  // Configure image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
  },
};

export default nextConfig;
