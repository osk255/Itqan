"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import type { Category } from "@/lib/catalogue";
import { staggerIn } from "@/lib/motion";
import { ProductCard } from "@/components/ui/ProductCard";

const HOME_CARD_SIZES = "(max-width: 1099px) min(60vw, 250px), 230px";

/**
 * Category tabs over the product carousel (README › CategoryTabs). Each panel
 * is server-rendered; inactive ones are `hidden`, so switching is instant and
 * their images load only when shown. Arrow keys move between tabs.
 */
export function PortfolioTabs({ categories, initial }: { categories: Category[]; initial: number }) {
  const [active, setActive] = useState(initial);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const panels = useRef<(HTMLUListElement | null)[]>([]);

  const select = (i: number, focus = false) => {
    if (i === active) return;
    setActive(i);
    if (focus) tabs.current[i]?.focus();
    requestAnimationFrame(() => {
      const panel = panels.current[i];
      if (panel) staggerIn(panel.querySelectorAll("[data-pkg]"));
    });
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const last = categories.length - 1;
    const next = { ArrowRight: active + 1, ArrowLeft: active - 1, Home: 0, End: last }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    select((next + categories.length) % categories.length, true);
  };

  return (
    <>
      <div
        role="tablist"
        aria-label="Therapeutic categories"
        onKeyDown={onKeyDown}
        className="no-scrollbar -mx-gutter flex flex-wrap gap-2 overflow-x-auto px-gutter pb-1 max-[1099px]:flex-nowrap"
      >
        {categories.map((c, i) => {
          const on = i === active;
          return (
            <button
              key={c.slug}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`tab-${c.slug}`}
              aria-selected={on}
              aria-controls={`panel-${c.slug}`}
              tabIndex={on ? 0 : -1}
              onClick={() => select(i)}
              className={`flex min-h-12 flex-none items-center gap-[10px] rounded-full border px-5 text-[15px] font-semibold whitespace-nowrap [transition:background_.35s,color_.35s,border-color_.35s] ${
                on ? "border-on-panel bg-on-panel text-panel" : "border-panel-line bg-transparent text-on-panel"
              }`}
            >
              {c.full}
              <span className="text-[12px] font-medium opacity-70">{c.items.length}</span>
            </button>
          );
        })}
      </div>
      {categories.map((c, i) => (
        // The panel role sits on a wrapper so the product list keeps its list semantics.
        <div key={c.slug} role="tabpanel" id={`panel-${c.slug}`} aria-labelledby={`tab-${c.slug}`} hidden={i !== active}>
          <ul
            ref={(el) => {
              panels.current[i] = el;
            }}
            className="no-scrollbar m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-[14px] p-0 max-[1099px]:-mx-5 max-[1099px]:auto-cols-[min(72%,300px)] max-[1099px]:grid-flow-col max-[1099px]:grid-cols-none max-[1099px]:snap-x max-[1099px]:snap-mandatory max-[1099px]:overflow-x-auto max-[1099px]:px-5 max-[1099px]:pb-2"
          >
            {c.items.map((p) => (
              <ProductCard key={p.slug} product={p} sizes={HOME_CARD_SIZES} />
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}
