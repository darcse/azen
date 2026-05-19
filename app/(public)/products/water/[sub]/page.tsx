import Link from "next/link";
import { notFound } from "next/navigation";
import { unstable_cache } from "next/cache";
import { ClipboardList } from "lucide-react";
import { createStaticClient } from "@/lib/supabase/static";
import { WaterSubBackButton } from "@/components/features/WaterSubBackButton";
import {
  CATALOG_SUB_LABEL_FALLBACK,
  WATER_SUB_CARDS,
  resolveWaterSubSlug,
} from "@/lib/products-catalog";

interface WaterSubPageProps {
  params: Promise<{ sub: string }>;
}

const getWaterSubProducts = (categorySlug: string) =>
  unstable_cache(
    async () => {
      const supabase = createStaticClient();

      const { data: category, error: categoryError } = await supabase
        .from("azen_categories")
        .select("id")
        .eq("slug", categorySlug)
        .maybeSingle();

      if (categoryError) {
        return { products: [] as Array<{ id: string; name: string; description: string | null; thumbnail_url: string | null }>, categoryError, productsError: null as { message: string } | null };
      }

      if (!category) {
        return { products: [], categoryError: null, productsError: null };
      }

      const { data: products, error: productsError } = await supabase
        .from("azen_products")
        .select("id, name, description, thumbnail_url")
        .eq("is_published", true)
        .eq("category_id", category.id)
        .order("created_at", { ascending: true });

      return { products: products ?? [], categoryError: null, productsError };
    },
    ["water-sub-products", categorySlug],
    { revalidate: 60 },
  )();

export default async function WaterSubProductsPage({ params }: WaterSubPageProps) {
  const { sub } = await params;
  const categorySlug = resolveWaterSubSlug(sub);

  if (!categorySlug) {
    notFound();
  }

  const card = WATER_SUB_CARDS.find((item) => item.slug === categorySlug);
  const title = card?.label ?? CATALOG_SUB_LABEL_FALLBACK[categorySlug] ?? categorySlug;

  const { products, categoryError, productsError } = await getWaterSubProducts(categorySlug);

  if (categoryError) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-red-500">
        카테고리 정보를 불러오지 못했습니다.
      </div>
    );
  }

  if (productsError) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-red-500">
        제품을 불러오지 못했습니다: {productsError.message}
      </div>
    );
  }

  const productRows = products;

  return (
    <main className="bg-background text-foreground">
      <section
        className="relative w-full overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: "url('/filter-bg.webp')", minHeight: "300px" }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 flex min-h-[300px] items-end">
          <div className="mx-auto w-full max-w-7xl px-8 py-12">
            <h1 className="text-3xl font-bold text-white md:text-4xl">{title}</h1>
            <p className="mt-2 text-sm leading-relaxed text-white/80 md:text-base">수처리 필터 제품 목록</p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-8 py-8">
        <WaterSubBackButton />
      </div>

      <section className="mx-auto max-w-7xl px-8 py-12">
        {productRows.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-elevated px-6 py-16 text-center">
            <ClipboardList className="h-10 w-10 text-muted-foreground" aria-hidden />
            <p className="font-medium text-foreground">등록된 제품이 없습니다.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {productRows.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}?category=filter`}
                className="flex flex-col gap-6 py-8 transition-colors hover:bg-muted/30 lg:flex-row lg:items-center"
              >
                <div className="h-48 w-full shrink-0 overflow-hidden rounded-xl bg-muted lg:w-64">
                  {product.thumbnail_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.thumbnail_url}
                      alt={product.name}
                      className="h-48 w-full object-cover lg:w-64"
                    />
                  ) : (
                    <div className="flex h-48 w-full items-center justify-center text-sm text-muted-foreground lg:w-64">
                      이미지 없음
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-xl font-bold text-foreground">{product.name}</h2>
                  {product.description ? (
                    <p className="mt-2 text-muted-foreground">{product.description}</p>
                  ) : null}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
