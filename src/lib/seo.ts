import type { Metadata } from "next";
import { SITE_URL, absoluteUrl, company, routes } from "./site";

const OG_IMAGE = { url: "/og.png", width: 1200, height: 630, alt: "Itqan Pharma — Fueling wellness" };

type PageMeta = {
  title: string;
  description: string;
  path: string;
  /** Internal pages (e.g. the brand sheet) are excluded from search. */
  noindex?: boolean;
  /** Absolute or root-relative image for social previews; defaults to the logo card. */
  image?: { url: string; width: number; height: number; alt: string };
};

/** Unique title, description, canonical and social tags for one page. */
export function pageMetadata({ title, description, path, noindex, image = OG_IMAGE }: PageMeta): Metadata {
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: company.legalName,
      locale: "en",
      url: path,
      title,
      description,
      images: [image],
    },
    twitter: { card: "summary_large_image", title, description, images: [image.url] },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
  };
}

type Crumb = { name: string; path: string };

/** JSON-LD for the whole organisation. Every value is verified (docs/seo/ENTITY_MAP.md). */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: company.legalName,
    alternateName: [company.brandName, company.shortName],
    url: `${SITE_URL}/`,
    logo: absoluteUrl("/assets/brand/logo.png"),
    email: company.email,
    telephone: company.phone,
    address: { "@type": "PostalAddress", addressLocality: company.locality, addressCountry: company.countryCode },
    sameAs: [company.facebook, company.linkedin],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: company.legalName,
    url: `${SITE_URL}/`,
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "en",
  };
}

export function breadcrumbJsonLd(trail: Crumb[]) {
  const items = [{ name: "Home", path: routes.home }, ...trail];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: absoluteUrl(c.path) })),
  };
}
