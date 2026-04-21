-- INIT-003: Supabase Storage 버킷/정책 세팅 (product-images)
-- 실행 위치: Supabase SQL Editor

-- 1) 버킷 생성 (없으면 생성)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  10485760,
  array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif'
  ]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- 2) 공개 읽기 정책
drop policy if exists "public_read_product_images_bucket" on storage.objects;
create policy "public_read_product_images_bucket"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'product-images');

-- 3) 관리자 쓰기 정책 (업로드/수정/삭제)
drop policy if exists "admin_insert_product_images_bucket" on storage.objects;
create policy "admin_insert_product_images_bucket"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'product-images'
  and coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'
);

drop policy if exists "admin_update_product_images_bucket" on storage.objects;
create policy "admin_update_product_images_bucket"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'product-images'
  and coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'
)
with check (
  bucket_id = 'product-images'
  and coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'
);

drop policy if exists "admin_delete_product_images_bucket" on storage.objects;
create policy "admin_delete_product_images_bucket"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'product-images'
  and coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'
);
