import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/admin',
        destination: 'https://auto-repair-dashboard.vercel.app/login',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
