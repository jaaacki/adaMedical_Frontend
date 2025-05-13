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
  // API configuration - using environment variables for the backend URL
  async rewrites() {
    // Get API URL from environment variables or use a default
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5555/api/v1';
    
    console.log(`Proxying API requests to: ${apiUrl}`);
    
    return [
      {
        source: '/api/:path*',
        // Use the API URL from environment or default to port 5555 (Flask app in docker-compose)
        destination: `${apiUrl}/:path*`,
      },
    ];
  },
}