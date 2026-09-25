import localFont from "next/font/local";

// Host Grotesk 400/500/600 (the only family in the design), self-hosted from
// @fontsource so the build never depends on Google Fonts being reachable.
export const hostGrotesk = localFont({
  src: [
    { path: "../../node_modules/@fontsource/host-grotesk/files/host-grotesk-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../../node_modules/@fontsource/host-grotesk/files/host-grotesk-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../../node_modules/@fontsource/host-grotesk/files/host-grotesk-latin-600-normal.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-host",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
  adjustFontFallback: "Arial",
});

// 700 is used only on the internal brand sheet (colour swatch names).
export const hostGroteskBold = localFont({
  src: "../../node_modules/@fontsource/host-grotesk/files/host-grotesk-latin-700-normal.woff2",
  weight: "700",
  display: "swap",
  preload: false,
  fallback: ["system-ui", "sans-serif"],
});
