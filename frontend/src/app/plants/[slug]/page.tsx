import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { fetchPublicPlant } from "@/lib/supabase/queries";
import { formatCurrency } from "@/util/format";
import PublicShell from "@/components/PublicShell";

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

  const primaryPhoto = plant.plant_photos?.[0];
  const otherPhotos = plant.plant_photos?.slice(1) ?? [];

  return (
    <PublicShell>
      <div className="min-h-screen bg-slate-50 pb-20 pt-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <nav className="mb-8 flex items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="hover:text-emerald-600">Home</Link>
            <span>/</span>
            <Link href="/plants" className="hover:text-emerald-600">Plants</Link>
            <span>/</span>
            <span className="text-slate-900">{plant.name}</span>
          </nav>

          <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr]">
            {/* Left Column: Gallery */}
            <div className="space-y-6">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-slate-900/5">
                {primaryPhoto ? (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${primaryPhoto.storage_path}`}
                    alt={primaryPhoto.alt ?? plant.name}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 60vw"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-400">
                    No photos available
                  </div>
                )}
              </div>
              
              {otherPhotos.length > 0 && (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {otherPhotos.map((photo) => (
                    <div key={photo.id} className="relative aspect-square overflow-hidden rounded-2xl bg-white ring-1 ring-slate-900/5 transition hover:opacity-90">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${photo.storage_path}`}
                        alt={photo.alt ?? plant.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 20vw"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Details */}
            <div className="lg:sticky lg:top-10 lg:h-fit">
              <div className="mb-6">
                {plant.category && (
                   <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700 ring-1 ring-inset ring-emerald-600/10">
                    {plant.category}
                  </span>
                )}
                <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl font-serif">
                  {plant.name}
                </h1>
                {plant.species && (
                  <p className="mt-2 text-lg italic text-slate-500">{plant.species}</p>
                )}
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-baseline justify-between border-b border-slate-100 pb-6">
                  <p className="text-3xl font-medium text-slate-900">
                    {plant.price_cents ? formatCurrency(plant.price_cents) : 'Inquire'}
                  </p>
                  <div className="text-right">
                     {plant.in_stock ? (
                      <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        {plant.quantity ? `${plant.quantity} in stock` : 'In stock'}
                      </span>
                    ) : (
                      <span className="text-sm font-medium text-rose-500">Out of stock</span>
                    )}
                  </div>
                </div>

                <div className="py-6">
                  <p className="text-base leading-relaxed text-slate-600">
                    {plant.description || "A rare specimen from our private collection."}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4">
                  {plant.stage && (
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-xs font-medium uppercase text-slate-500">Stage</p>
                      <p className="font-medium capitalize text-slate-900">{plant.stage}</p>
                    </div>
                  )}
                  {plant.root_status && (
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-xs font-medium uppercase text-slate-500">Roots</p>
                      <p className="font-medium capitalize text-slate-900">{plant.root_status.replace('_', ' ')}</p>
                    </div>
                  )}
                </div>

                <div className="mt-6">
                  {plant.in_stock ? (
                    <button className="w-full rounded-full bg-slate-900 px-8 py-4 text-base font-bold text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800 hover:shadow-xl">
                      Add to collection
                    </button>
                  ) : (
                    <button disabled className="w-full cursor-not-allowed rounded-full bg-slate-100 px-8 py-4 text-base font-bold text-slate-400">
                      Sold out
                    </button>
                  )}
                  <p className="mt-3 text-center text-xs text-slate-400">
                    Secure checkout • Insulated shipping included
                  </p>
                </div>
              </div>

              <div className="mt-8 space-y-6">
                <h3 className="text-lg font-semibold text-slate-900">Care Requirements</h3>
                <dl className="grid gap-y-4 text-sm">
                  {[
                    { label: 'Light', value: plant.light_requirements },
                    { label: 'Water', value: plant.water_schedule },
                    { label: 'Humidity', value: plant.humidity_range },
                    { label: 'Temp', value: plant.temperature_range },
                  ].filter(item => item.value).map((item) => (
                    <div key={item.label} className="flex items-start justify-between border-b border-slate-100 pb-4 last:border-0">
                      <dt className="font-medium text-slate-500">{item.label}</dt>
                      <dd className="max-w-[60%] text-right font-medium text-slate-900">{item.value}</dd>
                    </div>
                  ))}
                </dl>
                
                {plant.care_notes && (
                  <div className="rounded-2xl bg-indigo-50/50 p-5">
                    <div className="flex gap-2 text-indigo-900">
                      <svg className="h-5 w-5 flex-none" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm leading-relaxed font-medium">
                        <span className="block font-bold text-xs uppercase tracking-wider mb-1 opacity-70">Expert Note</span>
                        {plant.care_notes}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicShell>
  );
}
