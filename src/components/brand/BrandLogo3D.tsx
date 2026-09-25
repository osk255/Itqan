"use client";

import { useEffect, useRef } from "react";
import { images } from "@/lib/images.generated";

const LOGO_SRC = images["brand/logo"].variants.at(-1)!.src;

/** The voxel logo in "inview" mode: assembles when visible, then follows the pointer. */
export function BrandLogo3D() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    let dispose: (() => void) | undefined;
    let cancelled = false;
    import("@/components/home/logo3d")
      .then(({ mountLogo3D }) => mountLogo3D(host, { mode: "inview", logoSrc: LOGO_SRC }))
      .then((d) => (cancelled ? d() : (dispose = d)))
      .catch(() => {});
    return () => {
      cancelled = true;
      dispose?.();
    };
  }, []);
  return <div ref={ref} aria-hidden="true" className="absolute inset-0" />;
}
