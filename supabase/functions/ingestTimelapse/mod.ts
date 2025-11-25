import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const BUCKET = "timelapse";

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const payload = await req.json();
    console.log("Received timelapse payload", payload.id);
    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response("Failed to process payload", { status: 400 });
  }
});


