"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import type { Category } from "@/lib/catalogue";
import { routes } from "@/lib/site";
import { staggerIn } from "@/lib/motion";
import { ProductCard } from "@/components/ui/ProductCard";
import { Breadcrumbs, HeadlineLines, HeroGlow, intro } from "@/components/ui/primitives";

const ALL = "all";
const SITE = "Itqan Pharmaceutical Industries";
const hrefFor = (slug: string) => (slug === ALL ? routes.products : routes.category(slug));
const titleFor = (c?: Category) => (c ? `${c.full} — Products — ${SITE}` : `Products — ${SITE}`);
const slugFromPath = (path: string) => /^\/product-category\/([^/]+)\/?$/.exec(path)?.[1] ?? ALL;

/**
 * Products page body (README › Products). Every filter is a real URL
 * (/all-products/, /product-category/<slug>/) rendered statically for search
 * engines; in the browser the pills filter in place, like the prototype, and
 * keep the address bar, breadcrumb and title in sync.
 */
export function ProductsBrowser({ categories, initial }: { categories: Category[]; initial: string }) {
  const [filter, setFilter] = useState(initial);
  const groupsRef = useRef<HTMLDivElement>(null);
  const total = categories.reduce((n, c) => n + c.items.length, 0);
  const current = categories.find((c) => c.slug === filter);

  const show = (slug: string) => {
    setFilter(slug);
    document.title = titleFor(categories.find((c) => c.slug === slug));
    requestAnimationFrame(() => groupsRef.current && staggerIn(groupsRef.current.querySelectorAll("[data-pkg]")));
  };

  useEffect(() => {
    const onPop = () => show(slugFromPath(location.pathname));
    addEventListener("popstate", onPop);
    return () => removeEventListener("popstate", onPop);
    // `show` only closes over stable values.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPick = (e: MouseEvent<HTMLAnchorElement>, slug: string) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    if (slug === filter) return;
    history.pushState(null, "", hrefFor(slug));
    show(slug);
  };

  const filters = [{ slug: ALL, full: "All", count: total }, ...categories.map((c) => ({ slug: c.slug, full: c.full, count: c.items.length }))];
  const groups = categories.filter((c) => filter === ALL || c.slug === filter);

  return (
    <>
      <section className="relative overflow-hidden">
        <HeroGlow parallax={-0.15} className="-top-[30vw] -right-[15vw] w-[min(90vw,1000px)]" />
        <div className="relative mx-auto flex max-w-[1560px] flex-col gap-[clamp(18px,2vw,26px)] px-gutter pt-[clamp(36px,5vw,72px)] pb-[clamp(48px,6vw,96px)]">
          <Breadcrumbs
            trail={current ? [{ name: "Home", href: routes.home }, { name: "Products", href: routes.products }] : [{ name: "Home", href: routes.home }]}
            current={current ? current.full : "Products"}
          />
          <HeadlineLines lines={["Products"]} className="text-[clamp(40px,5.6vw,92px)] leading-[.95] tracking-[-.024em]" />
          <div className="flex flex-wrap items-end justify-between gap-x-14 gap-y-6">
            <p {...intro(350)} className="m-0 max-w-[52ch] text-[clamp(17px,1.4vw,21px)] leading-[1.55] text-mute [text-wrap:pretty]">
              {total} products across {categories.length} therapeutic categories.
            </p>
          </div>
        </div>
      </section>

      <div className="sticky top-[76px] z-20 border-y border-line bg-[color-mix(in_srgb,var(--bg)_88%,transparent)] backdrop-blur-[12px]">
        <nav aria-label="Filter by therapeutic category" className="no-scrollbar mx-auto flex max-w-[1560px] gap-2 overflow-x-auto px-gutter py-3">
          {filters.map((f) => {
            const on = f.slug === filter;
            return (
              <a
                key={f.slug}
                href={hrefFor(f.slug)}
                aria-current={on ? "page" : undefined}
                onClick={(e) => onPick(e, f.slug)}
                className={`flex min-h-11 flex-none items-center gap-[10px] rounded-full border px-[18px] text-[14px] font-semibold whitespace-nowrap no-underline [transition:background_.35s,color_.35s] ${
                  on ? "border-fg bg-fg text-bg hover:text-bg" : "border-line bg-transparent text-fg"
                }`}
              >
                {f.full}
                <span className="text-[12px] font-medium opacity-70">{f.count}</span>
              </a>
            );
          })}
        </nav>
      </div>

      <div ref={groupsRef}>
        {groups.map((c) => (
          <section key={c.slug} aria-labelledby={`cat-${c.slug}`}>
            <div className="mx-auto flex max-w-[1560px] flex-col gap-[22px] px-gutter pt-[clamp(40px,5vw,72px)] pb-2">
              <div className="flex flex-wrap items-baseline justify-between gap-x-5 gap-y-2 border-b border-line pb-4">
                <h2 id={`cat-${c.slug}`} className="m-0 text-[clamp(26px,3vw,42px)] leading-[1.05] font-semibold tracking-[-.025em]">
                  {c.full}
                </h2>
                <span className="text-[15px] font-medium text-mute">
                  {c.items.length} {c.items.length === 1 ? "product" : "products"}
                </span>
              </div>
              <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(min(46%,230px),1fr))] gap-[14px] p-0">
                {c.items.map((p) => (
                  <ProductCard key={p.slug} product={p} />
                ))}
              </ul>
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
