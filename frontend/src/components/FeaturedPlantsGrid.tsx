import ProductCard from "@/components/ProductCard";
import type { FeaturedPlant } from "@/content/featured-plants";

type FeaturedPlantsGridProps = {
  plants: FeaturedPlant[];
};

export default function FeaturedPlantsGrid({ plants }: FeaturedPlantsGridProps) {
  return (
    <section className="space-y-4 rounded-3xl border border-slate-100 bg-white/90 p-8 shadow-emerald-50/70">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-500">Featured inventory</p>
          <h2 className="text-3xl font-serif text-slate-950">Adopt from the current batch</h2>
        </div>
        <p className="text-sm text-slate-600">Highlights from Syngonium, Alocasia, and Begonia cohorts.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {plants.map((plant) => (
          <ProductCard key={plant.name} {...plant} />
        ))}
      </div>
    </section>
  );
}

