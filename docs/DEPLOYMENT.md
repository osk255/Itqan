# Deployment

Hosting: **Netlify** (chosen by the project owner; see ADR-002 in [DECISIONS.md](DECISIONS.md)).

## Current setup: the Next.js site on Netlify

- **Site:** https://courageous-caramel-8493e6.netlify.app. It deploys from branch `claude/sharp-turing-9bb810`, the repo's only branch, and every push redeploys automatically.
- **Config:** [`netlify.toml`](../netlify.toml) at the repo root, which overrides the settings in the Netlify UI:
  - build command `npm run build`, publish directory `out`, Node 22;
  - `NETLIFY_NEXT_PLUGIN_SKIP=true`, because the site is a plain static export (ADR-006);
  - 301 redirects, the preview `noindex` header, security headers and cache headers.
- **Environment variables:** none are required. `SITE_URL` is optional; without it, canonical URLs use Netlify's `URL`, the site's primary address (ADR-012).
- Netlify installs dependencies with `npm ci` from `package-lock.json`. The build takes about 20 s.

### One-time owner actions in the Netlify UI

1. **Enable the contact form.** Go to **Project configuration → Forms → Enable form detection**, then trigger a new deploy (Deploys → Trigger deploy).
   - Newer Netlify sites have detection off by default. Without it, enquiries fail and the form shows the email/phone fallback.
2. **Get form submissions by email.** Go to **Forms → Form notifications → Add notification → Email notification**, choose form `enquiry`, and enter the address Itqan picks (CLIENT_QUESTIONS #7).
   - Until this is set, submissions are only visible under **Forms** in Netlify.
3. Optional: **Project configuration → Change project name** for a readable URL (e.g. `itqan-preview.netlify.app`). Old links to the random name keep working as redirects.

### URLs to share

| Page | Path |
|---|---|
| Home (3D logo scroll scene) | `/` |
| About Us | `/about-us/` |
| Products | `/all-products/` |
| One category | `/product-category/health-wellness/` |
| One product | `/products/etoria/` |
| Business Cooperation | `/business-cooperation/` |
| Contact Us | `/contact-us/` |
| Brand sheet (internal) | `/brand/` |

Links from the old prototype preview (`/home/Home.dc.html`, `/products/Product.dc.html?p=etoria`, `/mobile`, …) redirect to their new pages.

### Before you share, tell reviewers

- The contact form sends real enquiries to the Netlify dashboard (and to the notification email, once one is set). Ask testers to write "TEST" in the message.
- Try **Light/Dark** (top right), and scroll slowly through the home page.

### Search engines

Every response carries `X-Robots-Tag: noindex, nofollow`, so Google and Bing will not index the preview even if the link is posted publicly. `robots.txt` allows crawling on purpose, so crawlers can see that header. Remove the header only at launch (Phase 5).

### Local development

```bash
npm install
npm run dev          # http://localhost:3000, hot reload
npm run check        # lint + typecheck + production build (run before every push)
npm run images       # regenerate public/images after changing an original asset (~3 min)
npx netlify-cli dev --offline --framework "#static" --dir out   # serve the built site with netlify.toml rules
```

## Phase 5: Domain cutover (DNS and email safety)

**Itqan's corporate email must keep working.** Before any DNS change:

1. Find where `itqanpharma.com` DNS is hosted (registrar or DNS provider) and who has access.
2. **Export the full zone** (all records, all TTLs) and commit a redacted copy to `docs/dns/` for the record.
3. Identify the email records and **do not modify them**: `MX`, SPF (`TXT v=spf1…`), DKIM (`TXT`/`CNAME` at `*._domainkey`), DMARC (`TXT _dmarc`), plus any mail `CNAME`/`SRV`/autodiscover records.
4. Lower the TTL on the apex `A`/`ALIAS` and `www` `CNAME` records 24 h ahead.
5. Add the custom domain in Netlify.
   - Change **only** the apex and `www` web records to the values Netlify shows.
   - Prefer keeping the current DNS provider over moving nameservers to Netlify DNS. Moving nameservers means re-creating every email record.
6. Wait for Netlify to issue the HTTPS certificate.
7. Test right away:
   - Send email to and from an `@itqanpharma.com` address.
   - Check that `dig MX itqanpharma.com` is unchanged.
   - Load both the apex and `www` URLs; one should redirect to the other.
8. Remove the preview `X-Robots-Tag` from `netlify.toml` in the same release as the cutover.

Rollback: restore the saved web records. Email records were never touched, so there is nothing to roll back for mail.
