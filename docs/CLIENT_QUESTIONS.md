# Client confirmation required

These are facts only Itqan can supply or confirm. **Until they are answered, the site must not state them.** Unknown values are `null` in the catalogue, and those rows are simply not rendered. Internal marker: `CLIENT CONFIRMATION REQUIRED`, which is never shown publicly.

Status key: **Open** · **Answered** (record the answer and its source) · **Dropped**

## Blocking Phase 2 or launch

| # | Question | Why it matters | Status |
|---|---|---|---|
| 1 | Is an **Arabic version** needed at launch? | It changes routing, layout (RTL) and scope | **Answered:** no, English only at launch (owner, 2026-09-25) |
| 2 | Does the Next.js project `itqan-pharma/` mentioned in the design handoff still exist? | Build on it instead of starting fresh | **Answered:** no, so a new one was created (owner, 2026-09-25) |
| 3 | Who controls the **itqanpharma.com DNS**, and which provider hosts the corporate email? | Needed to cut over safely without breaking email | Open |
| 4 | May we access **Google Search Console** for itqanpharma.com, or can we be added to it? | Shows which old URLs actually carry traffic, for the redirect map | Open |
| 5 | Should AI **training** crawlers (e.g. GPTBot) be allowed? AI **search** crawlers (OAI-SearchBot) will be allowed. | Robots policy is the client's decision | Open |
| 6 | Approval to use **GA4 / Microsoft Clarity**, and is a consent banner required for their markets? | Analytics setup and privacy | Open |
| 7 | Where should enquiry-form submissions go (which inbox), and who answers them? | Netlify Forms notifications | Open |

## Content gaps (listed in the design handoff)

| # | Item | Status |
|---|---|---|
| 8 | Production capacity per dosage form | Open |
| 9 | Active ingredient and dosage form for each of the 27 products | Open |
| 10 | Patient leaflets / SmPC documents | Open |
| 11 | Units for **Ales "5"** and **Pymol "500"** | Open |
| 12 | Working hours | Open |
| 13 | GMP certificates: which ones, issued by whom, and whether they can be shown | Open |

## Wording to confirm

| # | Item | Status |
|---|---|---|
| 14 | The home-page facts strip says **"30+ · Years of experience in this field"**. The About page attributes the 30+ years to **Itqan's founders**, and the company's first product was in 2019. Should the home strip also say "founders' experience", so it isn't read as company age? | Open |
| 15 | Approved markets, verbatim from the current site: "Jordan, Iraq, Lebanon, Sudan, Yemen, Libya, Kazakhstan and centrally in GCC and nationally in Kuwait, UAE, Oman". Registration "in process" with Swissmedic and the EU. Is this still current? | Open |
| 16 | A full street address for the Amman facility, for Organization schema and Google Business Profile | Open |
| 17 | Official social profiles beyond Facebook and LinkedIn, for `sameAs` | Open |
| 18 | Product pages show **"Manufacturer: Itqan Pharmaceutical Industries, Amman — Jordan"** (from the design). Is Itqan the manufacturer of all 27 products, or are some licensed or distributed? This is a medical and corporate fact that appears on 27 pages. | Open |
| 19 | The live site's **category and product URLs**. The new site uses `/product-category/<slug>/` with the design's slugs (e.g. `cns`, `otc`). If the live slugs differ, they need 301s to protect existing search rankings. | Open (needs the crawl or Search Console) |
