# Structured data plan

Rule: markup must describe **visible, verified** content only (SEO constitution §18). Every value comes from `src/lib/seo.ts`, which reads the verified constants in `src/lib/site.ts`. The build gate (`scripts/check-site.mjs`) fails if any JSON-LD block does not parse.

## Live now

| Type | Where | Fields | Source of truth |
|---|---|---|---|
| `Organization` | Every public page (site layout) | `name`, `alternateName` (Itqan Pharma, Itqan Pharmaceutical Ind.), `url`, `logo` (official PNG), `email`, `telephone`, `address` (Amman, JO), `sameAs` (Facebook, LinkedIn) | ENTITY_MAP.md |
| `WebSite` | Every public page | `name`, `url`, `publisher` → Organization `@id`, `inLanguage: en` | — |
| `BreadcrumbList` | Every inner page | Matches the visible breadcrumb trail | Page route |

## Deliberately not used (yet)

| Type | Why not | Unblocked by |
|---|---|---|
| `Product` | Google requires `offers`, `review` or `aggregateRating` for product rich results. None are published, and inventing them is prohibited (ADR-010). | Never, unless Itqan publishes prices or reviews |
| `Drug` / `MedicalEntity` | Needs an active ingredient, dosage form and indications, all unconfirmed. Wrong medical markup is worse than none. | CLIENT_QUESTIONS #9, #10 |
| `LocalBusiness` / `MedicalOrganization` subtype | Needs a full street address and opening hours | CLIENT_QUESTIONS #12, #16 |
| `FAQPage` | There is no real FAQ content, and FAQ markup only for SEO is prohibited | Genuine FAQs from sales or support |
| `Article` / `NewsArticle` | No news section yet | A newsroom (Phase 6) |

## Additions when the client confirms facts

- `Organization.address.streetAddress`, `postalCode` (#16)
- `Organization.sameAs`: further official profiles (#17)
- `Organization.foundingDate`: only the legal founding date, never inferred from "first product in 2019"

## Validation

- **Before launch:** Google Rich Results Test and the Schema.org validator on `/`, `/about-us/`, one category and one product page (LAUNCH_CHECKLIST).
- **After launch:** the Search Console "Enhancements" and "Unparsable structured data" reports.
