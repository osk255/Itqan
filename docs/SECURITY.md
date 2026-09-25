# Security

## Phase 1 preview: what is in place

- **Static files only.** There is no server code, no secrets and no environment variables, and no user data is collected. The contact form opens the visitor's own mail app.
- **Headers** from `netlify.toml`:
  - `X-Content-Type-Options: nosniff` and `Referrer-Policy: strict-origin-when-cross-origin`;
  - `X-Frame-Options: SAMEORIGIN`, which still allows the same-origin iframes on `/mobile`;
  - a `Permissions-Policy` that denies camera, microphone and geolocation;
  - `X-Robots-Tag: noindex, nofollow`.
- **HTTPS** is provided by Netlify on `*.netlify.app`.

## Residual risks, accepted for a short-lived preview

- **Third-party runtime scripts.** The pages execute JavaScript from unpkg.com: React, Babel standalone and three.js, with pinned versions but no Subresource Integrity. A compromised CDN could run code on the preview. Phase 2 bundles everything and removes this.
- **No CSP.** Babel standalone compiles in the browser and needs `unsafe-eval`, plus inline scripts, so a Content-Security-Policy would add little. It will be added in Phase 4, once runtime compilation is gone.

## Production baseline (Phase 4)

- A CSP that allows only self, plus analytics hosts if they are approved. HSTS on the custom domain.
- **Form:**
  - Netlify Forms with a honeypot and spam filtering.
  - Collect only name, email and message; company, phone and product are optional.
  - No personal data in analytics events or URLs, beyond the product name used to prefill the form.
- `npm audit` in CI. Dependency updates reviewed before merge.
- No secrets in the repo. Any keys go in Netlify environment variables and must never use the `NEXT_PUBLIC_` prefix unless they are genuinely public.
- **DNS/email safety:** see DEPLOYMENT.md, Phase 5.
