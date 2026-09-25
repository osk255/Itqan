import type { Ref } from "react";
import { Picture } from "@/components/ui/Picture";

// Where the 3D logo rests (logo3d.ts): on wide stages it is centred 23% right of
// middle at 44% of the width (at most 60% of the height); on narrow or portrait
// stages it sits 27% below middle at 84% of the width (at most 30% of the height).
// The logo artwork is 2004×1468, so a height limit h equals a width of 1.365 h.
// In the hero, HeroStage moves it to the centre as the page scrolls, like the 3D logo.
const LAYOUT = {
  hero: "left-[73%] top-1/2 w-[min(44vw,82svh)] [@media(max-aspect-ratio:23/20)]:left-1/2 [@media(max-aspect-ratio:23/20)]:top-[77%] [@media(max-aspect-ratio:23/20)]:w-[min(84vw,41svh)]",
  center: "left-1/2 top-1/2 w-[80%]",
} as const;

/**
 * The flat official logo, shown in place of the 3D capsule logo when WebGL 2 is
 * unavailable, the GPU context is lost, or the visitor has asked to save data.
 * `onInk` always shows the reversed logo, for a panel that is dark in both themes.
 */
export function LogoFallback({ layout, onInk = false, ref }: { layout: keyof typeof LAYOUT; onInk?: boolean; ref?: Ref<HTMLDivElement> }) {
  const sizes = "(max-width: 1099px) 84vw, 44vw";
  return (
    <div ref={ref} aria-hidden="true" className={`pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 ${LAYOUT[layout]}`}>
      {onInk ? (
        <Picture image="brand/logo-reversed" alt="" sizes={sizes} loading="eager" className="h-auto w-full" />
      ) : (
        <>
          <Picture image="brand/logo-reversed" data-logo="dark" alt="" sizes={sizes} loading="eager" className="h-auto w-full" />
          <Picture image="brand/logo" data-logo="light" alt="" sizes={sizes} className="h-auto w-full" />
        </>
      )}
    </div>
  );
}
