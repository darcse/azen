"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ImagePlus, Link as LinkIcon, Save, Upload } from "lucide-react";
import { AdminDeleteButton } from "@/components/features/AdminDeleteButton";
import { AdminImageDeleteButton } from "@/components/features/AdminImageDeleteButton";

interface CategoryOption {
  id: string;
  name: string;
}

interface ProductDetail {
  id: string;
  name: string;
  category_id: string;
  description: string | null;
  content: string | null;
  thumbnail_url: string | null;
  is_published: boolean;
  sort_order: number;
}

interface ProductImageItem {
  id: string;
  url: string;
  sort_order: number;
}

interface UpdateProductFormState {
  error: string | null;
}

interface AdminProductEditFormProps {
  categories: CategoryOption[];
  product: ProductDetail;
  images: ProductImageItem[];
  updateAction: (state: UpdateProductFormState, formData: FormData) => Promise<UpdateProductFormState>;
  deleteImageAction: (formData: FormData) => Promise<void>;
  deleteProductAction: (formData: FormData) => Promise<void>;
}

export const AdminProductEditForm = ({
  categories,
  product,
  images,
  updateAction,
  deleteImageAction,
  deleteProductAction,
}: AdminProductEditFormProps) => {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(updateAction, { error: null });
  const [isDirty, setIsDirty] = useState(false);
  const [thumbnailMode, setThumbnailMode] = useState<"file" | "url">("file");
  const [additionalMode, setAdditionalMode] = useState<"file" | "url">("file");
  const [additionalUrlInputs, setAdditionalUrlInputs] = useState([""]);

  const handleBackClick = () => {
    if (isDirty) {
      const shouldMove = window.confirm("저장하지 않은 변경사항이 있습니다. 목록으로 이동할까요?");
      if (!shouldMove) {
        return;
      }
    }
    router.push("/admin/list");
  };

  const addAdditionalUrlInput = () => {
    setAdditionalUrlInputs((prev) => [...prev, ""]);
  };

  const updateAdditionalUrlInput = (index: number, value: string) => {
    setAdditionalUrlInputs((prev) => prev.map((item, idx) => (idx === index ? value : item)));
  };

  const removeAdditionalUrlInput = (index: number) => {
    setAdditionalUrlInputs((prev) => (prev.length === 1 ? prev : prev.filter((_, idx) => idx !== index)));
  };

  return (
    <form
      action={formAction}
      onChange={() => setIsDirty(true)}
      className="glass-card space-y-5 rounded-2xl border border-border p-5"
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleBackClick}
          aria-label="목록으로 이동"
          className="inline-flex items-center justify-center rounded-md border border-border p-2 hover:bg-muted"
        >
          <ArrowLeft size={16} />
        </button>
        <h1 className="text-xl font-semibold">제품 수정</h1>
      </div>

      <section className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          제품명 <span className="text-red-500">*</span>
          <input
            name="name"
            required
            defaultValue={product.name}
            className="h-10 rounded-md border border-border bg-background px-3 py-2"
            placeholder="제품명을 입력하세요"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          카테고리 <span className="text-red-500">*</span>
          <select
            name="category_id"
            required
            defaultValue={product.category_id}
            className="h-10 rounded-md border border-border bg-background px-3 py-2"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
      </section>

      <label className="flex flex-col gap-1 text-sm">
        간단설명
        <textarea
          name="description"
          rows={3}
          defaultValue={product.description ?? ""}
          className="rounded-md border border-border bg-background px-3 py-2"
          placeholder="간단한 소개 문구를 입력하세요"
        />
      </label>

      <section className="grid gap-4 md:grid-cols-2">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="is_published" defaultChecked={product.is_published} className="h-4 w-4" />
          공개 상태
        </label>
        <label className="flex flex-col gap-1 text-sm">
          정렬순서
          <input
            type="number"
            name="sort_order"
            defaultValue={product.sort_order}
            className="rounded-md border border-border bg-background px-3 py-2"
          />
        </label>
      </section>

      <section className="space-y-3 rounded-xl border border-border p-4">
        <p className="text-sm font-medium">대표 이미지</p>
        {product.thumbnail_url && (
          <div className="flex aspect-square w-64 max-w-full shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-elevated">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.thumbnail_url}
              alt="기존 대표 이미지"
              className="max-h-full max-w-full object-contain object-center"
            />
          </div>
        )}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setThumbnailMode("file")}
            className={`inline-flex items-center gap-1 rounded-md border px-3 py-2 text-xs ${
              thumbnailMode === "file" ? "border-primary bg-primary text-white" : "border-border"
            }`}
          >
            <Upload size={14} />
            파일 업로드
          </button>
          <button
            type="button"
            onClick={() => setThumbnailMode("url")}
            className={`inline-flex items-center gap-1 rounded-md border px-3 py-2 text-xs ${
              thumbnailMode === "url" ? "border-primary bg-primary text-white" : "border-border"
            }`}
          >
            <LinkIcon size={14} />
            URL 입력
          </button>
        </div>
        <input type="hidden" name="thumbnail_mode" value={thumbnailMode} />
        {thumbnailMode === "file" ? (
          <input
            type="file"
            name="thumbnail_file"
            accept="image/*"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
        ) : (
          <input
            name="thumbnail_url"
            defaultValue={product.thumbnail_url ?? ""}
            placeholder="https://example.com/thumbnail.jpg"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
        )}
      </section>

      <section className="space-y-3 rounded-xl border border-border p-4">
        <p className="text-sm font-medium">기존 추가 이미지</p>
        {images.length === 0 ? (
          <p className="text-xs text-muted-foreground">등록된 추가 이미지가 없습니다.</p>
        ) : (
          <div className="space-y-2">
            {images.map((image) => (
              <div key={image.id} className="flex items-center gap-2 rounded-md border border-border p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image.url} alt="기존 추가 이미지" className="h-14 w-14 rounded object-cover" />
                <p className="line-clamp-1 flex-1 text-xs text-muted-foreground">{image.url}</p>
                <AdminImageDeleteButton action={deleteImageAction} imageId={image.id} imageUrl={image.url} />
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3 rounded-xl border border-border p-4">
        <p className="text-sm font-medium">새 추가 이미지</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setAdditionalMode("file")}
            className={`inline-flex items-center gap-1 rounded-md border px-3 py-2 text-xs ${
              additionalMode === "file" ? "border-primary bg-primary text-white" : "border-border"
            }`}
          >
            <ImagePlus size={14} />
            파일 업로드
          </button>
          <button
            type="button"
            onClick={() => setAdditionalMode("url")}
            className={`inline-flex items-center gap-1 rounded-md border px-3 py-2 text-xs ${
              additionalMode === "url" ? "border-primary bg-primary text-white" : "border-border"
            }`}
          >
            <LinkIcon size={14} />
            URL 입력
          </button>
        </div>
        <input type="hidden" name="additional_mode" value={additionalMode} />
        {additionalMode === "file" ? (
          <input
            type="file"
            name="additional_image_files"
            accept="image/*"
            multiple
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
        ) : (
          <div className="space-y-2">
            {additionalUrlInputs.map((value, index) => (
              <div key={`additional-url-${index}`} className="flex gap-2">
                <input
                  name="additional_image_urls"
                  value={value}
                  onChange={(event) => updateAdditionalUrlInput(index, event.target.value)}
                  placeholder="https://example.com/gallery-image.jpg"
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                />
                <button
                  type="button"
                  onClick={() => removeAdditionalUrlInput(index)}
                  className="rounded-md border border-border px-3 py-2 text-xs hover:bg-muted"
                >
                  삭제
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addAdditionalUrlInput}
              className="rounded-md border border-border px-3 py-2 text-xs hover:bg-muted"
            >
              URL 입력칸 추가
            </button>
          </div>
        )}
      </section>

      <label className="flex flex-col gap-1 text-sm">
        상세설명 (HTML)
        <textarea
          name="content"
          rows={24}
          defaultValue={product.content ?? ""}
          className="min-h-60 resize-y rounded-md border border-border bg-background px-3 py-2 font-mono text-xs"
          placeholder="<p>상세 HTML 설명</p>"
        />
      </label>

      {state.error && <p className="text-sm text-red-500">{state.error}</p>}

      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex w-36 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          <Save size={15} />
          {isPending ? "저장 중..." : "수정 저장"}
        </button>
        <AdminDeleteButton action={deleteProductAction} productId={product.id} productName={product.name}>
          제품 삭제
        </AdminDeleteButton>
      </div>
    </form>
  );
};
