import type { Metadata } from "next";
import { routes } from "@/lib/site";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { HeadlineLines, HeroGlow, PillLink } from "@/components/ui/primitives";

export const metadata: Metadata = { title: "Page not found — Itqan Pharmaceutical Industries", robots: { index: false } };

/** Static 404 (out/404.html, served by Netlify for unknown paths). */
export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main">
        <section className="relative overflow-hidden">
          <HeroGlow parallax={0} className="-top-[30vw] -right-[15vw] w-[min(90vw,1000px)]" />
          <div className="relative mx-auto flex max-w-[1560px] flex-col gap-[clamp(18px,2vw,26px)] px-gutter pt-[clamp(36px,5vw,72px)] pb-[clamp(64px,8vw,120px)]">
            <p className="m-0 text-[14px] font-medium text-mute">Error 404</p>
            <HeadlineLines lines={["Page not found"]} className="text-[clamp(40px,5.6vw,92px)] leading-[.95] tracking-[-.024em]" />
            <p className="m-0 max-w-[52ch] text-[clamp(17px,1.4vw,21px)] leading-[1.55] text-mute">
              The page you were looking for does not exist or has moved.
            </p>
            <div className="flex flex-wrap gap-3">
              <PillLink href={routes.home}>Home</PillLink>
              <PillLink href={routes.products} variant="ghost">
                Products
              </PillLink>
              <PillLink href={routes.contact} variant="ghost">
                Contact Us
              </PillLink>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
