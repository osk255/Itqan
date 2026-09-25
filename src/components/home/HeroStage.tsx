"use client";

import { useEffect, useRef, useState } from "react";
import { images } from "@/lib/images.generated";
import { prefersReducedMotion, smoothstep, skip3DLogo } from "@/lib/motion";
import { LogoFallback } from "./LogoFallback";

const LOGO_SRC = images["brand/logo"].variants.at(-1)!.src;

/**
 * Home hero scroll scene (README › 3D logo › Scroll scene). Owns the WebGL
 * stage and the text/caption cross-fade driven by scroll through [data-scene].
 * three.js is fetched only after the page is idle, so it never delays content.
 * Without WebGL 2, after a lost GPU context, or with Save-Data on, the flat
 * logo is shown instead (ADR-015).
 */
export function HeroStage() {
  const stageRef = useRef<HTMLDivElement>(null);
  const fallbackRef = useRef<HTMLDivElement>(null);
  const updateRef = useRef<(() => void) | null>(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const stage = stageRef.current;
    const scene = stage?.closest<HTMLElement>("[data-scene]");
    if (!stage || !scene) return;
    const text = scene.querySelector<HTMLElement>("[data-hero-text]");
    const caption = scene.querySelector<HTMLElement>("[data-hero-caption]");

    let raf = 0;
    const update = () => {
      raf = 0;
      const b = scene.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -b.top / Math.max(1, b.height - innerHeight)));
      // The flat logo follows the 3D logo's move (logo3d.ts): from its resting
      // place to the centre of the stage, at 74% of the width or 60% of the height.
      const fb = fallbackRef.current;
      if (fb) {
        const m = smoothstep(0.04, 0.55, p);
        const w = stage.clientWidth;
        const h = stage.clientHeight;
        const k = Math.min(0.74 * w, 0.82 * h) / Math.max(1, fb.offsetWidth);
        fb.style.transform = `translate(${((w / 2 - fb.offsetLeft) * m).toFixed(1)}px, ${((h / 2 - fb.offsetTop) * m).toFixed(1)}px) scale(${(1 + (k - 1) * m).toFixed(4)})`;
      }
      if (text) {
        const o = 1 - smoothstep(0.04, 0.26, p);
        text.style.opacity = String(o);
        text.style.transform = `translateY(${(-p * 120).toFixed(1)}px)`;
        text.style.visibility = o < 0.01 ? "hidden" : "visible";
      }
      if (caption) {
        const o = smoothstep(0.5, 0.72, p);
        caption.style.opacity = String(o);
        caption.style.transform = `translateY(${((1 - o) * 40).toFixed(1)}px)`;
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    updateRef.current = update;
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);

    // Mount the 3D logo once the browser is idle (after first paint and hydration).
    let dispose: (() => void) | null = null;
    let cancelled = false;
    let failed = false;
    const showFallback = () => {
      failed = true;
      dispose?.();
      dispose = null;
      if (!cancelled) setFallback(true);
    };
    const mount = () => {
      if (skip3DLogo()) return showFallback();
      import("./logo3d")
        .then(({ mountLogo3D }) => mountLogo3D(stage, { mode: "scene", sceneEl: scene, logoSrc: LOGO_SRC, onLost: showFallback }))
        .then((d) => {
          if (!d) showFallback();
          else if (cancelled || failed) d();
          else dispose = d;
        })
        .catch(showFallback);
    };
    const idle = "requestIdleCallback" in window ? requestIdleCallback(mount, { timeout: prefersReducedMotion() ? 3000 : 1200 }) : setTimeout(mount, 300);

    return () => {
      cancelled = true;
      updateRef.current = null;
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
      if ("cancelIdleCallback" in window) cancelIdleCallback(idle as number);
      else clearTimeout(idle);
      dispose?.();
    };
  }, []);

  // Place the flat logo for the current scroll position as soon as it appears.
  useEffect(() => {
    if (fallback) updateRef.current?.();
  }, [fallback]);

  return (
    <>
      <div ref={stageRef} aria-hidden="true" className="pointer-events-none absolute inset-0" />
      {fallback && <LogoFallback ref={fallbackRef} layout="hero" />}
    </>
  );
}
