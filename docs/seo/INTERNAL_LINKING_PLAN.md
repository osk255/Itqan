# Internal linking plan

## Measured structure (build of 2026-09-25)

Counts are links inside `<main>` of other pages. The header and footer add Home, About, Products, Business Cooperation, Contact and all 8 categories to every page on top of these.

| Page | Contextual inbound links | Notes |
|---|---|---|
| `/contact-us/` | 40 (every page) | Every product page's "Contact Us" pre-fills the enquiry type and product |
| `/all-products/` | 39 | Breadcrumbs and CTAs |
| `/product-category/<slug>/` | 10–20 | Breadcrumbs, product-page CTAs and siblings |
| `/products/<slug>/` | 5–14 | Category grid, siblings, previous/next, and the home tabs (Health & Wellness in the HTML) |
| `/about-us/` | **1** (home "Read More") | Nav and footer only otherwise |
| `/business-cooperation/` | **1** (home cooperation band) | Nav and footer only otherwise |

**Depth.** Every product is 2 clicks from the home page (home → all products or a category → product). The home tabs render all 8 categories' cards in the HTML, with inactive panels hidden, so crawlers can reach every card from `/`.

**Anchor text.** Descriptive throughout: product names, full category names, and "Explore Products". One exception is the home "Read More" link, which carries a screen-reader-only suffix: "Read More about Itqan".

## Gaps and recommendations

These are ordered by value. Items 1–2 change page content, so they go to Claude Design as proposals first (ADR-001/011).

1. **Link products to Business Cooperation.** A distributor reading a product page has no path to "contract manufacturing / partnership", only "Contact Us". Proposal: a small line or pill near the product CTAs, e.g. "Interested in distributing Itqan products? Business Cooperation →".
2. **Link About ↔ Business Cooperation contextually.** Both describe capabilities and approvals. Proposal: a "Manufacturing capabilities →" link from About's "Why Itqan Pharma" band to `/business-cooperation/`.
3. **Category pages:** the H1 is "Products" on every category page. A category-specific H1 would be stronger for relevance (see SEO_GEO_STRATEGY). This is a design decision.
4. **Keep it as it is:**
   - Product "Previous / Next" links (they spread link equity across all 27 products).
   - Sibling grids on product pages.
   - Footer category links.

## Rules for future content

- Link with descriptive anchors (the product, category or capability name), never "click here".
- Every new page must be linked from at least one relevant existing page and appear in the sitemap. The build gate checks sitemap consistency and broken links.
- Don't link to URLs that redirect. Link to the final canonical URL, with its trailing slash.
