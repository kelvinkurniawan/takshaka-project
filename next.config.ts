import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // Exclude better-sqlite3 dan node modules fs saat build untuk Cloudflare
    if (!isServer) {
      config.externals = {
        ...config.externals,
        "better-sqlite3": "better-sqlite3",
        fs: "fs",
      };
    }
    return config;
  },
};

export default nextConfig;
