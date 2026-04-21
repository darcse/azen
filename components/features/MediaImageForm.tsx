"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type MediaTab = "upload" | "url";

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const isValidImageUrl = (value: string) => {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
};

export const MediaImageForm = () => {
  const [tab, setTab] = useState<MediaTab>("upload");
  const [productId, setProductId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [sortOrder, setSortOrder] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const saveImageRecord = async (url: string) => {
    const supabase = createClient();
    const { error } = await supabase.from("azen_product_images").insert({
      product_id: productId.trim(),
      url,
      sort_order: sortOrder,
    });

    if (error) {
      throw new Error(error.message);
    }
  };

  const handleUploadSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(null);

    if (!productId.trim()) {
      setMessage("제품 ID를 입력하세요.");
      return;
    }
    if (!selectedFile) {
      setMessage("업로드할 이미지를 선택하세요.");
      return;
    }
    if (!ACCEPTED_IMAGE_TYPES.includes(selectedFile.type)) {
      setMessage("이미지 파일만 업로드할 수 있습니다. (jpg, png, webp, gif)");
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const extension = selectedFile.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const path = `${productId.trim()}/${Date.now()}.${extension}`;
      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(path, selectedFile, {
          contentType: selectedFile.type,
          upsert: false,
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      const { data } = supabase.storage.from("product-images").getPublicUrl(path);
      await saveImageRecord(data.publicUrl);

      setSelectedFile(null);
      setMessage("이미지 업로드 및 DB 저장이 완료되었습니다.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "업로드 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUrlSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(null);

    if (!productId.trim()) {
      setMessage("제품 ID를 입력하세요.");
      return;
    }
    if (!isValidImageUrl(imageUrl.trim())) {
      setMessage("유효한 이미지 URL(http/https)을 입력하세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      await saveImageRecord(imageUrl.trim());
      setImageUrl("");
      setMessage("외부 이미지 URL이 저장되었습니다.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "URL 저장 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setTab("upload")}
          className={`rounded-md border px-3 py-2 text-sm ${tab === "upload" ? "border-primary bg-primary text-white" : "border-border bg-background"}`}
        >
          파일 업로드
        </button>
        <button
          type="button"
          onClick={() => setTab("url")}
          className={`rounded-md border px-3 py-2 text-sm ${tab === "url" ? "border-primary bg-primary text-white" : "border-border bg-background"}`}
        >
          URL 입력
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          제품 ID
          <input
            value={productId}
            onChange={(event) => setProductId(event.target.value)}
            placeholder="UUID 제품 ID"
            className="rounded-md border border-border bg-background px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          정렬 순서
          <input
            type="number"
            value={sortOrder}
            onChange={(event) => setSortOrder(Number(event.target.value) || 0)}
            className="rounded-md border border-border bg-background px-3 py-2"
          />
        </label>
      </div>

      {tab === "upload" ? (
        <form onSubmit={handleUploadSubmit} className="space-y-3">
          <label className="flex flex-col gap-1 text-sm">
            이미지 파일
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
              className="rounded-md border border-border bg-background px-3 py-2"
            />
          </label>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {isSubmitting ? "업로드 중..." : "업로드 후 저장"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleUrlSubmit} className="space-y-3">
          <label className="flex flex-col gap-1 text-sm">
            외부 이미지 URL
            <input
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
              placeholder="https://example.com/image.jpg"
              className="rounded-md border border-border bg-background px-3 py-2"
            />
          </label>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {isSubmitting ? "저장 중..." : "URL 저장"}
          </button>
        </form>
      )}

      {message && <p className="text-sm text-muted-foreground">{message}</p>}
    </section>
  );
};
