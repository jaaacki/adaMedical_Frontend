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
    // Removed serverActions as it's now available by default
  },
  // API configuration - adjust to your backend URL
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        // Use port 5000 instead of 5555, which is the Flask app's default port in docker-compose
        destination: `http://localhost:5000/api/v1/:path*`,
      },
    ];
  },
}

module.exports = nextConfig