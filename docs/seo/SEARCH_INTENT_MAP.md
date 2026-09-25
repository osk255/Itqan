# Search intent map

Search intent → the page that should satisfy it → what that page needs → the CTA → the business outcome. Search volumes are **not** included: no keyword tool or Search Console data is available yet (CLIENT_QUESTIONS #4). Priorities are by business value and should be re-ranked with real query data after launch.

| # | Intent (example queries) | Type | Landing page | Content that satisfies it | CTA | Outcome |
|---|---|---|---|---|---|---|
| 1 | Itqan Pharma, Itqan pharmaceutical, and the company's Arabic name (exact spelling to confirm, CLIENT_QUESTIONS #20) | Branded / navigational | `/` | Name, meaning, location, contacts, portfolio | Explore Products / Become a Partner | Brand trust; any conversion |
| 2 | *<brand name>* (Etoria, Zeeto, SuperDal, …), *<brand> Jordan*, *<brand> 60 mg* | Product / branded | `/products/<slug>/` | Name, packaging, strengths, category; later the active ingredient and leaflet | Contact Us (product enquiry) | Product enquiry; distributor interest |
| 3 | pharmaceutical manufacturer Jordan, pharmaceutical company Amman | Commercial / B2B | `/` then `/business-cooperation/` | "Founded in Jordan…", manufacturing capabilities, dosage forms, approvals | Become a Partner | Partnership enquiry |
| 4 | contract manufacturing Jordan pharmaceutical, toll manufacturing tablets capsules Jordan | Commercial / B2B | `/business-cooperation/` | Contract manufacturing, dosage forms, approvals; later capacity and certificates | Become a Partner | **Primary:** qualified cooperation lead |
| 5 | pharmaceutical distributor Iraq / Kuwait / GCC Jordanian manufacturer | Commercial / B2B | `/business-cooperation/` (approved markets) | The verbatim approvals list, with registrations in progress marked as such | Become a Partner | Distribution partnership |
| 6 | Ingredient + strength queries, e.g. "B12 5000 mcg" (the published name and strength of Bioactive B12) | Product / generic | `/product-category/health-wellness/` and product pages | Strengths as published. Ingredient-based targeting waits for confirmed active ingredients (CLIENT_QUESTIONS #9) and must never be inferred from product names | Contact Us | Product enquiry |
| 7 | Itqan Pharma phone, Itqan Pharma address, Itqan email | Navigational / local | `/contact-us/` | Phone, email, maps link; later the street address | Call / email / form | Direct contact |
| 8 | Itqan Pharma careers / jobs | Navigational | none | — | — | Out of scope; decide with client (a LinkedIn link may be enough) |

## Principles

- **One page per intent cluster.** No city or country doorway pages (constitution §46). The market list lives on Business Cooperation.
- **Arabic queries (row 1)** exist for a Jordanian brand. The site is English only by owner decision. Revisit Arabic if Search Console shows significant Arabic demand.
- **Generic product queries (row 6)** compete with pharmacies and marketplaces. They're worth serving with accurate product pages, but they aren't the conversion focus.
