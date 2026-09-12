import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Wildcarded rather than a specific project ref so this doesn't need
    // updating if the Supabase project ever changes. Covers both public
    // Storage URLs (product images) and any other Supabase-hosted asset.
    // Without this, next/image hard-errors on any real image URL that
    // isn't same-origin — previously untriggered only because no real
    // product images existed yet.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
};

export default nextConfig;
