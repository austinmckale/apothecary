alter table if exists public.facebook_media
add column if not exists is_featured boolean not null default false;


