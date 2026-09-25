"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

/** Records a product_view event once per page view (lib/analytics.ts). Renders nothing. */
export function TrackProductView({ product, category }: { product: string; category: string }) {
  useEffect(() => track("product_view", { product, category }), [product, category]);
  return null;
}
