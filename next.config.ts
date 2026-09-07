import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Produce a self-contained build for the production Docker image.
  output: "standalone",

  // Mongoose and nodemailer ship CJS/dynamic requires — keep them unbundled.
  serverExternalPackages: ["mongoose", "nodemailer"],

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
};

export default nextConfig;
