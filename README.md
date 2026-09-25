# Itqan Pharmaceutical Industries: website

This is the redesign of [itqanpharma.com](https://itqanpharma.com/) for a pharmaceutical manufacturer in Amman, Jordan.

**Status:** Phase 1 is a design preview on Netlify, for feedback. The production build (Phase 2) hasn't started yet. See [docs/ROADMAP.md](docs/ROADMAP.md).

## View the preview

- **Online:** the Netlify URL, once connected. Setup steps are in [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).
- **Locally:** run `npx netlify-cli dev --offline`, then open <http://localhost:8888>.

Pages: `/` · `/about` · `/products` · `/business-cooperation` · `/contact` · `/mobile` (all pages in phone frames) · `/brand`

## Repository layout

```
netlify.toml                    Netlify config (publish dir, clean URLs, noindex, headers)
design_handoff_itqan_website/   Claude Design handoff. FROZEN reference, do not edit
  README.md                     Full design spec: tokens, components, motion, 3D logo, data
  site/                         Runnable HTML prototype (what the preview serves)
docs/
  ROADMAP.md                    Phases 0–6 and what's needed to start each
  PROJECT_STATE.md              Current state, known issues, constraints
  DEPLOYMENT.md                 Netlify setup, sharing, DNS/email-safe domain cutover
  DECISIONS.md                  Architecture decision records
  CLIENT_QUESTIONS.md           Facts only Itqan can confirm (never invented)
  FEEDBACK.md                   Reviewer prompts and feedback log
  ARCHITECTURE.md · SECURITY.md · ASSUMPTIONS.md
  seo/                          Entity map, redirect map (draft), launch checklist
  governance/                   Project directive and engineering/SEO constitutions
HANDOVER.md                     Latest session handover for the next engineer or agent
```

## Rules that matter most

1. **No invented facts.** Certifications, approvals, capacity, ingredients and indications appear only once Itqan confirms them. See [docs/CLIENT_QUESTIONS.md](docs/CLIENT_QUESTIONS.md).
2. **Don't edit the handoff.** Design changes come back from Claude Design as a new handoff.
3. **Keep the preview out of search.** Every deploy sends `noindex` until production launch.
4. **Protect Itqan's email.** DNS changes follow the checklist in [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).
