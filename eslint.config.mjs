import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const config = [
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Images are pre-optimised into responsive WebP sets by scripts/optimize-images.mjs
      // and rendered with <img srcset>; next/image optimisation is unavailable in a static export.
      "@next/next/no-img-element": "off",
    },
  },
  { ignores: [".next/**", "out/**", "node_modules/**", "design_handoff_itqan_website/**", "next-env.d.ts", "public/**"] },
];

export default config;
