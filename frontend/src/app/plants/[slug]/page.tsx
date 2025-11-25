import Image from "next/image";
import { notFound } from "next/navigation";

import { fetchPublicPlant } from "@/lib/supabase/queries";
import { formatCurrency } from "@/util/format";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  return [];
}

export default async function PlantPublicPage({ params }: Props) {
  const { slug } = await params;
  const plant = await fetchPublicPlant(slug);
  if (!plant) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <article className="mx-auto max-w-4xl px-6 py-12">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500">
            {plant.species ?? "Unknown species"}
          </p>
          <h1 className="text-4xl font-bold text-slate-950">{plant.name}</h1>
          {plant.description && <p className="text-lg text-slate-600">{plant.description}</p>}
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-[1.6fr_0.4fr]">
          <div className="grid gap-4">
            {plant.plant_photos?.map((photo) => (
              <div key={photo.id} className="relative overflow-hidden rounded-3xl border border-slate-100 bg-slate-50">
                <Image
                  src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${photo.storage_path}`}
                  alt={photo.alt ?? plant.name}
                  width={1200}
                  height={900}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
            {!plant.plant_photos?.length && (
              <div className="rounded-3xl border border-slate-100 bg-slate-50 p-10 text-center text-slate-500">
                Photo gallery coming soon.
              </div>
            )}
          </div>
          <div className="space-y-6 rounded-3xl border border-slate-100 bg-emerald-50 p-6">
            <div>
              <p className="text-sm font-semibold text-slate-500">Status</p>
              <p className="text-2xl font-semibold text-slate-900">In cultivation</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">Last updated</p>
              <p className="text-lg text-slate-900">{new Date(plant.updated_at).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">Estimated price range</p>
              <p className="text-xl font-semibold text-slate-900">{formatCurrency(15000)}</p>
            </div>
            <button className="w-full rounded-full bg-emerald-600 px-4 py-2 font-semibold text-white transition hover:bg-emerald-500">
              Request this plant
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}


