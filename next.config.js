/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.bdhonda.com',
        pathname: '/**',
      },
    ],
    // Configure image qualities to avoid warnings
    minimumCacheTTL: 60,
    formats: ['image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Add qualities configuration
    qualities: [10, 25, 50, 75, 80, 85, 90, 95, 100]
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  webpack: (config, { isServer }) => {
    // Disable caching to prevent module resolution issues
    config.cache = false;
    
    // Handle undici package
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        undici: false,
        fetch: false,
        crypto: false,
        url: false,
        http: false,
        https: false,
        util: false,
        zlib: false,
        stream: false,
        'stream-browserify': false
      };
    }

    return config;
  },
};

module.exports = nextConfig;