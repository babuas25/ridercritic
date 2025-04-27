/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    esmExternals: 'loose',
  },
  webpack: (config, { isServer }) => {
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