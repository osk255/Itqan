# Analytics plan

Status: the events are **implemented but go nowhere yet**. No analytics tool is installed until Itqan approves one (CLIENT_QUESTIONS #6).

## What we measure, and why

Organic search success is judged by business enquiries, not page views (SEO constitution §42–43).

| Level | Event | Fires when | Parameters | Business question |
|---|---|---|---|---|
| Primary | `contact_submit` | An enquiry is sent successfully | `enquiry_type` (General Inquiry / Business Cooperation / Product Information) | How many qualified enquiries does the site produce, and of which kind? |
| Secondary | `cooperation_cta_click` | Any "Become a Partner" or cooperation enquiry link is clicked | `link_location` (header / content / footer), `link_text` | Which placements drive partnership interest? |
| Secondary | `phone_click` | A `tel:` link is clicked | `link_location` | Enquiries that bypass the form |
| Secondary | `email_click` | A `mailto:` link is clicked | `link_location` | Same |
| Micro | `product_view` | A product page is viewed | `product`, `category` | Which products and categories attract interest? |

Every event also carries `page_path`. **No personal data is ever sent**: no names, emails, phone numbers or message text.

## Implementation

- `src/lib/analytics.ts`: `track()` pushes `{ event, page_path, …params }` onto `window.dataLayer`, the standard queue that Google Tag Manager and GA4 read.
- Where the events fire:
  - link clicks: `SiteRuntime`, via a capture-phase listener;
  - `contact_submit`: `ContactForm`, on a successful submission only;
  - `product_view`: `TrackProductView` on product pages.
- **Verified 2026-09-25:** all five events fired with the parameters above, and no third-party requests were made.

## Connecting a tool, once approved

1. The client decides on the tools (GA4, and Microsoft Clarity only if wanted) and whether consent is needed in their markets. Jordan has a Personal Data Protection Law; confirm what it requires with Itqan.
2. Add one loader component in `src/app/layout.tsx`, gated by an environment variable (e.g. `NEXT_PUBLIC_GA_ID`) so previews stay clean. Use either:
   - a Google Tag Manager container that reads `dataLayer` (easiest to maintain), or
   - gtag.js with a small `dataLayer` → `gtag('event', …)` bridge.
3. If consent is required, default consent to "denied" and add a minimal banner before collecting anything.
4. Mark `contact_submit` as a key event (conversion) in GA4.
5. **Search Console and Bing Webmaster Tools** need no code:
   - Verify through DNS TXT records. That's a web-only record; see the DNS safety rules in DEPLOYMENT.md.
   - Or verify through an HTML file placed in `public/`.
   - Submit `https://itqanpharma.com/sitemap.xml` after launch.

## Reporting (after launch)

Following the constitution's four layers:
- **Discovery:** indexed pages and crawl errors (Search Console, Bing).
- **Visibility:** impressions, queries, and AI citations where Bing reports them.
- **Engagement:** organic landing pages, CTR, engaged sessions.
- **Business:** `contact_submit` by `enquiry_type`, plus phone and email clicks, per landing page.
