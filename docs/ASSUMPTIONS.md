# Assumptions

These are working assumptions that are not yet confirmed. Replace each one with a fact, or with a decision in DECISIONS.md, once it is known.

| # | Assumption | Impact if wrong | Resolve by |
|---|---|---|---|
| A1 | The copy and data in the design handoff are verbatim from itqanpharma.com. The handoff says it was audited on 2026-09-25. This session could not reach the live site to re-check it, because the network policy blocked it. | Content may not match the live site | Phase 3 crawl, and client review |
| A2 | The 27 packaging images and 3 facility photos in the handoff are official Itqan assets. The handoff says they come from the live site and the earlier project. | Brand/IP risk | Client confirmation |
| A3 | `logo-reversed.png` (a light-lettering variant for dark themes) is acceptable brand use. The designer derived it from the official logo. | The brand team may reject it | Client brand sign-off |
| A4 | English-only is acceptable for the preview. | None for the preview; see CLIENT_QUESTIONS #1 for production | Client |
| A5 | Friends and stakeholders reviewing the preview have normal internet access to unpkg.com and Google Fonts, which the prototype needs at runtime. | They would see an unrendered page | Phase 2 removes the dependency |
| A6 | Netlify's free tier is enough for the preview: bandwidth, build minutes and deploy previews. The products page is about 22 MB per full view, so heavy sharing uses bandwidth quickly. | Bandwidth cap reached | Watch Netlify usage; Phase 2 cuts page weight |
