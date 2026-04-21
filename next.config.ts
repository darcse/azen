import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "www.capfil.co.kr",
      },
      {
        protocol: "http",
        hostname: "www.capfil.co.kr",
      },
    ],
  },
};

export default nextConfig;
