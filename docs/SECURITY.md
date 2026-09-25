# Security

## In place (2026-09-25)

- **Static site.** There is no server code, database, auth or secrets, and no environment variables are required. The attack surface is the CDN and one form.
- **Headers** from `netlify.toml`:
  - `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`;
  - `X-Frame-Options: SAMEORIGIN`;
  - a `Permissions-Policy` that denies camera, microphone and geolocation;
  - `X-Robots-Tag: noindex, nofollow` until launch.
- **HTTPS:** Netlify serves every page over HTTPS.
- **Third-party scripts:** none on the public pages. No analytics yet, and fonts are self-hosted.
- **Enquiry form:**
  - Browser validation, then Netlify Forms spam filtering and a honeypot (`bot-field`).
  - Only name, email and message are required; company, phone and product are optional.
  - No personal data goes in URLs, except the product name used to prefill the form. No personal data goes to analytics.
- **Dependencies:** `npm audit` reports 0 vulnerabilities (2026-09-25). Versions are locked by `package-lock.json`.
- **JSON-LD:** built from constants only, with `<` escaped.

## Residual risks

- **Form spam.** Netlify Forms offers no custom server-side validation or rate limiting. If abuse appears, add a Netlify Function or reCAPTCHA (ROADMAP Phase 4).
- **No Content-Security-Policy yet.** Next.js static export relies on inline scripts (RSC payload, theme boot script), so a strict CSP needs hashes. Evaluate in Phase 4.
- **The internal brand tool** (`/brand/Logo3D.html`) loads three.js from unpkg, pinned with SRI integrity hashes. Public pages do not.

## Production additions (Phase 4–5)

- HSTS on the custom domain, once HTTPS is confirmed on both the apex and `www`.
- CSP, if the hash-based approach proves maintainable.
- DNS and email safety: see DEPLOYMENT.md, Phase 5.
