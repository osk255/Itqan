# Redirect map: itqanpharma.com to the new site

**Status: DRAFT.** Don't launch until every live URL is listed with an action, and each 301 destination has been tested and returns 200.

## How to complete this map (Phase 3)

1. Crawl the live site from a network that can reach it. This session's network policy blocked itqanpharma.com.
   - Fetch `robots.txt` and any sitemaps (`/sitemap.xml`, `/sitemap_index.xml`, `/wp-sitemap.xml`).
   - Run a crawler such as Screaming Frog or `npx linkinator https://itqanpharma.com --recurse`.
2. Add any URLs with traffic or backlinks from Search Console (CLIENT_QUESTIONS #4).
3. Give every URL exactly one action:
   - **PRESERVE**: the same URL exists on the new site.
   - **301**: redirect to its exact replacement.
   - **REMOVE**: return 410 or 404, with a written justification. Use this for template contamination (Optcare, eye-surgery pages, electricians and so on), which must not be redirected into Itqan pages.
4. Never send unrelated URLs to the homepage. No redirect chains or loops.

## Known live URL patterns (from the design handoff)

The rows marked "if ADR-005 accepted" depend on the proposed URL strategy.

| Old URL | New URL | Action | Notes |
|---|---|---|---|
| `/` | `/` | PRESERVE | |
| `/about-us` | `/about-us` | PRESERVE (if ADR-005 accepted) | |
| `/all-products` | `/all-products` | PRESERVE (if ADR-005 accepted) | |
| `/product-category/<slug>` | `/product-category/<slug>` | PRESERVE (if ADR-005 accepted) | The live category slugs are unknown and may differ from the catalogue slugs. Confirm them from the crawl |
| `/business-cooperation` | `/business-cooperation` | PRESERVE | |
| `/contact-us` | `/contact-us` | PRESERVE (if ADR-005 accepted) | |
| *(individual product URLs, if any)* | `/products/<slug>` | 301 | The pattern is unknown until the crawl |
| *(template pages)* | none | REMOVE (410) | Optcare, ophthalmology, electricians, cleaners, lorem ipsum and similar |
