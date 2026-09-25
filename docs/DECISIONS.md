# Architecture decision records

## ADR-001: Keep the design handoff frozen and deploy it as-is for the preview

Date: 2026-09-25 · Status: Accepted; deployment part superseded by ADR-006 (the handoff stays the frozen visual reference)

**Context.** Claude Design delivered a high-fidelity HTML prototype (`design_handoff_itqan_website/`). The owner wants it online quickly for friends' feedback and said not to change the existing frontend.

**Decision.** Commit the handoff byte-for-byte. Any deployment problem is fixed in the root `netlify.toml`, never by editing the prototype files. Design changes come back as a new handoff from Claude Design.

**Consequences.** The preview is exactly what the designer shipped, including its known issues (see PROJECT_STATE "Known issues"). The handoff stays a clean reference for pixel-fidelity checks in Phase 2.

## ADR-002: Host on Netlify

Date: 2026-09-25 · Status: Accepted

**Context.** The project directive names Vercel as its preferred host. The owner explicitly asked for Netlify, and the design handoff already includes Netlify config and a Netlify Forms plan.

**Decision.** Netlify for the preview and for production.

**Consequences.**
- The directive's Vercel references read as Netlify: preview-URL noindexing applies to `*.netlify.app` and deploy previews.
- Netlify Forms covers the contact form without a backend.
- The Next.js site is deployed as a static export; Netlify's Next.js adapter is skipped (ADR-006).

## ADR-003: Noindex the preview with a header, not robots.txt

Date: 2026-09-25 · Status: Accepted

**Context.** The preview duplicates the live company's content. If it were indexed, it would compete with itqanpharma.com.

**Decision.** `X-Robots-Tag: noindex, nofollow` on every response through `netlify.toml`, with no robots.txt Disallow. A Disallow would stop crawlers from reading the noindex, and it would also mean changing the frontend folder.

**Consequences.** This must be removed at production cutover. It is listed in the launch checklist.

## ADR-004: Preview routing details

Date: 2026-09-25 · Status: Superseded by ADR-006 (the prototype is no longer deployed; its URLs now 301 to the new pages)

- `/` uses `force = true`. Without it, the prototype's `index.html` meta-refresh stub shadows the rewrite and `/` bounces to `/home/Home.dc.html`. Verified with `netlify dev`.
- `/mobile` is a 302 to `/Mobile%20Preview.dc.html`, not a rewrite, because Netlify does not rewrite to a filename containing a space. Verified.
- The designer's `immutable` one-year cache on `/assets/*` is **not** carried over. Asset URLs are not fingerprinted, so a changed image would stay stale in browsers for a year while we iterate. Netlify's default ETag revalidation is used instead. Production gets immutable caching on hashed build assets.

## ADR-005: Keep the live URLs as canonical in production

Date: 2026-09-25 · Status: **Accepted** by the owner on 2026-09-25

**Context.** The live site uses `/about-us`, `/contact-us`, `/all-products` and `/product-category/<slug>`, per the handoff README. The directive lists `/about`, `/contact` and `/products` as minimum routes. The directive also requires preserving search equity: preserve the URL or 301 it to its exact replacement.

**Proposal.**
- Keep the live URLs as canonical.
- Serve `/about`, `/contact` and `/products` as 301s to them.
- Add product pages at `/products/<slug>`.

**Alternatives.** Make the short URLs canonical and 301 the old ones. That's cleaner, but every existing URL then depends on redirects being right.

**Evidence still needed.** A full crawl of the live site (Phase 3), and Search Console data if the client can grant access. The category slugs (`/product-category/<slug>/`) come from the design catalogue; the live site's slugs are unconfirmed, so any that differ need a 301 (docs/seo/REDIRECT_MAP.md).

## ADR-006: Next.js static export on Netlify, adapter skipped

Date: 2026-09-25 · Status: Accepted

**Context.** The owner found the prototype slow, especially on first load. It compiles its pages in the browser with a 3 MB Babel bundle from unpkg and ships multi-megabyte PNGs. The directive prefers Next.js + TypeScript + Tailwind. The site has no server-side needs: no database, auth or API.

**Decision.**
- Build with Next.js App Router (`output: "export"`, `trailingSlash: true`) into `out/`, and publish that folder as static files.
- Set `NETLIFY_NEXT_PLUGIN_SKIP=true` in `netlify.toml`. Netlify's auto-installed Next.js adapter expects to publish `.next/`, and a static export needs none of its server features.

**Evidence.**
- I read the adapter source (v5.16.0): with `output: "export"` it only copies the export, and its publish-dir check reads `.next`.
- Measured on a simulated mid-range phone on slow 4G: first content went from about 2.5–4 s to about 1.3 s, and a fully scrolled products page from 21.7 MB to 1.8 MB.

**Consequences.**
- There's no server runtime to maintain.
- `next/image` optimisation is unavailable, so images are handled by ADR-008.
- Query-string state (the contact form prefill) is read on the client.

## ADR-007: Motion with CSS and the Web Animations API, no animation library

Date: 2026-09-25 · Status: Accepted

**Context.** The directive allows Motion "where justified". The design's motion is simple: rises, reveals, parallax, a marquee and staggers. The prototype already used the Web Animations API for all of it.

**Decision.**
- Intro motion (headline lines, above-the-fold reveals, the page fade-in) is pure CSS, so it runs on first paint without waiting for JavaScript.
- Scroll-driven motion lives in one small client component, `SiteRuntime`.
- No Motion/Framer dependency.
- Reveals use `fill: "backwards"` so hover lifts work afterwards, as the README specifies; the prototype's `fill: "both"` suppressed them.
- Everything is off under `prefers-reduced-motion`.

## ADR-008: Pre-optimised responsive WebP images

Date: 2026-09-25 · Status: Accepted

**Decision.**
- `npm run images` (`scripts/optimize-images.mjs`) reads the original assets from the frozen handoff and writes:
  - resized WebP sets to `public/images/`;
  - a typed manifest, `src/lib/images.generated.ts`.
- Packaging is resized only, never cropped or retouched, at quality 85. Logos are lossless.
- The output is committed, so Netlify builds stay fast and deterministic.

**Consequence.** Re-run the script, and commit its output, whenever an original asset changes.

## ADR-009: Enquiries through Netlify Forms

Date: 2026-09-25 · Status: Accepted

**Decision.**
- `public/__forms.html` holds the hidden form definition that Netlify detects at deploy time.
- The visible form on `/contact-us/` validates in the browser and POSTs URL-encoded data to `/__forms.html`.
- Spam protection comes from Netlify's spam filter plus a honeypot field (`bot-field`).
- On failure, the form shows the email address and phone number instead.

**Owner action.**
- Enable form detection in Netlify: **Forms → Enable form detection**. Newer sites have it off by default.
- Add an email notification to the chosen inbox (CLIENT_QUESTIONS #7).

**Residual.** Netlify Forms has no custom server-side validation or rate limiting. Revisit with a Netlify Function only if spam or abuse appears (ROADMAP Phase 4).

## ADR-010: No Product structured data yet

Date: 2026-09-25 · Status: Accepted

**Context.** Google treats `Product` markup without a price, review or rating as invalid. Inventing those is prohibited, and none are published.

**Decision.**
- Emit `Organization`, `WebSite` and `BreadcrumbList` only.
- Revisit `Product` (or a medical type such as `Drug`) once the client supplies verified product data: active ingredient, dosage form and leaflets.

## ADR-011: Small, deliberate deviations from the prototype

Date: 2026-09-25 · Status: Accepted. These go back to Claude Design as notes, not as edits to the handoff.

- **Accessibility fixes** (directive §16; axe-core now reports no violations):
  - The home tab panel role moves to a wrapper, so the product list keeps its list semantics.
  - The "In registration" label drops its extra 70% opacity, which failed WCAG AA contrast.
  - The theme toggle has an accessible name that matches its visible label.
  - Home tabs support arrow keys.
- **Breadcrumbs:** category pages show "Home / Products / <Category>", so the visible trail matches the page and its BreadcrumbList. On mobile this makes the page 24 px taller than the prototype.
- **Product filters** are links with real URLs (`/product-category/<slug>/`) instead of `?c=` buttons. They still filter in place.
- **Contact form:** submits to Netlify Forms instead of opening `mailto:`. The thank-you text now says the message was sent.
- **Header logo:** the dark-theme logo loads eagerly and the light one lazily, so the light logo only downloads for light-theme visitors.

## ADR-012: Self-hosted font; canonical origin from Netlify

Date: 2026-09-25 · Status: Accepted

- **Font:** Host Grotesk 400/500/600 comes from `@fontsource/host-grotesk` through `next/font/local`, so builds never depend on Google Fonts. Weight 700 is used only on the brand sheet and is not preloaded.
- **Canonical origin:** `SITE_URL` falls back to Netlify's build variable `URL` (the site's primary address), then to `https://itqanpharma.com`. Canonicals, Open Graph URLs and the sitemap therefore point at the preview today, and at itqanpharma.com automatically once that domain is made primary.

## ADR-013: A build-time quality gate blocks bad deploys

Date: 2026-09-25 · Status: Accepted

**Context.** The owner will iterate quickly on feedback, and each push deploys straight to the shared preview. The directive and SEO constitution §52 ask for automated checks.

**Decision.**
- `scripts/check-site.mjs` runs as `postbuild` over `out/`. It checks:
  - title, description, canonical and H1 on every indexable page, with titles and descriptions unique;
  - noindex only on hidden pages;
  - internal links and image files resolve;
  - every image has alt text and dimensions;
  - JSON-LD parses;
  - the sitemap matches the pages, and robots.txt names it;
  - no template contamination and no "CLIENT CONFIRMATION REQUIRED" marker;
  - a 450 KB image budget.
- Netlify runs `npm run lint && npm run build`. Any failure stops the deploy, so the previous version stays live.
- No separate CI service is added; Netlify's build is the pipeline.

**Evidence.** Negative-tested with 8 injected faults, all caught (see HANDOVER).

## ADR-014: Vendor-neutral analytics events, no tool until approved

Date: 2026-09-25 · Status: Accepted

**Decision.**
- The conversion events `contact_submit`, `cooperation_cta_click`, `email_click`, `phone_click` and `product_view` are pushed to `window.dataLayer` (`src/lib/analytics.ts`). They carry no personal data.
- No analytics script loads until the client approves a tool and the consent approach (CLIENT_QUESTIONS #6).
- Connecting GTM or GA4 later is a single loader component (docs/seo/ANALYTICS_PLAN.md).

**Consequences.** Zero third-party requests today (verified), and the events are ready the day a tool is approved.
