do $$
begin
  if not exists (
    select 1 from pg_policies where policyname = 'Public can view timelapse storage'
  ) then
    create policy "Public can view timelapse storage"
on storage.objects
for select
    using (bucket_id = 'timelapse');
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies where policyname = 'Admins upload timelapse storage'
  ) then
    create policy "Admins upload timelapse storage"
      on storage.objects
      for insert
      with check (
        bucket_id = 'timelapse'
        and auth.role() = 'authenticated'
      );
  end if;
end;
$$;

