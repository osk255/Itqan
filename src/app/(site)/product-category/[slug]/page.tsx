import { notFound } from "next/navigation";
import { categories, getCategory } from "@/lib/catalogue";
import { routes } from "@/lib/site";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/ui/JsonLd";
import { ProductsBrowser } from "@/components/products/ProductsBrowser";
import { ProductsCta } from "@/components/products/ProductsCta";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => categories.map((c) => ({ slug: c.slug }));

export async function generateMetadata({ params }: Params) {
  const c = getCategory((await params).slug);
  if (!c) return {};
  return pageMetadata({
    title: `${c.full} — Products — Itqan Pharmaceutical Industries`,
    description: `${c.full} from Itqan Pharmaceutical Industries, Amman, Jordan: ${c.items.map((p) => p.name).join(", ")}.`,
    path: routes.category(c.slug),
  });
}

export default async function CategoryPage({ params }: Params) {
  const c = getCategory((await params).slug);
  if (!c) notFound();
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Products", path: routes.products },
          { name: c.full, path: routes.category(c.slug) },
        ])}
      />
      <ProductsBrowser categories={categories} initial={c.slug} />
      <ProductsCta />
    </>
  );
}
