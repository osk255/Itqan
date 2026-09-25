import { categories, statements } from "@/lib/catalogue";
import { company, routes } from "@/lib/site";
import { Picture } from "@/components/ui/Picture";
import { reveal } from "@/components/ui/primitives";

const link = "text-fg no-underline [transition:color_.3s] hover:text-hi";
const heading = "text-[13px] leading-[normal] font-semibold text-mute";

/** Four columns mirroring the live site, the full-width logo, and the legal bar (README › Footer). */
export function Footer() {
  return (
    <footer className="overflow-hidden border-t border-line">
      <div className="mx-auto grid max-w-[1560px] grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-9 px-gutter pt-[clamp(56px,7vw,96px)] text-[15px] leading-[1.5]">
        <div className="flex flex-col gap-[14px]">
          <span className={heading}>About</span>
          <p className="m-0 max-w-[34ch] text-fg">{statements.founded}</p>
          <div className="flex gap-[18px]">
            <a href={company.facebook} className={link}>
              Facebook
            </a>
            <a href={company.linkedin} className={link}>
              LinkedIn
            </a>
          </div>
        </div>
        <nav aria-label="Footer links" className="flex flex-col gap-[10px]">
          <span className={heading}>Links</span>
          <a href={routes.about} className={link}>
            About
          </a>
          <a href={routes.products} className={link}>
            Products
          </a>
          <a href={routes.contact} className={link}>
            Contact
          </a>
          <a href={routes.cooperation} className={link}>
            Business Cooperation
          </a>
        </nav>
        <nav aria-label="Product categories" className="flex flex-col gap-[10px]">
          <span className={heading}>Categories</span>
          {categories.map((c) => (
            <a key={c.slug} href={routes.category(c.slug)} className="text-fg no-underline hover:text-hi">
              {c.full}
            </a>
          ))}
        </nav>
        <div className="flex flex-col gap-[10px]">
          <span className={heading}>Contacts</span>
          <a href={company.maps} className={link}>
            {company.locationLabel}
          </a>
          <a href={company.phoneHref} className={link}>
            {company.phone}
          </a>
          <a href={company.emailHref} className={link}>
            {company.email}
          </a>
        </div>
      </div>
      <div {...reveal()} className="mx-auto max-w-[1560px] px-gutter pt-[clamp(48px,7vw,96px)] pb-[clamp(18px,2vw,26px)]">
        <div className="w-[min(100%,1100px)]">
          <Picture image="brand/logo-reversed" data-logo="dark" alt="" sizes="(max-width: 1200px) 92vw, 1100px" className="h-auto w-full" />
          <Picture image="brand/logo" data-logo="light" alt="" sizes="(max-width: 1200px) 92vw, 1100px" className="h-auto w-full" />
        </div>
      </div>
      <div className="mx-auto flex max-w-[1560px] flex-wrap justify-between gap-[10px] border-t border-line px-gutter pt-5 pb-7 text-[13px] text-mute">
        <span>©2026 Itqan Pharmaceutical Ind. All rights reserved</span>
        <a href={routes.brand} className="text-mute">
          Brand identity
        </a>
      </div>
    </footer>
  );
}
