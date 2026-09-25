# Architecture decision records

## ADR-001: Keep the design handoff frozen and deploy it as-is for the preview

Date: 2026-09-25 · Status: Accepted

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
- Next.js runs through Netlify's auto-detected adapter.

## ADR-003: Noindex the preview with a header, not robots.txt

Date: 2026-09-25 · Status: Accepted

**Context.** The preview duplicates the live company's content. If it were indexed, it would compete with itqanpharma.com.

**Decision.** `X-Robots-Tag: noindex, nofollow` on every response through `netlify.toml`, with no robots.txt Disallow. A Disallow would stop crawlers from reading the noindex, and it would also mean changing the frontend folder.

**Consequences.** This must be removed at production cutover. It is listed in the launch checklist.

## ADR-004: Preview routing details

Date: 2026-09-25 · Status: Accepted

- `/` uses `force = true`. Without it, the prototype's `index.html` meta-refresh stub shadows the rewrite and `/` bounces to `/home/Home.dc.html`. Verified with `netlify dev`.
- `/mobile` is a 302 to `/Mobile%20Preview.dc.html`, not a rewrite, because Netlify does not rewrite to a filename containing a space. Verified.
- The designer's `immutable` one-year cache on `/assets/*` is **not** carried over. Asset URLs are not fingerprinted, so a changed image would stay stale in browsers for a year while we iterate. Netlify's default ETag revalidation is used instead. Production gets immutable caching on hashed build assets.

## ADR-005 (Proposed): Keep the live URLs as canonical in production

Date: 2026-09-25 · Status: **Proposed, awaiting owner decision** (ROADMAP Phase 2, decision 2)

**Context.** The live site uses `/about-us`, `/contact-us`, `/all-products` and `/product-category/<slug>`, per the handoff README. The directive lists `/about`, `/contact` and `/products` as minimum routes. The directive also requires preserving search equity: preserve the URL or 301 it to its exact replacement.

**Proposal.**
- Keep the live URLs as canonical.
- Serve `/about`, `/contact` and `/products` as 301s to them.
- Add product pages at `/products/<slug>`.

**Alternatives.** Make the short URLs canonical and 301 the old ones. That's cleaner, but every existing URL then depends on redirects being right.

**Evidence still needed.** A full crawl of the live site (Phase 3), and Search Console data if the client can grant access.
