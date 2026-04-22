import Link from "next/link";
import { notFound } from "next/navigation";
import Script from "next/script";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ProductGallery } from "@/components/features/ProductGallery";

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

interface CategoryRow {
  name: string;
  slug: string;
  parent_id: string | null;
}

const normalizeCategory = (cat: unknown): CategoryRow | null => {
  const parse = (o: object): CategoryRow | null => {
    if (!("name" in o) || !("slug" in o)) return null;
    const pid = (o as { parent_id?: unknown }).parent_id;
    return {
      name: String((o as { name: unknown }).name),
      slug: String((o as { slug: unknown }).slug),
      parent_id: pid == null ? null : String(pid),
    };
  };
  if (cat == null) return null;
  if (Array.isArray(cat)) return cat[0] && typeof cat[0] === "object" ? parse(cat[0] as object) : null;
  if (typeof cat === "object") return parse(cat as object);
  return null;
};

const buildGalleryUrls = (
  thumbnailUrl: string | null,
  rows: Array<{ id: string; url: string; sort_order: number }> | null,
): string[] => {
  const ordered = [...(rows ?? [])].sort((a, b) => a.sort_order - b.sort_order);
  const seen = new Set<string>();
  const urls: string[] = [];
  const push = (u: string | null | undefined) => {
    const s = u?.trim();
    if (!s || seen.has(s)) return;
    seen.add(s);
    urls.push(s);
  };
  push(thumbnailUrl);
  for (const row of ordered) push(row.url);
  return urls;
};

const crumbLinkClass =
  "text-muted-foreground underline-offset-2 transition hover:text-foreground hover:underline";

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("azen_products")
    .select(
      `id, name, description, content, thumbnail_url,
       category:azen_categories(name, slug, parent_id),
       images:azen_product_images(id, url, sort_order)`,
    )
    .eq("id", id)
    .eq("is_published", true)
    .maybeSingle();

  if (error || !data) notFound();

  const category = normalizeCategory(data.category);

  let parentCategory: { name: string; slug: string } | null = null;
  if (category?.parent_id) {
    const { data: parentRow } = await supabase
      .from("azen_categories")
      .select("name, slug")
      .eq("id", category.parent_id)
      .maybeSingle();
    if (parentRow && typeof parentRow.name === "string" && typeof parentRow.slug === "string") {
      parentCategory = { name: parentRow.name, slug: parentRow.slug };
    }
  }

  const galleryUrls = buildGalleryUrls(
    (data.thumbnail_url ?? null) as string | null,
    (data.images ?? null) as Array<{ id: string; url: string; sort_order: number }> | null,
  );

  const name = data.name as string;
  const description = (data.description ?? null) as string | null;
  const contentHtml = (data.content ?? null) as string | null;

  return (
    <main className="w-full overflow-x-hidden">
      {/* 1. 타이틀 바 */}
      <div className="mx-auto w-full max-w-7xl px-8 pt-8 pb-2">
        <div className="flex items-center gap-3">
          <button
            type="button"
            data-product-history-back
            aria-label="이전 페이지로"
            className="inline-flex shrink-0 items-center justify-center rounded-lg border border-border bg-background p-2 text-foreground transition hover:bg-muted"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden />
          </button>
          <h1 className="min-w-0 flex-1 truncate text-2xl font-bold text-foreground">{name}</h1>
        </div>
      </div>

      {/* 2. 브레드크럼 */}
      <div className="mx-auto w-full max-w-7xl px-8 pb-8">
        <nav aria-label="breadcrumb" className="ml-10 text-sm text-muted-foreground">
          {category ? (
            <span className="flex flex-wrap items-center gap-x-1 gap-y-1">
              {parentCategory ? (
                <>
                  <Link
                    href={`/products?category=${encodeURIComponent(parentCategory.slug)}`}
                    className={crumbLinkClass}
                  >
                    {parentCategory.name}
                  </Link>
                  <span className="px-0.5 text-muted-foreground/60" aria-hidden>&gt;</span>
                  <Link
                    href={`/products?category=${encodeURIComponent(category.slug)}`}
                    className={crumbLinkClass}
                  >
                    {category.name}
                  </Link>
                  <span className="px-0.5 text-muted-foreground/60" aria-hidden>&gt;</span>
                </>
              ) : (
                <>
                  <Link
                    href={`/products?category=${encodeURIComponent(category.slug)}`}
                    className={crumbLinkClass}
                  >
                    {category.name}
                  </Link>
                  <span className="px-0.5 text-muted-foreground/60" aria-hidden>&gt;</span>
                </>
              )}
              <span className="font-medium text-foreground">{name}</span>
            </span>
          ) : (
            <span className="font-medium text-foreground">{name}</span>
          )}
        </nav>
      </div>

      {/* 3. 좌우 분할 */}
      <div className="mx-auto w-full max-w-7xl px-8 pb-16">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
          <ProductGallery urls={galleryUrls} productName={name} />

          <div className="flex min-w-0 flex-col">
            {category ? <p className="text-sm text-primary">{category.name}</p> : null}
            <h2 className="mt-1 text-2xl font-bold text-foreground">{name}</h2>
            {description ? (
              <p className="mt-2 text-muted-foreground">{description}</p>
            ) : null}
            <hr className="my-6 border-border" />
            <p className="text-sm text-muted-foreground">스펙 정보 준비 중</p>
          </div>
        </div>
      </div>

      {/* 4. 하단 상세설명 */}
      {contentHtml ? (
        <div className="mx-auto w-full max-w-7xl px-8 pt-12 pb-16">
          <hr className="mb-8 border-border" />
          <h2 className="mb-4 text-lg font-bold text-foreground">제품 상세</h2>
          <div
            className="max-w-full text-sm leading-relaxed text-foreground md:text-base [&_a]:text-primary [&_img]:h-auto [&_img]:max-w-full [&_p]:mb-3 [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-5"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        </div>
      ) : null}

      <Script id="product-detail-history-back" strategy="afterInteractive">
        {`(function(){document.querySelectorAll("[data-product-history-back]").forEach(function(b){if(b.dataset.bound)return;b.dataset.bound="1";b.addEventListener("click",function(){history.back();});});})();`}
      </Script>
    </main>
  );
}
