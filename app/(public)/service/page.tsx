import { PublicServicePageClient } from "@/components/features/PublicServicePageClient";
import { createClient } from "@/lib/supabase/server";

interface ServiceCaseRow {
  id: string;
  title: string;
  thumbnail_url: string | null;
  thumbnail_caption: string | null;
  sort_order: number;
  created_at: string;
  images:
    | Array<{
        id: string;
        url: string;
        caption: string | null;
        sort_order: number;
      }>
    | null;
}

export default async function ServicePage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("azen_service_cases")
    .select(
      "id, title, thumbnail_url, thumbnail_caption, sort_order, created_at, images:azen_service_case_images(id, url, caption, sort_order)",
    )
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  const cases = ((data ?? []) as ServiceCaseRow[]).map((serviceCase) => {
    const additionalSlides = (serviceCase.images ?? [])
      .slice()
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((image) => ({
        url: image.url,
        caption: image.caption,
      }));

    const slides = [
      ...(serviceCase.thumbnail_url
        ? [
            {
              url: serviceCase.thumbnail_url,
              caption: serviceCase.thumbnail_caption,
            },
          ]
        : []),
      ...additionalSlides,
    ];

    return {
      id: serviceCase.id,
      title: serviceCase.title,
      thumbnail_url: serviceCase.thumbnail_url ?? additionalSlides[0]?.url ?? null,
      slides,
    };
  });

  return <PublicServicePageClient cases={cases} />;
}
