"use client";

import { useCallback, useEffect, useRef } from "react";
import { images } from "@/lib/images.generated";
import { prefersReducedMotion } from "@/lib/motion";

const LOGO_SRC = images["brand/logo"].variants.at(-1)!.src;
const PALETTE: [number, number, number][] = [
  [0xbc, 0xd1, 0x55],
  [0x52, 0x27, 0x6f],
  [0x1e, 0xa9, 0xe0],
];

type Variant = { key: string; label: string; cols: number; shape: "square" | "dot"; gap: number; bg: string; reversed?: boolean; animate?: boolean };

// Port of the brand sheet's pixel system (design_handoff_itqan_website/site/brand/Brand.dc.html).
const VARIANTS: Variant[] = [
  { key: "coarse", label: "Coarse grid · 36 cols", cols: 36, shape: "square", gap: 0.14, bg: "#0f0914", reversed: true },
  { key: "dots", label: "Dot matrix · 64 cols", cols: 64, shape: "dot", gap: 0.2, bg: "#f1ede6" },
  { key: "fine", label: "Fine grid · 110 cols", cols: 110, shape: "square", gap: 0.08, bg: "#52276f", reversed: true },
  { key: "assemble", label: "Assembly · animated", cols: 56, shape: "square", gap: 0.12, bg: "#0f0914", reversed: true, animate: true },
];

type Cell = { i: number; j: number; c: number; seed: number };

function sample(img: HTMLImageElement, cols: number) {
  const rows = Math.round((cols * img.naturalHeight) / img.naturalWidth);
  const canvas = document.createElement("canvas");
  canvas.width = cols;
  canvas.height = rows;
  const ctx = canvas.getContext("2d");
  if (!ctx) return { rows, cells: [] as Cell[] };
  ctx.drawImage(img, 0, 0, cols, rows);
  const d = ctx.getImageData(0, 0, cols, rows).data;
  const cells: Cell[] = [];
  for (let j = 0; j < rows; j++)
    for (let i = 0; i < cols; i++) {
      const k = (j * cols + i) * 4;
      if ((d[k + 3] ?? 0) < 110) continue;
      let best = 0;
      let bestDist = Infinity;
      PALETTE.forEach(([r, g, b], n) => {
        const dist = (r - (d[k] ?? 0)) ** 2 + (g - (d[k + 1] ?? 0)) ** 2 + (b - (d[k + 2] ?? 0)) ** 2;
        if (dist < bestDist) {
          bestDist = dist;
          best = n;
        }
      });
      cells.push({ i, j, c: best, seed: Math.random() });
    }
  return { rows, cells };
}

/** The logo redrawn as coarse, dot-matrix, fine and animated pixel grids, each downloadable as PNG. */
export function PixelLogos() {
  const canvases = useRef<Record<string, HTMLCanvasElement | null>>({});
  const img = useRef<HTMLImageElement | null>(null);
  const raf = useRef(0);

  const drawAll = useCallback(() => {
    const image = img.current;
    if (!image) return;
    for (const v of VARIANTS) {
      const cv = canvases.current[v.key];
      const ctx = cv?.getContext("2d");
      if (!cv || !ctx) continue;
      const { rows, cells } = sample(image, v.cols);
      const size = 1200;
      const cell = size / v.cols;
      cv.width = size;
      cv.height = Math.round(rows * cell);
      const colour = (n: number) => (v.reversed && n === 1 ? "#f1ede6" : `rgb(${PALETTE[n]!.join(",")})`);
      const paint = (t: number) => {
        ctx.clearRect(0, 0, cv.width, cv.height);
        for (const q of cells) {
          let k = 1, ox = 0, oy = 0;
          if (v.animate) {
            k = Math.min(1, Math.max(0, (t - q.i * 14 - q.seed * 500) / 700));
            k = 1 - Math.pow(1 - k, 3);
            ox = (1 - k) * (q.seed - 0.5) * 400;
            oy = (1 - k) * (((q.j * 7919) % 13) / 13 - 0.5) * 300;
          }
          if (k <= 0) continue;
          ctx.globalAlpha = k;
          ctx.fillStyle = colour(q.c);
          const g = cell * v.gap;
          const x = q.i * cell + g / 2 + ox;
          const y = q.j * cell + g / 2 + oy;
          const w = cell - g;
          if (v.shape === "dot") {
            ctx.beginPath();
            ctx.arc(x + w / 2, y + w / 2, w / 2, 0, Math.PI * 2);
            ctx.fill();
          } else ctx.fillRect(x, y, w, w);
        }
        ctx.globalAlpha = 1;
      };
      if (v.animate && !prefersReducedMotion()) {
        const t0 = performance.now();
        cancelAnimationFrame(raf.current);
        const loop = (now: number) => {
          const t = now - t0;
          paint(t);
          if (t < 2600) raf.current = requestAnimationFrame(loop);
        };
        raf.current = requestAnimationFrame(loop);
      } else paint(1e9);
    }
  }, []);

  useEffect(() => {
    const image = new Image();
    image.onload = () => {
      img.current = image;
      drawAll();
    };
    image.src = LOGO_SRC;
    return () => cancelAnimationFrame(raf.current);
  }, [drawAll]);

  const download = (key: string) => {
    const cv = canvases.current[key];
    if (!cv) return;
    const a = document.createElement("a");
    a.download = `itqan-logo-pixel-${key}.png`;
    a.href = cv.toDataURL("image/png");
    a.click();
  };

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div className="flex flex-col gap-[18px]">
          <p className="m-0 text-[11px] font-medium tracking-[.18em] text-[#bcd155] uppercase">02 / Pixel system</p>
          <h2 id="pixels" className="m-0 text-[clamp(30px,4vw,60px)] leading-none font-semibold tracking-[-.026em]">
            The logo, in pixels
          </h2>
        </div>
        <button
          type="button"
          onClick={drawAll}
          className="min-h-12 rounded-full border border-[rgba(241,237,230,.35)] bg-transparent px-5 text-[12px] font-medium tracking-[.12em] text-[#f1ede6] uppercase hover:bg-[rgba(241,237,230,.08)]"
        >
          Replay assembly ↻
        </button>
      </div>
      <p className="m-0 max-w-[60ch] text-[16px] leading-[1.6] text-[#a99fb3]">
        Sampled directly from the official logo file and snapped to the three brand colours. Use the coarse grid for large displays and motion, dot matrix
        for screens and events, fine grid for social avatars and favicons.
      </p>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] gap-3">
        {VARIANTS.map((v) => (
          <figure key={v.key} className="m-0 flex flex-col gap-[10px]">
            <div className="rounded-[22px] border border-[rgba(241,237,230,.14)] p-[12%]" style={{ background: v.bg }}>
              <canvas
                ref={(el) => {
                  canvases.current[v.key] = el;
                }}
                className="block h-auto w-full"
              />
            </div>
            <figcaption className="flex justify-between gap-3 text-[11px] font-medium tracking-[.12em] text-[#a99fb3] uppercase">
              <span>{v.label}</span>
              <button
                type="button"
                onClick={() => download(v.key)}
                className="min-h-6 border-0 bg-transparent p-0 text-[#bcd155] [font:inherit] [letter-spacing:inherit] [text-transform:inherit]"
              >
                PNG ↓
              </button>
            </figcaption>
          </figure>
        ))}
      </div>
    </>
  );
}
