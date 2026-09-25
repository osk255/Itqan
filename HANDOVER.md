# Handover

Read this first, then [docs/PROJECT_STATE.md](docs/PROJECT_STATE.md) and [docs/ROADMAP.md](docs/ROADMAP.md).

## Latest session: 2026-09-25 (Claude Code): Phase 0 and Phase 1 config

### What changed
- The repo was empty. It now contains the Claude Design handoff, committed **byte-identical** to the owner's zip (checked with `diff -r`).
- A root `netlify.toml` publishes `design_handoff_itqan_website/site`. It provides:
  - clean URLs;
  - `force = true` on `/`, which fixes the designer's rule being shadowed by `index.html`;
  - a `/mobile` 302 to the phone-frame board;
  - a preview-wide `X-Robots-Tag: noindex, nofollow`;
  - security headers.
- The governance docs are in `docs/governance/`, including the owner's project directive.
- New planning and continuity docs:
  - `docs/ROADMAP.md`, `DEPLOYMENT.md`, `DECISIONS.md`, `PROJECT_STATE.md`, `ASSUMPTIONS.md`, `CLIENT_QUESTIONS.md`, `FEEDBACK.md`, `ARCHITECTURE.md`, `SECURITY.md`;
  - `docs/seo/ENTITY_MAP.md`, `REDIRECT_MAP.md` (draft) and `LAUNCH_CHECKLIST.md`.
- `README.md`, `CLAUDE.md`, `AGENTS.md` and `.gitignore`.

### Decisions
ADR-001 to ADR-004 are accepted. ADR-005 (URL strategy) is proposed and waiting on the owner.

### Tests performed
- **Routing:** `netlify-cli dev` (v27.10.0) with this `netlify.toml`.
  - These return 200 with the correct page title: `/`, `/about`, `/about/`, `/products`, `/products/`, `/business-cooperation`, `/contact`, `/contact?type=cooperation`, `/brand`.
  - `/mobile` returns 302 then 200.
  - The per-folder `support.js`, `/shared/catalogue.js` and `/assets/*` all return 200.
  - The headers are present.
- **Rendering:** Playwright with the bundled Chromium. unpkg is blocked in this sandbox, so the identical package versions (react 18.3.1, react-dom 18.3.1, @babel/standalone 7.29.0, three 0.184.0) were served from npm.
  - 7 pages × 8 widths (320–1440 px): **0 horizontal overflow, 0 broken images, correct `<h1>` on every page.** The 3D canvas mounts on `/` and `/brand`.
  - The only console error is the known `{{ p.image }}` 404 on the product page.
  - Screenshots were checked visually at 390 and 1440 px.
- **Interaction:**
  - Nav click-through from the clean URLs works.
  - Product card → product page works.
  - The mobile menu opens with 8 links, and Esc closes it.
- **Not tested:**
  - A real Netlify deploy. There is no Netlify credential in this environment, so the owner connects the repo (DEPLOYMENT.md).
  - The live itqanpharma.com. The network policy blocked it.
  - Kev/Jev review. The local endpoint `127.0.0.1:8009` is not reachable from this cloud container.

### Unresolved and client information needed
- See [docs/CLIENT_QUESTIONS.md](docs/CLIENT_QUESTIONS.md). The top items are Arabic, the existing `itqan-pharma/` Next.js project, and DNS/email ownership.
- Prototype known issues are listed in PROJECT_STATE.

### Next recommended action
1. **Owner:** connect `osk255/Itqan` in Netlify (DEPLOYMENT.md, "One-time setup") and share the URL together with the FEEDBACK.md prompts.
2. **Owner:** answer the three Phase 2 decisions in ROADMAP.md.
3. **Next agent:**
   - Once the decisions are in, start Phase 2 in a new top-level app folder. Leave `design_handoff_itqan_website/` untouched as the reference.
   - Switch `netlify.toml` from the static publish directory to the Next.js build in the same PR that makes the new app deployable.
