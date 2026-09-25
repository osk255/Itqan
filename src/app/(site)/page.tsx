import { approvalsText, categories, dosageForms, products, statements } from "@/lib/catalogue";
import { routes } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";
import { HeroStage } from "@/components/home/HeroStage";
import { PortfolioTabs } from "@/components/home/PortfolioTabs";
import { Picture } from "@/components/ui/Picture";
import { HeadlineLines, PillLink, SectionLabel, intro, reveal } from "@/components/ui/primitives";
import { DosageFormGrid, MarketPills, ReasonsList, VisionMissionValues, WordsHeading } from "@/components/sections/shared";

export const metadata = pageMetadata({
  title: "Itqan Pharmaceutical Industries — Driven by a pursuit of perfection",
  description:
    "Itqan means establishing perfection. Founded in Jordan, Itqan Pharmaceutical Industries introduced its first product to the Jordanian market in 2019.",
  path: routes.home,
});

// Health & Wellness is the category shown first (README › State).
const DEFAULT_CATEGORY = categories.findIndex((c) => c.slug === "health-wellness");

const FACTS = [
  ["2019", "First product in the Jordanian market"],
  ["30+", "Years of experience in this field"],
  [String(products.length), "Products"],
  [String(categories.length), "Therapeutic categories"],
  [String(dosageForms.length), "Dosage forms"],
  ["Swiss medic · EU", "Registration in process"],
] as const;

export default function HomePage() {
  return (
    <>
      {/* Hero: a tall scroll scene with a sticky 100svh stage (README › 3D logo). */}
      <section data-scene="" aria-labelledby="hero-title" className="relative -mt-[76px] h-[190vh] max-[1099px]:h-[175svh] portrait:h-[175svh]">
        <div className="sticky top-0 h-svh overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-[20vh] -right-[10vw] aspect-square w-[min(95vw,1150px)] rounded-full bg-[radial-gradient(closest-side,var(--glow),transparent_72%)]"
          />
          <HeroStage />
          <div
            data-hero-text=""
            className="pointer-events-none relative z-[1] mx-auto flex h-full max-w-[1560px] flex-col justify-center gap-[clamp(20px,3vw,34px)] px-gutter pt-[calc(76px+clamp(28px,6vh,72px))] pb-[clamp(40px,8vh,96px)] max-[1099px]:justify-start portrait:justify-start"
          >
            <p {...intro()} className="m-0 flex items-center gap-[10px] text-[14px] font-semibold text-mute">
              <span aria-hidden="true" className="flex gap-1">
                <span className="size-2 rounded-full bg-lime" />
                <span className="size-2 rounded-full bg-[#8a5cb0]" />
                <span className="size-2 rounded-full bg-sky" />
              </span>
              Itqan Pharmaceutical Industries · Amman, Jordan
            </p>
            <div id="hero-title" className="max-w-[min(100%,780px)]">
              <HeadlineLines
                lines={["Driven by a", "pursuit of", <span key="p" className="text-hi">perfection.</span>]}
                className="text-[clamp(42px,6.2vw,104px)] leading-[.95] tracking-[-.024em]"
              />
            </div>
            <p {...intro(500)} className="m-0 max-w-[44ch] text-[clamp(17px,1.35vw,20px)] leading-[1.55] text-mute">
              {statements.meaning}
            </p>
            <div {...intro(620)} className="pointer-events-auto flex flex-wrap gap-3">
              <PillLink href={routes.products}>Explore Products</PillLink>
              <PillLink href={routes.cooperation} variant="ghost">
                Business Cooperation
              </PillLink>
            </div>
          </div>
          <div data-hero-caption="" aria-hidden="true" className="pointer-events-none absolute right-0 bottom-[clamp(40px,9vh,110px)] left-0 z-[1] opacity-0">
            <div className="mx-auto flex max-w-[1560px] flex-wrap items-end justify-between gap-6 px-gutter">
              <p className="m-0 max-w-[18ch] text-[clamp(28px,3.4vw,56px)] leading-[1.05] font-semibold tracking-[-.03em]">The name fits the meaning.</p>
              <p className="m-0 text-[15px] font-medium text-mute">Since 2019 · Amman, Jordan</p>
            </div>
          </div>
        </div>
      </section>

      {/* Facts marquee (README › FactsMarquee); the duplicate half is hidden from assistive tech. */}
      <section aria-label="Company facts" className="overflow-hidden border-y border-line">
        <div data-marquee="" className="flex w-max">
          {[...FACTS, ...FACTS].map(([value, label], i) => (
            <div
              key={i}
              aria-hidden={i >= FACTS.length || undefined}
              className="flex items-baseline gap-[14px] border-r border-line px-11 py-6 whitespace-nowrap"
            >
              <span className="text-[clamp(24px,2.4vw,34px)] leading-none font-semibold tracking-[-.02em]">{value}</span>
              <span className="text-[14px] font-medium text-mute">{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="who-title">
        <div className="mx-auto flex max-w-[1560px] flex-col gap-[clamp(40px,6vw,88px)] px-gutter pt-[clamp(88px,12vw,180px)] pb-[clamp(64px,8vw,120px)]">
          <div className="flex max-w-[1200px] flex-col gap-6">
            <SectionLabel>Who We Are</SectionLabel>
            <WordsHeading id="who-title" text={statements.founded} className="text-[clamp(32px,4.6vw,76px)] leading-[1.06] tracking-[-.03em] [text-wrap:balance]" />
            <a
              href={routes.about}
              className="flex min-h-11 items-center gap-[10px] self-start border-b border-line text-[16px] font-semibold text-fg no-underline hover:border-fg"
            >
              Read More<span className="sr-only"> about Itqan</span> <span aria-hidden="true">→</span>
            </a>
          </div>
          <VisionMissionValues />
        </div>
      </section>

      <section aria-labelledby="portfolio-title" className="rounded-t-[clamp(18px,2vw,28px)] bg-panel text-on-panel [transition:background-color_.5s,color_.5s]">
        <div className="mx-auto flex max-w-[1560px] flex-col gap-[clamp(28px,4vw,48px)] px-gutter py-[clamp(64px,8vw,120px)]">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="flex flex-col gap-5">
              <SectionLabel tone="panel">Our Products</SectionLabel>
              <h2 id="portfolio-title" {...reveal()} className="m-0 text-[clamp(36px,4.6vw,76px)] leading-[.95] font-semibold tracking-[-.024em]">
                Explore Our Portfolio
              </h2>
            </div>
            <a
              href={routes.products}
              className="flex min-h-[52px] items-center gap-[14px] rounded-full border border-panel-line px-[22px] text-[15px] font-semibold text-on-panel no-underline [transition:background_.3s,color_.3s] hover:bg-on-panel hover:text-panel"
            >
              View All <span aria-hidden="true">→</span>
            </a>
          </div>
          <PortfolioTabs categories={categories} initial={DEFAULT_CATEGORY} />
        </div>
      </section>

      <section id="manufacturing" aria-labelledby="mfg-title" className="bg-panel [transition:background-color_.5s]">
        <div className="relative h-[clamp(460px,86vh,900px)] overflow-hidden rounded-t-[clamp(18px,2vw,28px)] bg-ink">
          <Picture
            image="facility/building-2"
            data-parallax="0.16"
            alt="Production staff in cleanroom attire beside stainless-steel processing vessels at Itqan's facility"
            sizes="100vw"
            className="absolute top-[-12%] left-0 h-[124%] w-full object-cover"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(14,10,18,.05)_25%,rgba(14,10,18,.9)_100%)]" />
          <div className="absolute right-0 bottom-0 left-0 mx-auto flex max-w-[1560px] flex-wrap items-end justify-between gap-6 px-gutter py-[clamp(28px,4vw,56px)] text-bone">
            <div className="flex max-w-[900px] flex-col gap-[18px]">
              <SectionLabel tone="lime">Manufacturing</SectionLabel>
              <h2 id="mfg-title" {...reveal()} className="m-0 text-[clamp(36px,4.8vw,80px)] leading-[.94] font-semibold tracking-[-.024em]">
                Manufacturing capabilities
              </h2>
            </div>
            <p {...reveal(120)} className="m-0 max-w-[44ch] text-[17px] leading-[1.55] text-[#ddd6e2]">
              {statements.manufacturing}
            </p>
          </div>
        </div>
        <div className="bg-bg [transition:background-color_.5s]">
          <div className="mx-auto flex max-w-[1560px] flex-col gap-6 px-gutter py-[clamp(48px,6vw,88px)]">
            <div className="flex flex-wrap items-center justify-between gap-[14px]">
              <h3 className="m-0 text-[clamp(24px,2.4vw,34px)] leading-[1.1] font-semibold tracking-[-.02em]">Annual Production Capacity</h3>
            </div>
            <DosageFormGrid />
          </div>
        </div>
      </section>

      <section aria-labelledby="why-title" className="relative overflow-hidden bg-plum text-bone">
        <div
          aria-hidden="true"
          data-parallax="-0.1"
          className="pointer-events-none absolute -bottom-[30vw] -left-[20vw] aspect-square w-[70vw] rounded-full bg-[radial-gradient(closest-side,rgba(30,169,224,.3),transparent_70%)]"
        />
        <div className="relative mx-auto grid max-w-[1560px] grid-cols-[repeat(auto-fit,minmax(min(100%,440px),1fr))] gap-[clamp(36px,5vw,80px)] px-gutter py-[clamp(80px,10vw,150px)]">
          <div>
            <div className="sticky top-[120px] flex flex-col gap-6">
              <SectionLabel tone="lime">Why Choose Us</SectionLabel>
              <h2 id="why-title" {...reveal()} className="m-0 text-[clamp(36px,4.4vw,72px)] leading-[.95] font-semibold tracking-[-.024em]">
                Why Itqan Pharma
              </h2>
              <figure {...reveal(0, "mask")} className="m-0 aspect-[4/3] max-w-[480px] overflow-hidden rounded-2xl">
                <Picture
                  image="facility/cleanroom"
                  alt="A cleanroom corridor inside Itqan's manufacturing facility"
                  sizes="(max-width: 520px) 90vw, 480px"
                  className="size-full object-cover"
                />
              </figure>
            </div>
          </div>
          <ReasonsList />
        </div>
      </section>

      <section aria-labelledby="markets-title">
        <div className="mx-auto flex max-w-[1560px] flex-col gap-[clamp(36px,5vw,64px)] px-gutter py-[clamp(80px,10vw,150px)]">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,440px),1fr))] items-end gap-6">
            <div className="flex flex-col gap-5">
              <SectionLabel>Regulatory Reach</SectionLabel>
              <h2 id="markets-title" {...reveal()} className="m-0 text-[clamp(36px,4.6vw,78px)] leading-[.98] font-semibold tracking-[-.024em] [text-wrap:balance]">
                Our production site is currently approved in
              </h2>
            </div>
            <p {...reveal(120)} className="m-0 max-w-[46ch] text-[17px] leading-[1.55] text-mute">
              {approvalsText}
            </p>
          </div>
          <MarketPills />
        </div>
      </section>

      <section aria-labelledby="coop-title" className="px-[clamp(10px,1.6vw,24px)] pb-[clamp(10px,1.6vw,24px)]">
        <div className="mx-auto grid max-w-[1560px] grid-cols-[repeat(auto-fit,minmax(min(100%,460px),1fr))] items-end gap-[clamp(28px,4vw,64px)] rounded-[clamp(18px,2vw,28px)] bg-panel px-[clamp(22px,4vw,72px)] py-[clamp(52px,7vw,112px)] text-on-panel">
          <div className="flex flex-col gap-[22px]">
            <SectionLabel tone="panel">Business Cooperation</SectionLabel>
            <h2 id="coop-title" {...reveal()} className="m-0 text-[clamp(36px,4.8vw,80px)] leading-[.92] font-semibold tracking-[-.026em] [text-wrap:balance]">
              Collaborate with Itqan Pharma to achieve excellence
            </h2>
          </div>
          <div className="flex flex-col gap-7">
            <p {...reveal(120)} className="m-0 max-w-[50ch] text-[18px] leading-[1.55] text-panel-mute">
              {statements.cooperation}
            </p>
            <div {...reveal(200)} className="flex flex-wrap gap-3">
              <PillLink href={routes.contactCooperation} variant="panel">
                Become a Partner
              </PillLink>
              <PillLink href={routes.cooperation} variant="panelGhost">
                Contract manufacturing
              </PillLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
