import Link from "next/link";

type GuidePreview = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
};

type GuidesPreviewGridProps = {
  guides: GuidePreview[];
};

export default function GuidesPreviewGrid({ guides }: GuidesPreviewGridProps) {
  return (
    <section className="space-y-6 rounded-3xl border border-slate-200 bg-slate-950/90 p-10 text-slate-100 shadow-emerald-100/20">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-emerald-300">Care resources</p>
          <h2 className="text-3xl font-serif text-white">Latest guides from Libby&apos;s journal</h2>
        </div>
        <Link
          href="/guides"
          className="rounded-full border border-white/20 px-4 py-1.5 text-sm font-semibold text-white hover:border-emerald-200 hover:text-emerald-200"
        >
          View all guides
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {guides.map((guide) => (
          <Link
            key={guide.slug}
            href={`/guides/${guide.slug}`}
            className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-white transition hover:border-emerald-200 hover:bg-white/10"
          >
            <p className="text-xs uppercase tracking-[0.35em] text-emerald-200">{guide.date.slice(0, 10)}</p>
            <h3 className="text-lg font-semibold">{guide.title}</h3>
            <p className="text-sm text-white/70">{guide.excerpt}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

