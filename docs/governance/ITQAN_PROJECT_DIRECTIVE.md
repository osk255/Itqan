# ITQAN PHARMACEUTICAL INDUSTRIES — Production Website Engineering Directive

> Project-specific brief from the owner (received 2026-09-25). Highest-priority governance for this repo after explicit owner instructions.
> Owner overrides recorded with this directive: **host on Netlify** (not Vercel); **do not change the existing frontend** (the Claude Design handoff); first priority is a Netlify preview to gather feedback.

You are working on the production redesign of Itqan Pharmaceutical Industries.
This project must be treated as a real corporate pharmaceutical website, not a prototype.
Claude Code and Codex should operate as senior production engineers.
Claude is the primary architecture/reasoning/building agent.
Codex may implement, inspect, test, refactor and independently review work.
Any existing Jev/Kev-style evaluator should remain a bounded critic/decision layer for architecture, UX, complexity, risk and quality—not the primary coder.

## 1. FIRST ACTION: INSPECT, DO NOT REWRITE

Before making changes:

1. Inspect the entire repository.
2. Identify the current framework and dependencies.
3. Inspect git history/status/diff if available.
4. Inspect the existing Itqan redesign.
5. Inspect all existing assets.
6. Inspect current routes and components.
7. Inspect SEO implementation.
8. Inspect responsive behavior.
9. Inspect build/deployment configuration.

Do not blindly create a new application if a good existing foundation already exists.
Preserve good work.

## 2. READ PROJECT GOVERNANCE

If these files exist, read them before substantial changes:

- ENGINEERING_CONSTITUTION.md
- UNIVERSAL_AI_SOFTWARE_ARCHITECTURE_CONSTITUTION.md
- UNIVERSAL_AI_PRODUCT_ENGINEERING_OS.md
- CLAUDE.md
- AGENTS.md
- HANDOVER.md
- docs/PROJECT_STATE.md
- docs/ARCHITECTURE.md
- docs/DECISIONS.md
- docs/ASSUMPTIONS.md
- docs/SECURITY.md
- docs/DEPLOYMENT.md

Treat these as project governance.
Do not contradict existing architectural decisions silently.

## 3. MAINTAIN SHARED PROJECT STATE

Claude Code and Codex must share project state.
Maintain: HANDOVER.md and/or docs/PROJECT_STATE.md.
After meaningful work update:

- what changed
- files affected
- important architectural decisions
- unresolved issues
- client information still required
- tests performed
- next recommended action

Do not force the next agent to rediscover the repository.

## 4. WORKFLOW

For substantial tasks follow:
UNDERSTAND → INSPECT → RESEARCH → DESIGN → DECIDE → PLAN → EXECUTE → VERIFY → REVIEW → IMPROVE → DOCUMENT → DELIVER.
Do not skip verification.

## 5. SYSTEM COMPLEXITY

This is primarily a corporate/content website.
Use the smallest justified architecture.
Preferred direction if compatible with the existing project: Next.js, TypeScript, Tailwind CSS, Vercel *(owner override: Netlify)*.
Use Motion/CSS animation where justified.
Do NOT add: databases, microservices, authentication, admin dashboards, queues, complex APIs, unnecessary vendors — unless actual product requirements justify them.
A simple site should remain technically simple.

## 6. SOURCE OF TRUTH

Official company website: https://itqanpharma.com/

Use the existing official website as a source for legitimate existing: product names, product images, approved public product data, corporate identity, public contact information, company information.

However the existing site contains substantial template contamination. Never preserve irrelevant template material. Known bad content includes:

- Optcare
- eye surgery
- ophthalmology
- electricians
- house cleaners
- Melbourne address
- American telephone
- sample@example.com
- lorem ipsum
- template testimonials
- 23july.hostlin.com links
- zero production-capacity placeholders

## 7. MEDICAL / CORPORATE FACTUAL SAFETY

Never invent or infer: certifications, GMP status, regulatory approvals, factory approvals, production capacity, medical indications, dosage recommendations, active ingredients, countries served, clinical evidence, partnerships, company statistics, awards, testimonials.

When information is unavailable use an internal marker: `CLIENT CONFIRMATION REQUIRED`.
Do not render the marker publicly.

## 8. ASSET PRESERVATION

Preserve and reuse legitimate Itqan: logo, product packaging, company photography, facility imagery, approved brand colors, official visual assets.
Do not use unrelated template images.
Do not replace real pharmaceutical packaging with AI-generated medicine packaging.
Compress and optimize assets without materially altering official packaging/branding.

## 9. SITE ARCHITECTURE

At minimum support: `/`, `/about`, `/products`, `/products/[slug]`, `/business-cooperation`, `/contact`.
Preserve existing useful searchable product/category content.
Do NOT collapse the entire existing product footprint into one homepage.

## 10. MIGRATION SAFETY

Before production migration create an OLD_URL → NEW_URL migration map.
For every existing important URL: preserve it when sensible OR issue a permanent 301 redirect to the exact replacement.
Never blindly redirect every removed URL to the homepage.
Protect existing search equity.

## 11. SEO REQUIREMENTS

Implement correctly: semantic HTML, unique page titles, meta descriptions, canonical URLs, Open Graph, social metadata, robots.txt, sitemap.xml, clean URLs, breadcrumb architecture, descriptive image alt text, internal linking, Organization structured data, WebSite structured data, BreadcrumbList structured data, appropriate Product structured data where valid, Article/NewsArticle when future news content exists.
Structured data must represent visible truthful content. Never spam schema.

## 12. GEO / AI DISCOVERABILITY

Structure important factual content clearly. AI/search systems should easily identify: company name, company purpose, headquarters, manufacturing capabilities, product portfolio, therapeutic categories, official contacts, approved markets, business cooperation opportunities.
Use concise factual sections and strong semantic HTML.
Do not create fake GEO pages or mass-generated AI content.

## 13. PERFORMANCE

Target excellent Core Web Vitals, with particular attention to LCP, INP, CLS.
Use: responsive optimized images, modern image formats, correct image dimensions, lazy loading below the fold, sensible font loading, minimal client JavaScript, route-level code splitting, static generation when appropriate, caching/CDN, animation using transform/opacity when possible.
Do not sacrifice performance for impressive animation.

## 14. ANIMATION

Implement the approved Claude Design motion language faithfully. Animations should: communicate precision, preserve readability, remain subtle, perform at 60fps where practical, support prefers-reduced-motion, degrade cleanly on mobile.
Avoid unnecessary WebGL. Use expensive 3D only if it materially improves the approved design and remains performant.

## 15. RESPONSIVENESS

Test: 320px, 375px, 390px, 430px, 768px, 1024px, 1280px, 1440px+.
No horizontal overflow. No clipped text. No unusable menus. No microscopic touch targets.

## 16. ACCESSIBILITY

Implement: semantic landmarks, keyboard accessibility, visible focus, labels, correct heading order, alt text, contrast, reduced motion, accessible forms.

## 17. CONTACT FORM

Keep it simple. If a serverless contact form is needed: server-side validation, spam protection, rate limiting, safe error handling, no secrets shipped to browser, minimal data collection.
Do not build CRM functionality unless requested.

## 18. EMAIL/DNS SAFETY

This is critical. Itqan's existing corporate email infrastructure must remain functional.
During domain migration: DO NOT replace or remove email records blindly. Preserve existing MX, SPF, DKIM, DMARC.
Only change the DNS records required for website routing after inspecting the existing DNS configuration.
Create a deployment checklist before DNS modification.

## 19. ANALYTICS

Prepare integration for: Google Search Console, Google Analytics 4, Bing Webmaster Tools, Microsoft Clarity if approved.
Track commercially meaningful events where applicable: business cooperation CTA, contact submission, email click, phone click, product engagement.
Avoid vanity analytics.

## 20. SECURITY

At minimum: dependency audit, secure headers, server-side form validation, secret isolation, spam controls, no sensitive environment values exposed, no unnecessary third-party scripts.

## 21. CODE QUALITY

TypeScript strictness where feasible; reusable but not over-abstracted components; readable naming; clear component boundaries; no dead code; no console errors; no copied template garbage; no enormous components without reason; no duplicate content/data definitions when avoidable.

## 22. VERIFICATION BEFORE COMPLETION

Run and resolve: lint, typecheck, tests where present/applicable, production build.
Manually inspect: navigation, products, forms, responsive layouts, animations, accessibility basics, metadata, sitemap, robots, canonical links, redirects, broken links.
Do not claim completion when the build fails.

## 23. HUMAN QUALITY GATE

Before considering a page complete ask:
Does this feel specifically built for Itqan? Does anything look generic or AI-generated? Does every animation serve a purpose? Is the hierarchy obvious? Is the content factual? Is the page fast? Would a pharmaceutical executive trust this? Would a distributor understand what Itqan offers? Could Google clearly understand the page? Could an AI search system extract the relevant company facts accurately?
If any answer is weak, improve the implementation.

## 24. FINAL PRINCIPLE

The objective is not simply "build a nice website."
The objective is: build a high-trust, high-performance, technically sound digital representation of Itqan Pharmaceutical Industries that preserves its authentic brand and product portfolio while improving corporate credibility, B2B communication, search visibility and future AI discoverability — without overengineering the system.
