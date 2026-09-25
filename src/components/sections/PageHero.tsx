import type { ReactNode } from "react";
import { Breadcrumbs, HeadlineLines, HeroGlow, intro, type Crumb } from "@/components/ui/primitives";

type Props = {
  trail: Crumb[];
  current: string;
  lines: ReactNode[];
  /** Lead paragraph under the headline (fades in after the headline). */
  lead?: ReactNode;
  /** Optional call to action beside the lead. */
  cta?: ReactNode;
};

/** Inner-page hero: breadcrumb, rising headline, lead and optional CTA over a soft glow. */
export function PageHero({ trail, current, lines, lead, cta }: Props) {
  return (
    <section className="relative overflow-hidden">
      <HeroGlow parallax={-0.15} className="-top-[30vw] -right-[15vw] w-[min(90vw,1000px)]" />
      <div className="relative mx-auto flex max-w-[1560px] flex-col gap-[clamp(18px,2vw,26px)] px-gutter pt-[clamp(36px,5vw,72px)] pb-[clamp(48px,6vw,96px)]">
        <Breadcrumbs trail={trail} current={current} />
        <HeadlineLines lines={lines} className="text-[clamp(40px,5.6vw,92px)] leading-[.95] tracking-[-.024em]" />
        <div className="flex flex-wrap items-end justify-between gap-x-14 gap-y-6">
          {lead && (
            <p {...intro(350)} className="m-0 max-w-[52ch] text-[clamp(17px,1.4vw,21px)] leading-[1.55] text-mute [text-wrap:pretty]">
              {lead}
            </p>
          )}
          {cta && <div {...intro(450)}>{cta}</div>}
        </div>
      </div>
    </section>
  );
}
