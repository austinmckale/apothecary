import Link from 'next/link';

import type { Plant } from '@/types/plant';

type PlantCardProps = {
  plant: Plant;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(value));
}

export default function PlantCard({ plant }: PlantCardProps) {
  return (
    <article className="flex flex-col rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm shadow-slate-200/70">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
            {plant.species ?? 'Unknown species'}
          </p>
          <h3 className="text-xl font-semibold text-slate-950">{plant.name}</h3>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            plant.is_public ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
          }`}
        >
          {plant.is_public ? 'Public' : 'Private'}
        </span>
      </div>
      <p className="mt-3 line-clamp-2 text-sm text-slate-600">{plant.description ?? 'No notes yet.'}</p>

      <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-500">
        {plant.light_requirements && (
          <span className="rounded-full bg-slate-50 px-3 py-1">Light · {plant.light_requirements}</span>
        )}
        {plant.water_schedule && (
          <span className="rounded-full bg-slate-50 px-3 py-1">Water · {plant.water_schedule}</span>
        )}
        {plant.temperature_range && (
          <span className="rounded-full bg-slate-50 px-3 py-1">Temp · {plant.temperature_range}</span>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
        <p>Updated {formatDate(plant.updated_at)}</p>
        <Link
          href={`/admin/plants/${plant.id}`}
          className="text-xs font-semibold text-emerald-600 hover:text-emerald-500"
        >
          Open →
        </Link>
      </div>
    </article>
  );
}


