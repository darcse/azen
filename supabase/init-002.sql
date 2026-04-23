-- INIT-002: azen 제품 스키마 + RLS + 시드 데이터
-- 실행 위치: Supabase SQL Editor

create extension if not exists "pgcrypto";

create table if not exists public.azen_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  parent_id uuid references public.azen_categories(id) on delete set null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.azen_products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.azen_categories(id) on delete restrict,
  name text not null,
  description text,
  content text,
  spec text,
  thumbnail_url text,
  is_published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.azen_product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.azen_products(id) on delete cascade,
  url text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.azen_main_carousel (
  slot integer primary key,
  product_id uuid references public.azen_products(id) on delete set null
);

create index if not exists idx_azen_categories_parent_id on public.azen_categories(parent_id);
create index if not exists idx_azen_categories_sort_order on public.azen_categories(sort_order);
create index if not exists idx_azen_products_category_id on public.azen_products(category_id);
create index if not exists idx_azen_products_is_published on public.azen_products(is_published);
create index if not exists idx_azen_products_sort_order on public.azen_products(sort_order);
create index if not exists idx_azen_product_images_product_id on public.azen_product_images(product_id);
create index if not exists idx_azen_product_images_sort_order on public.azen_product_images(sort_order);

create or replace function public.set_azen_products_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_set_azen_products_updated_at on public.azen_products;
create trigger trg_set_azen_products_updated_at
before update on public.azen_products
for each row
execute function public.set_azen_products_updated_at();

alter table public.azen_categories enable row level security;
alter table public.azen_products enable row level security;
alter table public.azen_product_images enable row level security;
alter table public.azen_main_carousel enable row level security;

drop policy if exists "public_read_azen_categories" on public.azen_categories;
create policy "public_read_azen_categories"
on public.azen_categories
for select
to anon, authenticated
using (true);

drop policy if exists "public_read_azen_products" on public.azen_products;
create policy "public_read_azen_products"
on public.azen_products
for select
to anon, authenticated
using (is_published = true or auth.role() = 'authenticated');

drop policy if exists "public_read_azen_product_images" on public.azen_product_images;
create policy "public_read_azen_product_images"
on public.azen_product_images
for select
to anon, authenticated
using (true);

drop policy if exists "azen 캐러셀 공개 조회" on public.azen_main_carousel;
create policy "azen 캐러셀 공개 조회"
on public.azen_main_carousel
for select
using (true);

drop policy if exists "azen 관리자 캐러셀 수정" on public.azen_main_carousel;
create policy "azen 관리자 캐러셀 수정"
on public.azen_main_carousel
for update
using (auth.uid() is not null);

drop policy if exists "admin_write_azen_categories" on public.azen_categories;
create policy "admin_write_azen_categories"
on public.azen_categories
for all
to authenticated
using (
  coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'
)
with check (
  coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'
);

drop policy if exists "admin_write_azen_products" on public.azen_products;
create policy "admin_write_azen_products"
on public.azen_products
for all
to authenticated
using (
  coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'
)
with check (
  coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'
);

drop policy if exists "admin_write_azen_product_images" on public.azen_product_images;
create policy "admin_write_azen_product_images"
on public.azen_product_images
for all
to authenticated
using (
  coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'
)
with check (
  coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'
);

insert into public.azen_categories (name, slug, parent_id, sort_order)
values
  ('필터', 'filter', null, 10),
  ('전기/유공압', 'electric', null, 20),
  ('교체시공', 'service', null, 30),
  ('공조기 필터', 'air_handling', (select id from public.azen_categories where slug = 'filter'), 11),
  ('집진기 필터', 'dust_collector', (select id from public.azen_categories where slug = 'filter'), 12),
  ('수처리 필터', 'water_treatment', (select id from public.azen_categories where slug = 'filter'), 13),
  ('기타 품목', 'others', (select id from public.azen_categories where slug = 'filter'), 14),
  ('전기 부품', 'electric_parts', (select id from public.azen_categories where slug = 'electric'), 21),
  ('유공압', 'hydraulic', (select id from public.azen_categories where slug = 'electric'), 22)
on conflict (slug) do update
set
  name = excluded.name,
  parent_id = excluded.parent_id,
  sort_order = excluded.sort_order;

insert into public.azen_main_carousel (slot)
values (1), (2), (3), (4), (5), (6)
on conflict (slot) do nothing;
