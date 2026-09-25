"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { company, primaryNav, routes } from "@/lib/site";
import { Picture } from "@/components/ui/Picture";
import { PillLink } from "@/components/ui/primitives";

const DESKTOP = "(min-width: 1100px)";

/**
 * Sticky header (README › Header, Mobile). Desktop and mobile controls are both
 * rendered and switched with CSS at 1100px, so the server HTML is already right.
 */
export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        setScrolled(window.scrollY > 24);
      });
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    const mq = matchMedia(DESKTOP);
    const onMq = () => mq.matches && setMenuOpen(false);
    mq.addEventListener("change", onMq);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    addEventListener("keydown", onKey);
    return () => {
      removeEventListener("scroll", onScroll);
      mq.removeEventListener("change", onMq);
      removeEventListener("keydown", onKey);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Lock the page behind the open menu, and stagger its items in.
  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? "hidden" : "";
    if (!menuOpen || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    menuRef.current?.querySelectorAll("[data-menu-item]").forEach((el, i) =>
      el.animate([{ opacity: 0, transform: "translateY(24px)" }, { opacity: 1, transform: "none" }], {
        duration: 520,
        delay: 40 + i * 60,
        easing: "cubic-bezier(.16,1,.3,1)",
        fill: "both",
      }),
    );
  }, [menuOpen]);

  const toggleTheme = useCallback(() => {
    const root = document.documentElement;
    const next = root.dataset.theme === "light" ? "dark" : "light";
    root.dataset.theme = next;
    try {
      localStorage.setItem("itqan-theme", next);
    } catch {
      // Private mode: the theme still applies for this page view.
    }
    dispatchEvent(new Event("itqan-theme"));
  }, []);

  const solid = scrolled || menuOpen;
  // No backdrop-filter while the menu is open: it would trap the fixed menu inside the header.
  const blur = scrolled && !menuOpen;
  // Category and product pages belong to the Products section.
  const section = /^\/(product-category|products)\//.test(pathname) ? routes.products : pathname;
  const isCurrent = (href: string) => (href === "/" ? section === "/" : section.startsWith(href));

  return (
    <header
      className="sticky top-0 z-50 border-b [transition:background_.4s,border-color_.4s]"
      style={{
        borderBottomColor: solid ? "var(--line)" : "transparent",
        background: menuOpen ? "var(--bg)" : solid ? "color-mix(in srgb,var(--bg) 84%,transparent)" : "transparent",
        backdropFilter: blur ? "blur(14px)" : "none",
        WebkitBackdropFilter: blur ? "blur(14px)" : "none",
      }}
    >
      <div className="mx-auto flex h-[76px] max-w-[1560px] items-center gap-5 px-gutter">
        <a href={routes.home} aria-label="Itqan Pharma — home" className="mr-auto flex items-center">
          {/* Dark is the default theme, so its logo loads eagerly; the light one is lazy
              and, while hidden, never downloads. */}
          <Picture image="brand/logo-reversed" data-logo="dark" alt="Itqan Pharma — Fueling wellness" sizes="63px" loading="eager" className="h-[46px] w-auto" />
          <Picture image="brand/logo" data-logo="light" alt="Itqan Pharma — Fueling wellness" sizes="63px" loading="lazy" className="h-[46px] w-auto" />
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-[2px] min-[1100px]:flex">
          {primaryNav.map((item) => {
            const current = isCurrent(item.href);
            return (
              <a
                key={item.href}
                href={item.href}
                aria-current={current ? "page" : undefined}
                className={`rounded-full px-[14px] py-[10px] text-[15px] leading-none font-medium text-fg no-underline [transition:background_.3s] hover:bg-chip ${current ? "bg-chip" : ""}`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={toggleTheme}
          className="flex h-11 min-w-11 items-center gap-2 rounded-full border border-line bg-transparent px-[14px] text-[13px] font-medium text-fg [transition:background_.3s] hover:bg-chip"
        >
          <span aria-hidden="true" className="size-3 rounded-full border-[1.5px] border-current bg-transparent in-data-[theme=light]:bg-current" />
          <span className="sr-only">Switch to </span>
          <span data-when="dark">Light</span>
          <span data-when="light">Dark</span>
          <span className="sr-only"> theme</span>
        </button>

        <a
          href={routes.contactCooperation}
          className="hidden h-11 items-center gap-[10px] rounded-full bg-accent px-5 text-[14px] font-semibold text-on-accent no-underline [transition:filter_.3s,transform_.3s] hover:text-on-accent hover:brightness-[1.08] hover:[transform:translateY(-1px)] min-[1100px]:flex"
        >
          Become a Partner
        </a>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          className="h-11 rounded-full border-0 bg-fg px-[18px] text-[14px] font-semibold text-bg min-[1100px]:hidden"
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
      </div>

      {menuOpen && (
        <nav
          ref={menuRef}
          id="mobile-menu"
          aria-label="Mobile"
          className="fixed top-[76px] right-0 left-0 z-[60] flex h-[calc(100dvh-76px)] flex-col overflow-auto bg-bg px-5 pt-2 pb-8"
        >
          {primaryNav.map((item, i) => (
            <a
              key={item.href}
              data-menu-item=""
              href={item.href}
              aria-current={isCurrent(item.href) ? "page" : undefined}
              onClick={() => setMenuOpen(false)}
              className="flex items-baseline justify-between border-b border-line py-5 text-[32px] leading-[1.1] font-semibold tracking-[-.02em] text-fg no-underline"
            >
              {item.label}
              <span className="text-[13px] leading-[normal] font-medium text-mute">{String(i + 1).padStart(2, "0")}</span>
            </a>
          ))}
          <div className="mt-7">
            <PillLink href={routes.contactCooperation}>Become a Partner</PillLink>
          </div>
          <div className="mt-auto grid gap-2 pt-7 text-[15px]">
            <a href={company.phoneHref} className="text-fg">
              {company.phone}
            </a>
            <a href={company.emailHref} className="text-fg">
              {company.email}
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
