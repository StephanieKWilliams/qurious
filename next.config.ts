import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Add type-safe configuration here
  experimental: {
    // TypeScript will catch invalid options here
    typedRoutes: true,
  },
}

export default nextConfig
