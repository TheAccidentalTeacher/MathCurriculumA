/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize bundle
  experimental: {
    optimizePackageImports: ['react-plotly.js', '@react-three/fiber', '@react-three/drei']
  },
  
  // Skip type checking during build (do it in CI instead)
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'production'
  },
  
  // Skip ESLint during build
  eslint: {
    ignoreDuringBuilds: true
  }
}

module.exports = nextConfig