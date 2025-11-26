import Link from "next/link";

const collections = [
  {
    name: "Syngonium",
    tagline: "Vining variegation, forgiving growth, ready for poles.",
    href: "/plants?category=syngonium",
    accent: "from-[#d9f99d] to-[#86efac]",
  },
  {
    name: "Alocasia",
    tagline: "Corm awakenings, velvet textures, small-batch pups.",
    href: "/plants?category=alocasia",
    accent: "from-[#bfdbfe] to-[#c4b5fd]",
  },
  {
    name: "Begonia",
    tagline: "Living stained glass with iridescent leaves.",
    href: "/plants?category=begonia",
    accent: "from-[#fecdd3] to-[#fef9c3]",
  },
];

export default function FeaturedCollectionsRow() {
  return (
    <section className="grid gap-4 rounded-3xl border border-slate-100 bg-white/90 p-8 shadow-emerald-50/70 md:grid-cols-3">
      {collections.map((collection) => (
        <article
          key={collection.name}
          className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
        >
          <div className={`h-32 rounded-2xl bg-gradient-to-br ${collection.accent}`} />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-500">Featured</p>
            <h3 className="mt-2 text-2xl font-serif text-slate-950">{collection.name}</h3>
            <p className="text-sm text-slate-600">{collection.tagline}</p>
          </div>
          <Link
            href={collection.href}
            className="text-sm font-semibold text-emerald-600 hover:text-emerald-500"
          >
            Shop {collection.name} →
          </Link>
        </article>
      ))}
    </section>
  );
}

