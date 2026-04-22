import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProductDetailBackButton } from "@/components/features/ProductDetailBackButton";
import { ProductDetailHtmlContent } from "@/components/features/ProductDetailHtmlContent";
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

/** Header.tsx와 동일: `max-w-6xl` + `px-4` */
const pageContainer = "mx-auto w-full min-w-0 max-w-6xl px-4";

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("azen_products")
    .select(
      `id, name, description, content, spec, thumbnail_url,
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
  const spec = (data.spec ?? null) as string | null;

  return (
    <main className="w-full min-w-0 overflow-x-hidden">
      {/* 1–2. 타이틀 + 브레드크럼 (GNB와 동일 너비·뒤로 버튼 열 제외하고 제품명·브레드크럼 시작선 정렬) */}
      <div className={`${pageContainer} pb-10 pt-12`}>
        <div className="flex flex-col gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <ProductDetailBackButton />
            <h1 className="min-w-0 flex-1 truncate text-2xl font-bold text-foreground">{name}</h1>
          </div>
          <nav
            aria-label="breadcrumb"
            className="min-w-0 pl-[calc(2.5rem+0.75rem)] pt-1 text-sm text-muted-foreground"
          >
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
          <hr className="mt-6 border-border" aria-hidden />
        </div>
      </div>

      {/* 3. 좌우 분할 */}
      <div className={`${pageContainer} pb-16 pt-8`}>
        <div className="grid min-w-0 grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-12">
          <div className="min-w-0 max-w-full">
            <ProductGallery urls={galleryUrls} productName={name} />
          </div>

          <div className="flex min-w-0 max-w-full flex-col break-words">
            {category ? <p className="text-sm text-primary">{category.name}</p> : null}
            <h2 className="mt-1 text-2xl font-bold text-foreground">{name}</h2>
            {description ? (
              <p className="mt-2 text-muted-foreground">{description}</p>
            ) : null}
            {spec ? (
              <>
                <hr className="my-4 border-border" />
                <p className="text-sm font-semibold text-muted-foreground">스펙</p>
                <ProductDetailHtmlContent
                  html={spec}
                  className="prose prose-slate dark:prose-invert mt-2 min-w-0 max-w-none overflow-x-auto break-words text-sm leading-relaxed text-foreground [&_a]:text-primary [&_h3]:mb-2 [&_h3]:mt-4 [&_h3]:text-lg [&_h3]:font-semibold [&_img]:h-auto [&_img]:max-w-full [&_li]:mb-1 [&_ol]:mb-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-2 [&_ul]:mb-2 [&_ul]:list-disc [&_ul]:pl-5"
                />
              </>
            ) : null}
          </div>
        </div>
      </div>

      {/* 4. 하단 상세설명 */}
      {contentHtml ? (
        <div className={`${pageContainer} pb-16 pt-12`}>
          <hr className="mb-8 border-border" />
          <h2 className="mb-4 text-lg font-bold text-foreground">제품 상세</h2>
          <ProductDetailHtmlContent
            html={contentHtml}
            className="prose prose-slate dark:prose-invert min-w-0 max-w-none overflow-x-auto break-words text-sm leading-relaxed text-foreground md:text-base [&_a]:text-primary [&_h3]:mb-2 [&_h3]:mt-4 [&_h3]:text-xl [&_h3]:font-semibold [&_img]:h-auto [&_img]:max-w-full [&_li]:mb-1 [&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-3 [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-5"
          />
        </div>
      ) : null}

    </main>
  );
}
