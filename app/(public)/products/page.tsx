import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  CATALOG_SUB_LABEL_FALLBACK,
  ELECTRIC_SUB_SLUGS,
  FILTER_SUB_SLUGS,
  catalogCategoryIdsForGroup,
  isValidCatalogCategoryParam,
  resolveCatalogGroup,
  type ProductCatalogGroup,
} from "@/lib/products-catalog";
import { ProductsCatalogClient, type CatalogProduct } from "@/components/features/ProductsCatalogClient";

interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
}

interface ProductsPageProps {
  searchParams: Promise<{ category?: string }>;
}

const chipOrder = (group: ProductCatalogGroup) =>
  group === "filter" ? [...FILTER_SUB_SLUGS] : [...ELECTRIC_SUB_SLUGS];

const normalizeCategoryEmbed = (cat: unknown): { name: string; slug: string } | null => {
  const pick = (o: object) => {
    if (!("name" in o) || !("slug" in o)) return null;
    return {
      name: String((o as { name: unknown }).name),
      slug: String((o as { slug: unknown }).slug),
    };
  };
  if (cat == null) return null;
  if (Array.isArray(cat)) {
    const first = cat[0];
    if (first && typeof first === "object") return pick(first as object);
    return null;
  }
  if (typeof cat === "object") return pick(cat as object);
  return null;
};

const HERO_IMAGE = {
  filter: "/filter-bg.webp",
  electric: "/elec.webp",
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { category: rawCategory } = await searchParams;
  const slug = rawCategory?.trim() ?? "";

  if (!slug || !isValidCatalogCategoryParam(slug)) {
    redirect("/products?category=filter");
  }

  const group = resolveCatalogGroup(slug);
  const supabase = await createClient();

  const { data: categoryRows, error: catError } = await supabase
    .from("azen_categories")
    .select("id, name, slug, parent_id");

  if (catError) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-red-500">
        카테고리 정보를 불러오지 못했습니다.
      </div>
    );
  }

  const categories = (categoryRows ?? []) as CategoryRow[];
  const categoryIds = catalogCategoryIdsForGroup(categories, group);

  const { data: rawProducts, error: prodError } =
    categoryIds.length > 0
      ? await supabase
          .from("azen_products")
          .select("id, name, description, thumbnail_url, category:azen_categories(name, slug)")
          .eq("is_published", true)
          .in("category_id", categoryIds)
          .order("created_at", { ascending: true })
      : { data: null, error: null };

  if (prodError) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-red-500">
        제품을 불러오지 못했습니다: {prodError.message}
      </div>
    );
  }

  const bySlug = new Map(categories.map((c) => [c.slug, c]));
  const categoryChips = chipOrder(group).map((s) => ({
    slug: s,
    name: bySlug.get(s)?.name ?? CATALOG_SUB_LABEL_FALLBACK[s] ?? s,
  }));

  const products: CatalogProduct[] = (rawProducts ?? []).map((row) => {
    const cat = normalizeCategoryEmbed(row.category);
    return {
      id: row.id as string,
      name: row.name as string,
      description: (row.description ?? null) as string | null,
      thumbnailUrl: (row.thumbnail_url ?? null) as string | null,
      categoryName: cat?.name ?? null,
      categorySlug: cat?.slug ?? "",
    };
  });

  return (
    <>
      <section
        className="relative w-full overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `url('${HERO_IMAGE[group]}')`, minHeight: "300px" }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 flex min-h-[300px] items-end">
          <div className="mx-auto w-full max-w-6xl px-4 py-12">
            <h1 className="font-english text-3xl font-bold text-white md:text-4xl">
              {group === "filter" ? "Filter" : "Electric & Hydraulic"}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-white/80 md:text-base">
              {group === "filter"
                ? "공조·집진·수처리 등 산업용 필터 라인업입니다."
                : "전기 부품·유공압 부품 라인업입니다."}
            </p>
          </div>
        </div>
      </section>

      <ProductsCatalogClient
        products={products}
        group={group}
        urlCategorySlug={slug}
        categoryChips={categoryChips}
      />
    </>
  );
}
