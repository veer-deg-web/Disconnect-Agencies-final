import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  images: {
    unoptimized: true,
  },
  experimental: {
    // reactCompiler is now an experimental feature in some versions
    // or standard in others, keeping it if their original had it.
  }
};

export default nextConfig;
