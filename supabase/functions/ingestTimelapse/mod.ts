import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.46.1";
import OpenAI from "https://esm.sh/openai@4.22.1";

const BUCKET = "timelapse";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const openaiKey = Deno.env.get("OPENAI_API_KEY") ?? "";
const openai =
  openaiKey.length > 0
    ? new OpenAI({
        apiKey: openaiKey,
      })
    : null;

type Payload = {
  session_id?: string;
  camera_label?: string;
  captured_at: string;
  frame_index?: number;
  image_base64: string;
  temperature?: number;
  humidity?: number;
  moisture?: number;
  light_lux?: number;
  notes?: string;
};

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const payload = (await req.json()) as Payload;
    if (!payload.image_base64 || !payload.captured_at) {
      return new Response("Missing image or timestamp", { status: 400 });
    }

    const bytes = Uint8Array.from(atob(payload.image_base64), (c) => c.charCodeAt(0));
    const filePath = `${payload.camera_label ?? "default"}/${Date.now()}-${payload.frame_index ?? 0}.jpg`;

    const { error: storageError } = await supabase.storage.from(BUCKET).upload(filePath, bytes, {
      contentType: "image/jpeg",
      upsert: true,
    });

    if (storageError) {
      console.error(storageError);
      return new Response("Failed to store frame", { status: 500 });
    }

    let description: string | null = null;

    if (openai && req.headers.get("x-generate-caption") === "true") {
      try {
        const result = await openai.responses.create({
          model: "gpt-4.1-mini",
          input: [
            {
              role: "user",
              content: [
                { type: "input_text", text: "Describe this greenhouse timelapse frame in one sentence." },
                { type: "input_image", image_bytes: payload.image_base64 },
              ],
            },
          ],
        });
        description = result.output?.[0]?.content?.[0]?.text ?? null;
      } catch (captionError) {
        console.error("OpenAI caption error", captionError);
      }
    }

    const { error: insertError } = await supabase.from("timelapse_frames").insert({
      session_id: payload.session_id ?? null,
      camera_label: payload.camera_label,
      captured_at: payload.captured_at,
      frame_index: payload.frame_index,
      storage_path: `${BUCKET}/${filePath}`,
      temperature: payload.temperature,
      humidity: payload.humidity,
      moisture: payload.moisture,
      light_lux: payload.light_lux,
      notes: description ?? payload.notes,
    });

    if (insertError) {
      console.error(insertError);
      return new Response("Failed to save metadata", { status: 500 });
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response("Failed to process payload", { status: 400 });
  }
});

