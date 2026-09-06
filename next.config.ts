import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Produce a self-contained build for the production Docker image.
  output: "standalone",

  // Mongoose ships its own CJS/dynamic requires — keep it out of the bundler.
  serverExternalPackages: ["mongoose"],

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
};

export default nextConfig;
