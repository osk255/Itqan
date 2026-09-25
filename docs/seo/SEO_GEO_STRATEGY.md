# SEO and GEO strategy

One page, the plan in priority order. The details are in the linked docs.

## Objective

Search and AI visibility should produce **qualified B2B enquiries**: contract manufacturing, partnership and product information (ANALYTICS_PLAN `contact_submit`). Branded and product searches should land on accurate pages. Traffic volume is not the goal.

## Where we are (2026-09-25)

- **Technical foundation: done.**
  - Static, fast, crawlable HTML.
  - Unique metadata and self-canonicals.
  - Organization, WebSite and BreadcrumbList schema.
  - Sitemap and robots.txt.
  - Accessibility at WCAG AA (axe-core clean).
  - A build gate that blocks SEO regressions (`scripts/check-site.mjs`).
- **URLs:** the live URLs are kept (ADR-005). Confirmed old URLs already 301 (REDIRECT_MAP).
- **Preview:** `noindex` until launch.

## Priorities

1. **Migration safety (before launch).**
   - Crawl itqanpharma.com and map every URL (REDIRECT_MAP). Old product URLs use `/product/<name-strengths>/`, so all 27 need exact 301s.
   - Send template-contamination pages to 410.
   - This is blocked on network access to itqanpharma.com.
2. **The business cooperation page is the money page.** Competitors that win B2B queries publish capacity, certificates and process (COMPETITOR_ANALYSIS). Get #8 and #13 from the client, plus a short "how cooperation works", and add them without inventing anything.
3. **Product pages carry brand-name demand.**
   - Confirmed active ingredients and dosage forms (#9) disambiguate colliding brand names (Dozile, Cresuva, Xaro, Zeeto) and unlock medical schema.
   - Until then, strengths plus category plus "Itqan Pharma" in the title is the best we can truthfully do.
4. **Entity consistency off-site.** Make NAP and founding facts consistent in JAPM, D&B, Pharmchoices, Made in Jordan and LinkedIn, and add a CPHI Online profile (AI_VISIBILITY_PLAN). This is cheap, and it's what makes AI answers correct.
5. **Design proposals (to Claude Design).**
   - A category-specific H1 on category pages.
   - A product → business cooperation link.
   - An About → capabilities link (INTERNAL_LINKING_PLAN).
6. **Launch and measurement.**
   - Search Console, Bing Webmaster Tools (with the AI Performance report) and IndexNow.
   - Analytics once approved.
   - Then the monthly review loop (LAUNCH_CHECKLIST, ANALYTICS_PLAN).

## Guardrails

- No invented facts, statistics, certificates or approvals.
- No doorway or country pages.
- No mass-generated content.
- No schema that doesn't match visible content.
- No purchased links.
- Medical content needs client and expert review.

## Documents

ENTITY_MAP · KEYWORD_MAP · SEARCH_INTENT_MAP · CONTENT_MAP · COMPETITOR_ANALYSIS · REDIRECT_MAP · SCHEMA_PLAN · INTERNAL_LINKING_PLAN · ANALYTICS_PLAN · AI_VISIBILITY_PLAN · LAUNCH_CHECKLIST
