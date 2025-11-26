import Link from 'next/link';

import GalleryGrid from '@/components/admin/GalleryGrid';
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

      <GalleryGrid shots={shots} />
    </div>
  );
}


