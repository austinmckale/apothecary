import Image from "next/image";
import Link from "next/link";

import type { PlantWithPhotos } from "@/types/plant";

type Props = {
  plants: PlantWithPhotos[];
};

export default function PlantGrid({ plants }: Props) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {plants.map((plant) => {
        const cover = plant.plant_photos?.find((photo) => photo.is_cover) ?? plant.plant_photos?.[0];
        return (
          <Link
            key={plant.id}
            href={`/plants/${plant.slug}`}
            className="group overflow-hidden rounded-3xl border border-slate-200 bg-white/80 shadow-sm shadow-emerald-50 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="relative h-64 w-full overflow-hidden bg-slate-100">
              {cover ? (
                <Image
                  src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${cover.storage_path}`}
                  alt={cover.alt ?? plant.name}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-slate-400">No photo</div>
              )}
            </div>
            <div className="space-y-2 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-500">{plant.species ?? "Unknown species"}</p>
              <h3 className="text-xl font-semibold text-slate-900">{plant.name}</h3>
              <p className="text-sm text-slate-600 line-clamp-2">
                {plant.description ?? "Care notes coming soon."}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}


