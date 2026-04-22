"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export function ProductDetailBackButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      aria-label="이전 페이지로"
      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-foreground transition hover:bg-muted"
      onClick={() => router.back()}
    >
      <ArrowLeft className="h-5 w-5" aria-hidden />
    </button>
  );
}
