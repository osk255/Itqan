# Project state

Last verified: 2026-09-25

## Product
The corporate website for **Itqan Pharmaceutical Industries**, a pharmaceutical manufacturer in Amman, Jordan. It is replacing itqanpharma.com, whose current site contains template contamination. B2B goals, in order:
1. business-cooperation enquiries (contract manufacturing and partnership);
2. product information requests;
3. corporate credibility.

## Current users / actors
- Visitors: distributors, partners, healthcare and pharma professionals, and the general public.
- Right now: the owner and friends reviewing the design preview.

## Stack
- **Now:** the static Claude Design prototype (`design_handoff_itqan_website/site/`) on Netlify. React, Babel and three.js load from unpkg at runtime. No build step.
- **Target:** Next.js (App Router) + TypeScript + Tailwind v4 + Motion, statically generated, on Netlify. See [ARCHITECTURE.md](ARCHITECTURE.md).

## Design system
It is fully specified in `design_handoff_itqan_website/README.md`: tokens, type, components, motion and the 3D logo. Both themes (dark by default, plus light). Font: Host Grotesk. Brand colours: plum `#52276f`, lime `#bcd155`, sky `#1ea9e0`.

## Completed
- Phase 0: the repo, the handoff committed unchanged, the governance docs and the continuity docs.
- Phase 1 config: the root `netlify.toml` with clean URLs, the preview noindex and the headers. Verified locally (see HANDOVER.md).

## In progress
- Phase 1: **waiting for the owner to connect the repo in Netlify** (see [DEPLOYMENT.md](DEPLOYMENT.md)).

## Next priorities
1. Connect Netlify and share the preview URL.
2. Run the feedback round ([FEEDBACK.md](FEEDBACK.md)).
3. Answer the three Phase 2 decisions ([ROADMAP.md](ROADMAP.md)): the existing Next.js project, the URL strategy (ADR-005) and Arabic.

## Known issues (prototype, by design not fixed: ADR-001)
- **Page weight.**
  - The products page is about 22 MB when fully scrolled. The largest images are `supervit-c-plus.png` at 3.4 MB and `supervit-c.png` at 3.2 MB, both PNG.
  - The home page's own assets are about 3.4 MB on first view.
  - About 5 MB of runtime JS (uncompressed) comes from unpkg: Babel standalone alone is 3 MB.
- **Product page 404.** `products/Product.dc.html` makes one request for a literal `{{ p.image }}`, which returns 404 before the template binds. It's harmless; the real image then loads.
- **File-style URLs.** Links inside the prototype go to URLs like `/products/Products.dc.html`. Only the entry URLs are clean.
- **Metadata is weak.** It sits in a `<helmet>` block rendered by the runtime, and the OG image URL is relative. Link previews in WhatsApp and similar apps may be weak.
- **The contact form uses `mailto:`** to Itqan's real inbox.
- **No custom 404 page.**

## Technical debt
None yet. There is no production code.

## Important constraints
- Never invent medical or corporate facts. Unknown means `null`, and it is not rendered. See [CLIENT_QUESTIONS.md](CLIENT_QUESTIONS.md).
- Don't edit the handoff files. Design changes come back from Claude Design.
- Preserve itqanpharma.com's corporate email (MX, SPF, DKIM, DMARC) through any DNS work.
- Keep the architecture small: no database, auth, CMS or admin.

## Recent decisions
See [DECISIONS.md](DECISIONS.md):
- ADR-001: freeze the handoff.
- ADR-002: Netlify.
- ADR-003: noindex via a header.
- ADR-004: routing details.
- ADR-005 (proposed): keep the live URLs.

## External integrations
- Netlify: hosting.
- unpkg.com and Google Fonts: runtime, preview only.
- Planned: Netlify Forms, then GA4, Search Console and Bing, subject to approval.

## Do not break
- The noindex header on every non-production deploy.
- The clean entry URLs listed in DEPLOYMENT.md, which may already be shared with reviewers.
