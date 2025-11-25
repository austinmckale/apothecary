-- Additional metadata for timelapse frames
alter table public.timelapse_frames
  add column if not exists light_lux numeric,
  add column if not exists notes text;

