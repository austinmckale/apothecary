import Link from 'next/link';
import { notFound } from 'next/navigation';

import PlantPhotoUploader from '@/components/admin/PlantPhotoUploader';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import type { PlantWithPhotos } from '@/types/plant';
import { formatCurrency } from '@/util/format';

async function fetchPlant(id: string): Promise<PlantWithPhotos | null> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from('plants')
    .select('*, plant_photos(*)')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Failed to load plant detail', error);
    return null;
  }

  return data;
}

type PageProps = {
  params: {
    id: string;
  };
};

export default async function PlantDetailPage({ params }: PageProps) {
  const { id } = await params;
  const plant = await fetchPlant(id);
  if (!plant) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-500">{plant.species ?? 'Unknown species'}</p>
            {plant.category && (
              <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
                {plant.category}
              </span>
            )}
          </div>
          <h1 className="text-3xl font-semibold text-slate-950">{plant.name}</h1>
          <p className="text-sm text-slate-500">Slug: {plant.slug}</p>
        </div>
        <div className="flex gap-2 text-sm">
          <Link
            href={`/plants/${plant.slug}`}
            className="rounded-full border border-slate-200 px-4 py-1.5 font-medium text-slate-600 hover:border-emerald-200 hover:text-emerald-600"
          >
            View public page
          </Link>
          <button
            type="button"
            className="rounded-full bg-emerald-600 px-4 py-1.5 font-semibold text-white shadow-emerald-500/30 hover:bg-emerald-500"
          >
            Edit
          </button>
        </div>
      </div>

      <section className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
           <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm shadow-slate-200/60">
            <h2 className="text-xl font-semibold text-slate-900">Overview</h2>
            <dl className="mt-4 grid gap-4 text-sm text-slate-600 sm:grid-cols-2 md:grid-cols-3">
              <div>
                <dt className="text-xs uppercase tracking-[0.3em] text-slate-400">Stage</dt>
                <dd className="text-base font-medium text-slate-900 capitalize">{plant.stage ?? 'Not set'}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.3em] text-slate-400">Root Status</dt>
                <dd className="text-base font-medium text-slate-900 capitalize">
                  {plant.root_status ? plant.root_status.replace('_', ' ') : 'Not set'}
                </dd>
              </div>
               <div>
                <dt className="text-xs uppercase tracking-[0.3em] text-slate-400">Stock</dt>
                <dd className="text-base font-medium text-slate-900">
                  {plant.in_stock ? (
                    <span className="text-emerald-600">{plant.quantity ?? 1} available</span>
                  ) : (
                    <span className="text-rose-500">Out of stock</span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.3em] text-slate-400">Price</dt>
                <dd className="text-base font-medium text-slate-900">
                  {plant.price_cents ? formatCurrency(plant.price_cents) : 'Not for sale'}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.3em] text-slate-400">Cultivar</dt>
                <dd className="text-base font-medium text-slate-900">{plant.cultivar ?? '-'}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm shadow-slate-200/60">
            <h2 className="text-xl font-semibold text-slate-900">Care profile</h2>
            <dl className="mt-4 grid gap-4 text-sm text-slate-600 sm:grid-cols-2">
              <div>
                <dt className="text-xs uppercase tracking-[0.3em] text-slate-400">Light</dt>
                <dd className="text-base text-slate-900">{plant.light_requirements ?? 'Not set'}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.3em] text-slate-400">Watering</dt>
                <dd className="text-base text-slate-900">{plant.water_schedule ?? 'Not set'}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.3em] text-slate-400">Temperature</dt>
                <dd className="text-base text-slate-900">{plant.temperature_range ?? 'Not set'}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.3em] text-slate-400">Humidity</dt>
                <dd className="text-base text-slate-900">{plant.humidity_range ?? 'Not set'}</dd>
              </div>
            </dl>
            <div className="mt-6 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Description</h3>
                <div className="mt-2 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                  {plant.description ?? 'Add a story about this plant.'}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Care notes</h3>
                <div className="mt-2 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                  {plant.care_notes ?? 'Log your care notes here.'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-slate-950/90 p-6 text-white shadow-sm shadow-slate-900/50">
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-300">Status</p>
            <p className="text-lg font-semibold">{plant.is_public ? 'Public' : 'Private'}</p>
            <p className="text-xs text-white/70">
              Updated {new Date(plant.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
            <p className="text-sm font-semibold text-slate-900">Photos</p>
            <p className="text-xs text-slate-500">
              {plant.plant_photos?.length ? `${plant.plant_photos.length} uploaded` : 'No photos yet'}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {plant.plant_photos?.map((photo) => (
                <div
                  key={photo.id}
                  className="h-24 rounded-2xl bg-slate-100"
                  style={{
                    backgroundImage: `url(${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${photo.storage_path})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
              ))}
            </div>
            <div className="mt-6">
              <PlantPhotoUploader plantId={plant.id} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
