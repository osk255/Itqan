"use client";

import { useEffect, useRef } from "react";
import { images } from "@/lib/images.generated";
import { prefersReducedMotion, smoothstep } from "@/lib/motion";

const LOGO_SRC = images["brand/logo"].variants.at(-1)!.src;

/**
 * Home hero scroll scene (README › 3D logo › Scroll scene). Owns the WebGL
 * stage and the text/caption cross-fade driven by scroll through [data-scene].
 * three.js is fetched only after the page is idle, so it never delays content.
 */
export function HeroStage() {
  const stageRef = useRef<HTMLDivElement>(null);

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
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);

    // Mount the 3D logo once the browser is idle (after first paint and hydration).
    let dispose: (() => void) | undefined;
    let cancelled = false;
    const mount = () =>
      import("./logo3d")
        .then(({ mountLogo3D }) => mountLogo3D(stage, { mode: "scene", sceneEl: scene, logoSrc: LOGO_SRC }))
        .then((d) => (cancelled ? d() : (dispose = d)))
        .catch(() => {
          // The hero is complete without the 3D logo; nothing to recover.
        });
    const idle = "requestIdleCallback" in window ? requestIdleCallback(mount, { timeout: prefersReducedMotion() ? 3000 : 1200 }) : setTimeout(mount, 300);

    return () => {
      cancelled = true;
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
      if ("cancelIdleCallback" in window) cancelIdleCallback(idle as number);
      else clearTimeout(idle);
      dispose?.();
    };
  }, []);

  return <div ref={stageRef} aria-hidden="true" className="pointer-events-none absolute inset-0" />;
}
