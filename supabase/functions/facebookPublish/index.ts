import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const GRAPH_VERSION = "v19.0";
const FACEBOOK_PAGE_ID = Deno.env.get("FACEBOOK_PAGE_ID") ?? "";
const FACEBOOK_PAGE_TOKEN = Deno.env.get("FACEBOOK_PAGE_TOKEN") ?? "";

if (!FACEBOOK_PAGE_ID || !FACEBOOK_PAGE_TOKEN) {
  console.error("facebookPublish missing config");
}

type Payload = {
  message: string;
  imageUrl?: string;
};

const postToFacebook = async (payload: Payload) => {
  const baseUrl = `https://graph.facebook.com/${GRAPH_VERSION}/${FACEBOOK_PAGE_ID}`;
  const url = payload.imageUrl ? `${baseUrl}/photos` : `${baseUrl}/feed`;
  const params = new URLSearchParams();
  params.set("message", payload.message);
  params.set("access_token", FACEBOOK_PAGE_TOKEN);
  if (payload.imageUrl) {
    params.set("url", payload.imageUrl);
  }

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(JSON.stringify(result));
  }

  return result;
};

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  if (!FACEBOOK_PAGE_ID || !FACEBOOK_PAGE_TOKEN) {
    return new Response("Facebook configuration missing", { status: 500 });
  }

  try {
    const payload = (await req.json()) as Payload;
    if (!payload.message) {
      return new Response("Message is required", { status: 400 });
    }

    const result = await postToFacebook(payload);
    return new Response(JSON.stringify({ ok: true, result }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("facebookPublish error", error);
    return new Response("Failed to post to Facebook", { status: 500 });
  }
});

