import "server-only";

import { cache } from "react";

import { getSupabaseServerClient } from "./supabase/server";

export type GalleryShot = {
  id: string;
  url: string;
  title: string;
  alt: string | null;
  captured_at: string;
  source: string;
};

const buildStorageUrl = (path: string | null | undefined) => {
  if (!path) return null;
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${path}`;
};

export const getLatestGalleryPhotos = cache(async (limit = 6): Promise<GalleryShot[]> => {
  const supabase = await getSupabaseServerClient();

  const plantQuery = supabase
    .from("plant_photos")
    .select("id, storage_path, alt, captured_at, plants:plants!inner(name, slug, is_public)")
    .eq("plants.is_public", true)
    .order("captured_at", { ascending: false })
    .limit(limit);

  const facebookQuery = supabase
    .from("facebook_media")
    .select(
      "id, storage_path, media_url, media_type, facebook_posts:facebook_post_uuid(id, message, posted_at, is_featured, status)"
    )
    .eq("facebook_posts.is_featured", true)
    .order("facebook_posts.posted_at", { ascending: false })
    .limit(limit);

  const [{ data: plantData, error: plantError }, { data: facebookData, error: facebookError }] =
    await Promise.all([plantQuery, facebookQuery]);

  if (plantError) {
    console.error("Failed to fetch plant gallery shots", plantError);
  }

  if (facebookError) {
    console.error("Failed to fetch facebook gallery shots", facebookError);
  }

  const plantShots: GalleryShot[] = (plantData ?? []).map((photo) => ({
    id: photo.id,
    url: buildStorageUrl(photo.storage_path) ?? "",
    title: photo.plants?.name ?? "Libby's Apothecary",
    alt: photo.alt,
    captured_at: photo.captured_at ?? new Date().toISOString(),
    source: photo.plants?.name ? "Collection" : "Greenhouse",
  }));

  const facebookShots: GalleryShot[] = (facebookData ?? [])
    .filter((entry) => entry.facebook_posts?.is_featured)
    .map((entry) => {
      const post = entry.facebook_posts;
      const fallbackTitle = post?.message?.slice(0, 80) ?? "Facebook update";
      const storageUrl = buildStorageUrl(entry.storage_path);
      const preferredUrl = storageUrl ?? entry.media_url ?? "";

      return {
        id: entry.id,
        url: preferredUrl,
        title: fallbackTitle,
        alt: post?.message ?? null,
        captured_at: post?.posted_at ?? new Date().toISOString(),
        source: "Facebook",
      };
    });

  return [...plantShots, ...facebookShots]
    .filter((shot) => shot.url.length > 0)
    .sort(
      (a, b) => new Date(b.captured_at).getTime() - new Date(a.captured_at).getTime()
    )
    .slice(0, limit);
});

