"use client";

import { useActionState, useState } from "react";
import { ImagePlus, Link as LinkIcon, Save, Trash2, Upload } from "lucide-react";
import { RichTextEditor } from "@/components/ui/RichTextEditor";

interface CategoryOption {
  id: string;
  name: string;
}

interface CreateProductFormState {
  error: string | null;
}

interface AdminProductCreateFormProps {
  categories: CategoryOption[];
  action: (state: CreateProductFormState, formData: FormData) => Promise<CreateProductFormState>;
}

export const AdminProductCreateForm = ({ categories, action }: AdminProductCreateFormProps) => {
  const [state, formAction, isPending] = useActionState(action, { error: null });
  const [contentHtml, setContentHtml] = useState("");
  const [specHtml, setSpecHtml] = useState("");
  const [thumbnailMode, setThumbnailMode] = useState<"file" | "url">("file");
  const [additionalMode, setAdditionalMode] = useState<"file" | "url">("file");
  const [additionalUrlInputs, setAdditionalUrlInputs] = useState([""]);

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
    <form action={formAction} className="glass-card space-y-5 rounded-2xl border border-border p-5">
      <section className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          제품명 <span className="text-red-500">*</span>
          <input
            name="name"
            required
            className="h-10 rounded-md border border-border bg-background px-3 py-2"
            placeholder="제품명을 입력하세요"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          카테고리 <span className="text-red-500">*</span>
          <select
            name="category_id"
            required
            defaultValue=""
            className="h-10 rounded-md border border-border bg-background px-3 py-2"
          >
            <option value="" disabled>
              서브카테고리를 선택하세요
            </option>
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
          className="rounded-md border border-border bg-background px-3 py-2"
          placeholder="간단한 소개 문구를 입력하세요"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        스펙
        <input type="hidden" name="spec" value={specHtml} />
        <RichTextEditor
          value={specHtml}
          onChange={setSpecHtml}
          placeholder="HTML 입력 가능. 예: <ul><li>규격: 500x500</li></ul>"
        />
      </label>

      <section className="grid gap-4 md:grid-cols-2">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="is_published" defaultChecked className="h-4 w-4" />
          공개 상태
        </label>
        <label className="flex flex-col gap-1 text-sm">
          정렬순서
          <input
            type="number"
            name="sort_order"
            defaultValue={0}
            className="rounded-md border border-border bg-background px-3 py-2"
          />
        </label>
      </section>

      <section className="space-y-3 rounded-xl border border-border p-4">
        <p className="text-sm font-medium">대표 이미지</p>
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
            placeholder="https://example.com/thumbnail.jpg"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
        )}
      </section>

      <section className="space-y-3 rounded-xl border border-border p-4">
        <p className="text-sm font-medium">추가 이미지</p>
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
                  className="inline-flex items-center justify-center rounded-md border border-border px-3 py-2 text-xs hover:bg-muted"
                  aria-label="추가 이미지 URL 입력칸 삭제"
                >
                  <Trash2 size={14} />
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
        <input type="hidden" name="content" value={contentHtml} />
        <RichTextEditor
          value={contentHtml}
          onChange={setContentHtml}
          placeholder="<p>상세 HTML 설명</p>"
        />
      </label>

      {state.error && <p className="text-sm text-red-500">{state.error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        <Save size={15} />
        {isPending ? "저장 중..." : "제품 저장"}
      </button>
    </form>
  );
};
