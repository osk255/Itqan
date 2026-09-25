# Launch checklist (Phase 5)

Tick an item only with evidence: a command output, a screenshot or a link.

## Content and facts
- [ ] Client has signed off every page's copy
- [ ] No CLIENT CONFIRMATION REQUIRED item is rendered or implied
- [ ] No template contamination anywhere (Optcare, eye surgery, Melbourne, sample@example.com, lorem ipsum, hostlin links)

## Technical SEO
- [ ] **The preview `X-Robots-Tag: noindex` has been removed from `netlify.toml`**
- [ ] `robots.txt` on the production domain allows Googlebot, Bingbot and OAI-SearchBot, with the GPTBot policy set as the client decided, and lists the sitemap URL
- [ ] `sitemap.xml` lists only canonical URLs that return 200 and are indexable
- [ ] Every page has a unique title and description, a self-canonical URL on the production domain, and OG/Twitter tags with absolute image URLs
- [ ] JSON-LD validates in Google's Rich Results Test and the Schema.org validator, and matches the visible content
- [ ] Every row in REDIRECT_MAP has been tested: correct destination, 200, no chains or loops
- [ ] The custom 404 page returns status 404
- [ ] No `*.netlify.app` URLs in canonicals, the sitemap or internal links

## Quality
- [ ] Rendered at 320, 375, 390, 430, 768, 1024, 1280 and 1440 px in both themes: no overflow, clipping or tiny tap targets
- [ ] Keyboard-only walkthrough of navigation, the menu and the form; focus is visible
- [ ] `prefers-reduced-motion` stops all motion, and the 3D logo renders static
- [ ] Mobile Lighthouse score recorded: LCP ≤ 2.5 s, CLS ≤ 0.1, and TBT/INP within budget
- [ ] No console errors on any page
- [ ] A real form submission arrives in the client's inbox, and the spam honeypot is working

## DNS and email (see DEPLOYMENT.md, Phase 5)
- [ ] Full DNS zone exported and saved before any change
- [ ] Only the apex and `www` web records changed; MX, SPF, DKIM and DMARC unchanged (compare `dig` output before and after)
- [ ] HTTPS certificate issued, and apex/`www` redirect to a single canonical host
- [ ] Test email sent and received on @itqanpharma.com after cutover

## After cutover
- [ ] Search Console and Bing Webmaster verified, and the sitemap submitted
- [ ] Analytics are receiving events (if approved)
- [ ] Post-launch monitoring booked: day 1–7 and week 2–4 (ROADMAP Phase 6)
