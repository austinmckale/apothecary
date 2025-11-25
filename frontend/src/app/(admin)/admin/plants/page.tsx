import Link from 'next/link';

import PlantCard from '@/components/admin/PlantCard';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import type { Plant } from '@/types/plant';

async function fetchPlants(): Promise<Plant[]> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from('plants')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch plants', error);
    return [];
  }

  return data ?? [];
}

export default async function PlantsPage() {
  const plants = await fetchPlants();
  const emptyState = plants.length === 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-500">Inventory</p>
          <h1 className="text-3xl font-semibold text-slate-950">Plant catalog</h1>
        </div>
        <div className="flex gap-3 text-sm">
          <Link
            href="/admin/plants/new"
            className="rounded-full bg-emerald-600 px-4 py-1.5 font-semibold text-white shadow-emerald-500/30 transition hover:bg-emerald-500"
          >
            New plant
          </Link>
          <button
            type="button"
            className="rounded-full border border-slate-200 px-4 py-1.5 font-medium text-slate-600 hover:border-emerald-200 hover:text-emerald-600"
          >
            Sync species
          </button>
        </div>
      </div>

      {emptyState ? (
        <div className="rounded-3xl border border-dashed border-emerald-200 bg-emerald-50/40 p-10 text-center text-slate-600">
          <p className="text-lg font-semibold text-slate-900">No plants yet</p>
          <p className="text-sm text-slate-600">
            Create a plant record from your phone to start building the catalog. Upload at least one cover
            photo to surface it on the public site.
          </p>
          <Link
            href="/admin/plants/new"
            className="mt-4 inline-flex rounded-full bg-slate-900 px-5 py-1.5 text-sm font-semibold text-white"
          >
            Add the first plant
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {plants.map((plant) => (
            <PlantCard key={plant.id} plant={plant} />
          ))}
        </div>
      )}
    </div>
  );
}


