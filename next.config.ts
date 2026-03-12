import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "xbsoftware.com" },
      { protocol: "https", hostname: "**.xbsoftware.com" },
    ],
  },
};

export default nextConfig;
