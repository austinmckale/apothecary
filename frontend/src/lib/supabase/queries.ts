import "server-only";

import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { PlantWithPhotos } from "@/types/plant";

export async function fetchPublicPlants() {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("plants")
    .select("*, plant_photos(*)")
    .eq("is_public", true)
    .order("updated_at", { ascending: false })
    .limit(30);

  if (error) {
    console.error("fetchPublicPlants error", error);
    return [];
  }

  return data as PlantWithPhotos[];
}

export async function fetchPublicPlant(slug: string) {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("plants")
    .select("*, plant_photos(*)")
    .eq("slug", slug)
    .eq("is_public", true)
    .maybeSingle();

  if (error) {
    console.error("fetchPublicPlant error", error);
    return null;
  }

  return data as PlantWithPhotos | null;
}


