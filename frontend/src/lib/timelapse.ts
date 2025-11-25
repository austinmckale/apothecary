import "server-only";

import { cache } from "react";

import { getSupabaseServerClient } from "./supabase/server";

export type TimelapseFrame = {
  id: string;
  storage_path: string;
  captured_at: string;
  camera_label: string | null;
  temperature: number | null;
  humidity: number | null;
  moisture: number | null;
  light_lux?: number | null;
  notes?: string | null;
};

const DEFAULT_FRAME_LIMIT = 48;

export const getLatestTimelapseFrames = cache(async (limit: number = DEFAULT_FRAME_LIMIT) => {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("timelapse_frames")
    .select(
      "id, storage_path, captured_at, camera_label, temperature, humidity, moisture, light_lux, notes"
    )
    .order("captured_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Failed to fetch timelapse frames", error);
    return [];
  }

  return data as TimelapseFrame[];
});

