import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { SiteRuntime } from "@/components/site/SiteRuntime";
import { JsonLd } from "@/components/ui/JsonLd";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";

/** Chrome shared by every public page: skip link, header, footer, motion runtime. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="absolute top-2 left-[-9999px] z-[100] bg-lime px-[14px] py-[10px] font-semibold text-ink focus:left-2"
      >
        Skip to content
      </a>
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <SiteRuntime />
      <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
    </>
  );
}
