'use client';

import { useMemo, useState } from 'react';

import type { GalleryShot } from '@/lib/gallery';

type Filter = 'all' | 'linked' | 'unlinked' | 'facebook' | 'collection';

const filterOptions: { label: string; value: Filter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Linked', value: 'linked' },
  { label: 'Unlinked', value: 'unlinked' },
  { label: 'Facebook', value: 'facebook' },
  { label: 'Collection', value: 'collection' },
];

export default function GalleryGrid({ shots }: { shots: GalleryShot[] }) {
  const [filter, setFilter] = useState<Filter>('all');

  const filteredShots = useMemo(() => {
    switch (filter) {
      case 'linked':
        return shots.filter((shot) => shot.has_plant);
      case 'unlinked':
        return shots.filter((shot) => !shot.has_plant);
      case 'facebook':
        return shots.filter((shot) => shot.source === 'Facebook');
      case 'collection':
        return shots.filter((shot) => shot.source !== 'Facebook');
      default:
        return shots;
    }
  }, [filter, shots]);

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setFilter(option.value)}
            className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
              filter === option.value
                ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredShots.map((shot) => (
          <article
            key={`${shot.source}-${shot.id}`}
            className="flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
          >
            <div className="relative h-56 w-full bg-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={shot.url} alt={shot.alt ?? shot.title} className="h-full w-full object-cover" />
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
                {shot.has_plant ? (
                  <>
                    {shot.plant_id && (
                      <a
                        href={`/admin/plants/${shot.plant_id}`}
                        className="rounded-full bg-slate-900 px-3 py-1 text-white hover:bg-slate-800"
                      >
                        Manage listing
                      </a>
                    )}
                    {shot.plant_slug && (
                      <a
                        href={`/plants/${shot.plant_slug}`}
                        className="rounded-full border border-slate-200 px-3 py-1 text-slate-600 hover:border-emerald-200 hover:text-emerald-600"
                        target="_blank"
                        rel="noreferrer"
                      >
                        View public ↗
                      </a>
                    )}
                  </>
                ) : (
                  <a
                    href={`/admin/plants/new?source_photo=${shot.id}`}
                    className="rounded-full border border-emerald-200 px-3 py-1 text-emerald-700 hover:bg-emerald-50"
                  >
                    Create listing from photo
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
        {filteredShots.length === 0 && (
          <div className="col-span-full rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center text-slate-500">
            Nothing matches this filter.
          </div>
        )}
      </div>
    </section>
  );
}


