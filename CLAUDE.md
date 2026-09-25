# CLAUDE.md

This is the corporate website for Itqan Pharmaceutical Industries (Amman, Jordan). Claude is the primary architecture and build agent. Codex may implement and review.

## Read before substantial work
1. `HANDOVER.md`: the latest session, and what to do next
2. `docs/PROJECT_STATE.md`, `docs/ROADMAP.md`, `docs/DECISIONS.md`
3. `docs/governance/ITQAN_PROJECT_DIRECTIVE.md`: the project brief, which has the highest priority after explicit owner instructions
4. The rest of `docs/governance/`: the engineering OS, the SEO/GEO constitution and the Kev/Jev layer. Kev is a bounded critic only; its endpoint is `127.0.0.1:8009` when it is available locally.
5. `design_handoff_itqan_website/README.md`: the authoritative design spec

## Hard rules
- **Never invent** certifications, GMP status, approvals, capacity, ingredients, indications, dosages, markets, statistics, partners, awards or testimonials. Unknown means `null`, which is not rendered. Track it in `docs/CLIENT_QUESTIONS.md` with the internal marker `CLIENT CONFIRMATION REQUIRED`, which is never shown publicly.
- **Do not edit `design_handoff_itqan_website/`.** It is the visual reference. Match it pixel for pixel in `src/`, and list any deliberate deviation in ADR-011. Design changes come back from Claude Design.
- Hosting is **Netlify**, not Vercel (ADR-002). Every non-production deploy must stay `noindex` (ADR-003).
- **DNS:** never touch MX, SPF, DKIM or DMARC. Follow `docs/DEPLOYMENT.md`, Phase 5.
- Keep the architecture small: no database, auth, CMS, admin or microservices without a real requirement.
- Never keep live-site template contamination: Optcare, eye surgery, Melbourne, sample@example.com, lorem ipsum, hostlin links.

## Stack
Next.js 16 static export (`out/`) on Netlify, TypeScript strict, Tailwind v4. Content lives in `src/lib/catalogue.ts`. See `docs/PROJECT_STATE.md` for the code map.

## Commands
- `npm run dev`: local dev server.
- `npm run check`: lint + typecheck + production build + the quality gate (`scripts/check-site.mjs`). Run it before every push. Netlify runs the same checks and refuses to deploy on failure.
- `npm run images`: regenerate `public/images` after an original asset changes.
- `npx netlify-cli dev --offline --framework "#static" --dir out`: serve the built site with the `netlify.toml` rules.

## After meaningful work
Update `HANDOVER.md`: what changed, files, decisions, tests, open issues, next action. Also update `docs/PROJECT_STATE.md`, and add an ADR in `docs/DECISIONS.md` for any significant choice.
