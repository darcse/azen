"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";

export const ConditionalHeader = () => {
  const pathname = usePathname();

  if (pathname === "/login" || pathname.startsWith("/admin")) {
    return null;
  }

  return <Header />;
};
