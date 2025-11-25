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

export const getLatestGalleryPhotos = cache(async (limit = 6): Promise<GalleryShot[]> => {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("plant_photos")
    .select(
      "id, storage_path, alt, captured_at, is_cover, plants:plants!inner(name, slug, is_public)"
    )
    .eq("plants.is_public", true)
    .order("captured_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Failed to fetch gallery shots", error);
    return [];
  }

  return (data ?? []).map((photo) => ({
    id: photo.id,
    url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${photo.storage_path}`,
    title: photo.plants?.name ?? "Libby's Apothecary",
    alt: photo.alt,
    captured_at: photo.captured_at ?? new Date().toISOString(),
    source: photo.plants?.name ? "Collection" : "Greenhouse",
  }));
});

