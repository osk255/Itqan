# Roadmap: Itqan website redesign

Last updated: 2026-09-25

The site goes from design prototype to production in six phases. Each phase ends with a check you can see, not only a claim. Phases 1 and 1b let people react to the design before any production code is written, so their feedback is cheap to act on.

| # | Phase | Status | Output |
|---|---|---|---|
| 0 | Foundation and governance | **Done** | Repo, governance docs, project state, this plan |
| 1 | Netlify design preview | **Ready: needs one Netlify connection (see [DEPLOYMENT.md](DEPLOYMENT.md))** | A shareable preview URL that stays out of Google |
| 1b | Feedback round | Next | Triaged feedback in [FEEDBACK.md](FEEDBACK.md) |
| 2 | Production build | Blocked on 3 decisions below | Next.js site with the same design, fast on mobile |
| 3 | SEO, GEO and URL migration | After 2 | Metadata, schema, sitemap, full redirect map |
| 4 | Forms, analytics and security | After 2, parallel with 3 | Working enquiry form, measured conversions, hardened headers |
| 5 | Launch on itqanpharma.com | After 3 and 4 plus client sign-off | Live site, email untouched |
| 6 | Post-launch | Ongoing | Monitoring, content the client supplies later |

---

## Phase 0: Foundation and governance (done)

- The design handoff is committed **unchanged** in `design_handoff_itqan_website/`. It is the frozen visual reference.
- The governance docs are in `docs/governance/`: the project directive, the engineering OS, the SEO/GEO constitution and the Kev/Jev layer.
- The continuity docs are `HANDOVER.md`, `docs/PROJECT_STATE.md`, `DECISIONS.md`, `ASSUMPTIONS.md` and `CLIENT_QUESTIONS.md`.

## Phase 1: Netlify design preview (config done, needs one connection)

**Goal:** friends and stakeholders can open the design on their own phones and laptops.

- The root `netlify.toml` publishes the prototype with no build step. It gives clean URLs (`/`, `/about`, `/products`, `/business-cooperation`, `/contact`, `/brand`, `/mobile`).
- Every response carries `X-Robots-Tag: noindex, nofollow`, so the preview never competes with itqanpharma.com in search.
- All routes were tested with Netlify's own emulator (`netlify dev`). All 7 pages were rendered in Chromium at 320, 375, 390, 430, 768, 1024, 1280 and 1440 px: no horizontal overflow and no broken images. Details are in [HANDOVER.md](../HANDOVER.md).

**Exit:** a live `*.netlify.app` URL has been shared.
**Owner action:** connect the GitHub repo in Netlify. That's about 3 minutes, steps in [DEPLOYMENT.md](DEPLOYMENT.md).

**Tell reviewers:**
1. This is a design prototype, so it is heavier and slower than the final site will be. The products page downloads about 22 MB.
2. The contact form opens a real email to info@itqanpharma.com. Don't send it.

## Phase 1b: Feedback round

- Collect reactions using the prompts in [FEEDBACK.md](FEEDBACK.md). Log each one with page, device and theme.
- Sort each item into one of four buckets:
  - **design change**: goes back to Claude Design, then a new handoff;
  - **production concern**: handled in Phase 2 anyway, for example speed or image weight;
  - **content or fact**: goes to the client via [CLIENT_QUESTIONS.md](CLIENT_QUESTIONS.md);
  - **won't do**: with a reason.
- Never "fix" the prototype files directly. The handoff stays the single visual source of truth until the production build replaces it.

**Exit:** feedback is triaged and any design revisions are handed back.

## Phase 2: Production build

**Goal:** the same design, rebuilt so it is fast, crawlable and maintainable.

**Decisions needed before starting.** The recommended answer comes first in each:
1. **Existing Next.js project?** The handoff README refers to an existing `itqan-pharma/` Next.js 16 project, but it is not in this repo.
   - If it exists, push it here and Phase 2 builds on it.
   - Otherwise Phase 2 starts clean from the spec.
2. **URL strategy.** Recommended: keep the live site's URLs as canonical (`/about-us`, `/contact-us`, `/all-products`, `/product-category/<slug>`), as the handoff advises for SEO. Add `/about`, `/contact` and `/products` as 301 aliases. New product pages live at `/products/<slug>`.
   - The alternative is to make the directive's short URLs canonical and 301 the old ones.
   - Both are safe. The first carries less risk to existing rankings.
3. **Arabic version?** If it is needed at launch, routes become `/en/...` and `/ar/...` with hreflang and a deliberately designed RTL layout, which changes the Phase 2 scope. If it is not needed now, build English-only with i18n-ready content.

**Stack** (per the directive, confirmed against current Netlify docs at the start of Phase 2):
- Next.js (App Router), TypeScript strict, Tailwind v4, Motion, `next/font` (Host Grotesk).
- All pages statically generated. Netlify's Next.js adapter is detected automatically.

**Work:**
- **Content and design:**
  - Port `shared/catalogue.js` to a typed `lib/catalogue.ts` as the single content source.
  - Recreate the tokens, components and motion from the handoff README pixel-for-pixel. Keep the copy verbatim.
- **Pages:**
  - Build `/products/[slug]` for all 27 products with `generateStaticParams`.
  - Show a row only when its value exists. Never invent values.
- **3D logo:** wrap it as a client-only component, keep the scroll scene, and render it static under `prefers-reduced-motion`.
- **Remove the runtime Babel/React/three CDN loads.** Bundle only what's needed and load three.js only on the home page.
- **Images:**
  - Optimise to AVIF/WebP at correct sizes, using lossless or visually lossless settings so official packaging is not altered.
  - Target under 300 KB per product image. Some are 3.4 MB today.

**Exit:**
- Lint, typecheck and build pass.
- The site is rendered and checked at 8 widths in both themes, keyboard navigation works, and there are no console errors.
- The Lighthouse mobile score and LCP, CLS and INP are recorded against targets (LCP ≤ 2.5 s, CLS ≤ 0.1, INP ≤ 200 ms).
- The Netlify deploy preview replaces the prototype preview.

## Phase 3: SEO, GEO and URL migration

- **Crawl the live itqanpharma.com.** This session could not reach it, so it has to be done from a network that can. Build a complete `OLD URL → NEW URL → ACTION` map in [seo/REDIRECT_MAP.md](seo/REDIRECT_MAP.md). No blanket redirects to the homepage.
- **Metadata:**
  - A unique title, description, canonical URL and Open Graph/Twitter tags for every page, with absolute OG image URLs.
  - Breadcrumbs.
- **JSON-LD**, limited to visible, true content:
  - `Organization`, `WebSite` and `BreadcrumbList`;
  - `Product` only where valid, with no prices, ratings or availability invented.
- **Crawl files:**
  - `sitemap.xml` listing canonical URLs only.
  - `robots.txt` that allows Googlebot, Bingbot and OAI-SearchBot. Blocking GPTBot (training) is **the client's decision**, recorded in CLIENT_QUESTIONS.
- **Remaining SEO docs**, written from real research rather than placeholders:
  - `docs/seo/` KEYWORD_MAP, SEARCH_INTENT_MAP, SCHEMA_PLAN, INTERNAL_LINKING_PLAN and AI_VISIBILITY_PLAN;
  - plus the ENTITY_MAP that already exists.
- **Automated checks at build:** broken internal links, duplicate titles, stray `noindex`, sitemap URLs that don't return 200.

## Phase 4: Forms, analytics and security

- **Contact form:**
  - Replace the prototype's `mailto:` with Netlify Forms, as the handoff recommends: honeypot, Netlify spam filtering, and the existing "Thank you." state.
  - If the client needs real server-side validation or rate limiting beyond what Netlify Forms offers, use a small Netlify Function instead. Decide once volume and spam are known.
- **Analytics** (after client approval, with consent handling where required):
  - Tools: GA4, Search Console, Bing Webmaster Tools, and Clarity only if approved.
  - Events: `contact_submit`, `cooperation_cta_click`, `email_click`, `phone_click`, `product_view`. No vanity events.
- **Security:**
  - Headers: CSP (possible once the runtime Babel/`eval` is gone) and HSTS on the real domain.
  - `npm audit`, and no secrets in the client bundle.

## Phase 5: Launch on itqanpharma.com

Follow [seo/LAUNCH_CHECKLIST.md](seo/LAUNCH_CHECKLIST.md). The critical parts:

- **Content:** the client signs off all content, and every CLIENT CONFIRMATION REQUIRED item is resolved or removed.
- **Before touching DNS:**
  - Export and record the full current DNS zone.
  - Keep MX, SPF, DKIM and DMARC exactly as they are.
  - Change **only** the web records (apex and `www`).
  - Lower the TTL a day ahead.
- **Right after cutover:**
  - Remove the preview `noindex` header.
  - Verify the 301s.
  - Submit the sitemap to Google and Bing.
  - Send a test email to and from the domain.

## Phase 6: Post-launch

- **Day 1–7:** indexing, 404s, redirects, crawler access.
- **Week 2–4:** queries, Core Web Vitals, fixes.
- **Month 2 onward:** add content only as the client supplies real data. That means leaflets/SmPC, active ingredients, dosage forms, capacity and certificates. Arabic comes here if it was deferred.
