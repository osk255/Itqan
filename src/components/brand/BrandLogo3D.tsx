"use client";

import { useEffect, useRef, useState } from "react";
import { images } from "@/lib/images.generated";
import { skip3DLogo } from "@/lib/motion";
import { LogoFallback } from "@/components/home/LogoFallback";

const LOGO_SRC = images["brand/logo"].variants.at(-1)!.src;

/**
 * The capsule logo in "inview" mode: assembles when visible, then follows the
 * pointer. It sits on the sheet's ink panel, so it keeps the dark-ground colours.
 */
export function BrandLogo3D() {
  const ref = useRef<HTMLDivElement>(null);
  const [fallback, setFallback] = useState(false);
  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    let dispose: (() => void) | null = null;
    let cancelled = false;
    let failed = false;
    const showFallback = () => {
      failed = true;
      dispose?.();
      dispose = null;
      if (!cancelled) setFallback(true);
    };
    Promise.resolve()
      .then(() => {
        if (skip3DLogo()) return null;
        return import("@/components/home/logo3d").then(({ mountLogo3D }) => mountLogo3D(host, { mode: "inview", logoSrc: LOGO_SRC, onLost: showFallback, onInk: true }));
      })
      .then((d) => {
        if (!d) showFallback();
        else if (cancelled || failed) d();
        else dispose = d;
      })
      .catch(showFallback);
    return () => {
      cancelled = true;
      dispose?.();
    };
  }, []);
  return (
    <>
      <div ref={ref} aria-hidden="true" className="absolute inset-0" />
      {fallback && <LogoFallback layout="center" onInk />}
    </>
  );
}
