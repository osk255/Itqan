// Content sections that appear on more than one page. Copy is verbatim from the
// live site via lib/catalogue.ts.
import { dosageForms, markets, reasons, statements } from "@/lib/catalogue";
import { reveal } from "@/components/ui/primitives";

const pad2 = (i: number) => String(i + 1).padStart(2, "0");

/** Three columns with a hairline on top (README › VisionMissionValues). */
export function VisionMissionValues() {
  const items = [
    ["Our Vision", statements.vision],
    ["Our Mission", statements.mission],
    ["Our Values", statements.values],
  ] as const;
  return (
    <div className="flex flex-wrap gap-x-[clamp(24px,3vw,48px)]">
      {items.map(([title, text], i) => (
        <div key={title} {...reveal(i * 100)} className="flex flex-[1_1_260px] flex-col gap-3 border-t border-line py-7">
          <span className="text-[14px] font-semibold text-label">{title}</span>
          <p className="m-0 text-[clamp(21px,1.9vw,27px)] leading-[1.25] font-semibold tracking-[-.015em]">{text}</p>
        </div>
      ))}
    </div>
  );
}

/** The seven numbered reasons; rows indent 12px on hover (README › ReasonsList). */
export function ReasonsList({ onPanel = false }: { onPanel?: boolean }) {
  const line = onPanel ? "border-panel-line" : "border-[rgba(243,239,232,.28)]";
  return (
    <ol className={`m-0 list-none border-t p-0 ${line}`}>
      {reasons.map((r, i) => (
        <li
          key={r}
          {...reveal()}
          className={`grid grid-cols-[52px_1fr] items-baseline gap-[10px] border-b py-[clamp(20px,2.4vw,30px)] [transition:padding_.45s_var(--ease-soft)] hover:pl-3 ${line}`}
        >
          <span className="text-[14px] font-medium opacity-70">{pad2(i)}</span>
          <span className="text-[clamp(21px,2.2vw,32px)] leading-[1.15] font-semibold tracking-[-.02em] [text-wrap:balance]">{r}</span>
        </li>
      ))}
    </ol>
  );
}

/** Seven dosage-form tiles (README › DosageFormGrid). Capacity values are not published yet. */
export function DosageFormGrid() {
  return (
    <ol className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(50%,170px),1fr))] gap-[10px] p-0">
      {dosageForms.map((f, i) => (
        <li
          key={f}
          {...reveal((i % 7) * 60)}
          className="flex min-h-40 flex-col justify-between gap-10 rounded-[14px] border border-line bg-chip p-5 [transition:background_.35s,color_.35s,transform_.45s_var(--ease-soft)] hover:bg-accent hover:text-on-accent hover:[transform:translateY(-4px)]"
        >
          <span className="text-[13px] font-medium opacity-75">{pad2(i)}</span>
          <span className="text-[clamp(19px,1.6vw,23px)] leading-[1.12] font-semibold tracking-[-.015em]">{f}</span>
        </li>
      ))}
    </ol>
  );
}

/**
 * Approved markets (lime dot), the GCC central approval (sky dot) and
 * registrations in process (dashed, muted). README › MarketPills.
 */
export function MarketPills() {
  const list = [
    ...markets.national.map((name) => ({ name, kind: "national" as const })),
    ...markets.central.map((name) => ({ name, kind: "central" as const })),
    ...markets.inProgress.map((name) => ({ name, kind: "inProgress" as const })),
  ];
  return (
    <ul className="m-0 flex list-none flex-wrap gap-[10px] p-0">
      {list.map((m, i) => {
        const pending = m.kind === "inProgress";
        return (
          <li
            key={m.name}
            {...reveal((i % 8) * 50)}
            className={`flex min-h-14 items-center gap-3 rounded-full px-[22px] text-[clamp(16px,1.4vw,21px)] leading-none font-semibold ${
              pending ? "border border-dashed border-line text-mute" : "border border-line bg-chip"
            }`}
          >
            <span
              aria-hidden="true"
              className={`size-[9px] flex-none rounded-full ${pending ? "border border-mute" : m.kind === "central" ? "bg-sky" : "bg-lime"}`}
            />
            {m.name}
            {/* Full-strength muted text: at the design's 70% opacity this 12px label fails WCAG AA contrast. */}
            <span className="text-[12px] leading-[normal] font-medium">{pending ? "In registration" : ""}</span>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * Heading whose words brighten one by one as it scrolls into view
 * (README › Word-by-word read). Words are rendered on the server; the full
 * sentence stays available to assistive tech through aria-label.
 */
export function WordsHeading({ text, className, id }: { text: string; className: string; id?: string }) {
  const words = text.split(/\s+/);
  return (
    <h2 id={id} data-words="" aria-label={text} className={`m-0 font-semibold ${className}`}>
      {words.map((w, i) => (
        <span key={i} aria-hidden="true" className="[transition:opacity_.3s_linear]">
          {w + (i < words.length - 1 ? " " : "")}
        </span>
      ))}
    </h2>
  );
}

/** Closing "Collaborate…" band used on About and Products. */
export function CollaborateBand({ children }: { children: React.ReactNode }) {
  return (
    <section className="mx-auto flex max-w-[1560px] flex-wrap items-end justify-between gap-6 px-gutter py-[clamp(56px,7vw,110px)]">
      <h2 className="m-0 max-w-[20ch] text-[clamp(28px,3.4vw,52px)] leading-[1.02] font-semibold tracking-[-.03em]">
        Collaborate with Itqan Pharma to achieve excellence
      </h2>
      <div className="flex flex-wrap gap-3">{children}</div>
    </section>
  );
}
