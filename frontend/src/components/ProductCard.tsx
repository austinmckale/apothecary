import Image from "next/image";

import type { FeaturedPlant } from "@/content/featured-plants";

export default function ProductCard({
  name,
  category,
  stage,
  rootStatus,
  price,
  tags,
  image,
  description,
}: FeaturedPlant) {
  return (
    <article className="flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm shadow-emerald-50/70">
      <div className="relative h-48 w-full">
        <Image src={image} alt={name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 400px" />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex justify-between text-xs uppercase tracking-[0.35em] text-emerald-500">
          <span>{category}</span>
          <span>{stage}</span>
        </div>
        <h3 className="text-xl font-semibold text-slate-950">{name}</h3>
        <p className="text-sm text-slate-600">{description}</p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-auto flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Root status</p>
            <p className="text-sm text-slate-900">{rootStatus}</p>
          </div>
          <p className="text-2xl font-semibold text-slate-950">
            {price.toLocaleString("en-US", { style: "currency", currency: "USD" })}
          </p>
        </div>
      </div>
    </article>
  );
}

