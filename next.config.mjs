/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required for Prisma to work correctly on Vercel serverless
  serverExternalPackages: ["@prisma/client", "prisma"],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...(config.externals || []), "@prisma/client"];
    }
    return config;
  },
};

export default nextConfig;
