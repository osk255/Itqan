import type { Product } from "@/lib/catalogue";
import { routes } from "@/lib/site";
import { Picture } from "./Picture";

/** Width of the packaging image inside a card, for the browser's srcset choice. */
export const CARD_IMAGE_SIZES = "(max-width: 600px) 40vw, (max-width: 1099px) 30vw, 260px";

/**
 * White packaging card (README › ProductCard). The multiply blend makes the
 * packaging's own white background disappear into the card.
 */
export function ProductCard({ product, sizes = CARD_IMAGE_SIZES }: { product: Product; sizes?: string }) {
  return (
    <li data-pkg="" className="min-w-0 snap-start">
      <a
        href={routes.product(product.slug)}
        className="flex h-full flex-col overflow-hidden rounded-2xl bg-white text-[#1a1020] no-underline [transition:transform_.5s_var(--ease-soft),box-shadow_.5s] hover:text-[#1a1020] hover:shadow-[0_30px_60px_-28px_rgba(82,39,111,.5)] hover:[transform:translateY(-6px)]"
      >
        <span className="block aspect-square p-[9%]">
          <Picture image={product.image} alt={`${product.name} packaging`} sizes={sizes} className="size-full object-contain mix-blend-multiply" />
        </span>
        <span className="flex flex-col gap-1 border-t border-[rgba(26,16,32,.08)] px-[18px] pt-[14px] pb-[18px]">
          <span className="text-[19px] leading-[1.15] font-semibold tracking-[-.01em]">{product.name}</span>
          <span className="min-h-[1.35em] text-[13px] leading-[1.35] text-[#5d5468]">{product.strengths ?? ""}</span>
        </span>
      </a>
    </li>
  );
}
