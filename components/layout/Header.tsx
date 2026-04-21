"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

const filterItems = [
  { label: "공조기 필터", href: "/products?category=air_handling" },
  { label: "집진기 필터", href: "/products?category=dust_collector" },
  { label: "수처리 필터", href: "/products?category=water_treatment" },
  { label: "기타 품목", href: "/products?category=others" },
];

const electricItems = [
  { label: "전기 부품", href: "/products?category=electric_parts" },
  { label: "유공압", href: "/products?category=hydraulic" },
];

const navBaseClass =
  "px-2 py-2 text-base font-normal text-foreground/90 underline-offset-[6px] decoration-2 decoration-transparent transition-all hover:font-semibold hover:underline hover:decoration-primary dark:text-[#fefbfe]/90 dark:hover:text-[#fefbfe] dark:hover:decoration-[#0A84FF]";

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<"filter" | "electric" | null>(null);
  const mobileDepthOneClass =
    "px-2 py-2 text-base font-semibold text-foreground dark:text-[#fefbfe]";
  const mobileDepthTwoClass = `${navBaseClass} pl-4 text-sm`;

  const handleDropdownKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    menu: "filter" | "electric",
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpenDropdown((prev) => (prev === menu ? null : menu));
    }

    if (event.key === "Escape") {
      setOpenDropdown(null);
    }
  };

  const handleDropdownBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setOpenDropdown(null);
    }
  };

  return (
    <header className="glass-header relative z-40 border-b border-border bg-background">
      <div className="mx-auto flex h-[83px] w-full max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" aria-label="AZEN 홈으로 이동" className="text-foreground">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 150 36"
              className="h-7 w-auto fill-current"
            >
              <path d="m139 4v-0.1-3.1h-7.2v2.1c-2.4 0.1-5.3 1.1-7.7 2.9l2 2.6c1.8-1.4 4.4-2.4 7.5-2.4 4.5 0 11.8 3.7 11.8 12.6 0 4.8-2.5 9.3-6.4 11.3v-20.5c-1.7-1.1-3.9-1.8-7.1-1.4l0.1 15.2-14.7-22.4h-8.7v34.1h7.6v-22.7l15.1 22.7h7.7v-1.7c4.2-1.6 9.1-6 9.2-14.3 0-6.6-4.1-12.8-9.2-14.9z" />
              <path d="m26.5 0.8h-9l-12.6 34.1h7.4l2.5-6.9h14.4l2.4 6.9h8.3l-13.4-34.1zm-9.2 20.9 4.7-13.4 4.7 13.4h-9.4z" />
              <path d="m14.7 2.9c-2.3 0.2-4.6 1.1-6.1 2.3-2.2 1.6-4.5 3.9-5.7 7-0.8 1.8-1 3.1-1 4.6-0.3 4.7 1.1 8.5 3.3 12l1.3-3.2c-1.2-1.8-1.7-4.3-1.7-7 0-5.5 4.4-11.1 8.8-12.4l0.4-0.1 0.6-1.6v-0.1-0.1l0.4-1-0.3-0.4z" />
              <path d="m43.6 0.8v6.6h16.9l-17.7 22.3v5.2h27.7v-6.3h-17.5l17.2-22.4v-5.4h-26.6z" />
              <path d="m76.7 0.8v34.1h25.4c0.1 0 0-6.4 0-6.4h-17.8c-0.1 0 0-7.5 0-7.5h15.8v-6.5h-15.8v-7.1h17.2v-6.6h-24.8z" />
            </svg>
          </Link>

          <nav className="hidden items-center gap-5 md:flex">
            <Link href="/about" className={navBaseClass}>
              회사소개
            </Link>

            <div
              className="relative"
              onMouseEnter={() => setOpenDropdown("filter")}
              onMouseLeave={() => setOpenDropdown((prev) => (prev === "filter" ? null : prev))}
              onBlur={handleDropdownBlur}
            >
              <button
                type="button"
                className={navBaseClass}
                aria-expanded={openDropdown === "filter"}
                aria-controls="filter-menu"
                onKeyDown={(event) => handleDropdownKeyDown(event, "filter")}
              >
                필터
              </button>
              <div
                id="filter-menu"
                className={`glass-card absolute left-0 top-full z-20 -mt-px min-w-44 rounded-md border border-border bg-background p-1 pt-2 shadow-sm dark:bg-[#1c1c1e] dark:border-white/10 ${
                  openDropdown === "filter"
                    ? "visible opacity-100"
                    : "invisible pointer-events-none opacity-0"
                }`}
              >
                {filterItems.map((item) => (
                  <Link key={item.href} href={item.href} className={`${navBaseClass} block text-sm`}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div
              className="relative"
              onMouseEnter={() => setOpenDropdown("electric")}
              onMouseLeave={() => setOpenDropdown((prev) => (prev === "electric" ? null : prev))}
              onBlur={handleDropdownBlur}
            >
              <button
                type="button"
                className={navBaseClass}
                aria-expanded={openDropdown === "electric"}
                aria-controls="electric-menu"
                onKeyDown={(event) => handleDropdownKeyDown(event, "electric")}
              >
                전기/유공압
              </button>
              <div
                id="electric-menu"
                className={`glass-card absolute left-0 top-full z-20 -mt-px min-w-44 rounded-md border border-border bg-background p-1 pt-2 shadow-sm dark:bg-[#1c1c1e] dark:border-white/10 ${
                  openDropdown === "electric"
                    ? "visible opacity-100"
                    : "invisible pointer-events-none opacity-0"
                }`}
              >
                {electricItems.map((item) => (
                  <Link key={item.href} href={item.href} className={`${navBaseClass} block text-sm`}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <Link href="/service" className={navBaseClass}>
              교체시공
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            className="glass-card inline-flex h-9 w-9 items-center justify-center rounded-md border border-border md:hidden"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label="모바일 메뉴 토글"
          >
            {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="absolute left-0 top-full z-50 w-full md:hidden">
          <div className="glass-header border-t border-border bg-background/95 px-4 py-3 shadow-lg dark:bg-[#0e0e10]/95">
            <nav className="mx-auto w-full max-w-6xl">
              <div className="flex flex-col gap-2 pb-2">
                <Link
                  href="/about"
                  className={mobileDepthOneClass}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  회사소개
                </Link>
                <p className={mobileDepthOneClass}>필터</p>
                {filterItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={mobileDepthTwoClass}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <p className={mobileDepthOneClass}>전기/유공압</p>
                {electricItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={mobileDepthTwoClass}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  href="/service"
                  className={mobileDepthOneClass}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  교체시공
                </Link>
              </div>
            </nav>
          </div>
          <button
            type="button"
            className="h-[calc(100dvh-83px)] w-full bg-black/30 backdrop-blur-[1px]"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="모바일 메뉴 닫기"
          />
        </div>
      )}
    </header>
  );
};
