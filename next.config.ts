import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "profile-image-s3.s3.ap-southeast-1.amazonaws.com",
    ],
  },
};

export default nextConfig;
