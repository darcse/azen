import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { AdminServiceCaseForm } from "@/components/features/AdminServiceCaseForm";
import {
  collectStoragePathsFromUrls,
  createStoragePath,
  getStoragePathFromPublicUrl,
  isValidUrl,
  SERVICE_CASE_IMAGE_BUCKET,
  type ServiceCaseDetail,
  type ServiceCaseImageRow,
} from "@/lib/admin-service-cases";
import { createClient } from "@/lib/supabase/server";

interface AdminServiceEditPageProps {
  params: Promise<{ id: string }>;
}

interface UpdateServiceCaseFormState {
  error: string | null;
}

export default async function AdminServiceEditPage({ params }: AdminServiceEditPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: serviceCase }, { data: images }] = await Promise.all([
    supabase
      .from("azen_service_cases")
      .select("id, title, thumbnail_url, thumbnail_caption, is_published, sort_order")
      .eq("id", id)
      .maybeSingle(),
    supabase
      .from("azen_service_case_images")
      .select("id, url, caption, sort_order")
      .eq("case_id", id)
      .order("sort_order", { ascending: true }),
  ]);

  if (!serviceCase) {
    redirect("/admin/service");
  }

  const caseDetail = serviceCase as ServiceCaseDetail;
  const caseImages = (images ?? []) as ServiceCaseImageRow[];

  const updateServiceCaseAction = async (
    _: UpdateServiceCaseFormState,
    formData: FormData,
  ): Promise<UpdateServiceCaseFormState> => {
    "use server";

    const title = String(formData.get("title") ?? "").trim();
    const thumbnailCaption = String(formData.get("thumbnail_caption") ?? "").trim();
    const isPublished = formData.get("is_published") === "on";
    const sortOrder = Number(String(formData.get("sort_order") ?? "0")) || 0;
    const thumbnailMode = String(formData.get("thumbnail_mode") ?? "file");
    const additionalMode = String(formData.get("additional_mode") ?? "file");

    if (!title) {
      return { error: "제목을 입력해주세요." };
    }

    const actionClient = await createClient();
    let nextThumbnailUrl: string | null = caseDetail.thumbnail_url;

    if (thumbnailMode === "url") {
      const inputUrl = String(formData.get("thumbnail_url") ?? "").trim();
      if (inputUrl) {
        if (!isValidUrl(inputUrl)) {
          return { error: "대표 이미지 URL 형식이 올바르지 않습니다." };
        }
        nextThumbnailUrl = inputUrl;
      }
    } else {
      const thumbnailFile = formData.get("thumbnail_file");
      if (thumbnailFile instanceof File && thumbnailFile.size > 0) {
        const thumbnailPath = createStoragePath(`${id}/thumbnail`, thumbnailFile.name);
        const { error: uploadError } = await actionClient.storage
          .from(SERVICE_CASE_IMAGE_BUCKET)
          .upload(thumbnailPath, thumbnailFile, {
            contentType: thumbnailFile.type || "image/jpeg",
            upsert: false,
          });
        if (uploadError) {
          return { error: `대표 이미지 업로드에 실패했습니다: ${uploadError.message}` };
        }
        const { data } = actionClient.storage.from(SERVICE_CASE_IMAGE_BUCKET).getPublicUrl(thumbnailPath);
        nextThumbnailUrl = data.publicUrl;
      }
    }

    const { error: updateError } = await actionClient
      .from("azen_service_cases")
      .update({
        title,
        thumbnail_url: nextThumbnailUrl,
        thumbnail_caption: thumbnailCaption || null,
        is_published: isPublished,
        sort_order: sortOrder,
      })
      .eq("id", id);

    if (updateError) {
      return { error: `시공사례 수정에 실패했습니다: ${updateError.message}` };
    }

    const lastSortOrder = caseImages.at(-1)?.sort_order ?? -1;
    const additionalRows: Array<{ case_id: string; url: string; caption: string | null; sort_order: number }> = [];

    if (additionalMode === "url") {
      const urls = formData.getAll("additional_image_urls").map((value) => String(value).trim());
      const captions = formData.getAll("additional_image_url_captions").map((value) => String(value).trim());

      for (const [index, url] of urls.entries()) {
        if (!url) continue;
        if (!isValidUrl(url)) {
          return { error: `추가 이미지 URL(${index + 1}번째) 형식이 올바르지 않습니다.` };
        }
        additionalRows.push({
          case_id: id,
          url,
          caption: captions[index] || null,
          sort_order: lastSortOrder + additionalRows.length + 1,
        });
      }
    } else {
      const files = formData
        .getAll("additional_image_files")
        .filter((value): value is File => value instanceof File && value.size > 0);
      const captions = formData.getAll("additional_image_captions").map((value) => String(value).trim());

      for (const [index, file] of files.entries()) {
        const path = createStoragePath(`${id}/gallery`, file.name, index);
        const { error: uploadError } = await actionClient.storage.from(SERVICE_CASE_IMAGE_BUCKET).upload(path, file, {
          contentType: file.type || "image/jpeg",
          upsert: false,
        });
        if (uploadError) {
          return { error: `추가 이미지 업로드에 실패했습니다: ${uploadError.message}` };
        }
        const { data } = actionClient.storage.from(SERVICE_CASE_IMAGE_BUCKET).getPublicUrl(path);
        additionalRows.push({
          case_id: id,
          url: data.publicUrl,
          caption: captions[index] || null,
          sort_order: lastSortOrder + index + 1,
        });
      }
    }

    if (additionalRows.length > 0) {
      const { error: imageInsertError } = await actionClient.from("azen_service_case_images").insert(additionalRows);
      if (imageInsertError) {
        return { error: `추가 이미지 저장에 실패했습니다: ${imageInsertError.message}` };
      }
    }

    redirect("/admin/service?toast=updated");
  };

  const deleteImageAction = async (formData: FormData) => {
    "use server";

    const imageId = String(formData.get("image_id") ?? "");
    const imageUrl = String(formData.get("image_url") ?? "");
    if (!imageId) {
      return;
    }

    const actionClient = await createClient();
    const storagePath = getStoragePathFromPublicUrl(imageUrl);
    if (storagePath) {
      await actionClient.storage.from(SERVICE_CASE_IMAGE_BUCKET).remove([storagePath]);
    }
    await actionClient.from("azen_service_case_images").delete().eq("id", imageId).eq("case_id", id);
    revalidatePath(`/admin/service/${id}/edit`);
  };

  const deleteCaseAction = async (formData: FormData) => {
    "use server";

    void formData;
    const actionClient = await createClient();
    const [{ data: caseRow }, { data: imageRows }] = await Promise.all([
      actionClient.from("azen_service_cases").select("thumbnail_url").eq("id", id).maybeSingle(),
      actionClient.from("azen_service_case_images").select("url").eq("case_id", id),
    ]);

    const storagePaths = collectStoragePathsFromUrls([
      caseRow?.thumbnail_url ?? null,
      ...(imageRows ?? []).map((image) => image.url),
    ]);

    if (storagePaths.length > 0) {
      await actionClient.storage.from(SERVICE_CASE_IMAGE_BUCKET).remove(storagePaths);
    }

    await actionClient.from("azen_service_case_images").delete().eq("case_id", id);
    await actionClient.from("azen_service_cases").delete().eq("id", id);
    redirect("/admin/service?toast=deleted");
  };

  return (
    <main className="mx-auto w-full max-w-6xl space-y-4 p-6">
      <p className="text-sm text-muted-foreground">기존 시공사례 정보를 수정하고 이미지를 관리할 수 있습니다.</p>
      <AdminServiceCaseForm
        mode="edit"
        initialCase={caseDetail}
        existingImages={caseImages}
        action={updateServiceCaseAction}
        deleteImageAction={deleteImageAction}
        deleteCaseAction={deleteCaseAction}
      />
    </main>
  );
}
