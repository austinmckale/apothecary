import Link from "next/link";

import PlantForm from "@/components/admin/PlantForm";

export const metadata = {
  title: "New Plant · Admin",
};

export default function NewPlantPage() {
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


