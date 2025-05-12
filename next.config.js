/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  // Configure async loading of scripts
  experimental: {
    // For better CSS optimization
    optimizeCss: true,
    // Removed serverActions as it's now available by default
  },
  // API configuration - adjust to your backend URL
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5555/api/v1'}/:path*`,
      },
    ];
  },
}

module.exports = nextConfig