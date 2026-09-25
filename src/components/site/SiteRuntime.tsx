"use client";

import { useEffect } from "react";
import { EASE_EXPO, prefersReducedMotion } from "@/lib/motion";

/**
 * Page-level motion that needs JavaScript (README › Interactions & Motion):
 * scroll reveals, word-by-word read, parallax, the facts marquee speed and the
 * page-transition fade. Intro motion is CSS-only (globals.css). Renders nothing.
 */
export function SiteRuntime() {
  useEffect(() => {
    const reduce = prefersReducedMotion();
    const cleanups: (() => void)[] = [];

    // Reveal: opacity/translate or clip-path mask, played once when 8% inside the viewport.
    if (!reduce) {
      const pending = new Map<Element, Animation>();
      const io = new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            if (!e.isIntersecting) return;
            pending.get(e.target)?.play();
            pending.delete(e.target);
            io.unobserve(e.target);
          }),
        { rootMargin: "0px 0px -8% 0px" },
      );
      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        const mask = el.dataset.reveal === "mask";
        const animation = el.animate(
          mask
            ? [{ clipPath: "inset(100% 0 0 0 round 24px)" }, { clipPath: "inset(0 0 0 0 round 24px)" }]
            : [{ opacity: 0, transform: "translateY(22px)" }, { opacity: 1, transform: "none" }],
          // "backwards" hands the element back to its own styles afterwards, so hover lifts still work.
          { duration: mask ? 1300 : 900, delay: Number(el.dataset.delay ?? 0), easing: EASE_EXPO, fill: mask ? "both" : "backwards" },
        );
        animation.pause();
        pending.set(el, animation);
        el.dataset.armed = "";
        io.observe(el);
      });
      cleanups.push(() => io.disconnect());
    }

    // Facts marquee: one loop takes (half its width) × 26ms.
    document.querySelectorAll<HTMLElement>("[data-marquee]").forEach((el) => {
      el.style.setProperty("--marquee-duration", `${Math.round((el.scrollWidth / 2) * 26)}ms`);
    });

    // Scroll-linked effects, throttled to one update per frame.
    const words = [...document.querySelectorAll<HTMLElement>("[data-words]")];
    const parallax = reduce ? [] : [...document.querySelectorAll<HTMLElement>("[data-parallax]")];
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = innerHeight;
      for (const el of words) {
        const r = el.getBoundingClientRect();
        const p = reduce ? 1 : Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.25)));
        const spans = el.children;
        for (let i = 0; i < spans.length; i++) {
          (spans[i] as HTMLElement).style.opacity = String(0.18 + 0.82 * Math.min(1, Math.max(0, p * spans.length * 1.1 - i)));
        }
      }
      for (const el of parallax) {
        const box = el.parentElement?.getBoundingClientRect();
        if (!box) continue;
        const y = (box.top + box.height / 2 - vh / 2) * Number(el.dataset.parallax);
        el.style.transform = `translate3d(0,${y.toFixed(1)}px,0)`;
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    if (words.length || parallax.length) {
      update();
      addEventListener("scroll", onScroll, { passive: true });
      addEventListener("resize", onScroll);
      cleanups.push(() => {
        removeEventListener("scroll", onScroll);
        removeEventListener("resize", onScroll);
        cancelAnimationFrame(raf);
      });
    }

    // Page transition: fade the page out (200ms) before following an internal link.
    const onClick = (e: MouseEvent) => {
      if (reduce || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || a.target || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || !url.protocol.startsWith("http")) return;
      if (url.pathname === location.pathname && url.hash) return;
      e.preventDefault();
      const fade = document.body.animate([{ opacity: 1 }, { opacity: 0.001 }], { duration: 200, easing: "ease-in", fill: "forwards" });
      fade.onfinish = () => {
        location.href = url.href;
        setTimeout(() => fade.cancel(), 1500);
      };
    };
    // Coming back through the back/forward cache: undo the fade.
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) document.body.getAnimations().forEach((a) => a.cancel());
    };
    document.addEventListener("click", onClick);
    addEventListener("pageshow", onPageShow);
    cleanups.push(() => {
      document.removeEventListener("click", onClick);
      removeEventListener("pageshow", onPageShow);
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
