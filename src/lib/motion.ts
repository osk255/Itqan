// Motion helpers shared by client components (README › Interactions & Motion).
export const EASE_EXPO = "cubic-bezier(.16,1,.3,1)";

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * True when the 3D logo should not even be downloaded: the browser asks sites to
 * save data (Chrome's Data Saver, Android "Lite" mode) or has no WebGL 2 at all.
 */
export const skip3DLogo = () =>
  typeof window !== "undefined" &&
  (!("WebGL2RenderingContext" in window) || (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true);

/** Re-stagger cards after a category switch: 750ms, 60ms apart. */
export function staggerIn(elements: Iterable<Element>) {
  if (prefersReducedMotion()) return;
  let i = 0;
  for (const el of elements) {
    el.animate([{ opacity: 0, transform: "translateY(36px) scale(.97)" }, { opacity: 1, transform: "none" }], {
      duration: 750,
      delay: i++ * 60,
      easing: EASE_EXPO,
      fill: "backwards",
    });
  }
}

/** Smoothstep between a and b. */
export const smoothstep = (a: number, b: number, v: number) => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
