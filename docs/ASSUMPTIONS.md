# Assumptions

These are working assumptions that are not yet confirmed. Replace each one with a fact, or with a decision in DECISIONS.md, once it is known.

| # | Assumption | Impact if wrong | Resolve by |
|---|---|---|---|
| A1 | The copy and data in the design handoff are verbatim from itqanpharma.com. The handoff says it was audited on 2026-09-25. This session could not reach the live site to re-check it, because the network policy blocked it. | Content may not match the live site | Phase 3 crawl, and client review |
| A2 | The 27 packaging images and 3 facility photos in the handoff are official Itqan assets. The handoff says they come from the live site and the earlier project. | Brand/IP risk | Client confirmation |
| A3 | `logo-reversed.png` (a light-lettering variant for dark themes) is acceptable brand use. The designer derived it from the official logo. | The brand team may reject it | Client brand sign-off |
| A4 | English-only is acceptable. | Resolved: the owner confirmed English only at launch | Owner (2026-09-25) |
| A5 | Reviewers can reach unpkg.com and Google Fonts. | Resolved: the Phase 2 build has no runtime CDN dependencies on public pages | ADR-006, ADR-012 |
| A6 | Netlify's free tier is enough: bandwidth, build minutes (builds take about 20 s) and form submissions (the free tier has a monthly cap). Pages are now about 2 MB per full view. | Cap reached | Watch Netlify usage |
| A7 | Category URLs use the design catalogue's slugs until the live site's slugs are known. | Old category URLs would 404 without 301s | Phase 3 crawl (CLIENT_QUESTIONS #19) |
