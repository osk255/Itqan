# Handoff: Itqan Pharmaceutical Industries — corporate website

## Overview
A full redesign of itqanpharma.com. It has six public pages plus a brand sheet, dark and light themes, a mobile-first layout, and a 3D logo on the home hero that is driven by scroll. The site presents the company, its 27-product portfolio across 8 therapeutic categories, its manufacturing capabilities and regulatory approvals, and three business routes: contract manufacturing, partnership and product information.

## About the Design Files
The files in `site/` are **design references built in HTML**. They are working prototypes of the intended look, copy and behaviour. The task is to **recreate them in a production stack**. Two options:

- **Recommended:** add them to the existing Next.js 16 + Tailwind v4 + Motion project (`itqan-pharma/`, which already has the routes, `lib/products.ts` and `public/images`).
- **Or:** ship `site/` as-is to Netlify as a static preview. It runs without a build step (see "Netlify" below).

Do not copy the `.dc.html` inline styles into React by hand. Use the tokens and component specs below.

## Fidelity
**High-fidelity.** Colours, type, spacing, radii, motion timings and copy are final. Recreate them pixel-for-pixel.

**All copy comes from itqanpharma.com.** Nothing is invented. Keep it verbatim.

---

## Routes

| Page | Spec file | Next.js route (keep live URLs for SEO) |
|---|---|---|
| Home | `site/home/Home.dc.html` | `/` |
| About Us | `site/about/About.dc.html` | `/about-us` |
| Products | `site/products/Products.dc.html` (`?c=<slug>`) | `/all-products`, `/product-category/[category]` |
| Product | `site/products/Product.dc.html` (`?p=<slug>`) | **new** `/products/[slug]` (use `generateStaticParams`) |
| Business Cooperation | `site/business-cooperation/Cooperation.dc.html` | `/business-cooperation` |
| Contact Us | `site/contact/Contact.dc.html` (`?type=cooperation\|product&product=<name>`) | `/contact-us` |
| Brand sheet (internal) | `site/brand/Brand.dc.html`, `site/brand/Logo3D.html` | `/brand` (noindex) |
| Mobile board | `site/Mobile Preview.dc.html` | not shipped: six live pages in 390×844 frames for QA |

---

## Design Tokens

### Colour (CSS variables on `<html>`, dark by default)

| Token | Dark | Light | Use |
|---|---|---|---|
| `--bg` | `#0e0a12` | `#f6f3ee` | page ground |
| `--bg-2` | `#161019` | `#ece7df` | secondary ground |
| `--fg` | `#f3efe8` | `#1a1020` | text |
| `--mute` | `#a9a0b2` | `#5d5468` | secondary text |
| `--line` | `rgba(243,239,232,.14)` | `rgba(26,16,32,.13)` | hairlines, borders |
| `--chip` | `rgba(243,239,232,.06)` | `rgba(26,16,32,.05)` | hover / subtle fills |
| `--accent` | `#f3efe8` | `#52276f` | primary button fill |
| `--on-accent` | `#0e0a12` | `#ffffff` | primary button text |
| `--hi` | `#cfe07a` | `#52276f` | highlighted word ("perfection."), strengths |
| `--label` | `#5cc3ec` | `#0d6c93` | section labels |
| `--scroll` | `#6b3a90` | `#52276f` | scrollbar thumb |
| `--panel` | `#f3efe8` | `#140d19` | inverted panels (portfolio, cooperation) |
| `--on-panel` | `#1a1020` | `#f3efe8` | text on panel |
| `--panel-mute` | `#5f566a` | `#a9a0b2` | secondary text on panel |
| `--panel-line` | `rgba(26,16,32,.14)` | `rgba(243,239,232,.14)` | borders on panel |
| `--glow` | `rgba(123,69,163,.32)` | `rgba(82,39,111,.14)` | radial glow behind heroes |

Brand constants (from the logo): **plum `#52276f`**, **lime `#bcd155`**, **sky `#1ea9e0`**, ink `#0e0a12`, bone `#f3efe8`.

- The "Why Itqan" section is always plum `#52276f` with bone text.
- Focus ring: 2px `#1ea9e0`, offset 3px.
- Selection: lime background, ink text.

### Typography
- **Host Grotesk**, weights 400/500/600 (Google Fonts, or `next/font/google`). One family is used for everything.
- **Display (h1):** `clamp(40px,5.6vw,92px)`/0.95, weight 600, tracking −0.026em. The home hero h1 is `clamp(42px,6.2vw,104px)`.
- **Section h2:** `clamp(36px,4.6vw,76px)`/0.98, weight 600, tracking −0.024em.
- **Big statement:**
  - "Who we are": `clamp(32px,4.6vw,76px)`/1.06, weight 600.
  - "30+": `clamp(110px,16vw,240px)`/0.8.
- **Card title:** 19px/1.15, weight 600.
- **Lists:**
  - Reasons: `clamp(21px,2.2vw,32px)`, weight 600.
  - Dosage forms: `clamp(19px,1.6vw,23px)`, weight 600.
- **Body:** `clamp(17px,1.35vw,20px)`/1.55, weight 400, colour `--mute`. Small text is 13–15px.
- **Section label:** 14px, weight 600, colour `--label`, preceded by an 18×2px dash in `currentColor`.

### Spacing / layout
- Container: `max-width:1560px`, side padding `clamp(20px,4vw,56px)`.
- Section vertical padding: `clamp(64px,8vw,120px)`. The larger sections use `clamp(80px,10vw,150px)`.
- Grids use `repeat(auto-fit,minmax(min(100%,440px),1fr))`, so they collapse to one column below about 900px.
- Header height is 76px and sticky.

### Radius
- Pills and buttons: 999px.
- Cards and form fields: 14–16px.
- Large panels and images: `clamp(18px,2vw,28px)`.
- Product cards: 16px.

### Shadow
- Only on product-card hover: `0 30px 60px -28px rgba(82,39,111,.5)`.

### Scrollbar
- **Firefox:** `scrollbar-width:thin; scrollbar-color:var(--scroll) var(--bg)`.
- **WebKit:** 10px wide; track `--bg`; thumb `--scroll` with radius 999px and a 2px `--bg` border; thumb turns sky on hover.
- Horizontal scrollers (tabs, filters, mobile carousels) hide their scrollbar.

---

## Themes
- `data-theme="dark|light"` goes on `<html>`. It is read from `localStorage["itqan-theme"]` by an **inline script in `<head>` before paint**, so there is no flash on load.
- The header toggle is a pill labelled "Light" or "Dark" with a 12px ring dot; the dot is filled in light mode. Clicking it:
  1. flips the attribute,
  2. saves it to localStorage,
  3. dispatches `window` event `itqan-theme`.
- The 3D logo listens for that event and recolours its plum voxels: bone on dark, plum on light.
- Logo swap: `[data-logo=dark]` shows `logo-reversed.png` and `[data-logo=light]` shows `logo.png`. CSS hides whichever doesn't match.
- `body` transitions `background-color` and `color` over 0.5s.

## Mobile (breakpoint 1099px; "narrow" = width < 1100 or portrait)
- **Header:** logo, theme pill and a **Menu** pill (ink on bone). The desktop nav and the "Become a Partner" button are hidden.
- **Menu:** full-screen `position:fixed; top:76px; height:calc(100dvh - 76px)` over `--bg`.
  - Five 32px links, numbered 01–05, then the "Become a Partner" pill, then phone and email at the bottom.
  - Links stagger in (+60ms each). The page behind is locked (`html{overflow:hidden}`). **Esc** closes the menu.
  - **Important:** the header must NOT have `backdrop-filter` while the menu is open. That traps `position:fixed` children. The prototype blurs the header only when it is scrolled *and* the menu is closed.
- **Home hero:** the text sits at the top and the 3D logo in the lower 30% of the stage. The scene is **175svh** tall on mobile and **190vh** on desktop.
- **Portfolio:**
  - Category tabs become a single horizontal scroll row (no wrap).
  - Products become a snap carousel with `grid-auto-columns:min(72%,300px)` and `scroll-snap-type:x mandatory`.
- **Products page:** the filter bar stays sticky under the header (`top:76px`) and scrolls horizontally.
- **Touch targets:** at least 44px everywhere (tested). Buttons are at least 48px high, CTAs 56px.
- **Inputs:** 16px font size so iOS doesn't zoom on focus.

## Components

### Header
- Sticky with `z-index:50`.
- Transparent at the top. After 24px of scroll: background `color-mix(in srgb,var(--bg) 84%,transparent)`, `blur(14px)`, and a 1px `--line` bottom border.
- Nav links: 15px weight 500, padding 10×14px, pill-shaped. Active and hover use `--chip`.

### PillButton
- **Accent:** 56px high, min-width `min(220px,100%)`, padding `0 8px 0 24px`, fill `--accent`, 15px weight 600. A 40px circle on the right in `--on-accent` holds a "→".
  - Hover: `translateY(-2px)` plus `brightness(1.08)`.
- **Ghost:** 1px `--line` border with a "↗". Hover fills `--chip` and the border becomes `--fg`.

### ProductCard
- White `#fff` card, radius 16px.
- Image area is a 1:1 box with 9% padding, `object-fit:contain` and `mix-blend-mode:multiply`, so the white packaging backgrounds disappear.
- Below the image: name at 19px weight 600, then strengths at 13px in `#5d5468`.
- Hover: lifts 6px and gains the plum shadow.
- Links to `/products/[slug]`.

### CategoryTabs
- Pills with a 1px `--panel-line` border.
- Active pill is filled `--on-panel` with `--panel` text.
- Each pill shows the category's full name plus its count at 12px and 70% opacity.

### FactsMarquee
- A full-width strip with 1px lines above and below.
- Content, verbatim:
  - 2019 · First product in the Jordanian market
  - 30+ · Years of experience in this field
  - 27 · Products
  - 8 · Therapeutic categories
  - 7 · Dosage forms
  - Swiss medic · EU · Registration in process
- It loops with a WAAPI `translateX(-50%)`; duration is `width × 26ms`. The duplicate half is `aria-hidden`.

### ReasonsList
The seven reasons are numbered 01–07, each row separated by a hairline. On hover the row indents 12px.

### DosageFormGrid
- Seven tiles, min-height 160px, radius 14px.
- Each tile has a 1px `--line` border and `--chip` fill.
- Hover fills the tile `--accent`, sets text to `--on-accent`, and lifts it 4px.

### MarketPills
- Pills 56px high.
- Approved markets get a lime dot, the GCC central approval a sky dot.
- "In registration" pills (Swiss medic, European Union) have a dashed border and muted text.

### VisionMissionValues
Three columns that wrap on small screens. Each has a hairline on top, a `--label` heading and a 21–27px statement.

### Footer
- Four columns, mirroring the live site: About (text, Facebook, LinkedIn), Links, Categories (8), Contacts.
- Below the columns, the full-width logo (maximum 1100px wide).
- A final bar with "©2026 Itqan Pharmaceutical Ind. All rights reserved" on the left and a link to the brand sheet on the right.

### Contact form
Enquiry type is a set of three pills: General Inquiry, Business Cooperation, Product Information. The Product field only appears for Product Information.

| Field | Required |
|---|---|
| Name | yes |
| Company | no |
| Email | yes |
| Phone | no |
| Product (Product Information only) | no |
| Message | yes |

- **Styling:** inputs are 54px high, radius 14px, `--chip` fill, 1px `--line` border that turns `--fg` on focus.
- **Validation messages:**
  - "Please enter your name."
  - "Please enter your email." / "Please enter a valid email address."
  - "Please enter a message."
- Invalid fields get `aria-invalid`, errors are announced with `role="alert"`, and focus moves to the first invalid field.
- **Submit:** today it builds a `mailto:info@itqanpharma.com` with the subject `<type> — <product> — <name>`. **In production, replace this with Netlify Forms** (see below).
- **Prefill from the URL:** `?type=cooperation` or `?type=product&product=Etoria` selects the type and fills the product field.

---

## Interactions & Motion
All motion uses the Web Animations API. The easing is `cubic-bezier(.16,1,.3,1)` unless stated otherwise. **Under `prefers-reduced-motion: reduce`, turn off every item below**: the 3D logo renders assembled and static, and the marquee stops.

| Effect | Spec |
|---|---|
| Headline lines | Each line is clipped; the inner span rises from `translateY(105%)` to 0 over 1150ms, with 110ms stagger and a 150ms delay. |
| Reveal (`data-reveal="up"`) | opacity 0→1 and translateY 22px→0 over 900ms, triggered by IntersectionObserver with rootMargin `0 0 -8% 0`. `data-delay` gives the delay in ms. |
| Mask reveal (`data-reveal="mask"`) | `clip-path: inset(100% 0 0 0 round 24px)` → `inset(0 round 24px)` over 1300ms. |
| Word-by-word read | Each word's opacity goes from 0.18 to 1 as the block scrolls from 85% of the viewport height upward. |
| Parallax (`data-parallax=f`) | `translateY((elCentre − viewportCentre) × f)`, with f between −0.15 and 0.18. |
| Category switch | Cards restagger: opacity 0 → 1 with `translateY(36px) scale(.97)` → none, 750ms, 60ms stagger. |
| Page transition | Internal link click: body fades to 0 in 200ms (ease-in), then navigates. The new page fades in over 500ms. Cancelled on `pageshow` (bfcache). Skipped for new-tab, modifier-key and hash links. |
| Mobile menu | Items rise 24px → 0 over 520ms, starting 40ms after open with +60ms stagger. |

### 3D logo (`site/shared/itqan-logo3d.js`, `site/shared/logo-voxels.js`)
- **Sampling:** `logo.png` is sampled into voxels. Width is 150 columns on desktop and 110 on phones (`innerWidth < 700`).
  - Each cell is filled when at least 18% of its 4×4 subsamples are opaque, so the thin "Fueling wellness" tagline survives.
  - Each cell snaps to the nearest of lime, plum or sky.
- **Rendering:** a single `THREE.InstancedMesh` (three@0.184.0 from unpkg). Each voxel is a box of s·0.86 × s·0.86 × s·2.6.
  - Lights: hemisphere, a key light, and sky and lime rim lights.
  - Pixel ratio is capped at 1.5 on touch devices and 1.75 elsewhere. Antialiasing is off on touch.
  - Rendering pauses when the logo is off-screen.
- **Intro:** voxels fly in from a scattered sphere, ordered by x position plus some randomness, each settling over about 1.05s.
- **Scroll scene:** progress `p` runs 0 → 1 across the sticky 100svh stage inside `[data-scene]`.

| p | Behaviour |
|---|---|
| 0 | Logo sits right of the text on desktop (x = +23% of visible width) or below it on mobile (y = −27%). It is rotated −0.3 rad on Y and follows the pointer. |
| 0.04–0.26 | Hero text fades out and drifts up. |
| 0.04–0.55 | Logo moves to the centre, scales up to fill 74% of the width, turns once around Y, and voxels spread in depth (sin curve). |
| 0.50–0.72 | Caption fades in: "The name fits the meaning." with "Since 2019 · Amman, Jordan". |

- **Mounting:** the prototype attaches the canvas in a shadow root and mounts the element imperatively into a ref'd div so re-renders can't remove it. In React:
  - use a `'use client'` component with `useEffect`,
  - load it with `dynamic(() => import(...), { ssr:false })`,
  - keep the canvas outside React-managed children.
- **Download:** `site/brand/Logo3D.html` exports the same model (one mesh per colour) as GLB or OBJ.

## State
Per page:
- `theme`: `"dark" | "light"`, persisted in localStorage.
- `mobile`: from `matchMedia("(max-width:1099px)")`.
- `menu`: boolean.
- `scrolled`: `scrollY > 24`.

Home: `cat` (index of the active category, defaults to 5, Health & Wellness).
Products: `filter` (category slug or `all`, kept in sync with `?c=`).
Product: `slug` (from the URL).
Contact: `type` (0/1/2), `err` (per-field messages), `sent`.

## Data
`site/shared/catalogue.js` is the single source of content:
- 8 categories: `slug`, `title`, `full`, `items`
- 27 products: `name`, `slug`, `strengths`, `image`, `category`, `categorySlug`
- the 7 dosage forms
- the 7 reasons
- markets: national, central (GCC), inProgress (Swiss medic, EU)
- the company's contacts

It replaces `src/lib/products.ts`. Fields that are unknown are `null`: `activeIngredient`, `dosageForm`, `approvedInfo`, `documents`.

**Render a row only when its value exists. Never invent values.**

Still needed from the client:
- production capacity per dosage form
- active ingredient and dosage form for each product
- leaflets / SmPC
- units for Ales "5" and Pymol "500"
- working hours
- GMP certificates

## Assets

| Path | What it is |
|---|---|
| `site/assets/brand/logo.png` | Official logo, 2004×1468, transparent |
| `site/assets/brand/logo-reversed.png` | Logo with the plum lettering turned bone, for dark grounds (generated from the official file) |
| `site/assets/facility/building-2.jpg`, `building.jpg`, `cleanroom.png` | Facility photography, from the existing project |
| `site/assets/products/*` | 27 packaging images, from the existing project and the live site |

## SEO / accessibility (built into the spec)
- One `<h1>` per page; breadcrumbs on the inner pages.
- `<title>`, meta description and Open Graph tags on every page.
- A skip link.
- `aria-current` on the active nav item.
- `role=tablist` / `tab` / `aria-selected` on the home category tabs, and `aria-pressed` on the product filters.
- Descriptive alt text on every image.
- Each `aria-hidden` duplicate in the marquee.
- Split words in the "Who we are" block keep their text as an `aria-label` on the parent.
- **Add in production:**
  - JSON-LD: `Organization`, plus `Product` on product pages
  - a sitemap
  - canonical URLs

---

## Netlify

### A. Static preview (no build)
1. Drag the `site/` folder into Netlify (Sites → "Deploy manually"), or push it to a repo with publish directory `.`.
2. `site/netlify.toml` already sets:
   - rewrites for `/`, `/about`, `/products`, `/business-cooperation`, `/contact` and `/brand`
   - immutable cache headers on `/assets/*`
   - security headers
3. Keep `support.js` next to every `.dc.html` (one sits in each folder). It is the runtime those pages need.

### B. Production (Next.js on Netlify)
- **Build settings:** build command `npm run build`. The Next.js runtime is auto-detected (`@netlify/plugin-nextjs`), so no publish directory needs to be set.
- **Forms:** use Netlify Forms.
  1. Add a hidden static form `<form name="enquiry" data-netlify="true" netlify-honeypot="bot-field" hidden>` containing every field name, so Netlify detects it at build time.
  2. From the client form, `fetch("/", {method:"POST", body:new URLSearchParams(formData)})` with `form-name=enquiry`.
  3. Show the existing "Thank you." state on success.
- **Environment:** none required.
- **Redirects:** if any URL changes from the live site, add 301s in `netlify.toml`.

## Suggested prompt for Claude Code / Codex
> Read `design_handoff_itqan_website/README.md` fully. In the `itqan-pharma` Next.js project, replace the current design with this spec: add the theme tokens to `globals.css` (`@theme` plus `[data-theme=light]` overrides), swap fonts to Host Grotesk via next/font, rebuild the Header/MobileMenu/Footer and the sections per "Components", port `site/shared/catalogue.js` into `src/lib/catalogue.ts`, add `/products/[slug]`, wrap `itqan-logo3d.js` in a client-only component for the home hero scroll scene, implement motion with `motion/react` per the table, wire the contact form to Netlify Forms, and verify at 390px, 768px and 1440px in both themes. Use only the copy in the spec files.

## Files

```
design_handoff_itqan_website/
  README.md                 ← this file
  site/                     ← runnable HTML reference (open any .dc.html, or deploy as-is)
    index.html  netlify.toml  support.js  Mobile Preview.dc.html
    home/ about/ products/ business-cooperation/ contact/ brand/   (each with support.js)
    shared/catalogue.js  shared/itqan-logo3d.js  shared/logo-voxels.js
    assets/brand  assets/facility  assets/products
```
