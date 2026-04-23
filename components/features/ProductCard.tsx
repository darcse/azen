import Image from "next/image";
import Link from "next/link";
import { Image as ImageIcon } from "lucide-react";

export interface ProductCardDisplay {
  id: string;
  name: string;
  description: string | null;
  thumbnailUrl: string | null;
  categoryName: string | null;
}

export const ProductCard = ({ product }: { product: ProductCardDisplay }) => {
  const hasThumb = Boolean(product.thumbnailUrl?.trim());

  return (
    <Link
      href={`/products/${product.id}`}
      className="glass-card group relative block overflow-hidden rounded-2xl border border-border bg-elevated md:transition-all md:duration-300 md:hover:-translate-y-1 md:hover:shadow-[0_20px_50px_rgba(255,255,255,0.08)]"
    >
      <div className="pointer-events-none absolute inset-0 z-[1] bg-black/10 opacity-0 md:transition-opacity md:duration-300 md:group-hover:opacity-100" />
      <div className="relative h-[22rem] w-full overflow-hidden">
        {hasThumb ? (
          <Image
            src={product.thumbnailUrl as string}
            alt={product.name}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover md:transition-transform md:duration-500 md:group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <ImageIcon className="h-10 w-10 text-muted-foreground/40" strokeWidth={1.25} aria-hidden />
          </div>
        )}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 to-transparent"
          aria-hidden
        />
      </div>
      <div className="relative z-[2] p-5">
        {product.categoryName ? (
          <p className="text-sm text-primary">{product.categoryName}</p>
        ) : null}
        <h3 className="mt-1 font-bold text-foreground">{product.name}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
          {product.description ?? "제품 상세 페이지에서 더 많은 정보를 확인할 수 있습니다."}
        </p>
      </div>
    </Link>
  );
};
