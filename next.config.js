/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  // Source directory configuration
  distDir: '.next',
  // Configure async loading of scripts
  experimental: {
    // For better CSS optimization
    optimizeCss: true,
  },
  // API configuration - fix the path mapping to match the backend structure
  async rewrites() {
    return [
      {
        // Frontend requests to /api/users/me
        source: '/api/:path*',
        // Backend expects /api/v1/users/me - insert the v1 part
        destination: 'http://localhost:5555/api/v1/:path*',
      },
    ];
  },
}

module.exports = nextConfig