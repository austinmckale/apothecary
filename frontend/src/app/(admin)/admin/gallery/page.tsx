import Image from 'next/image';
import Link from 'next/link';

import { getLatestGalleryPhotos } from '@/lib/gallery';

export const metadata = {
  title: 'Gallery · Admin',
};

export default async function AdminGalleryPage() {
  const shots = await getLatestGalleryPhotos(30);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-emerald-500">Gallery</p>
          <h1 className="text-2xl font-semibold text-slate-950">Media & listings</h1>
          <p className="text-sm text-slate-500">Review the latest Fresh Snaps and link them to active inventory.</p>
        </div>
        <Link
          href="/admin/plants/new"
          className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow shadow-emerald-500/40 hover:bg-emerald-500"
        >
          + New plant listing
        </Link>
      </header>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {shots.map((shot) => (
          <article key={`${shot.source}-${shot.id}`} className="flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="relative h-56 w-full bg-slate-100">
              <Image src={shot.url} alt={shot.alt ?? shot.title} fill className="object-cover" />
              <span className="absolute left-3 top-3 rounded-full bg-white/80 px-2 py-0.5 text-xs font-semibold uppercase text-slate-700">
                {shot.source}
              </span>
            </div>
            <div className="flex flex-1 flex-col gap-3 p-5">
              <div>
                <p className="text-sm font-semibold text-slate-900">{shot.title}</p>
                <p className="text-xs text-slate-500">{new Date(shot.captured_at).toLocaleString()}</p>
              </div>
              <div className="mt-auto flex flex-wrap gap-2 text-xs font-semibold">
                {shot.plant_id ? (
                  <>
                    <Link
                      href={`/admin/plants/${shot.plant_id}`}
                      className="rounded-full bg-slate-900 px-3 py-1 text-white hover:bg-slate-800"
                    >
                      Manage listing
                    </Link>
                    {shot.plant_slug && (
                      <Link
                        href={`/plants/${shot.plant_slug}`}
                        className="rounded-full border border-slate-200 px-3 py-1 text-slate-600 hover:border-emerald-200 hover:text-emerald-600"
                        target="_blank"
                      >
                        View public ↗
                      </Link>
                    )}
                  </>
                ) : (
                  <Link
                    href={`/admin/plants/new?source_photo=${shot.id}`}
                    className="rounded-full border border-emerald-200 px-3 py-1 text-emerald-700 hover:bg-emerald-50"
                  >
                    Create listing from photo
                  </Link>
                )}
              </div>
            </div>
          </article>
        ))}
        {shots.length === 0 && (
          <div className="col-span-full rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center text-slate-500">
            No gallery entries yet. Capture plant photos or feature Facebook posts to see them here.
          </div>
        )}
      </section>
    </div>
  );
}


