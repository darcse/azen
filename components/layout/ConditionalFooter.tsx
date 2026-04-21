"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/layout/Footer";

export const ConditionalFooter = () => {
  const pathname = usePathname();

  if (pathname === "/login" || pathname.startsWith("/admin")) {
    return null;
  }

  return <Footer />;
};
