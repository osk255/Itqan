import { images, type ImageKey } from "@/lib/images.generated";

type Props = Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet" | "width" | "height"> & {
  image: ImageKey;
  alt: string;
  /** Rendered width of the image slot, e.g. "(max-width: 900px) 90vw, 45vw". */
  sizes: string;
  /** Above-the-fold images load eagerly with high priority; everything else is lazy. */
  priority?: boolean;
};

/** Responsive WebP image from the pre-optimised set (scripts/optimize-images.mjs). */
export function Picture({ image, alt, sizes, priority = false, ...rest }: Props) {
  const entry = images[image];
  const fallback = entry.variants[entry.variants.length > 1 ? 1 : 0] ?? entry.variants[0];
  return (
    <img
      src={fallback?.src}
      srcSet={entry.variants.map((v) => `${v.src} ${v.width}w`).join(", ")}
      sizes={sizes}
      width={entry.width}
      height={entry.height}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      {...rest}
    />
  );
}
