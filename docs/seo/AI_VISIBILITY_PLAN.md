# AI visibility plan (GEO)

Goal: when someone asks ChatGPT, Google AI Mode, AI Overviews or Copilot about Itqan, or about Jordanian contract manufacturers, the answer is accurate and cites itqanpharma.com.

## What the platforms say (checked 2026-09-25, via search summaries; re-read the primary pages)

- **Google.** No special files or markup are needed to appear in AI Overviews or AI Mode, and llms.txt and "AI text files" are unnecessary. Focus on unique, non-commodity content, good page experience, and indexable pages. `nosnippet` and `max-snippet` limit what can be shown. Blocking Google-Extended does not affect Search. Sources: developers.google.com/search/docs/appearance/ai-features; the Search Central blog, May 2025 and May 2026.
- **Bing / Copilot.**
  - Clear titles and headings, and state the entity plainly and early.
  - IndexNow keeps content fresh.
  - Bing Webmaster Tools has an **AI Performance** report (public preview since February 2026) showing Copilot citations and "grounding queries".
- **OpenAI.** Don't block **OAI-SearchBot** (ChatGPT search). **GPTBot** (training) is a separate control, and the choice is the client's (CLIENT_QUESTIONS #5).

## Questions people will ask, and the page that should answer

| Question | Authoritative page | Status |
|---|---|---|
| Who is Itqan Pharmaceutical Industries? What do they do? | `/`, `/about-us/` | Answered: founded in Jordan, first product 2019, pharmaceutical manufacturer, 27 products |
| Where is Itqan located? How do I contact them? | `/contact-us/` | Partly: Amman; street address pending (#16) |
| Does Itqan offer contract manufacturing? Which dosage forms? | `/business-cooperation/` | Answered qualitatively; capacity missing (#8) |
| Which countries is Itqan approved in? | `/business-cooperation/` | Answered, verbatim; "in registration" is labelled clearly |
| Who makes Etoria / Vertiloc / … ? What's in it? | `/products/<slug>/` | Name, strengths and manufacturer row (#18); active ingredient pending (#9) |
| Is Itqan GMP-certified? | none | **Unanswerable until the client confirms (#13).** Never imply it |

## Actions

**Done:**
- Server-rendered HTML for every fact. Nothing depends on JavaScript to be readable.
- Organization, WebSite and BreadcrumbList JSON-LD, matching the visible content.
- robots.txt allows all crawlers, including OAI-SearchBot.
- A sitemap.
- Descriptive, entity-first titles, e.g. "Etoria — Anti-inflammatory Medications — Itqan Pharma".

**At launch:**
- Verify Bing Webmaster Tools and watch the AI Performance report.
- Enable IndexNow. A key file in `public/` plus a post-deploy ping, or Netlify's IndexNow integration.

**Entity corroboration (off-page, highest leverage).** AI answers are assembled from several sources, so the same facts must appear everywhere:
- Make name, address, phone, founding year and markets consistent on JAPM, D&B, Pharmchoices, Made in Jordan and LinkedIn (CLIENT_QUESTIONS #16, #21, #23).
- Create a CPHI Online profile, where competitors already are.
- Ask JAPM to link to the new site.

**Content that AI systems can cite (client data needed):**
- Active ingredients per product (#9).
- Capacity per dosage form (#8).
- Certificates (#13).

These are exactly the facts people ask about and that competitors publish.

**Disambiguation.** "Itqan" is shared by unrelated companies in Saudi Arabia, Qatar, the UAE and Egypt.
- Always write "Itqan Pharmaceutical Industries (Amman, Jordan)" on first mention in external profiles.
- Keep `sameAs` pointing to the official profiles only.

## Measuring it (monthly after launch)

- Bing AI Performance: citations and cited pages.
- Manual prompt checks, recorded with the date and model:
  - "Who is Itqan Pharmaceutical Industries?"
  - "Jordanian pharmaceutical contract manufacturers"
  - "Who manufactures Etoria?"
- ChatGPT referral traffic, once analytics is approved.

Treat all of this as directional. AI answers vary by wording, location and time.

## Not doing

- No llms.txt: Google says it's unnecessary, and it isn't a ranking signal.
- No prompt-variant pages.
- No FAQ markup without genuine FAQs.
- No fake third-party mentions.
