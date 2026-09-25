# Roadmap: Itqan website redesign

Last updated: 2026-09-25

The site goes from design prototype to production in six phases. Each phase ends with a check you can see, not only a claim.

| # | Phase | Status | Output |
|---|---|---|---|
| 0 | Foundation and governance | **Done** | Repo, governance docs, project state, this plan |
| 1 | Netlify design preview | **Done** | https://courageous-caramel-8493e6.netlify.app (noindex) |
| 1b | Feedback round | **In progress** | Triaged feedback in [FEEDBACK.md](FEEDBACK.md) |
| 2 | Production build | **Built. Owner review on the preview** | Next.js static site with the same design, fast on mobile |
| 3 | SEO, GEO and URL migration | Next. Needs access to itqanpharma.com | Full redirect map, keyword/intent maps, schema plan |
| 4 | Forms, analytics and security | Partly done | Form live once Netlify form detection is on; analytics pending approval |
| 5 | Launch on itqanpharma.com | After 3 and 4 plus client sign-off | Live site, email untouched |
| 6 | Post-launch | Ongoing | Monitoring, content the client supplies later |

---

## Phase 0: Foundation and governance (done)

- The design handoff is committed **unchanged** in `design_handoff_itqan_website/`. It is the frozen visual reference.
- The governance docs live in `docs/governance/`.
- The continuity docs are HANDOVER, PROJECT_STATE, DECISIONS, ASSUMPTIONS and CLIENT_QUESTIONS.

## Phase 1: Netlify design preview (done)

- The prototype was published as-is.
- Owner feedback: it was **slow to start, especially on phones**.
- The cause, measured on a simulated mid-range phone on 4G:
  - blank screen for about 1.5 s;
  - text at about 2.5–4 s, because the page compiles itself in the browser with a 3 MB Babel bundle;
  - no 3D logo even after 8 s;
  - the products page downloads 21.7 MB of PNGs.
- That fed directly into Phase 2.

## Phase 1b: Feedback round (in progress)

- Share the preview URL with the prompts in [FEEDBACK.md](FEEDBACK.md), and log each point.
- Sort each point into one of four buckets:
  - **design**: goes back to Claude Design;
  - **production**: handled in code;
  - **content**: goes to the client;
  - **won't do**: with a reason.

## Phase 2: Production build (built; owner review)

Owner decisions, 2026-09-25:
1. The earlier Next.js project doesn't exist, so a new one was created.
2. The live URLs stay canonical (ADR-005).
3. No Arabic version at launch.

**Delivered:**
- **Stack:** Next.js 16 App Router, TypeScript strict, Tailwind v4. Static export to `out/`, served from Netlify's CDN (ADR-006).
- **Pages:** all six public pages plus the brand sheet, on the live URLs:
  - `/`, `/about-us/`, `/all-products/`, `/business-cooperation/`, `/contact-us/`;
  - `/product-category/<slug>/` (8 pages);
  - `/products/<slug>/` (27 pages).
- **Design:** recreated from the handoff tokens and specs, including the scroll-driven 3D voxel logo.
  - Page heights match the prototype to the pixel on most pages at 390 and 1440 px, in both themes.
  - Deliberate deviations are listed in ADR-011.
- **Speed:**
  - No in-browser compiler.
  - Intro motion runs in CSS on first paint.
  - three.js (130 KB gzipped) loads only on the home page, after the content, once the browser is idle.
  - Images are WebP at the right size (ADR-008).
  - Result: first content in about 1.3 s instead of about 2.5–4 s, and the products page drops from 21.7 MB to 1.8 MB.
- **SEO basics:**
  - A unique title, description and canonical on every page, plus Open Graph and Twitter tags.
  - JSON-LD: Organization, WebSite and BreadcrumbList. No Product markup (ADR-010).
  - `sitemap.xml` (40 URLs), `robots.txt`, a real 404 page.
  - 301s from `/about`, `/contact` and `/products`, and from every old prototype preview URL.
- **Accessibility:**
  - Landmarks, a skip link and visible focus.
  - Labelled form with announced errors; tabs follow the ARIA pattern with arrow keys.
  - `prefers-reduced-motion` respected.
  - axe-core reports 0 violations on the main pages in both themes.
- **Contact form:** posts to Netlify Forms, with a honeypot and an email/phone fallback on failure (ADR-009).

**Still open in Phase 2:** owner and friends review the new preview; design notes go back to Claude Design (ADR-011).

## Phase 3: SEO, GEO and URL migration (next)

- **Crawl the live itqanpharma.com.** This environment's network policy blocks it: allow the domain in the environment settings, or run the crawl elsewhere.
- **Complete [seo/REDIRECT_MAP.md](seo/REDIRECT_MAP.md):**
  - Confirm the live category slugs and any product URLs.
  - Add a 301 for each one that differs.
  - Send template-contamination pages to 410.
- **Write the remaining SEO docs** from real research:
  - KEYWORD_MAP, SEARCH_INTENT_MAP, SCHEMA_PLAN, INTERNAL_LINKING_PLAN, AI_VISIBILITY_PLAN.
- **Consider category H1s:** the design keeps "Products" as the H1 on category pages, and a category-specific H1 would be stronger. That's a design decision for Claude Design.
- **Automated checks at build:** broken links, duplicate titles, stray `noindex`, sitemap URLs that don't return 200.

## Phase 4: Forms, analytics and security (partly done)

- **Done:** Netlify Forms wiring, honeypot, security headers, `npm audit` (0 vulnerabilities), and no third-party scripts.
- **Owner:**
  - Enable **form detection** in Netlify.
  - Set the notification email (CLIENT_QUESTIONS #7).
- **After client approval:**
  - Analytics: GA4, Search Console, Bing Webmaster Tools, and Clarity if approved.
  - Events: `contact_submit`, `cooperation_cta_click`, `email_click`, `phone_click`, `product_view`.
- **Next:**
  - A Content-Security-Policy. The static export uses inline scripts, so this needs hashes or `'unsafe-inline'`; evaluate the trade-off.
  - HSTS on the custom domain.

## Phase 5: Launch on itqanpharma.com

Follow [seo/LAUNCH_CHECKLIST.md](seo/LAUNCH_CHECKLIST.md) and the DNS and email steps in [DEPLOYMENT.md](DEPLOYMENT.md):

- Keep MX, SPF, DKIM and DMARC exactly as they are, and change only the web records.
- Remove the preview `X-Robots-Tag`.
- Verify the 301s.
- Submit the sitemap.
- Test email in both directions.

## Phase 6: Post-launch

- **Day 1–7:** indexing, 404s, redirects, crawler access.
- **Week 2–4:** queries, Core Web Vitals, fixes.
- **After that:** add product data only as the client supplies it (active ingredients, dosage forms, leaflets, capacity, certificates).
