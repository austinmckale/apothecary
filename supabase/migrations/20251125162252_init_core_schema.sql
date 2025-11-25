-- Enable useful extensions
create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";

-- Helper to auto-maintain updated_at stamps
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create table if not exists public.plants (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null,
  slug text unique not null,
  species text,
  cultivar text,
  light_requirements text,
  water_schedule text,
  temperature_range text,
  humidity_range text,
  description text,
  care_notes text,
  is_public boolean not null default true
);

create trigger plants_handle_updated_at
before update on public.plants
for each row execute function public.handle_updated_at();

create table if not exists public.plant_photos (
  id uuid primary key default gen_random_uuid(),
  plant_id uuid not null references public.plants(id) on delete cascade,
  storage_path text not null,
  alt text,
  width integer,
  height integer,
  captured_at timestamptz not null default now(),
  is_cover boolean not null default false,
  created_at timestamptz not null default now()
);

create unique index if not exists plant_photos_cover_idx
  on public.plant_photos (plant_id) where is_cover;

create table if not exists public.guides (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  slug text not null unique,
  title text not null,
  summary text,
  body_md text,
  category text,
  hero_image text,
  is_published boolean not null default true
);

create trigger guides_handle_updated_at
before update on public.guides
for each row execute function public.handle_updated_at();

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null,
  slug text not null unique,
  description text,
  price_cents integer not null check (price_cents >= 0),
  currency text not null default 'usd',
  sku text unique,
  image_url text,
  inventory integer,
  is_active boolean not null default true,
  printful_product_id text
);

create trigger products_handle_updated_at
before update on public.products
for each row execute function public.handle_updated_at();

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  stripe_session_id text unique,
  customer_email text,
  status text not null default 'pending',
  fulfillment_status text,
  total_cents integer not null default 0,
  currency text not null default 'usd',
  shipping_address jsonb,
  line_items jsonb,
  metadata jsonb
);

create trigger orders_handle_updated_at
before update on public.orders
for each row execute function public.handle_updated_at();

create table if not exists public.timelapse_frames (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null unique,
  captured_at timestamptz not null default now(),
  published_at timestamptz,
  camera_label text,
  notes text,
  is_featured boolean not null default false
);

-- Row Level Security
alter table public.plants enable row level security;
alter table public.plant_photos enable row level security;
alter table public.guides enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.timelapse_frames enable row level security;

-- Plant visibility: anonymous users can read public plants
create policy "Public can view published plants"
on public.plants
for select
using (is_public);

-- Service role manages plants
create policy "Service role manages plants"
on public.plants
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

create policy "Public can view plant photos"
on public.plant_photos
for select
using (
  exists (
    select 1
    from public.plants p
    where p.id = plant_photos.plant_id
      and p.is_public
  )
);

create policy "Service role manages plant photos"
on public.plant_photos
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

create policy "Public can read guides"
on public.guides
for select
using (is_published);

create policy "Service role manages guides"
on public.guides
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

create policy "Public can view active products"
on public.products
for select
using (is_active);

create policy "Service role manages products"
on public.products
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

create policy "Service role manages orders"
on public.orders
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

create policy "Public can view timelapse frames"
on public.timelapse_frames
for select
using (true);

create policy "Service role manages timelapse frames"
on public.timelapse_frames
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');


