# Itqan website: meeting brief (2026-09-25)

## Context

You sent four governance files:
- **ITQAN Production Website Engineering Directive:** the project brief.
- **Universal AI Product Engineering OS:** how the work is run.
- **Universal SEO/GEO Constitution:** search and AI visibility.
- **Kev/Jev Decision Layer:** an independent reviewer model.

You have a meeting and need one page that says:
- where the project stands against those files;
- what happens next, in order;
- what each person must decide or provide.

Everything below comes from the repo docs (ROADMAP, PROJECT_STATE, CLIENT_QUESTIONS, `docs/seo/*`). Nothing new is built in this step.

---

## 1. Where we are (one line each)

| Phase | Status | Evidence |
|---|---|---|
| 0 Foundation and governance | ✅ Done | Repo, governance docs, HANDOVER, PROJECT_STATE, 14 ADRs |
| 1 Netlify preview | ✅ Done | https://courageous-caramel-8493e6.netlify.app (hidden from Google) |
| 2 Production build | ✅ Built, awaiting your review | Same design; first content ~1.3 s vs ~2.5–4 s; products page 21.7 MB → 1.8 MB |
| 3 SEO/GEO and URL migration | 🟡 In progress | 9 SEO plans written; quality gate live; 3 of ~30 old URLs mapped. **Crawl blocked** |
| 4 Forms, analytics, security | 🟡 Partly done | Form wired (needs Netlify switch); analytics events ready (needs approval); 0 vulnerabilities |
| 5 Launch on itqanpharma.com | ⏳ Not started | Needs client answers + DNS access |
| 6 Post-launch | ⏳ | — |

---

## 2. Directive compliance (the file you'll be asked about)

| Directive section | Status | What's left |
|---|---|---|
| §1–4 Inspect, governance, shared state, workflow | ✅ | Keep HANDOVER/PROJECT_STATE updated each session |
| §5 Small architecture (Next.js, TS, Tailwind; Netlify, per your choice) | ✅ | — |
| §6 Official site as source; strip template junk | ✅ | Build gate blocks Optcare, lorem ipsum, etc. automatically |
| §7 No invented medical or corporate facts | ✅ Enforced | 23 client questions open; unknowns stay hidden |
| §8 Preserve real assets | ✅ | Originals untouched; optimised copies only |
| §9 Site architecture | ✅ | Live URLs kept; `/about`, `/contact`, `/products` redirect |
| §10 Migration safety (old URL → new URL) | 🟡 | **Crawl the live site**; map ~27 old `/product/…` URLs + categories; junk pages → 410 |
| §11 SEO requirements | ✅ | Product schema deliberately skipped until real data exists (ADR-010) |
| §12 GEO / AI discoverability | 🟡 | Needs client facts (ingredients, capacity, certificates) + consistent directory listings |
| §13 Performance | ✅ In lab | Confirm on real phones and with Search Console Core Web Vitals after launch |
| §14 Animation | ✅ | Reduced-motion supported |
| §15 Responsive 320–1440+ | ✅ | Tested 320–1920, both themes |
| §16 Accessibility | ✅ | axe-core: 0 violations |
| §17 Contact form | 🟡 | You: enable Netlify form detection + notification email |
| §18 Email/DNS safety | 🟡 Planned | Checklist ready; needs who controls DNS (Q3) |
| §19 Analytics | 🟡 | Events ready; Itqan must approve a tool and a consent approach (Q6) |
| §20 Security | ✅ Baseline | Add HSTS (+ CSP if feasible) at launch |
| §21–22 Code quality and verification | ✅ | Automatic gate refuses bad deploys |
| §23 Human quality gate | ⏳ | Your review + friends' feedback + Itqan sign-off |
| Kev/Jev layer | ⚠️ Not used | The endpoint runs on your machine, not in the cloud. Run it locally for launch-readiness review if you want it |

---

## 3. The plan, in order

**Step 1: Feedback round (now → this week).** Owner: you.
- Share the preview; use the 7 questions in `docs/FEEDBACK.md`.
- Log the answers there.
- I triage each point into design / code / client / won't-do.

**Step 2: Unblock the crawl and finish migration (as soon as access is allowed).** Owner: you (access), me (work).
- Allow `itqanpharma.com` + the netlify.app domain in the environment settings.
- I crawl the live site and complete `docs/seo/REDIRECT_MAP.md`: every old product/category URL gets an exact 301, and template junk gets 410.
- I read the product facts straight from the official site. Anything the live site already publishes, like active ingredients, becomes usable after Itqan confirms it.

**Step 3: Client data (in parallel, depends on Itqan).** Owner: Itqan.
- I add each confirmed fact:
  - **products:** active ingredients and dosage forms;
  - **Business Cooperation:** capacity and certificates;
  - **Contact:** address and working hours;
  - **schema:** updated to match.
- Only confirmed facts go live; the build gate prevents placeholders from shipping.

**Step 4: Design round (after feedback).** Owner: Claude Design → me.
- Send the designer:
  - feedback items;
  - accessibility deviations (ADR-011);
  - proposals: a category-specific heading on category pages, a product → Business Cooperation link, an About → capabilities link;
  - the stale "Funnel" font text on the brand page.
- I implement the new handoff, checked against it pixel by pixel.

**Step 5: Launch preparation.** Owner: me + you.
- Analytics tool (if approved).
- Search Console + Bing Webmaster (incl. the AI Performance report) + IndexNow.
- HSTS/CSP.
- Run `docs/seo/LAUNCH_CHECKLIST.md` end to end.

**Step 6: Launch day.** Owner: whoever controls DNS + me.
- Export the full DNS zone first. **Do not touch MX/SPF/DKIM/DMARC** (email keeps working).
- Change only the website records.
- Remove the "hide from Google" header.
- Submit the sitemap.
- Test email both ways.

**Step 7: Post-launch.**
- Days 1–7: indexing and 404s.
- Weeks 2–4: queries, Core Web Vitals.
- Monthly: AI-citation check (Bing report + manual prompts).
- Off-site: fix directory listings (JAPM, D&B, Pharmchoices), add a CPHI Online profile.

---

## 4. What to ask for in the meeting

**Decisions / actions for you (owner)**
1. Allow network access to `itqanpharma.com` and `courageous-caramel-8493e6.netlify.app` (environment settings → Edit).
2. Netlify: Forms → enable form detection → redeploy. Then add an email notification for form `enquiry`.
3. Circulate the preview to reviewers; confirm the deadline for feedback.

**Must-have answers from Itqan (full list: `docs/CLIENT_QUESTIONS.md`)**
| # | Ask | Why it blocks |
|---|---|---|
| 3 | Who controls the itqanpharma.com DNS, and who hosts company email? | Launch without breaking email |
| 4 | Google Search Console access | Protect existing rankings during migration |
| 7 | Which inbox receives website enquiries? | Leads go nowhere otherwise |
| 9 | Active ingredient + dosage form for all 27 products | Product pages, AI answers, name collisions (Dozile, Cresuva, Xaro) |
| 8, 13 | Capacity per dosage form; GMP / other certificates | Competitors win "contract manufacturing Jordan" with these |
| 16 | Correct address (directories show both Sahab free zone and Marka) | Google/AI consistency, Contact page |
| 18 | Does Itqan manufacture all 27 products? Sana Pharma also lists "Etoria" | "Manufacturer" line on 27 pages |
| 6, 5 | Approve an analytics tool + consent approach; allow AI-training crawlers (GPTBot)? | Legal/privacy decisions only Itqan can make |

**Nice-to-have from Itqan:** Arabic company name (#20), founding year, 2017? (#21), Emperor strengths (#22), "30+ years" wording (#14), markets list still current (#15), leaflets (#10), Ales/Pymol units (#11), working hours (#12), other social profiles (#17), who can fix directory listings (#23), approval of the light-on-dark logo variant (A3).

**Things NOT to promise in the meeting** (directive §7): GMP status, capacity numbers, approvals beyond the published list, rankings, or dates that depend on Itqan's answers.

---

## 5. How each step is verified

- **Every push:** Netlify runs lint + typecheck + build + the site quality gate. A failure blocks the deploy and the last good version stays live.
- **Migration:** every REDIRECT_MAP row is tested with `netlify dev` (301 → 200, no chains) before launch.
- **Content additions:** each fact is traced to Itqan's written confirmation, recorded in CLIENT_QUESTIONS.
- **Launch:** every LAUNCH_CHECKLIST item is ticked with evidence (command output, screenshot), including a before/after DNS comparison proving the email records are unchanged.

## Key files
`docs/ROADMAP.md` · `docs/CLIENT_QUESTIONS.md` · `docs/FEEDBACK.md` · `docs/DEPLOYMENT.md` · `docs/seo/SEO_GEO_STRATEGY.md` · `docs/seo/REDIRECT_MAP.md` · `docs/seo/LAUNCH_CHECKLIST.md` · `HANDOVER.md`
