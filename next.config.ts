import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Produce a self-contained build for the production Docker image.
  output: "standalone",

  // These ship CJS/dynamic requires — keep them out of the bundler.
  serverExternalPackages: ["mongoose", "nodemailer", "imagekit"],

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "ik.imagekit.io" },
    ],
  },
};

export default nextConfig;
