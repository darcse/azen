"use client";

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
      <div className="flex w-full aspect-[4/3] items-center justify-center rounded-lg border border-dashed border-border">
        <ImageIcon className="h-16 w-16 text-muted-foreground" strokeWidth={1.25} aria-hidden />
        <span className="sr-only">이미지 없음</span>
      </div>
    );
  }

  return (
    <div className="min-w-0">
      <div className="w-full overflow-hidden rounded-lg border border-border bg-muted">
        <img
          src={urls[selected]}
          alt={`${productName} 이미지`}
          className="w-full aspect-[4/3] object-contain"
        />
      </div>
      <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
        {urls.map((url, i) => (
          <button
            key={`${url}-${i}`}
            type="button"
            onClick={() => setSelected(i)}
            className={`shrink-0 w-20 h-20 overflow-hidden rounded-lg border-2 cursor-pointer transition-colors ${
              i === selected ? "border-primary" : "border-border"
            }`}
          >
            <img
              src={url}
              alt={`${productName} 썸네일 ${i + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};
