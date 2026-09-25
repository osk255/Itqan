import type { MetadataRoute } from "next";
import { categories, products } from "@/lib/catalogue";
import { absoluteUrl, routes } from "@/lib/site";

export const dynamic = "force-static";

/** Canonical, indexable URLs only (the brand sheet and 404 are excluded). */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    routes.home,
    routes.about,
    routes.products,
    routes.cooperation,
    routes.contact,
    ...categories.map((c) => routes.category(c.slug)),
    ...products.map((p) => routes.product(p.slug)),
  ];
  return paths.map((path) => ({ url: absoluteUrl(path) }));
}
