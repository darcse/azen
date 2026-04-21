"use client";

import Image from "next/image";
import { useState } from "react";

interface ProductImageGalleryProps {
  images: Array<{
    id: string;
    url: string;
  }>;
}

const GalleryImage = ({ url }: { url: string }) => {
  const [isBroken, setIsBroken] = useState(false);

  if (isBroken) {
    return (
      <div className="flex h-40 items-center justify-center rounded-md border border-border bg-muted text-sm text-muted-foreground">
        이미지 로드 실패
      </div>
    );
  }

  return (
    <Image
      src={url}
      alt="제품 이미지"
      width={640}
      height={360}
      unoptimized
      className="h-40 w-full rounded-md border border-border object-cover"
      onError={() => setIsBroken(true)}
    />
  );
};

export const ProductImageGallery = ({ images }: ProductImageGalleryProps) => {
  if (images.length === 0) {
    return (
      <div className="rounded-md border border-border bg-muted p-4 text-sm text-muted-foreground">
        등록된 이미지가 없습니다.
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {images.map((image) => (
        <GalleryImage key={image.id} url={image.url} />
      ))}
    </div>
  );
};
