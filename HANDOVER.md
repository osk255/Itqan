# Handover

Read this first, then [docs/PROJECT_STATE.md](docs/PROJECT_STATE.md) and [docs/ROADMAP.md](docs/ROADMAP.md).

## Latest session: 2026-09-25 (Claude Code): Phase 2 production build

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
