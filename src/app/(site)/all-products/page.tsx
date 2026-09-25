import { categories, products } from "@/lib/catalogue";
import { routes } from "@/lib/site";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/ui/JsonLd";
import { ProductsBrowser } from "@/components/products/ProductsBrowser";
import { ProductsCta } from "@/components/products/ProductsCta";

export const metadata = pageMetadata({
  title: "Products — Itqan Pharmaceutical Industries",
  description: `The Itqan Pharma product portfolio: ${products.length} products across ${categories.length} therapeutic categories.`,
  path: routes.products,
});

export default function AllProductsPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Products", path: routes.products }])} />
      <ProductsBrowser categories={categories} initial="all" />
      <ProductsCta />
    </>
  );
}
