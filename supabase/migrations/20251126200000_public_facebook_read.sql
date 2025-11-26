-- Allow public read access to facebook content (since it's already public on FB)
create policy "Public can view facebook posts"
on public.facebook_posts
for select
to anon
using (true);

create policy "Public can view facebook media"
on public.facebook_media
for select
to anon
using (true);

