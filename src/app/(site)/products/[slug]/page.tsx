import { notFound } from "next/navigation";
import { getProduct, products } from "@/lib/catalogue";
import { routes } from "@/lib/site";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/ui/JsonLd";
import { TrackProductView } from "@/components/products/TrackProductView";
import { Picture } from "@/components/ui/Picture";
import { ProductCard } from "@/components/ui/ProductCard";
import { Breadcrumbs, HeroGlow, PillLink, intro } from "@/components/ui/primitives";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => products.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: Params) {
  const p = getProduct((await params).slug);
  if (!p) return {};
  return pageMetadata({
    title: `${p.name} — ${p.categoryFull} — Itqan Pharma`,
    description: `${p.name}${p.strengths ? ` (${p.strengths})` : ""} — ${p.categoryFull} from Itqan Pharmaceutical Industries, Amman, Jordan.`,
    path: routes.product(p.slug),
  });
}

/**
 * Product page (README › Product). Rows render only when a value is published;
 * active ingredient, dosage form and leaflets await the client
 * (docs/CLIENT_QUESTIONS.md), so they are omitted rather than guessed.
 * Product JSON-LD is intentionally not emitted: without a published price or
 * reviews it would be invalid for Google (docs/DECISIONS.md ADR-010).
 */
export default async function ProductPage({ params }: Params) {
  const p = getProduct((await params).slug);
  if (!p) notFound();
  const i = products.indexOf(p);
  const prev = products[(i - 1 + products.length) % products.length]!;
  const next = products[(i + 1) % products.length]!;
  const siblings = products.filter((x) => x.categorySlug === p.categorySlug && x.slug !== p.slug);
  const allRows: [label: string, value: string | null][] = [
    ["Product name", p.name],
    ["Active ingredient", p.activeIngredient],
    ["Strength", p.strengths],
    ["Dosage form", p.dosageForm],
    ["Therapeutic category", p.categoryFull],
    ["Manufacturer", "Itqan Pharmaceutical Industries, Amman — Jordan"],
  ];
  const rows = allRows.filter((r): r is [string, string] => Boolean(r[1]));

  return (
    <>
      <TrackProductView product={p.name} category={p.categoryFull} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Products", path: routes.products },
          { name: p.categoryFull, path: routes.category(p.categorySlug) },
          { name: p.name, path: routes.product(p.slug) },
        ])}
      />
      <section className="relative overflow-hidden">
        <HeroGlow parallax={-0.12} className="-top-[30vw] -left-[20vw] w-[min(90vw,1000px)]" />
        <div className="relative mx-auto flex max-w-[1560px] flex-col gap-7 px-gutter pt-[clamp(28px,4vw,56px)] pb-[clamp(56px,7vw,110px)]">
          <Breadcrumbs
            trail={[
              { name: "Home", href: routes.home },
              { name: "Products", href: routes.products },
              { name: p.categoryFull, href: routes.category(p.categorySlug) },
            ]}
            current={p.name}
          />
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,460px),1fr))] items-center gap-[clamp(24px,4vw,64px)]">
            <div {...intro()} className="flex aspect-square items-center justify-center rounded-[clamp(18px,2vw,26px)] bg-white p-[9%]">
              <Picture
                image={p.image}
                alt={`${p.name} packaging`}
                sizes="(max-width: 1000px) 80vw, 40vw"
                priority
                className="size-full object-contain mix-blend-multiply"
              />
            </div>
            <div className="flex flex-col gap-6">
              <p className="m-0 text-[14px] font-semibold text-label">{p.categoryFull}</p>
              <h1 {...intro()} className="m-0 text-[clamp(52px,7vw,112px)] leading-[.92] font-semibold tracking-[-.026em]">
                {p.name}
              </h1>
              {p.strengths && <p className="m-0 text-[clamp(20px,2vw,28px)] leading-[1.2] font-semibold text-hi">{p.strengths}</p>}
              <dl className="m-0 border-t border-line">
                {rows.map(([label, value]) => (
                  <div key={label} className="grid grid-cols-[minmax(120px,40%)_1fr] gap-4 border-b border-line py-4">
                    <dt className="text-[14px] font-medium text-mute">{label}</dt>
                    <dd className="m-0 text-[16px] font-semibold">{value}</dd>
                  </div>
                ))}
              </dl>
              <div className="flex flex-wrap gap-3">
                <PillLink href={routes.contactProduct(p.name)}>Contact Us</PillLink>
                <PillLink href={routes.category(p.categorySlug)} variant="ghost">
                  {p.categoryFull}
                </PillLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <nav aria-label="More products" className="border-y border-line">
        <div className="mx-auto grid max-w-[1560px] grid-cols-2">
          <a href={routes.product(prev.slug)} className="flex flex-col gap-[6px] border-r border-line px-gutter py-7 text-fg no-underline [transition:background_.3s] hover:bg-chip">
            <span className="text-[14px] font-medium text-mute">← Previous</span>
            <span className="text-[clamp(20px,2.2vw,30px)] leading-[1.1] font-semibold">{prev.name}</span>
          </a>
          <a
            href={routes.product(next.slug)}
            className="flex flex-col items-end gap-[6px] px-gutter py-7 text-right text-fg no-underline [transition:background_.3s] hover:bg-chip"
          >
            <span className="text-[14px] font-medium text-mute">Next →</span>
            <span className="text-[clamp(20px,2.2vw,30px)] leading-[1.1] font-semibold">{next.name}</span>
          </a>
        </div>
      </nav>

      {siblings.length > 0 && (
        <section aria-labelledby="more-title">
          <div className="mx-auto flex max-w-[1560px] flex-col gap-[22px] px-gutter py-[clamp(48px,6vw,96px)]">
            <h2 id="more-title" className="m-0 text-[clamp(26px,3vw,42px)] leading-[1.05] font-semibold tracking-[-.025em]">
              {p.categoryFull}
            </h2>
            <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(min(46%,230px),1fr))] gap-[14px] p-0">
              {siblings.map((s) => (
                <ProductCard key={s.slug} product={s} />
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
