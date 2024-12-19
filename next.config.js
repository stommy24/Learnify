const { withSentryConfig } = require('@sentry/nextjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  sentry: {
    hideSourceMaps: true,
  },
};

const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry webpack plugin
  silent: true,
};

module.exports = withSentryConfig(
  nextConfig,
  sentryWebpackPluginOptions
); 