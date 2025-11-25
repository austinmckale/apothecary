create table if not exists public.timelapse_sessions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  started_at timestamptz,
  ended_at timestamptz,
  interval_minutes integer not null default 15,
  location text,
  camera_label text,
  is_active boolean not null default true
);

alter table public.timelapse_frames
  add column if not exists session_id uuid references public.timelapse_sessions(id) on delete set null,
  add column if not exists frame_index integer,
  add column if not exists camera_label text,
  add column if not exists exposure text,
  add column if not exists moisture numeric,
  add column if not exists temperature numeric,
  add column if not exists humidity numeric;

create index if not exists timelapse_frames_session_idx on public.timelapse_frames(session_id);

alter table public.timelapse_sessions enable row level security;

create policy "Public read sessions"
on public.timelapse_sessions
for select
using (true);

create policy "Service role manages sessions"
on public.timelapse_sessions
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');


