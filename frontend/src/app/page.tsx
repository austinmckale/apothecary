import Image from "next/image";
import Link from "next/link";

import { getAllGuides } from "@/lib/guides";
import { getLatestGalleryPhotos } from "@/lib/gallery";

const serviceHighlights = [
  { label: "Small batch greenhouse", detail: "Over 180 aroids in rotation", icon: "🌿" },
  { label: "Care concierge", detail: "Personalized watering & light plans", icon: "📋" },
  { label: "Timelapse feed", detail: "Daily uploads from our grow benches", icon: "📷" },
];

const experienceTiles = [
  {
    title: "Shop rare aroids",
    copy: "Hand-selected Alocasias, Syngoniums, and climbers acclimated to home environments.",
    action: "Browse inventory",
  },
  {
    title: "Book a greenhouse visit",
    copy: "See the collection in person, pick up pre-orders, and chat with Libby about propagation.",
    action: "Plan a visit",
  },
  {
    title: "Follow the grow journal",
    copy: "Weekly timelapse, pest reports, and seasonal recipes from our care team.",
    action: "Read the journal",
  },
];

export default async function Home() {
  const guides = getAllGuides().slice(0, 3);
  const gallery = await getLatestGalleryPhotos(6);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-lime-50 to-white text-slate-900">
      <header className="sticky top-0 z-30 border-b border-emerald-100/60 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 text-sm font-semibold text-slate-700 lg:px-12">
          <Link href="/" className="flex items-center gap-2 text-slate-900">
            <span>🌱 Libby&apos;s Apothecary</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/guides" className="text-slate-600 hover:text-emerald-700">
              Guides
            </Link>
            <Link
              href="/admin"
              className="rounded-full bg-emerald-600 px-4 py-1.5 text-white shadow-emerald-500/30 transition hover:bg-emerald-500"
            >
              Open Admin Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-16 px-6 pb-24 pt-12 lg:px-12">
        <section className="grid gap-10 rounded-3xl border border-emerald-200 bg-white/80 p-10 shadow-2xl shadow-emerald-100/40 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <p className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1 text-xs font-semibold tracking-[0.3em] text-emerald-700">
              LANCASTER · SMALL-BATCH AROID STUDIO
            </p>
            <h1 className="text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl">
              Living sculptures, curated care, and a timelapse window into Libby&apos;s greenhouse.
            </h1>
            <p className="text-lg text-slate-600">
              We grow and ship collector-grade Alocasias, Syngoniums, and climbers—plus the care plans,
              workshops, and digital tools that keep them thriving in your space.
            </p>
            <div className="flex flex-wrap gap-4 text-sm font-semibold">
              <Link
                className="rounded-full bg-emerald-600 px-5 py-2 text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-500"
                href="/guides"
              >
                Explore care guides
              </Link>
              <Link
                className="rounded-full border border-slate-200 px-5 py-2 text-slate-700 hover:border-emerald-300 hover:text-emerald-700"
                href="/admin/plants"
              >
                View inventory beta
              </Link>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-8 text-white shadow-emerald-900/40">
            <div className="pointer-events-none absolute -top-10 right-4 h-56 w-56 rounded-full bg-emerald-400/40 blur-3xl" />
            <div className="pointer-events-none absolute bottom-4 left-0 h-40 w-40 rounded-full bg-amber-200/20 blur-3xl" />
            <div className="relative flex flex-col items-center gap-6 text-center">
              <div className="rounded-full border border-emerald-700/60 bg-emerald-50/10 p-6 shadow-2xl shadow-black/40">
                <Image
                  src="/logo.png"
                  alt="Libby's Aroid Apothecary emblem"
                  width={220}
                  height={220}
                  className="mix-blend-screen"
                  priority
                />
              </div>
              <p className="text-lg text-emerald-100">
                Shop visits · Care concierge · Remote monitoring · Stripe-powered drops
              </p>
              <div className="flex flex-wrap justify-center gap-3 text-xs uppercase tracking-[0.3em] text-emerald-200">
                <span className="rounded-full border border-white/10 px-4 py-2">TIMELAPSE</span>
                <span className="rounded-full border border-white/10 px-4 py-2">SUPABASE</span>
                <span className="rounded-full border border-white/10 px-4 py-2">AI CARE</span>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 rounded-3xl border border-slate-100 bg-white/90 p-8 shadow-emerald-50/70 md:grid-cols-3">
          {serviceHighlights.map((item) => (
            <div key={item.label} className="flex flex-col gap-2">
              <span className="text-2xl">{item.icon}</span>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-[0.3em]">
                {item.label}
              </p>
              <p className="text-lg font-semibold text-slate-900">{item.detail}</p>
            </div>
          ))}
        </section>

        <section className="space-y-8">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-500">
              Experiences
            </p>
            <h2 className="text-3xl font-semibold text-slate-950">Choose your greenhouse adventure</h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {experienceTiles.map((tile) => (
              <article
                key={tile.title}
                className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm shadow-emerald-50"
              >
                <h3 className="text-2xl font-semibold text-slate-900">{tile.title}</h3>
                <p className="text-sm text-slate-600">{tile.copy}</p>
                <span className="text-sm font-semibold text-emerald-600">{tile.action} →</span>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-6 rounded-3xl border border-slate-200 bg-slate-950/90 p-10 text-slate-100 shadow-emerald-100/20">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-emerald-300">Care resources</p>
              <h2 className="text-3xl font-semibold text-white">Latest guides from Libby&apos;s journal</h2>
            </div>
            <Link
              href="/guides"
              className="rounded-full border border-white/20 px-4 py-1.5 text-sm font-semibold text-white hover:border-emerald-200 hover:text-emerald-200"
            >
              View all guides
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {guides.map((guide) => (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-white transition hover:border-emerald-200 hover:bg-white/10"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">{guide.date.slice(0, 10)}</p>
                <h3 className="text-lg font-semibold">{guide.title}</h3>
                <p className="text-sm text-white/70">{guide.excerpt}</p>
              </Link>
            ))}
          </div>
        </section>
        {gallery.length > 0 && (
          <section className="space-y-4 rounded-3xl border border-slate-100 bg-white/80 p-8 shadow-emerald-50/50">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500">
                  Fresh snaps
                </p>
                <h2 className="text-3xl font-semibold text-slate-950">Greenhouse photo stream</h2>
              </div>
              <Link href="/timelapse" className="text-sm font-semibold text-emerald-600">
                View timelapse →
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {gallery.map((shot) => (
                <figure
                  key={shot.id}
                  className="group overflow-hidden rounded-2xl border border-slate-100 bg-slate-50"
                >
                  <Image
                    src={shot.url}
                    alt={shot.alt ?? shot.title}
                    width={600}
                    height={500}
                    className="h-60 w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  <figcaption className="p-4">
                    <p className="text-sm font-semibold text-slate-900">{shot.title}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(shot.captured_at).toLocaleDateString()} · {shot.source}
                    </p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

