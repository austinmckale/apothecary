import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.46.1";

const GRAPH_VERSION = "v19.0";
const FACEBOOK_BUCKET = "facebook-ingest";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const FACEBOOK_PAGE_ID = Deno.env.get("FACEBOOK_PAGE_ID") ?? "";
const FACEBOOK_PAGE_TOKEN = Deno.env.get("FACEBOOK_PAGE_TOKEN") ?? "";

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing Supabase credentials");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

type GraphImage = {
  src?: string;
  width?: number;
  height?: number;
};

type GraphAttachment = {
  media_type?: string;
  url?: string;
  target?: { id?: string };
  media?: {
    image?: GraphImage;
    source?: string;
  };
  subattachments?: {
    data?: GraphAttachment[];
  };
};

type GraphPost = {
  id: string;
  message?: string;
  created_time?: string;
  permalink_url?: string;
  attachments?: {
    data?: GraphAttachment[];
  };
};

const flattenAttachments = (attachments?: GraphAttachment[]): GraphAttachment[] => {
  if (!attachments || attachments.length === 0) return [];

  return attachments.flatMap((attachment) => {
    if (attachment.subattachments?.data?.length) {
      return [attachment, ...flattenAttachments(attachment.subattachments.data)];
    }
    return [attachment];
  });
};

const appendAccessToken = (url: string) => {
  if (url.includes("access_token")) return url;
  const delimiter = url.includes("?") ? "&" : "?";
  return `${url}${delimiter}access_token=${FACEBOOK_PAGE_TOKEN}`;
};

const mirrorMediaToStorage = async (
  mediaUrl: string,
  key: string,
): Promise<{ storagePath: string | null }> => {
  try {
    const fetchUrl = appendAccessToken(mediaUrl);
    const response = await fetch(fetchUrl);
    if (!response.ok) {
      console.error("Failed to download media", await response.text());
      return { storagePath: null };
    }

    const contentType = response.headers.get("content-type") ?? "image/jpeg";
    const extension = contentType.includes("png")
      ? "png"
      : contentType.includes("gif")
        ? "gif"
        : "jpg";
    const objectPath = `${key}.${extension}`;
    const buffer = new Uint8Array(await response.arrayBuffer());

    const { error } = await supabase.storage
      .from(FACEBOOK_BUCKET)
      .upload(objectPath, buffer, { contentType, upsert: true });

    if (error) {
      console.error("Storage upload error", error);
      return { storagePath: null };
    }

    return { storagePath: `${FACEBOOK_BUCKET}/${objectPath}` };
  } catch (err) {
    console.error("mirrorMediaToStorage error", err);
    return { storagePath: null };
  }
};

serve(async (req) => {
  if (req.method !== "GET" && req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  if (!FACEBOOK_PAGE_ID || !FACEBOOK_PAGE_TOKEN) {
    return new Response("Missing Facebook configuration", { status: 500 });
  }

  const url = new URL(req.url);
  const limit = Number(url.searchParams.get("limit") ?? "5");

  try {
    const graphUrl = new URL(
      `https://graph.facebook.com/${GRAPH_VERSION}/${FACEBOOK_PAGE_ID}/posts`,
    );
    graphUrl.searchParams.set(
      "fields",
      "id,message,created_time,permalink_url,attachments{media_type,media{image{src,width,height},source},url,subattachments}",
    );
    graphUrl.searchParams.set("limit", `${Math.min(limit, 25)}`);
    graphUrl.searchParams.set("access_token", FACEBOOK_PAGE_TOKEN);

    const graphResponse = await fetch(graphUrl);
    if (!graphResponse.ok) {
      const detail = await graphResponse.text();
      console.error("Graph API error", detail);
      return new Response(detail, { status: 502 });
    }

    const payload = (await graphResponse.json()) as { data?: GraphPost[] };
    const posts = payload.data ?? [];

    const processed: string[] = [];

    for (const post of posts) {
      const upsertPayload = {
        facebook_post_id: post.id,
        direction: "ingest",
        status: "synced",
        message: post.message ?? null,
        link: post.permalink_url ?? null,
        posted_at: post.created_time ? new Date(post.created_time).toISOString() : null,
        raw_payload: post,
      };

      const { data: upserted, error: upsertError } = await supabase
        .from("facebook_posts")
        .upsert(upsertPayload, { onConflict: "facebook_post_id" })
        .select("id")
        .single();

      if (upsertError || !upserted) {
        console.error("Failed to upsert facebook post", upsertError);
        continue;
      }

      const postUuid = upserted.id;
      const attachments = flattenAttachments(post.attachments?.data);

      if (attachments.length > 0) {
        await supabase.from("facebook_media").delete().eq("facebook_post_uuid", postUuid);
      }

      for (const attachment of attachments) {
        const mediaUrl =
          attachment.media?.image?.src ??
          attachment.media?.source ??
          attachment.url ??
          null;

        if (!mediaUrl) continue;

        const key = `${postUuid}/${attachment.target?.id ?? crypto.randomUUID()}`;
        const { storagePath } = await mirrorMediaToStorage(mediaUrl, key);

        const { error: mediaError } = await supabase.from("facebook_media").insert({
          facebook_post_uuid: postUuid,
          storage_path: storagePath,
          media_url: mediaUrl,
          media_type: attachment.media_type ?? null,
          width: attachment.media?.image?.width ?? null,
          height: attachment.media?.image?.height ?? null,
          source: "facebook",
        });

        if (mediaError) {
          console.error("Failed to insert facebook media", mediaError);
        }
      }

      processed.push(post.id);
    }

    return new Response(
      JSON.stringify({ ok: true, postsProcessed: processed.length }),
      { headers: { "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("facebookIngest error", error);
    return new Response("Failed to sync Facebook content", { status: 500 });
  }
});

