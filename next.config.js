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
    JWT_SECRET: process.env.JWT_SECRET,
  },
};

module.exports = nextConfig;
