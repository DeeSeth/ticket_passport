import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      // Ticketmaster image CDN domains
      {
        protocol: 'https',
        hostname: 's1.ticketm.net',
      },
      {
        protocol: 'https',
        hostname: '*.ticketm.net',
      },
      {
        protocol: 'https',
        hostname: 'media.ticketmaster.com',
      },
    ],
  },
};

export default nextConfig;
