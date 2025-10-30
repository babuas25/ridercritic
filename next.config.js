/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
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