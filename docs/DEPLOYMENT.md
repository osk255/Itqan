# Deployment

Hosting: **Netlify** (chosen by the project owner; see ADR-002 in [DECISIONS.md](DECISIONS.md)).

## Phase 1: Design preview (current)

### What gets deployed

- **What:** `design_handoff_itqan_website/site/`, exactly as the designer delivered it. There is no build step.
- **Config:** the root [`netlify.toml`](../netlify.toml). It sets the publish directory, clean URLs, the `noindex` header and basic security headers.
- `design_handoff_itqan_website/site/netlify.toml` is the designer's original file. Git deploys ignore it because Netlify reads the root file.

### One-time setup (about 3 minutes)

1. Sign in at <https://app.netlify.com>. Signing up with GitHub is easiest.
2. **Add new project → Import an existing project → GitHub**. Authorise Netlify, then pick **`osk255/Itqan`**.
   - If the repo is not listed, choose "Configure the Netlify app on GitHub" and grant access to it.
3. **Branch to deploy:** `main`.
   - If `main` doesn't exist yet, first create it on GitHub from `claude/sharp-turing-9bb810`: Branches → New branch → source `claude/sharp-turing-9bb810`.
   - Alternatively, pick `claude/sharp-turing-9bb810` directly in Netlify for now.
4. Leave **Build command** empty. The **Publish directory** is read from `netlify.toml` (`design_handoff_itqan_website/site`); if the form shows a field, enter that.
5. Click **Deploy**. After about 30 s you get a URL like `https://<random-name>.netlify.app`.
6. Optional: **Project configuration → Change project name** to get a readable URL, e.g. `itqan-preview.netlify.app`.

After this, every push to the deploy branch redeploys automatically. Every pull request gets its own **deploy preview** URL, which makes it easy to compare "before" and "after" with friends.

### URLs to share

| Page | Path |
|---|---|
| Home (3D logo scroll scene) | `/` |
| About Us | `/about` |
| Products (filter with `?c=health-wellness` etc.) | `/products` |
| One product | `/products/Product.dc.html?p=etoria` |
| Business Cooperation | `/business-cooperation` |
| Contact Us | `/contact` |
| All six pages in phone frames (best on a laptop) | `/mobile` |
| Brand sheet (internal) | `/brand` |

Clicking links inside the prototype shows file-style URLs such as `/products/Products.dc.html`. That's expected for the prototype; the production build has clean URLs throughout.

### Before you share, tell reviewers

- It's a design prototype. It loads its libraries at runtime and uses uncompressed images, so it is slower than the final site will be.
- The contact form opens an email to **info@itqanpharma.com**, which is Itqan's real inbox. Don't send it.
- Try both **Light/Dark** (top right), and scroll slowly on the home page.

### Search engines

Every response carries `X-Robots-Tag: noindex, nofollow`, so Google and Bing will not index the preview even if the link is posted publicly. Don't add a `robots.txt` Disallow: that would stop crawlers from ever seeing the noindex header.

### Local preview

Use Netlify's CLI to get the same URL rules as production:

```bash
npx netlify-cli dev --offline      # serves http://localhost:8888 using netlify.toml
```

Or open `design_handoff_itqan_website/site/home/Home.dc.html` directly in a browser.

### Known environment limits

- The pages load React, Babel and three.js from `unpkg.com`, and fonts from Google Fonts. A network that blocks unpkg sees unrendered `{{ }}` templates. Phase 2 removes these runtime CDN dependencies.
- There is no custom 404 page in the prototype, so Netlify's default 404 is shown.

## Phase 2+: Production (planned)

- **Build and runtime:** Next.js built by Netlify, with the adapter auto-detected and the build command `npm run build`. Pages are statically generated.
- **Forms:** Netlify Forms (see ROADMAP Phase 4).
- **Environment variables:** none are required for the static site. If analytics or form functions later need keys, they go in Netlify → Environment variables, never in the repo.

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
