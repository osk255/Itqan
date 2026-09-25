import type { CSSProperties } from "react";
import { routes } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";
import { hostGroteskBold } from "../fonts";
import { Picture } from "@/components/ui/Picture";
import { BrandLogo3D } from "@/components/brand/BrandLogo3D";
import { PixelLogos } from "@/components/brand/PixelLogos";

// Internal brand sheet (README › Routes: /brand, noindex). Port of
// design_handoff_itqan_website/site/brand/Brand.dc.html with its own dark palette.
export const metadata = pageMetadata({
  title: "Itqan Pharma — Brand identity",
  description: "Internal brand sheet: logo lockups, pixel system, colour and type.",
  path: routes.brand,
  noindex: true,
});

const eyebrow = "m-0 text-[11px] font-medium tracking-[.18em] text-[#bcd155] uppercase";
const caption = "text-[11px] font-medium tracking-[.12em] text-[#a99fb3] uppercase";
const h2 = "m-0 text-[clamp(30px,4vw,60px)] leading-none font-semibold tracking-[-.026em]";
const section = "border-t border-[rgba(241,237,230,.14)]";
const inner = "mx-auto flex max-w-[1560px] flex-col gap-7 px-gutter py-[clamp(56px,7vw,110px)]";
const bold: CSSProperties = { fontFamily: hostGroteskBold.style.fontFamily, fontWeight: 700 };

const LOCKUPS = [
  { image: "brand/logo", alt: "Itqan Pharma full-colour logo on bone", bg: "bg-[#f1ede6]", label: "Primary · full colour on bone" },
  { image: "brand/logo-reversed", alt: "Itqan Pharma reversed logo on ink", bg: "bg-[#1a1022] border border-[rgba(241,237,230,.14)]", label: "Reversed · on ink" },
  { image: "brand/logo-reversed", alt: "Itqan Pharma reversed logo on plum", bg: "bg-[#52276f]", label: "Reversed · on plum" },
  { image: "brand/logo", alt: "Itqan Pharma single-colour ink logo on lime", bg: "bg-[#bcd155]", label: "Single colour · ink on lime", mono: true },
] as const;

const SWATCHES = [
  { name: "Plum", note: "#52276F · Primary", className: "bg-[#52276f]" },
  { name: "Lime", note: "#BCD155 · Action", className: "bg-[#bcd155] text-[#0f0914]" },
  { name: "Sky", note: "#1EA9E0 · Detail", className: "bg-[#1ea9e0] text-[#0f0914]" },
  { name: "Ink", note: "#0F0914 · Ground", className: "bg-[#0f0914] border border-[rgba(241,237,230,.14)]" },
  { name: "Bone", note: "#F1EDE6 · Paper", className: "bg-[#f1ede6] text-[#0f0914]" },
];

export default function BrandPage() {
  return (
    <div className="min-h-screen bg-[#0f0914] text-[#f1ede6] [&_a]:text-[#bcd155] [&_a:hover]:text-[#d4e48a] [&_:focus-visible]:outline-[#bcd155]">
      <header className="sticky top-0 z-20 border-b border-[rgba(241,237,230,.14)] bg-[rgba(15,9,20,.9)] backdrop-blur-[12px]">
        <div className="mx-auto flex h-[72px] max-w-[1560px] items-center justify-between gap-5 px-gutter">
          <a href={routes.home} aria-label="Itqan Pharma — home">
            <Picture image="brand/logo-reversed" alt="Itqan Pharma" sizes="60px" priority className="h-11 w-auto" />
          </a>
          <span className="text-[11px] font-medium tracking-[.16em] text-[#a99fb3] uppercase">Brand identity · v1</span>
        </div>
      </header>
      <main>
        <section className="mx-auto grid max-w-[1560px] grid-cols-[repeat(auto-fit,minmax(min(100%,480px),1fr))] items-center gap-8 px-gutter py-[clamp(40px,6vw,96px)]">
          <div className="flex flex-col gap-6">
            <p className={eyebrow}>00 / The mark</p>
            <h1 className="m-0 text-[clamp(40px,6vw,100px)] leading-[.94] font-semibold tracking-[-.028em]">
              Itqan Pharma.
              <br />
              Fueling wellness.
            </h1>
            <p className="m-0 max-w-[48ch] text-[17px] leading-[1.6] text-[#a99fb3]">
              The full Itqan logo as a 3D object, sampled pixel by pixel from the official logo file in lime, plum and sky. Download it as GLB or OBJ for
              motion, signage and events.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="/brand/Logo3D.html"
                className="flex min-h-[52px] items-center gap-5 rounded-full bg-[#bcd155] px-[22px] text-[12px] font-medium tracking-[.12em] !text-[#0f0914] uppercase no-underline"
              >
                Open 3D viewer · GLB / OBJ <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
          <div className="relative h-[clamp(320px,50vh,560px)] rounded-[28px] bg-[radial-gradient(closest-side,rgba(123,69,163,.5),transparent_75%)]">
            <BrandLogo3D />
          </div>
        </section>

        <section aria-labelledby="lockups" className={section}>
          <div className={inner}>
            <p className={eyebrow}>01 / Lockups</p>
            <h2 id="lockups" className={h2}>
              Logo on every ground
            </h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-3">
              {LOCKUPS.map((l) => (
                <figure key={l.label} className="m-0 flex flex-col gap-[10px]">
                  <div className={`grid aspect-[4/3] place-items-center rounded-2xl p-[14%] ${l.bg}`}>
                    <Picture image={l.image} alt={l.alt} sizes="(max-width: 700px) 70vw, 260px" className={"mono" in l ? "brightness-0" : ""} />
                  </div>
                  <figcaption className={caption}>{l.label}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section aria-labelledby="pixels" className={section}>
          <div className={inner}>
            <PixelLogos />
          </div>
        </section>

        <section aria-labelledby="colour" className={section}>
          <div className={inner}>
            <p className={eyebrow}>03 / Colour</p>
            <h2 id="colour" className={h2}>
              Sampled from the logo
            </h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(50%,200px),1fr))] gap-3">
              {SWATCHES.map((s) => (
                <div key={s.name} className={`flex min-h-[220px] flex-col justify-between rounded-2xl p-5 ${s.className}`}>
                  <span className="text-[20px]" style={bold}>
                    {s.name}
                  </span>
                  <span className="text-[12px] font-medium tracking-[.1em]">{s.note}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section aria-labelledby="type" className={section}>
          <div className="mx-auto grid max-w-[1560px] grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-3 px-gutter py-[clamp(56px,7vw,110px)]">
            <div className="flex flex-col gap-[18px] pr-5">
              <p className={eyebrow}>04 / Type</p>
              <h2 id="type" className={h2}>
                Funnel Display + Funnel Sans
              </h2>
            </div>
            <div className="flex flex-col gap-[14px] rounded-2xl border border-[rgba(241,237,230,.14)] p-6">
              <span className={caption}>Display · Funnel Display 700</span>
              <span className="text-[56px] leading-none font-semibold tracking-[-.028em]">Aa Perfection</span>
            </div>
            <div className="flex flex-col gap-[14px] rounded-2xl border border-[rgba(241,237,230,.14)] p-6">
              <span className={caption}>Text · Funnel Sans 400</span>
              <span className="text-[18px] leading-[1.55]">Improving the health and quality of life.</span>
              <span className="text-[12px] font-medium tracking-[.16em] text-[#bcd155] uppercase">01 / Product portfolio</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
