import Link from "next/link";

type HeroSectionProps = {
  stats: {
    label: string;
    value: string;
  }[];
};

export default function HeroSection({ stats }: HeroSectionProps) {
  return (
    <section className="grid gap-10 rounded-3xl border border-emerald-200 bg-white/85 p-10 shadow-2xl shadow-emerald-100/40 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-6">
        <p className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1 text-xs font-semibold tracking-[0.35em] text-emerald-700">
          Reading, PA · Small-batch aroid studio
        </p>
        <h1 className="text-4xl font-serif leading-tight text-slate-950 sm:text-5xl">
          Rare Aroids, Pups, and Corms, Grown With Intention.
        </h1>
        <p className="text-lg text-slate-600">
          Syngonium vines, Alocasia awakenings, and Begonia stained glass—monitored, documented, and matched to caretakers
          with concierge support.
        </p>
        <div className="flex flex-wrap gap-3 text-sm font-semibold">
          <Link
            href="/plants"
            className="rounded-full bg-emerald-600 px-5 py-2 text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-500"
          >
            Shop plants
          </Link>
          <Link
            href="/plants?category=syngonium"
            className="rounded-full border border-slate-200 px-5 py-2 text-slate-700 hover:border-emerald-300 hover:text-emerald-700"
          >
            Browse Syngonium
          </Link>
          <Link
            href="/plants?category=alocasia"
            className="rounded-full border border-slate-200 px-5 py-2 text-slate-700 hover:border-emerald-300 hover:text-emerald-700"
          >
            Browse Alocasia
          </Link>
          <Link
            href="/timelapse"
            className="rounded-full border border-slate-200 px-5 py-2 text-slate-700 hover:border-emerald-300 hover:text-emerald-700"
          >
            Enter the greenhouse
          </Link>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-8 text-white shadow-emerald-900/40">
        <div className="pointer-events-none absolute -top-10 right-4 h-56 w-56 rounded-full bg-emerald-400/40 blur-3xl" />
        <div className="pointer-events-none absolute bottom-4 left-0 h-40 w-40 rounded-full bg-amber-200/20 blur-3xl" />
        <div className="relative flex flex-col gap-5">
          <p className="text-sm uppercase tracking-[0.4em] text-emerald-200">Greenhouse metrics</p>
          <div className="grid gap-3 text-sm text-emerald-50">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-2">
                <span className="text-xs uppercase tracking-[0.35em] text-emerald-200">{stat.label}</span>
                <span className="text-lg font-semibold">{stat.value}</span>
              </div>
            ))}
          </div>
          <div className="text-xs text-emerald-200/80">
            Live vitals mirrored to the admin dashboard so every adoption includes current care notes.
          </div>
        </div>
      </div>
    </section>
  );
}

