"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export const WaterSubBackButton = () => {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-primary"
    >
      <ArrowLeft className="h-4 w-4" aria-hidden />
      뒤로가기
    </button>
  );
};
