/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false,
        dns: false,
        tls: false,
        fs: false,
        "original-fs": false,
      };
    }

    return config;
  },
  typescript: {
    // Disables type checking during the build
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
