import Link from 'next/link';
import { notFound } from 'next/navigation';

import PlantPhotoUploader from '@/components/admin/PlantPhotoUploader';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import type { PlantWithPhotos } from '@/types/plant';

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
  const plant = await fetchPlant(params.id);
  if (!plant) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-500">{plant.species ?? 'Unknown species'}</p>
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
        <div className="space-y-4 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm shadow-slate-200/60">
          <h2 className="text-xl font-semibold text-slate-900">Care profile</h2>
          <dl className="grid gap-4 text-sm text-slate-600 sm:grid-cols-2">
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
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Description</h3>
            <p className="text-sm text-slate-600">{plant.description ?? 'Add a story about this plant.'}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Care notes</h3>
            <p className="text-sm text-slate-600">{plant.care_notes ?? 'Log your care notes here.'}</p>
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


