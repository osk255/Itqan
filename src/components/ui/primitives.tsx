// Small building blocks shared by every page. Values mirror the design handoff
// exactly (README › Components); keep them here rather than repeating classes.
import type { CSSProperties, ReactNode } from "react";

type WithChildren = { children: ReactNode; className?: string };

/** max-width 1560px container with the responsive side gutter. */
export function Container({ children, className = "" }: WithChildren) {
  return <div className={`mx-auto max-w-[1560px] px-gutter ${className}`}>{children}</div>;
}

const labelTone = { label: "text-label", panel: "text-panel-mute", lime: "text-lime" } as const;

/** 14px section label preceded by an 18×2px dash. */
export function SectionLabel({ children, tone = "label" }: { children: ReactNode; tone?: keyof typeof labelTone }) {
  return (
    <p className={`m-0 flex items-center gap-[10px] text-[14px] font-semibold ${labelTone[tone]}`}>
      <span aria-hidden="true" className="h-[2px] w-[18px] bg-current" />
      {children}
    </p>
  );
}

const pill = {
  accent:
    "min-w-[min(220px,100%)] justify-between gap-6 pr-2 pl-6 bg-accent text-on-accent [transition:transform_.4s_var(--ease-soft),filter_.3s] hover:[transform:translateY(-2px)] hover:brightness-[1.08]",
  ghost:
    "min-w-[min(220px,100%)] justify-between gap-6 px-6 border border-line text-fg [transition:background_.3s,border-color_.3s] hover:bg-chip hover:border-fg",
  panel:
    "min-w-[230px] justify-between gap-6 pr-2 pl-6 bg-on-panel text-panel [transition:transform_.4s_var(--ease-soft)] hover:[transform:translateY(-2px)]",
  panelGhost: "gap-5 px-6 border border-panel-line text-on-panel hover:bg-panel-line",
} as const;

const pillIcon = {
  accent: "grid size-10 place-items-center rounded-full bg-on-accent text-accent text-[17px]",
  panel: "grid size-10 place-items-center rounded-full bg-lime text-ink",
} as const;

/** Pill-shaped call to action (README › PillButton). Accent/panel show a "→" disc; ghost variants a "↗". */
export function PillLink({
  href,
  children,
  variant = "accent",
  className = "",
  external = false,
}: WithChildren & { href: string; variant?: keyof typeof pill; external?: boolean }) {
  const icon =
    variant === "accent" || variant === "panel" ? (
      <span aria-hidden="true" className={pillIcon[variant]}>
        →
      </span>
    ) : (
      <span aria-hidden="true">↗</span>
    );
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener" } : {})}
      className={`inline-flex min-h-14 items-center rounded-full text-[15px] font-semibold no-underline ${pill[variant]} ${className}`}
    >
      {children}
      {icon}
    </a>
  );
}

/**
 * Display headline whose lines rise out of a clipped row on load
 * (README › Motion › Headline lines). Pure CSS; see [data-line] in globals.css.
 */
export function HeadlineLines({ lines, className, id }: { lines: ReactNode[]; className: string; id?: string }) {
  return (
    <h1 id={id} className={`m-0 font-semibold ${className}`}>
      {lines.map((line, i) => (
        <span key={i} className="block pb-[.05em] [clip-path:inset(-.15em_-100vw_0_-100vw)]">
          <span data-line="" className="inline-block" style={{ "--i": i } as CSSProperties}>
            {line}
          </span>
        </span>
      ))}
    </h1>
  );
}

export type Crumb = { name: string; href: string };

/** Visible breadcrumb trail; the current page is the last, unlinked item. */
export function Breadcrumbs({ trail, current }: { trail: Crumb[]; current: string }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="m-0 flex list-none flex-wrap gap-[6px] p-0 text-[14px] font-medium text-mute">
        {trail.map((c) => (
          <li key={c.href} className="flex gap-[6px]">
            <a href={c.href} className="text-mute no-underline hover:text-fg">
              {c.name}
            </a>
            <span aria-hidden="true">/</span>
          </li>
        ))}
        <li aria-current="page" className="text-fg">
          {current}
        </li>
      </ol>
    </nav>
  );
}

/** Soft radial glow behind page heroes; drifts with scroll (data-parallax). */
export function HeroGlow({ className, parallax }: { className: string; parallax: number }) {
  return (
    <div
      aria-hidden="true"
      data-parallax={parallax}
      className={`pointer-events-none absolute aspect-square rounded-full bg-[radial-gradient(closest-side,var(--glow),transparent_72%)] ${className}`}
    />
  );
}

/** Reveal-on-scroll wrapper attributes (README › Motion › Reveal). */
export const reveal = (delay = 0, kind: "up" | "mask" = "up") => ({
  "data-reveal": kind,
  ...(delay ? { "data-delay": String(delay) } : {}),
});

/** Above-the-fold reveal that runs on first paint (CSS), with an optional delay in ms. */
export const intro = (delay = 0, kind: "up" | "mask" = "up") => ({
  "data-intro": kind === "mask" ? "mask" : "",
  style: { "--d": `${delay}ms` } as CSSProperties,
});
