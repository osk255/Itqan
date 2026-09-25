import { approvalsText, statements } from "@/lib/catalogue";
import { routes } from "@/lib/site";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/ui/JsonLd";
import { Picture } from "@/components/ui/Picture";
import { PillLink, reveal } from "@/components/ui/primitives";
import { PageHero } from "@/components/sections/PageHero";
import { DosageFormGrid, MarketPills, ReasonsList } from "@/components/sections/shared";

export const metadata = pageMetadata({
  title: "Business Cooperation — Itqan Pharmaceutical Industries",
  description: "Collaborate with Itqan Pharma to achieve excellence: contract manufacturing and manufacturing capabilities from Amman, Jordan.",
  path: routes.cooperation,
});

const card = "flex flex-1 flex-col justify-between gap-9 rounded-[clamp(18px,2vw,26px)] p-[clamp(28px,3.4vw,48px)]";
const cardTitle = "m-0 text-[clamp(28px,3vw,46px)] leading-none font-semibold tracking-[-.03em]";

export default function CooperationPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Business Cooperation", path: routes.cooperation }])} />
      <PageHero
        trail={[{ name: "Home", href: routes.home }]}
        current="Business Cooperation"
        lines={["Business", "Cooperation"]}
        lead={statements.cooperation}
        cta={<PillLink href={routes.contactCooperation}>Become a Partner</PillLink>}
      />

      <section className="px-[clamp(10px,1.6vw,24px)]">
        <div className="mx-auto grid max-w-[1560px] grid-cols-[repeat(auto-fit,minmax(min(100%,440px),1fr))] gap-[14px]">
          <figure {...reveal(0, "mask")} className="relative m-0 min-h-[420px] overflow-hidden rounded-[clamp(18px,2vw,26px)]">
            <Picture
              image="facility/building-2"
              alt="Production staff working beside processing vessels at Itqan's facility"
              sizes="(max-width: 900px) 95vw, 50vw"
              className="absolute inset-0 size-full object-cover"
            />
          </figure>
          <div className="flex flex-col gap-[14px]">
            <div {...reveal()} className={`${card} bg-panel text-on-panel`}>
              <h2 className={cardTitle}>Contract manufacturing</h2>
              <p className="m-0 max-w-[44ch] text-[18px] leading-[1.55]">{statements.contractManufacturing}</p>
            </div>
            <div {...reveal(100)} className={`${card} bg-plum text-bone`}>
              <h2 className={cardTitle}>Manufacturing capabilities</h2>
              <p className="m-0 max-w-[48ch] text-[18px] leading-[1.55]">{statements.manufacturing}</p>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="forms-title">
        <div className="mx-auto flex max-w-[1560px] flex-col gap-7 px-gutter pt-[clamp(80px,10vw,140px)]">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="forms-title" {...reveal()} className="m-0 text-[clamp(36px,4.6vw,76px)] leading-[.98] font-semibold tracking-[-.024em]">
              Annual Production Capacity
            </h2>
          </div>
          <DosageFormGrid />
        </div>
      </section>

      <section aria-labelledby="markets-title">
        <div className="mx-auto flex max-w-[1560px] flex-col gap-[clamp(32px,4vw,56px)] px-gutter py-[clamp(80px,10vw,140px)]">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,440px),1fr))] items-end gap-6">
            <h2 id="markets-title" {...reveal()} className="m-0 text-[clamp(36px,4.6vw,78px)] leading-[.98] font-semibold tracking-[-.024em] [text-wrap:balance]">
              Our production site is currently approved in
            </h2>
            <p className="m-0 max-w-[46ch] text-[17px] leading-[1.55] text-mute">{approvalsText}</p>
          </div>
          <MarketPills />
        </div>
      </section>

      <section aria-labelledby="why-title" className="px-[clamp(10px,1.6vw,24px)] pb-[clamp(10px,1.6vw,24px)]">
        <div className="mx-auto grid max-w-[1560px] grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] gap-[clamp(32px,5vw,72px)] rounded-[clamp(18px,2vw,28px)] bg-panel px-[clamp(22px,4vw,72px)] py-[clamp(52px,7vw,110px)] text-on-panel">
          <div className="flex flex-col justify-between gap-7">
            <h2 id="why-title" className="m-0 text-[clamp(36px,4.4vw,72px)] leading-[.95] font-semibold tracking-[-.024em]">
              Why Itqan Pharma
            </h2>
            <PillLink href={routes.contactCooperation} variant="panel" className="self-start">
              Become a Partner
            </PillLink>
          </div>
          <ReasonsList onPanel />
        </div>
      </section>
    </>
  );
}
