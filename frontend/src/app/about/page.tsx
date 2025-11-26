import Link from "next/link";

const highlights = [
  {
    title: "Syngonium atelier",
    detail:
      "Fast-growing vines acclimated to reading light, trained on moss poles, and offered as pups, vines, or mounted cuttings.",
  },
  {
    title: "Alocasia corm lab",
    detail:
      "Small-batch corm awakenings with velvet foliage, each rooted in our self-watering 3D printed vessels for easy acclimation.",
  },
  {
    title: "Begonia stained glass",
    detail:
      "Statement leaves with dramatic color stories, propagated in bioactive mix for collectors who crave texture and glow.",
  },
];

const values = [
  {
    label: "Intentional batches",
    copy: "We grow in micro cohorts, tracking every pup from corm to rooted plant so adopters know the full lineage.",
  },
  {
    label: "Transparent care",
    copy: "Vitals, watering schedules, and acclimation notes accompany every plant, plus access to live sensor data.",
  },
  {
    label: "Community greenhouse",
    copy: "Monthly salons, cutting swaps, and livestreams keep the Reading plant family connected year-round.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-lime-50 text-slate-900">
      <header className="border-b border-emerald-100 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-12 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-emerald-500">Reading, Pennsylvania</p>
          <h1 className="text-4xl font-serif leading-tight text-slate-950 sm:text-5xl">
            Rare aroids, conjured with patience and practical magic.
          </h1>
          <p className="text-base text-slate-600 sm:text-lg">
            Alivia&apos;s Apothecary is a greenhouse atelier focused on Syngonium, Alocasia, and select Begonias. We
            combine collector knowledge, timelapse data, and concierge care to help each plant find its perfect home.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm font-semibold">
            <Link
              href="/plants"
              className="rounded-full bg-emerald-600 px-5 py-2 text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-500"
            >
              Shop plants
            </Link>
            <Link
              href="/guides"
              className="rounded-full border border-slate-200 px-5 py-2 text-slate-700 hover:border-emerald-300 hover:text-emerald-700"
            >
              Read care guides
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-12">
        <section className="rounded-3xl border border-emerald-100 bg-white/90 p-8 shadow-emerald-100/50">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-5">
              <h2 className="text-3xl font-serif text-slate-950">Meet Alivia</h2>
              <p className="text-slate-600">
                Botanist, greenhouse tinkerer, and your plant concierge. Libby started the apothecary after years of
                quietly reviving neglected Syngoniums and coaxing Alocasia corms back to life for friends. Each batch is
                documented in Supabase so the admin dashboard mirrors the greenhouse shelves—photos, vitals, and sensor
                readings included.
              </p>
              <p className="text-slate-600">
                We design 3D-printed corm vessels with hidden reservoirs, capture daily timelapse frames, and run AI
                species checks before releasing any plant. The result: rooted companions that arrive ready for your
                ritual, plus the education to keep them glowing.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-100 bg-slate-50 p-6 text-sm text-slate-600">
              <p className="text-xs uppercase tracking-[0.35em] text-emerald-500">Greenhouse vitals</p>
              <ul className="mt-4 space-y-3">
                <li className="flex justify-between">
                  <span>Pups in rotation</span>
                  <span className="font-semibold text-slate-900">180+</span>
                </li>
                <li className="flex justify-between">
                  <span>Active corm awakenings</span>
                  <span className="font-semibold text-slate-900">42</span>
                </li>
                <li className="flex justify-between">
                  <span>Timelapse frames per day</span>
                  <span className="font-semibold text-slate-900">96</span>
                </li>
                <li className="flex justify-between">
                  <span>Concierge clients</span>
                  <span className="font-semibold text-slate-900">28 households</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {highlights.map((highlight) => (
            <article key={highlight.title} className="rounded-2xl border border-slate-100 bg-white/90 p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-500">{highlight.title}</p>
              <p className="mt-3 text-sm text-slate-600">{highlight.detail}</p>
            </article>
          ))}
        </section>

        <section className="rounded-3xl border border-emerald-100 bg-slate-950/95 p-8 text-slate-50 shadow-lg shadow-slate-900/60">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-emerald-200">Our promise</p>
              <h2 className="text-3xl font-serif text-white">Care that follows you home</h2>
            </div>
            <div className="text-sm text-slate-300">
              Live vitals, care logs, and greenhouse alerts are synced through the admin dashboard so your plant data is
              always current.
            </div>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {values.map((value) => (
              <div key={value.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold text-white">{value.label}</p>
                <p className="mt-2 text-xs text-white/70">{value.copy}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4 rounded-3xl border border-slate-100 bg-white/90 p-8 shadow-emerald-50/40">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-500">
                Join the Reading greenhouse
              </p>
              <h2 className="text-3xl font-serif text-slate-950">Visit, stream, or adopt</h2>
            </div>
            <div className="text-sm text-slate-600">
              Schedule concierge hours, peek at the live timelapse, or request a custom planting in our printed corm
              pots.
            </div>
          </div>
          <div className="flex flex-wrap gap-3 text-sm font-semibold">
            <Link
              href="/timelapse"
              className="rounded-full border border-slate-200 px-5 py-2 text-slate-700 hover:border-emerald-300 hover:text-emerald-700"
            >
              Watch the timelapse
            </Link>
            <Link
              href="/plants"
              className="rounded-full bg-slate-950 px-5 py-2 text-white shadow shadow-slate-900/30 transition hover:bg-slate-800"
            >
              Request concierge session
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

