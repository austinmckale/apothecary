create table if not exists public.plant_identifications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  plant_id uuid references public.plants(id) on delete set null,
  image_url text,
  model text,
  suggestion text,
  confidence numeric,
  notes text,
  raw jsonb
);

alter table public.plant_identifications enable row level security;

create policy "Service role can manage identifications"
on public.plant_identifications
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

create policy "Authenticated admins can read identifications"
on public.plant_identifications
for select
using (auth.role() = 'authenticated');

