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

## Known live URL patterns (design handoff + search-result snippets, 2026-09-25)

ADR-005 was accepted on 2026-09-25: the live URLs are kept, and the new site already serves them.

| Old URL | New URL | Action | Notes |
|---|---|---|---|
| `/` | `/` | PRESERVE | |
| `/about-us` | `/about-us` | PRESERVE | |
| `/all-products` | `/all-products` | PRESERVE | |
| `/product-category/<slug>` | `/product-category/<slug>/` | PRESERVE or 301 | The new slugs are `anti-histamine`, `anti-inflammatory`, `antimicrobial`, `cns`, `endocrine-cardiovascular`, `health-wellness`, `male-health`, `otc`. Map each live slug from the crawl and 301 any that differ |
| `/business-cooperation` | `/business-cooperation` | PRESERVE | |
| `/contact-us` | `/contact-us` | PRESERVE | |
| `/product/etoria-60-90-120mg/` | `/products/etoria/` | 301 **(live)** | Old product URLs are `/product/<name-strengths>/`, seen in search snippets |
| `/product/vertiloc-8-16-24-mg/` | `/products/vertiloc/` | 301 **(live)** | Same |
| `/product/<other 25 products>/` | `/products/<slug>/` | 301 | Exact old slugs needed from the crawl; don't guess them |
| `/become-a-partner/` | `/contact-us/?type=cooperation` | 301 **(live)** | The live partner page; its replacement is the cooperation enquiry. Check its content in the crawl |
| *(template pages)* | none | REMOVE (410) | Optcare, ophthalmology, electricians, cleaners, lorem ipsum and similar |

## Already live in netlify.toml

| From | To | Why |
|---|---|---|
| `/about`, `/contact`, `/products` | `/about-us/`, `/contact-us/`, `/all-products/` | Short aliases named in the project directive |
| `/home/*`, `/about/About.dc.html`, `/business-cooperation/Cooperation.dc.html`, `/contact/Contact.dc.html`, `/brand/Brand.dc.html`, `/mobile` | The matching new page | Links shared during the prototype preview |
| `/products/Products.dc.html?c=<slug>` / `/products/Product.dc.html?p=<slug>` | `/product-category/<slug>/` / `/products/<slug>/` | Same |
