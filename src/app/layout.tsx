import type { Metadata, Viewport } from "next";
import { hostGrotesk } from "./fonts";
import { SITE_URL, company } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: company.legalName,
  applicationName: company.brandName,
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0e0a12" },
    { media: "(prefers-color-scheme: light)", color: "#f6f3ee" },
  ],
};

// Runs before first paint: apply the saved theme (no flash) and flag that JS is
// available, which lets CSS hide scroll-reveal elements until they are armed.
const BOOT_SCRIPT = `(function(){var d=document.documentElement;try{d.dataset.theme=localStorage.getItem("itqan-theme")==="light"?"light":"dark"}catch(e){}d.classList.add("js")})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" className={hostGrotesk.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
