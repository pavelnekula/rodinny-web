import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/teodor", destination: "/teo", permanent: true },
      { source: "/teodor/pokemon", destination: "/teo/pokemon", permanent: true },
    ];
  },
};

export default nextConfig;
