# Handover

Read this first, then [docs/PROJECT_STATE.md](docs/PROJECT_STATE.md) and [docs/ROADMAP.md](docs/ROADMAP.md).

## Latest session: 2026-09-25 (Claude Code): two-tone capsule 3D logo

**Context.** The owner asked for the 3D voxel logo to be rebuilt from pharmaceutical tablets instead of cubes, chose **two-tone capsules**, and asked that it stay fast on every device. The plan was approved first; see ADR-015.

### What changed
- **`src/components/home/logo3d.ts`:**
  - Each voxel is now a two-tone capsule, still drawn as a single `InstancedMesh` (one draw call).
    - A hand-built six-sided capsule with exact normals and a per-vertex `aTone`.
    - A per-instance `aBack` colour.
    - A one-line shader patch mixes the two halves.
  - Colours:
    - Front halves use the brand colour; letters are bone on dark, as before.
    - Back halves are white; letters on dark get plum.
    - Colours switch live with the theme.
  - Capsules tilt slightly while the logo turns and realign at rest.
  - The sampling, timings, scroll path, lights and camera are the designer's, unchanged.
  - **Speed:**
    - Device tiers: desktop, touch, and low-end (≤2 GB or ≤2 cores).
    - A frame-time watchdog lowers the resolution if frames are slow.
    - It draws at 30 fps once still, and not at all when idle with reduced motion.
    - `powerPreference: "default"`.
    - The WebGL 2 context is created up front, so a missing GPU returns `null` quietly.
    - A lost context hands over to the fallback.
  - New `onInk` option: the brand sheet's panel is ink in both themes, so it always uses the dark-ground colours.
- **`src/components/home/LogoFallback.tsx` (new):** the flat official logo at the 3D logo's resting place. It is theme-aware; `onInk` always shows the reversed logo.
- **`HeroStage.tsx`:**
  - Shows the fallback when WebGL 2 is missing, the context is lost, or Save-Data is on.
  - The fallback follows the 3D logo's scroll move to the centre, so it never covers the caption.
- **`BrandLogo3D.tsx`:** the same fallback; passes `onInk`.
- **`src/lib/motion.ts`:** `skip3DLogo()` (Save-Data, or no WebGL 2 API). In those cases three.js isn't downloaded at all.
- **Docs:** DECISIONS (ADR-015; ADR-011 notes for Claude Design), PROJECT_STATE and this handover.

### Decisions
- **Six-sided capsules.** On screen a capsule is 4–11 device pixels across, and close-ups at 2× showed no visible difference between six and eight sides, or between rounded and simpler caps on touch screens.
- **Short-phone overlap left for Claude Design.** On 375×667 and 320×640 the resting logo overlaps the "Business Cooperation" button. The box version and the prototype do the same, so it's recorded in ADR-011 rather than changed here.

### Tests performed
- **Visual:**
  - The 3D logo at 320, 375, 390, 430, 768×1024, 1024×768, 1280, 1440 and 1920, in dark and light themes.
  - Scroll positions: intro, rest, mid-turn and centred.
  - 2× close-ups of the capsule shading.
  - Checked: live theme toggle, brand page, and reduced motion (static, and redrawn only on scroll).
- **Performance** (software WebGL, same script and machine, two runs each):
  - Phone: scrolling 11.8 → 11.6 fps (unchanged); idle redraws halved.
  - Desktop: scrolling 7.6 → 4.3 fps. That's the software renderer's anti-aliasing cost; without it, capsules ran at 8.8 fps.
  - Full table in ADR-015.
  - The old box baseline was re-measured, because the first benchmark's scroll was cancelled by the site's smooth scrolling.
- **Fallbacks**, in both themes and on home and brand pages, with no console errors:
  - 3D APIs disabled;
  - no WebGL 2 API;
  - Save-Data (no three.js request);
  - forced context loss.
- **Regression:**
  - `npm run check` passes.
  - Interaction suite 37/37.
  - axe-core: 0 violations on 6 pages × 2 themes.
  - Overflow sweep: 180 loads, no problems.

### Not tested / limits
- **Real GPUs and phones.** This sandbox renders WebGL in software. Please check the preview on a real phone and laptop.
- The designer's GLB/OBJ exporter (`/brand/Logo3D.html`, verbatim) still exports cubes.

### Next recommended action
1. **Owner:** open the Netlify preview on a phone and a laptop. The hero should assemble from capsules, show the two-tone bodies while scrolling, and stay smooth.
2. **Owner:** the items from the previous session still stand: network allowlist, Netlify form detection, CLIENT_QUESTIONS.
3. **Next agent:** relay the ADR-011 notes to Claude Design: capsules, the brand sheet colours, and the short-phone hero overlap.

## Previous session: 2026-09-25 (Claude Code): quality gate, analytics events, Phase 3 plans

**Context.** The owner confirmed the Phase 2 push and asked to start the next steps. The live itqanpharma.com and `*.netlify.app` are still blocked by this environment's network policy, so the crawl-dependent migration work waits.

### What changed
- **Build quality gate** (`scripts/check-site.mjs`, run as `postbuild`; ADR-013).
  - Netlify now runs `npm run lint && npm run build`, so a failing check stops the deploy.
  - Adds the `node-html-parser` dev dependency.
- **Analytics events** (`src/lib/analytics.ts`, `TrackProductView`, plus hooks in `SiteRuntime` and `ContactForm`; ADR-014).
  - Events: `contact_submit`, `cooperation_cta_click`, `email_click`, `phone_click`, `product_view`, all pushed to `window.dataLayer`.
  - No tool is loaded and no personal data is sent.
- **Redirects** in `netlify.toml` for confirmed live URLs:
  - `/product/etoria-60-90-120mg/` → `/products/etoria/`
  - `/product/vertiloc-8-16-24-mg/` → `/products/vertiloc/`
  - `/become-a-partner/` → `/contact-us/?type=cooperation`
- **Research** (web search; snippets only, because the proxy blocked page fetches) covered:
  - Itqan's third-party footprint and conflicting facts;
  - competitors and directories;
  - brand-name collisions (Dozile, Cresuva, Xaro, Zeeto);
  - Google, Bing and OpenAI AI-search guidance.
- **New docs** in `docs/seo/`: SEO_GEO_STRATEGY, KEYWORD_MAP, SEARCH_INTENT_MAP, CONTENT_MAP, COMPETITOR_ANALYSIS, SCHEMA_PLAN, INTERNAL_LINKING_PLAN, ANALYTICS_PLAN, AI_VISIBILITY_PLAN.
- **Updated docs:** REDIRECT_MAP, ENTITY_MAP, CLIENT_QUESTIONS (#9, #15–18 annotated; #20–23 new), ROADMAP, DECISIONS (ADR-013, ADR-014) and PROJECT_STATE.

### Decisions
- **Candidate active ingredients stay unpublished.** Search snippets of Itqan's own product pages suggest some (e.g. Etoria = etoricoxib). Snippets aren't a verified source for medical facts, so they're recorded in CLIENT_QUESTIONS #9 until the owner confirms, or the crawl reads them directly from itqanpharma.com.
- **Unknown old URLs are not guessed.** Only the confirmed old product URLs are redirected; the other 25 `/product/…` URLs wait for the crawl. They 404 until then, which is harmless because the domain hasn't switched yet.

### Tests performed
- **Quality gate:** passes on the real build (40 indexable pages, 40 sitemap URLs). Negative test with 8 injected faults: all caught, exit code 1. The faults were a broken link, duplicate title, "lorem ipsum" and "CLIENT CONFIRMATION REQUIRED" text, a stray noindex, a missing canonical, missing image dimensions, a missing image file, and a hidden page in the sitemap.
- **Analytics:** all 5 events fire with the expected parameters in Chromium, with no third-party requests.
- **Redirects** verified with `netlify dev`: 301 with and without the trailing slash; unknown `/product/x/` returns 404.
- `npm run check` passes (lint, typecheck, build and the gate).

### Next recommended action
1. **Owner:**
   - Allow `itqanpharma.com` and `courageous-caramel-8493e6.netlify.app` in the environment's network settings.
   - Enable Netlify form detection and set the notification email.
   - Forward CLIENT_QUESTIONS to Itqan, especially #9 (ingredients), #16 (address), #18 (manufacturer/Sana) and #3 (DNS).
2. **Next agent, with network access:**
   - Crawl the live site and complete REDIRECT_MAP (all 27 `/product/` URLs, categories, template pages → 410).
   - Verify the live preview's headers and link previews.

## Earlier session: 2026-09-25 (Claude Code): Phase 2 production build

### Why
The owner found the prototype preview slow, especially at the start and on phones. They asked for it to be faster and more mobile-friendly **without changing the design**. They answered the Phase 2 decisions:
- No existing Next.js project, so create one.
- Keep the live URLs.
- No Arabic at launch.

### Diagnosis (measured)
Simulated mid-range phone (4× CPU slowdown, 150 ms RTT, 1.6 Mbps):
- The prototype showed a **blank screen for about 1.5 s** and text at about 2.5–4 s, because it downloads and runs a 3 MB in-browser Babel compiler before rendering.
- The 3D logo had not appeared by 8 s.
- The load event came at 12–13 s.
- A fully scrolled products page downloaded **21.7 MB**, mostly PNGs of up to 3.4 MB each.

### What changed
- **New Next.js app at the repo root**, a static export (`src/`, `package.json`, `next.config.ts`, etc.).
  - Every page is recreated from the handoff specs on the live URLs.
  - The component map is in PROJECT_STATE.
- **Image pipeline** (`scripts/optimize-images.mjs`):
  - Output: `public/images/**` (4.6 MB total, originally 24 MB), `public/og.png`, `src/app/icon.png` and `src/app/apple-icon.png`.
  - It also copies the designer's GLB/OBJ viewer into `public/brand/`.
- **Contact form:** now posts to Netlify Forms (`public/__forms.html`).
- **`netlify.toml`** changes:
  - Build with `npm run build`, publish `out/`, and skip the Next adapter.
  - 301s for `/about`, `/contact` and `/products` and for all old prototype URLs.
  - noindex and security headers, plus cache headers.
- **Docs:** ROADMAP, PROJECT_STATE, DECISIONS (ADR-005 accepted; ADR-006–012 new), DEPLOYMENT, ARCHITECTURE, SECURITY, CLIENT_QUESTIONS, ASSUMPTIONS, REDIRECT_MAP, README and CLAUDE.md.

### Results (measured on the same simulation)
- **First content** in about **1.3 s**, with the full hero by 2 s.
- The **3D logo** starts flying in at about 4–5 s. It loads after the content, when the browser is idle.
- **Products page:** 21.7 MB → **1.8 MB**. Home page: about 1.7 MB on a phone, including all JS.
- **JavaScript:** about 180 KB gzipped for Next/React (async, not render-blocking), plus 130 KB gzipped of three.js on the home page only.

### Tests performed
- `npm run lint`, `tsc --noEmit` and `next build` are clean: **47 static pages**. `npm audit`: 0 vulnerabilities.
- Clean `npm ci` + `netlify build --offline` from a fresh copy passes, and the Next.js plugin is skipped as intended.
- **Routes and redirects** via `netlify dev` against `out/`:
  - All pages return 200.
  - The directive aliases and every prototype URL return 301, `?c=` and `?p=` included.
  - Unknown URLs return 404 with the site's 404 page.
  - The headers are present.
- **Fidelity:** full-page screenshots, prototype vs new, at 390 and 1440 px, in dark and light themes.
  - Page heights are identical on 13 of 16 page/width pairs; home differs by 1 px.
  - Category pages are 24 px taller on mobile because of the richer breadcrumb (ADR-011).
  - Pixel diffs are ≤ 0.7% on most segments. The remaining differences are 1 px offsets, and prototype images that hadn't finished loading.
- **Layout sweep:** 10 routes × 9 widths (320–1920) × 2 themes = 180 loads, with **no horizontal overflow, no console errors and no undersized tap targets**.
- **Interactions: 37/37 pass.**
  - Mobile menu: open, Esc, scroll lock.
  - Theme toggle and persistence.
  - Home tabs, including arrow keys.
  - Product filter: URL, title, breadcrumb and back button.
  - Product rows omit unknown data.
  - Contact: prefill, three validation messages, focus, a valid Netlify POST body, and the success and failure states.
  - Skip link, page-transition fade, 404.
- **Accessibility:** axe-core (WCAG 2.1 AA plus best practice) reports **0 violations** on 6 pages × 2 themes, after two fixes to issues inherited from the prototype (ADR-011).

### Not tested / limits
- **Live Netlify deploy and link previews.** This sandbox's network policy blocks `*.netlify.app` and `itqanpharma.com`.
  - Confirm the next deploy on Netlify.
  - Run `curl -I https://<site>/_next/static/...` to check the cache headers.
- **Real Netlify Forms submission.** It needs form detection enabled in Netlify. The client side is tested with a mocked endpoint.
- **Real devices.** All device testing used Chromium emulation.
- **Kev/Jev.** Its endpoint (`127.0.0.1:8009`) is not reachable from this cloud container.

### Client information still needed
See [docs/CLIENT_QUESTIONS.md](docs/CLIENT_QUESTIONS.md). New since the last session:
- #18: confirm the "Manufacturer" row on product pages.
- #19: live category slugs.

### Next recommended action
1. **Owner:** check the redeployed preview on a phone, then enable **Forms → form detection** in Netlify and add an email notification (DEPLOYMENT.md).
2. **Owner:** allow `itqanpharma.com` in the environment's network settings so the next session can crawl the live site for the redirect map (Phase 3).
3. **Next agent:**
   - Phase 3 SEO/GEO work from the crawl.
   - Relay the ADR-011 design notes and the stale "Funnel" type copy to Claude Design.
