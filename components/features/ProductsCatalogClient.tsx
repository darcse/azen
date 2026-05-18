"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  CATALOG_SUB_LABEL_FALLBACK,
  ELECTRIC_SUB_SLUGS,
  FILTER_SUB_SLUGS,
  WATER_SUB_CARDS,
  WATER_SUB_SLUGS,
  type ProductCatalogGroup,
} from "@/lib/products-catalog";
import { ProductCard, type ProductCardDisplay } from "@/components/features/ProductCard";
import { ChevronDown, Package } from "lucide-react";

export interface CatalogProduct extends ProductCardDisplay {
  categorySlug: string;
}

interface CategoryChip {
  slug: string;
  name: string;
}

type WaterProductsBySlug = Record<(typeof WATER_SUB_SLUGS)[number], CatalogProduct[]>;

const EMPTY_WATER_PRODUCTS: WaterProductsBySlug = {
  water_depth: [],
  water_carbon: [],
  water_pleated: [],
};

interface ProductsCatalogClientProps {
  products: CatalogProduct[];
  group: ProductCatalogGroup;
  urlCategorySlug: string;
  categoryChips: CategoryChip[];
  waterProductsBySlug?: WaterProductsBySlug;
}

const FILTER_TABS = FILTER_SUB_SLUGS.map((slug) => ({
  slug,
  label: CATALOG_SUB_LABEL_FALLBACK[slug] ?? slug,
}));

const initialSelectedSub = (urlSlug: string, group: ProductCatalogGroup): "all" | string => {
  const subSlugs: readonly string[] = group === "filter" ? FILTER_SUB_SLUGS : ELECTRIC_SUB_SLUGS;
  return subSlugs.includes(urlSlug) ? urlSlug : "all";
};

export const ProductsCatalogClient = ({
  products,
  group,
  urlCategorySlug,
  categoryChips,
  waterProductsBySlug = EMPTY_WATER_PRODUCTS,
}: ProductsCatalogClientProps) => {
  const [search, setSearch] = useState("");
  const [selectedSub, setSelectedSub] = useState<"all" | string>(() =>
    initialSelectedSub(urlCategorySlug, group),
  );

  useEffect(() => {
    setSelectedSub(initialSelectedSub(urlCategorySlug, group));
  }, [urlCategorySlug, group]);

  const filterTabProducts = useMemo(() => {
    if (group !== "filter" || urlCategorySlug === "water_treatment") return [];
    return products.filter((p) => p.categorySlug === urlCategorySlug);
  }, [products, group, urlCategorySlug]);

  const electricFiltered = useMemo(() => {
    if (group !== "electric") return [];
    const q = search.trim().toLowerCase();
    const groupSubSlugs = new Set<string>(ELECTRIC_SUB_SLUGS);
    return products.filter((p) => {
      if (selectedSub === "all") {
        if (!groupSubSlugs.has(p.categorySlug)) return false;
      } else if (p.categorySlug !== selectedSub) {
        return false;
      }
      if (q && !p.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [products, search, selectedSub, group]);

  const groupLabel = group === "filter" ? "필터" : "전기·유공압";

  if (group === "filter") {
    const isWaterTab = urlCategorySlug === "water_treatment";

    return (
      <>
        <section className="mx-auto w-full max-w-6xl border-b border-border px-4">
          <nav className="flex flex-wrap gap-1 md:gap-4" aria-label="필터 카테고리">
            {FILTER_TABS.map((tab) => {
              const isActive = urlCategorySlug === tab.slug;

              return (
                <Link
                  key={tab.slug}
                  href={`/products?category=${tab.slug}`}
                  aria-current={isActive ? "page" : undefined}
                  className={`border-b-2 px-3 py-4 text-sm font-medium transition-colors md:px-4 md:text-base ${
                    isActive
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </nav>
        </section>

        <section className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
          {isWaterTab ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {WATER_SUB_CARDS.map((card) => {
                const subProducts = waterProductsBySlug[card.slug] ?? [];

                return (
                  <div key={card.slug} className="rounded-2xl bg-muted p-8">
                    <h3 className="text-xl font-bold tracking-wide text-foreground">{card.label}</h3>
                    {subProducts.length > 0 && (
                      <div className="mt-6 flex flex-col">
                        {subProducts.map((product, index) => (
                          <Link
                            key={product.id}
                            href={`/products/${product.id}?category=filter`}
                            className={`flex items-center gap-3 py-3 transition-colors hover:bg-background/50 ${
                              index < subProducts.length - 1 ? "border-b border-border" : ""
                            }`}
                          >
                            {product.thumbnailUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={product.thumbnailUrl}
                                alt={product.name}
                                className="h-12 w-12 shrink-0 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-background text-[10px] text-muted-foreground">
                                없음
                              </div>
                            )}
                            <p className="line-clamp-2 text-sm font-semibold text-foreground">{product.name}</p>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : filterTabProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-elevated px-6 py-16 text-center">
              <Package className="h-10 w-10 text-muted-foreground" aria-hidden />
              <p className="font-medium text-foreground">표시할 제품이 없습니다.</p>
              <p className="max-w-md text-sm text-muted-foreground">다른 카테고리 탭을 선택해 보세요.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filterTabProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </>
    );
  }

  return (
    <>
      <section className="mx-auto w-full max-w-6xl px-4 pt-8 pb-6">
        <div className="flex items-center gap-2 md:flex-wrap md:gap-3">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="제품명을 입력하세요"
            aria-label="제품명 검색"
            className="min-w-0 flex-1 rounded-lg border border-border bg-elevated px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary md:w-64 md:flex-none"
            autoComplete="off"
          />

          <div className="relative shrink-0 md:hidden">
            <select
              value={selectedSub}
              onChange={(e) => setSelectedSub(e.target.value)}
              aria-label={`${groupLabel} 카테고리`}
              className="h-full appearance-none rounded-lg border border-border bg-elevated py-2 pl-3 pr-8 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="all">전체</option>
              {categoryChips.map((chip) => (
                <option key={chip.slug} value={chip.slug}>
                  {chip.name}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
          </div>

          <div
            className="hidden flex-wrap gap-2 md:flex"
            role="tablist"
            aria-label={`${groupLabel} 카테고리`}
          >
            <button
              type="button"
              onClick={() => setSelectedSub("all")}
              aria-selected={selectedSub === "all"}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                selectedSub === "all" ? "bg-primary text-white" : "bg-elevated text-muted-foreground"
              }`}
            >
              전체
            </button>
            {categoryChips.map((chip) => {
              const active = selectedSub === chip.slug;
              return (
                <button
                  key={chip.slug}
                  type="button"
                  onClick={() => setSelectedSub(chip.slug)}
                  aria-selected={active}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                    active ? "bg-primary text-white" : "bg-elevated text-muted-foreground"
                  }`}
                >
                  {chip.name}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        {electricFiltered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-elevated px-6 py-16 text-center">
            <Package className="h-10 w-10 text-muted-foreground" aria-hidden />
            <p className="font-medium text-foreground">표시할 제품이 없습니다.</p>
            <p className="max-w-md text-sm text-muted-foreground">
              검색어를 바꾸거나 &apos;전체&apos;·다른 카테고리를 선택해 보세요.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {electricFiltered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </>
  );
};
