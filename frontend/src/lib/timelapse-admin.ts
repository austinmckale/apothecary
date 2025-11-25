import "server-only";

import { cache } from "react";

import { getSupabaseServerClient } from "@/lib/supabase/server";

export type TimelapseSession = {
  id: string;
  started_at: string | null;
  ended_at: string | null;
  interval_minutes: number;
  camera_label: string | null;
  is_active: boolean;
};

export const getTimelapseSessions = cache(async (): Promise<TimelapseSession[]> => {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("timelapse_sessions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch timelapse sessions", error);
    return [];
  }

  return (data ?? []) as TimelapseSession[];
});

