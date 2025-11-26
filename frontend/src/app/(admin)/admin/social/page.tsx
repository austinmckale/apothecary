import Image from "next/image";
import Link from "next/link";

import {
  createFacebookPostAction,
  refreshFacebookFeedAction,
  togglePostFeaturedAction,
} from "./actions";
import { getSupabaseServerClient } from "@/lib/supabase/server";

type SocialMedia = {
  id: string;
  storage_path: string | null;
  media_url: string | null;
  media_type: string | null;
};

type SocialPost = {
  id: string;
  message: string | null;
  posted_at: string | null;
  status: string | null;
  is_featured: boolean;
  link: string | null;
  facebook_media: SocialMedia[] | null;
  direction: string | null;
};

const buildStorageUrl = (path: string | null | undefined) => {
  if (!path) return null;
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${path}`;
};

async function getFacebookPosts(): Promise<SocialPost[]> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("facebook_posts")
    .select(
      "id, message, posted_at, status, is_featured, link, direction, facebook_media:id_facebook_media(id, storage_path, media_url, media_type)"
    )
    .order("posted_at", { ascending: false })
    .limit(15);

  if (error) {
    console.error("Failed to load facebook posts", error);
    return [];
  }

  return (data ?? []) as SocialPost[];
}

const formatDate = (value: string | null) => {
  if (!value) return "—";
  return new Date(value).toLocaleString();
};

const getPrimaryImageUrl = (media: SocialMedia[] | null) => {
  if (!media || media.length === 0) return null;
  const primary = media[0];
  return buildStorageUrl(primary.storage_path) ?? primary.media_url;
};

export default async function SocialFeedPage() {
  const posts = await getFacebookPosts();

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-emerald-500">Social sync</p>
              <h1 className="text-2xl font-semibold text-slate-950">Facebook gallery feed</h1>
              <p className="text-sm text-slate-500">
                Refresh pulls the latest Facebook posts and media. Compose a new post to publish directly from the
                apothecary dashboard.
              </p>
            </div>
            <form action={refreshFacebookFeedAction}>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-emerald-200 hover:text-emerald-600"
              >
                🔄 Refresh feed
              </button>
            </form>
          </div>

          <form action={createFacebookPostAction} className="grid gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-500">New post</p>
            <label className="text-sm font-semibold text-slate-600">
              Caption
              <textarea
                name="message"
                rows={3}
                placeholder="Share a greenhouse update, new drop, or timelapse moment."
                className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                required
              />
            </label>
            <label className="text-sm font-semibold text-slate-600">
              Image URL (optional)
              <input
                name="image_url"
                type="url"
                placeholder="https://your-supabase-storage/object/public/plant-photos/..."
                className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
              />
              <span className="text-xs text-slate-500">Use a Supabase public URL or any hosted image.</span>
            </label>
            <div className="flex justify-end">
              <button
                type="submit"
                className="rounded-full bg-slate-950 px-5 py-2 text-sm font-semibold text-white shadow shadow-slate-900/30 hover:bg-slate-800"
              >
                Publish to Facebook
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        {posts.map((post) => {
          const imageUrl = getPrimaryImageUrl(post.facebook_media ?? null);

          return (
            <article
              key={post.id}
              className="flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
            >
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={post.message ?? "Facebook post"}
                  width={1200}
                  height={800}
                  className="h-64 w-full object-cover"
                />
              ) : (
                <div className="flex h-64 items-center justify-center bg-slate-100 text-slate-400">
                  No image attached
                </div>
              )}

              <div className="flex flex-1 flex-col gap-4 p-5">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em]">
                  <span className="text-slate-500">{post.status ?? "pending"}</span>
                  <span className="text-slate-400">{formatDate(post.posted_at)}</span>
                </div>
                <div className="text-xs text-slate-400">
                  {post.direction === "crosspost" ? "Published from admin" : "Imported from Facebook"}
                </div>
                <p className="text-sm text-slate-700">{post.message ?? "No caption on this post."}</p>

                <div className="mt-auto flex flex-wrap gap-3 text-sm">
                  <form action={togglePostFeaturedAction}>
                    <input type="hidden" name="post_id" value={post.id} />
                    <input type="hidden" name="feature" value={post.is_featured ? "false" : "true"} />
                    <button
                      type="submit"
                      className={`rounded-full px-4 py-1.5 font-semibold ${
                        post.is_featured
                          ? "border border-rose-200 text-rose-600 hover:border-rose-300"
                          : "border border-emerald-200 text-emerald-600 hover:border-emerald-300"
                      }`}
                    >
                      {post.is_featured ? "Remove from gallery" : "Feature on site"}
                    </button>
                  </form>
                  {post.link && (
                    <Link
                      href={post.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-4 py-1.5 text-slate-600 hover:border-slate-300"
                    >
                      View on Facebook ↗
                    </Link>
                  )}
                </div>
              </div>
            </article>
          );
        })}

        {posts.length === 0 && (
          <div className="col-span-full rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center text-slate-500">
            No Facebook posts have been ingested yet. Tap “Refresh feed” after wiring your Facebook
            app credentials.
          </div>
        )}
      </section>
    </div>
  );
}
