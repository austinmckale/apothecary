import Image from "next/image";
import Link from "next/link";

export type GreenhouseWindowProps = {
  liveStreamEnabled: boolean;
  liveStreamUrl?: string | null;
  galleryImages: { src: string; alt: string }[];
};

export default function GreenhouseWindow({ liveStreamEnabled, liveStreamUrl, galleryImages }: GreenhouseWindowProps) {
  const previewImages = galleryImages.slice(0, 4);
  const hasLiveFeed = liveStreamEnabled && liveStreamUrl;

  return (
    <section className="grid gap-8 rounded-3xl border border-slate-100 bg-white/90 p-8 shadow-emerald-50/50 lg:grid-cols-2">
      <div className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-500">Greenhouse window</p>
        <h2 className="text-3xl font-serif text-slate-950">See the Reading benches in real time</h2>
        <p className="text-sm text-slate-600">
          Timelapse cameras capture every awakening. When the livestream rests, the latest frames and vitals are still
          logged for review.
        </p>
        {hasLiveFeed ? (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-black">
            <iframe
              title="Greenhouse livestream"
              src={liveStreamUrl ?? undefined}
              className="h-60 w-full"
              allow="autoplay; fullscreen; picture-in-picture"
            />
          </div>
        ) : (
          <div className="flex h-60 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-center text-sm text-slate-500">
            <p className="font-semibold text-slate-700">Camera resting 🌙</p>
            <p>Fresh frames continue to sync every 15 minutes.</p>
          </div>
        )}
        <div className="flex flex-wrap gap-3 text-sm font-semibold">
          <Link
            href="/timelapse"
            className="rounded-full bg-slate-950 px-5 py-2 text-white shadow shadow-slate-900/30 transition hover:bg-slate-800"
          >
            Watch live
          </Link>
          <Link
            href="/gallery"
            className="rounded-full border border-slate-200 px-5 py-2 text-slate-700 hover:border-emerald-300 hover:text-emerald-700"
          >
            View full gallery
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {previewImages.map((image) => (
          <figure
            key={image.src}
            className="overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 shadow-sm"
          >
            <Image src={image.src} alt={image.alt} width={800} height={600} className="h-44 w-full object-cover" />
          </figure>
        ))}
        {previewImages.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
            Upload plant photos to populate the greenhouse gallery.
          </div>
        )}
      </div>
    </section>
  );
}

