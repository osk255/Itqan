// Site-wide constants: canonical origin, routes and verified company contacts.
// Routes keep the live itqanpharma.com URLs (ADR-005).

/**
 * Origin used for canonical URLs, Open Graph and the sitemap. On Netlify, `URL`
 * is the site's primary address: the *.netlify.app preview today, and
 * https://itqanpharma.com automatically once that domain is made primary.
 * `SITE_URL` overrides both.
 */
export const SITE_URL = (process.env.SITE_URL ?? process.env.URL ?? "https://itqanpharma.com").replace(/\/$/, "");

export const routes = {
  home: "/",
  about: "/about-us/",
  products: "/all-products/",
  category: (slug: string) => `/product-category/${slug}/`,
  product: (slug: string) => `/products/${slug}/`,
  cooperation: "/business-cooperation/",
  contact: "/contact-us/",
  contactCooperation: "/contact-us/?type=cooperation",
  contactProduct: (name?: string) => `/contact-us/?type=product${name ? `&product=${encodeURIComponent(name)}` : ""}`,
  brand: "/brand/",
} as const;

export const primaryNav = [
  { label: "Home", href: routes.home },
  { label: "About Us", href: routes.about },
  { label: "Products", href: routes.products },
  { label: "Business Cooperation", href: routes.cooperation },
  { label: "Contact Us", href: routes.contact },
] as const;

export const company = {
  legalName: "Itqan Pharmaceutical Industries",
  shortName: "Itqan Pharmaceutical Ind.",
  brandName: "Itqan Pharma",
  locality: "Amman",
  country: "Jordan",
  countryCode: "JO",
  locationLabel: "Itqan Pharmaceutical Ind. Amman, Jordan",
  phone: "+962 6 402 6371",
  phoneHref: "tel:+96264026371",
  email: "info@itqanpharma.com",
  emailHref: "mailto:info@itqanpharma.com",
  maps: "https://maps.app.goo.gl/tRABmUWKA13cP5Dp8",
  facebook: "https://www.facebook.com/share/1JjBmg6u4K/?mibextid=LQQJ4d",
  linkedin: "https://www.linkedin.com/company/itqan-pharmaceutical-industries/",
  foundingMarketYear: "2019",
} as const;

export const absoluteUrl = (path: string) => `${SITE_URL}${path}`;
