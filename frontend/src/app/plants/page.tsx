import Link from "next/link";

import PlantGrid from "@/components/plant/PlantGrid";
import { fetchPublicPlants } from "@/lib/supabase/queries";

export const metadata = {
  title: "Plant Catalog · Libby's Aroid Apothecary",
};

export default async function PlantsCatalogPage() {
  const plants = await fetchPublicPlants();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-emerald-50/40 to-white">
      <header className="border-b border-emerald-100 bg-white/70">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 text-sm text-slate-600 lg:px-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">Aroid catalog</p>
            <h1 className="text-3xl font-semibold text-slate-900">Available plants</h1>
          </div>
          <Link href="/guides" className="font-semibold text-emerald-600 hover:text-emerald-500">
            Care guides →
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-10 px-6 py-12 lg:px-12">
        {plants.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-emerald-200 bg-white/70 p-10 text-center text-slate-500">
            <p className="text-lg font-semibold text-slate-900">No public listings yet</p>
            <p className="text-sm">Check back soon or follow @libbys_apothecary for drop alerts.</p>
          </div>
        ) : (
          <PlantGrid plants={plants} />
        )}
      </main>
    </div>
  );
}


