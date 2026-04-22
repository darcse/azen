"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ELECTRIC_SUB_SLUGS,
  FILTER_SUB_SLUGS,
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

interface ProductsCatalogClientProps {
  products: CatalogProduct[];
  group: ProductCatalogGroup;
  urlCategorySlug: string;
  categoryChips: CategoryChip[];
}

const initialSelectedSub = (urlSlug: string, group: ProductCatalogGroup): "all" | string => {
  const subSlugs: readonly string[] = group === "filter" ? FILTER_SUB_SLUGS : ELECTRIC_SUB_SLUGS;
  return subSlugs.includes(urlSlug) ? urlSlug : "all";
};

export const ProductsCatalogClient = ({
  products,
  group,
  urlCategorySlug,
  categoryChips,
}: ProductsCatalogClientProps) => {
  const [search, setSearch] = useState("");
  const [selectedSub, setSelectedSub] = useState<"all" | string>(() =>
    initialSelectedSub(urlCategorySlug, group),
  );

  useEffect(() => {
    setSelectedSub(initialSelectedSub(urlCategorySlug, group));
  }, [urlCategorySlug, group]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const groupSubSlugs = new Set<string>(
      group === "filter" ? FILTER_SUB_SLUGS : ELECTRIC_SUB_SLUGS,
    );
    return products.filter((p) => {
      if (selectedSub === "all") {
        if (!groupSubSlugs.has(p.categorySlug)) return false;
      } else {
        if (p.categorySlug !== selectedSub) return false;
      }
      if (q && !p.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [products, search, selectedSub, group]);

  const groupLabel = group === "filter" ? "필터" : "전기·유공압";

  return (
    <>
      {/* 검색 + 필터 바 */}
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

          {/* 모바일: select 드롭다운 */}
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

          {/* 데스크탑: 버튼 칩 */}
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

      {/* 제품 카드 그리드 */}
      <section className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-elevated px-6 py-16 text-center">
            <Package className="h-10 w-10 text-muted-foreground" aria-hidden />
            <p className="font-medium text-foreground">표시할 제품이 없습니다.</p>
            <p className="max-w-md text-sm text-muted-foreground">
              검색어를 바꾸거나 &apos;전체&apos;·다른 카테고리를 선택해 보세요.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </>
  );
};
