-- Buckets for plants, timelapse, marketing assets, and Facebook ingestion
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('plant-photos', 'plant-photos', true, 5242880, '{image/png,image/jpeg,image/webp,image/heic}'),
  ('timelapse', 'timelapse', true, 10485760, '{image/png,image/jpeg,image/webp}'),
  ('site-media', 'site-media', true, 2097152, '{image/png,image/jpeg,image/svg+xml}'),
  ('facebook-ingest', 'facebook-ingest', false, 10485760, '{image/png,image/jpeg,image/webp}')
on conflict (id) do nothing;

-- Public read for plant gallery assets
do $$
begin
  if not exists (
    select 1
    from pg_policies
    where policyname = 'Public read plant photos'
      and tablename = 'objects'
      and schemaname = 'storage'
  ) then
    create policy "Public read plant photos"
      on storage.objects
      for select
      using (bucket_id = 'plant-photos');
  end if;
end;
$$;

-- Authenticated uploads for plant photos
do $$
begin
  if not exists (
    select 1 from pg_policies
    where policyname = 'Admins upload plant photos'
      and tablename = 'objects'
      and schemaname = 'storage'
  ) then
    create policy "Admins upload plant photos"
      on storage.objects
      for insert
      with check (
        bucket_id = 'plant-photos'
        and auth.role() = 'authenticated'
      );
  end if;
end;
$$;

-- Service role full control of plant photo bucket
do $$
begin
  if not exists (
    select 1 from pg_policies
    where policyname = 'Service role manages plant photos'
      and tablename = 'objects'
      and schemaname = 'storage'
  ) then
    create policy "Service role manages plant photos"
      on storage.objects
      for all
      using (
        bucket_id = 'plant-photos'
        and auth.role() = 'service_role'
      )
      with check (
        bucket_id = 'plant-photos'
        and auth.role() = 'service_role'
      );
  end if;
end;
$$;

-- Timelapse policies (public read, authenticated insert)
do $$
begin
  if not exists (
    select 1 from pg_policies
    where policyname = 'Public read timelapse frames'
      and tablename = 'objects'
      and schemaname = 'storage'
  ) then
    create policy "Public read timelapse frames"
      on storage.objects
      for select
      using (bucket_id = 'timelapse');
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where policyname = 'Admins upload timelapse frames'
      and tablename = 'objects'
      and schemaname = 'storage'
  ) then
    create policy "Admins upload timelapse frames"
      on storage.objects
      for insert
      with check (
        bucket_id = 'timelapse'
        and auth.role() = 'authenticated'
      );
  end if;
end;
$$;

-- Marketing media: public read, authenticated insert
do $$
begin
  if not exists (
    select 1 from pg_policies
    where policyname = 'Public read site media'
      and tablename = 'objects'
      and schemaname = 'storage'
  ) then
    create policy "Public read site media"
      on storage.objects
      for select
      using (bucket_id = 'site-media');
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where policyname = 'Admins upload site media'
      and tablename = 'objects'
      and schemaname = 'storage'
  ) then
    create policy "Admins upload site media"
      on storage.objects
      for insert
      with check (
        bucket_id = 'site-media'
        and auth.role() = 'authenticated'
      );
  end if;
end;
$$;

-- Facebook ingest bucket: private read/write, service role only
do $$
begin
  if not exists (
    select 1 from pg_policies
    where policyname = 'Service role manages facebook ingest'
      and tablename = 'objects'
      and schemaname = 'storage'
  ) then
    create policy "Service role manages facebook ingest"
      on storage.objects
      for all
      using (
        bucket_id = 'facebook-ingest'
        and auth.role() = 'service_role'
      )
      with check (
        bucket_id = 'facebook-ingest'
        and auth.role() = 'service_role'
      );
  end if;
end;
$$;


