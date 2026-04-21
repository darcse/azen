"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const baseClass = "font-medium underline-offset-4 transition-colors";
const inactiveClass = "text-foreground/90 hover:text-primary hover:underline";
const activeClass = "text-primary underline";

export const AdminHeaderNav = () => {
  const pathname = usePathname();

  const isProductList =
    pathname === "/admin/list" || pathname.startsWith("/admin/products/") || pathname === "/admin";
  const isMainManage = pathname === "/admin/main";

  return (
    <nav className="flex items-center gap-5 text-sm">
      <Link href="/admin/list" className={`${baseClass} ${isProductList ? activeClass : inactiveClass}`}>
        제품 등록
      </Link>
      <Link href="/admin/main" className={`${baseClass} ${isMainManage ? activeClass : inactiveClass}`}>
        메인 관리
      </Link>
    </nav>
  );
};
