import { MediaImageForm } from "@/components/features/MediaImageForm";

export default function AdminProductNewPage() {
  return (
    <main className="mx-auto w-full max-w-3xl space-y-4 p-6">
      <h1 className="text-xl font-semibold">제품 이미지 등록</h1>
      <p className="text-sm text-muted-foreground">
        파일 업로드 또는 외부 URL 입력 방식으로 이미지를 등록할 수 있습니다.
      </p>
      <MediaImageForm />
    </main>
  );
}
