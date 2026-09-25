import type { NextConfig } from "next";

// Fully static site: every route is pre-rendered to HTML in `out/` and served
// by Netlify's CDN. No server runtime (see docs/DECISIONS.md ADR-006).
const nextConfig: NextConfig = {
  output: "export",
  // WordPress-style URLs (/about-us/) so the live site's URLs keep working.
  trailingSlash: true,
  // Images are pre-optimised by `npm run images`; next/image is not used.
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
