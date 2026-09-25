import { company, routes } from "@/lib/site";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/ui/JsonLd";
import { intro, reveal } from "@/components/ui/primitives";
import { PageHero } from "@/components/sections/PageHero";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata = pageMetadata({
  title: "Contact Us — Itqan Pharmaceutical Industries",
  description: `Contact Itqan Pharmaceutical Industries in Amman, Jordan: ${company.phone} · ${company.email}.`,
  path: routes.contact,
});

const CARDS = [
  { label: "Company Location", value: company.locationLabel, href: company.maps, external: true },
  { label: "Company Email", value: company.email, href: company.emailHref, external: false },
  { label: "Contact Us", value: company.phone, href: company.phoneHref, external: false },
];

export default function ContactPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Contact Us", path: routes.contact }])} />
      <PageHero trail={[{ name: "Home", href: routes.home }]} current="Contact Us" lines={["Contact Us"]} />

      <section className="mx-auto max-w-[1560px] px-gutter">
        <div className="flex flex-wrap gap-[14px]">
          {CARDS.map((c) => (
            <a
              key={c.label}
              href={c.href}
              {...(c.external ? { target: "_blank", rel: "noopener" } : {})}
              {...intro()}
              className="flex min-h-[180px] flex-[1_1_260px] flex-col justify-between gap-9 rounded-2xl border border-line bg-chip p-6 text-fg no-underline [overflow-wrap:anywhere] [transition:background_.35s,color_.35s,transform_.45s_var(--ease-soft)] hover:bg-accent hover:text-on-accent hover:[transform:translateY(-4px)]"
            >
              <span className="text-[14px] font-semibold opacity-80">{c.label}</span>
              <span className="text-[clamp(20px,1.9vw,27px)] leading-[1.2] font-semibold tracking-[-.015em]">{c.value}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1560px] px-gutter py-[clamp(56px,7vw,110px)]">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] gap-[clamp(32px,5vw,80px)]">
          <h2 id="form-title" {...reveal()} className="m-0 text-[clamp(36px,4.6vw,76px)] leading-[.98] font-semibold tracking-[-.024em]">
            Send an enquiry
          </h2>
          <div>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
