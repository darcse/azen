import { ProductImageGallery } from "@/components/features/ProductImageGallery";
import { createClient } from "@/lib/supabase/server";

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: images } = await supabase
    .from("azen_product_images")
    .select("id, url")
    .eq("product_id", id)
    .order("sort_order", { ascending: true });

  return (
    <main className="mx-auto w-full max-w-6xl space-y-4 p-6">
      <h1 className="text-xl font-semibold">제품 상세 (ID: {id})</h1>
      <ProductImageGallery images={images ?? []} />
    </main>
  );
}
