/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {},
  webpack(config) {
    config.experiments = { ...config.experiments, topLevelAwait: true };
    return config;
  },
  env: {
    BUCKET_ID: process.env.BUCKET_ID,
    PROJECT_ID: process.env.PROJECT_ID,
  },
};

module.exports = nextConfig;
