create table if not exists public.facebook_posts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  facebook_post_id text unique,
  direction text not null default 'ingest' check (direction in ('ingest', 'crosspost')),
  status text not null default 'new',
  message text,
  link text,
  posted_at timestamptz,
  is_featured boolean not null default false,
  raw_payload jsonb
);

create table if not exists public.facebook_media (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  facebook_post_uuid uuid not null references public.facebook_posts(id) on delete cascade,
  storage_path text,
  media_url text,
  media_type text,
  width integer,
  height integer,
  source text not null default 'facebook'
);

create unique index if not exists facebook_posts_facebook_post_id_idx on public.facebook_posts (facebook_post_id);
create index if not exists facebook_media_post_idx on public.facebook_media (facebook_post_uuid);

create or replace function public.set_facebook_posts_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists facebook_posts_set_updated_at on public.facebook_posts;
create trigger facebook_posts_set_updated_at
before update on public.facebook_posts
for each row execute function public.set_facebook_posts_updated_at();

alter table public.facebook_posts enable row level security;
alter table public.facebook_media enable row level security;

create policy "Service role can manage facebook posts"
on public.facebook_posts
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

create policy "Service role can manage facebook media"
on public.facebook_media
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

create policy "Authenticated users can read facebook posts"
on public.facebook_posts
for select
using (auth.role() = 'authenticated');

create policy "Authenticated users can read facebook media"
on public.facebook_media
for select
using (auth.role() = 'authenticated');

