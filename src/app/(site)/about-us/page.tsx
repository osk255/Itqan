import { statements } from "@/lib/catalogue";
import { routes } from "@/lib/site";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/ui/JsonLd";
import { Picture } from "@/components/ui/Picture";
import { PillLink, SectionLabel, intro, reveal } from "@/components/ui/primitives";
import { PageHero } from "@/components/sections/PageHero";
import { CollaborateBand, ReasonsList, VisionMissionValues, WordsHeading } from "@/components/sections/shared";

export const metadata = pageMetadata({
  title: "About Us — Itqan Pharmaceutical Industries",
  description: `${statements.founded} ${statements.experience}`,
  path: routes.about,
});

export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "About Us", path: routes.about }])} />
      <PageHero
        trail={[{ name: "Home", href: routes.home }]}
        current="About Us"
        lines={["About Us"]}
        lead="Committed to improving health and quality of life"
      />

      <section className="px-[clamp(10px,1.6vw,24px)]">
        <figure {...intro(0, "mask")} className="relative m-0 mx-auto h-[clamp(300px,64vh,720px)] max-w-[1560px] overflow-hidden rounded-[clamp(18px,2vw,28px)]">
          <Picture
            image="facility/building"
            data-parallax="0.12"
            alt="Processing vessels and cleanroom staff inside Itqan's Amman facility"
            sizes="(max-width: 1560px) 97vw, 1560px"
            priority
            className="absolute top-[-10%] left-0 h-[120%] w-full object-cover"
          />
        </figure>
      </section>

      <section>
        <div className="mx-auto grid max-w-[1560px] grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-end gap-[clamp(24px,4vw,64px)] px-gutter py-[clamp(80px,10vw,150px)]">
          <p {...reveal()} aria-hidden="true" className="m-0 text-[clamp(110px,16vw,240px)] leading-[.8] font-semibold tracking-[-.026em] text-hi">
            30+
          </p>
          <div className="flex flex-col gap-5">
            <SectionLabel>Itqan&apos;s founders have</SectionLabel>
            <WordsHeading text={statements.experience} className="text-[clamp(30px,3.6vw,56px)] leading-[1.06] tracking-[-.03em]" />
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[1560px] px-gutter pb-[clamp(80px,10vw,150px)]">
          <VisionMissionValues />
        </div>
      </section>

      <section aria-labelledby="why-title" className="bg-plum text-bone">
        <div className="mx-auto grid max-w-[1560px] grid-cols-[repeat(auto-fit,minmax(min(100%,440px),1fr))] gap-[clamp(36px,5vw,80px)] px-gutter py-[clamp(80px,10vw,150px)]">
          <div>
            <div className="sticky top-[120px] flex flex-col gap-6">
              <SectionLabel tone="lime">Why Choose Us</SectionLabel>
              <h2 id="why-title" {...reveal()} className="m-0 text-[clamp(36px,4.4vw,72px)] leading-[.95] font-semibold tracking-[-.024em]">
                Why Itqan Pharma
              </h2>
            </div>
          </div>
          <ReasonsList />
        </div>
      </section>

      <CollaborateBand>
        <PillLink href={routes.contactCooperation}>Become a Partner</PillLink>
        <PillLink href={routes.products} variant="ghost">
          Explore Products
        </PillLink>
      </CollaborateBand>
    </>
  );
}
