# Itqan Pharmaceutical Industries: website

This is the redesign of [itqanpharma.com](https://itqanpharma.com/) for a pharmaceutical manufacturer in Amman, Jordan. It's a fast, static Next.js site that recreates the Claude Design handoff exactly.

**Status:** the Phase 2 production build is live as a preview at https://courageous-caramel-8493e6.netlify.app. The preview is `noindex`. See [docs/ROADMAP.md](docs/ROADMAP.md).

## Commands

```bash
npm install
npm run dev        # local dev server, http://localhost:3000
npm run check      # lint + typecheck + production build; run before pushing
npm run images     # regenerate optimised images from the handoff originals
```

Netlify builds with `npm run build` and publishes `out/`; see [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Pages (the live site's URLs are kept)

`/` · `/about-us/` · `/all-products/` · `/product-category/<slug>/` · `/products/<slug>/` · `/business-cooperation/` · `/contact-us/` · `/brand/` (internal)

## Repository layout

```
src/app/                        pages (App Router), global CSS, sitemap, robots, 404
src/components/                 site chrome, UI primitives, sections, client islands
src/lib/catalogue.ts            all product and company content (single source)
src/lib/site.ts · seo.ts        routes, contacts, metadata and JSON-LD builders
scripts/optimize-images.mjs     image pipeline → public/images + manifest
public/                         optimised images, Netlify Forms definition, brand 3D tool
netlify.toml                    build, redirects, headers
design_handoff_itqan_website/   Claude Design handoff. FROZEN visual reference, never edit
docs/                           roadmap, state, decisions, deployment, SEO, governance
HANDOVER.md                     latest session handover for the next engineer or agent
```

## Rules that matter most

1. **No invented facts.** Certifications, approvals, capacity, ingredients and indications appear only once Itqan confirms them ([docs/CLIENT_QUESTIONS.md](docs/CLIENT_QUESTIONS.md)).
2. **Don't edit the handoff.** Design changes come back from Claude Design. Deviations made for accessibility are listed in ADR-011.
3. **Keep previews out of search.** Every deploy sends `noindex` until launch.
4. **Protect Itqan's email.** DNS changes follow [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md), Phase 5.
