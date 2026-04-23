"use client";

import Image from "next/image";
import { useState } from "react";
import { Image as ImageIcon } from "lucide-react";

interface ProductGalleryProps {
  urls: string[];
  productName: string;
}

export const ProductGallery = ({ urls, productName }: ProductGalleryProps) => {
  const [selected, setSelected] = useState(0);

  if (urls.length === 0) {
    return (
      <div className="flex aspect-[4/3] w-full min-w-0 max-w-full items-center justify-center rounded-lg border border-dashed border-border bg-elevated">
        <ImageIcon className="h-16 w-16 text-muted-foreground" strokeWidth={1.25} aria-hidden />
        <span className="sr-only">이미지 없음</span>
      </div>
    );
  }

  return (
    <div className="min-w-0 w-full max-w-full">
      {/* aspect는 래퍼에만 두고, img는 절대배치로 min-content 폭이 튀지 않게 함 (그리드 가로 오버플로 방지) */}
      <div className="relative flex aspect-[4/3] w-full min-h-0 min-w-0 max-w-full items-center justify-center overflow-hidden rounded-lg border border-border bg-elevated">
        <Image
          src={urls[selected]}
          alt={`${productName} 이미지`}
          fill
          className="h-full w-full min-h-0 min-w-0 object-contain object-center"
        />
      </div>
      <div className="mt-4 flex min-w-0 max-w-full gap-2 overflow-x-auto pb-1">
        {urls.map((url, i) => (
          <button
            key={`${url}-${i}`}
            type="button"
            onClick={() => setSelected(i)}
            className={`shrink-0 w-20 h-20 overflow-hidden rounded-lg border-2 bg-elevated cursor-pointer transition-colors ${
              i === selected ? "border-primary" : "border-border"
            }`}
          >
            <div className="relative h-full w-full">
              <Image
              src={url}
              alt={`${productName} 썸네일 ${i + 1}`}
              fill
              className="object-cover"
            />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
