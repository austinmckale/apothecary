import Link from "next/link";

import PlantForm from "@/components/admin/PlantForm";

export const metadata = {
  title: "New Plant · Admin",
};

type NewPlantPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function NewPlantPage({ searchParams }: NewPlantPageProps) {
  const params = await searchParams;
  const sourcePhoto = typeof params?.source_photo === 'string' ? params.source_photo : undefined;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-500">
            Inventory
          </p>
          <h1 className="text-3xl font-semibold text-slate-950">New plant</h1>
          <p className="text-sm text-slate-500">
            Capture the essentials now, add photos as you go.
          </p>
          {sourcePhoto && (
            <p className="mt-2 text-xs text-emerald-700">
              Linking gallery photo <span className="font-mono text-emerald-900">{sourcePhoto}</span>. Uploaded images will attach automatically.
            </p>
          )}
        </div>
        <Link
          href="/admin/plants"
          className="rounded-full border border-slate-200 px-4 py-1.5 text-sm font-semibold text-slate-600 hover:border-emerald-200 hover:text-emerald-600"
        >
          ← Back to catalog
        </Link>
      </div>
      <PlantForm />
    </div>
  );
}


