"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface CategoryOption {
  id: string;
  name: string;
}

interface AdminProductListControlsProps {
  categories: CategoryOption[];
  initialSearch: string;
  initialCategory: string;
  initialSort: "name_asc" | "name_desc" | "created_desc" | "created_asc";
}

export const AdminProductListControls = ({
  categories,
  initialSearch,
  initialCategory,
  initialSort,
}: AdminProductListControlsProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSort, setSelectedSort] = useState(initialSort);

  const updateQuery = (nextValues: { search?: string; category?: string; sort?: string }) => {
    const next = new URLSearchParams(searchParams.toString());
    next.delete("toast");

    const search = (nextValues.search ?? "").trim();
    const category = (nextValues.category ?? "").trim();
    const sort = (nextValues.sort ?? "").trim();

    if (search) next.set("search", search);
    else next.delete("search");

    if (category) next.set("category", category);
    else next.delete("category");

    if (sort) next.set("sort", sort);
    else next.delete("sort");

    const query = next.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        updateQuery({
          search: searchInput,
          category: selectedCategory,
          sort: selectedSort,
        });
      }}
      className="flex flex-wrap items-center justify-end gap-2"
    >
      <div className="relative w-64">
        <input
          type="text"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="제품명 검색"
          className="h-10 w-full rounded-md border border-border bg-background px-3 py-2 pr-9 text-sm"
        />
        {searchInput.trim() && (
          <button
            type="button"
            onClick={() => {
              setSearchInput("");
              updateQuery({
                search: "",
                category: selectedCategory,
                sort: selectedSort,
              });
            }}
            aria-label="검색어 지우기"
            className="absolute right-2 top-1/2 inline-flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
          >
            <X size={12} />
          </button>
        )}
      </div>
      <select
        value={selectedCategory}
        onChange={(event) => {
          const nextCategory = event.target.value;
          setSelectedCategory(nextCategory);
          updateQuery({
            search: searchInput,
            category: nextCategory,
            sort: selectedSort,
          });
        }}
        className="h-10 min-w-44 rounded-md border border-border bg-background px-3 py-2 text-sm"
      >
        <option value="">전체 카테고리</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      <select
        value={selectedSort}
        onChange={(event) => {
          const nextSort = event.target.value;
          setSelectedSort(nextSort as "name_asc" | "name_desc" | "created_desc" | "created_asc");
          updateQuery({
            search: searchInput,
            category: selectedCategory,
            sort: nextSort,
          });
        }}
        className="h-10 min-w-44 rounded-md border border-border bg-background px-3 py-2 text-sm"
      >
        <option value="name_asc">이름 오름차순</option>
        <option value="name_desc">이름 내림차순</option>
        <option value="created_desc">등록일 최신순</option>
        <option value="created_asc">등록일 오래된순</option>
      </select>
    </form>
  );
};
