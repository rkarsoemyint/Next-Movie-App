import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        pathname: '/t/p/**', // TMDB ရဲ့ ပုံလမ်းကြောင်း pattern
      },
    ],
  },
};

export default nextConfig;
