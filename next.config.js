/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://eu-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://eu.i.posthog.com/:path*",
      },
      {
        source: "/ingest/decide",
        destination: "https://eu.i.posthog.com/decide",
      },
    ];
  },
  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,

  //
  images: {
    remotePatterns: [
      // strava profile pics
      {
        protocol: 'https',
        hostname: '*.cloudfront.net'
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com'
      },
    ],
  },
};

module.exports = nextConfig;
