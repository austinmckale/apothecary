import Image from "next/image";
import Link from "next/link";

type Feature = {
  title: string;
  detail: string;
  badge: string;
};

type RoadmapLane = {
  label: string;
  items: string[];
};

const features: Feature[] = [
  {
    title: "Plant Inventory",
    detail: "CRUD, tagging, and camera uploads straight to Supabase Storage.",
    badge: "Admin PWA",
  },
  {
    title: "AI Species ID",
    detail: "Edge Function bridges OpenAI Vision (or OSS) to auto-fill metadata.",
    badge: "Edge AI",
  },
  {
    title: "Timelapse Feed",
    detail: "Rolling public gallery that refreshes via cache-busted `latest.jpg`.",
    badge: "Media",
  },
  {
    title: "Merch & Stripe",
    detail: "Product grid feeding into Stripe Checkout + optional Printful.",
    badge: "Commerce",
  },
];

const roadmap: RoadmapLane[] = [
  {
    label: "Now",
    items: [
      "Finalize Supabase schema for plants/products/guides",
      "Ship camera-first PlantForm with optimistic updates",
      "Prototype species identification flow",
    ],
  },
  {
    label: "Next",
    items: [
      "Public timelapse page with `?t=` cache busting",
      "Guides powered by markdown + Tailwind `prose`",
      "Stripe webhook → order timeline in admin",
    ],
  },
  {
    label: "Later",
    items: [
      "Printful auto-fulfillment edge function",
      "AI-assisted care tips per growth stage",
      "Native-like PWA packaging + push alerts",
    ],
  },
];

const stack = [
  "Next.js App Router",
  "Tailwind CSS",
  "Supabase (Auth/Postgres/Storage)",
  "Stripe Checkout",
  "OpenAI / OSS Vision",
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-100 via-lime-50 to-white text-slate-900">
      <header className="sticky top-0 z-30 border-b border-emerald-100/60 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 text-sm font-semibold text-slate-700 lg:px-12">
          <Link href="/" className="flex items-center gap-2 text-slate-900">
            <span>🌱 Libby&apos;s Apothecary</span>
          </Link>
          <Link
            href="/admin"
            className="rounded-full bg-emerald-600 px-4 py-1.5 text-white shadow-emerald-500/30 transition hover:bg-emerald-500"
          >
            Open Admin Dashboard
          </Link>
        </div>
      </header>
      <main className="mx-auto flex max-w-6xl flex-col gap-16 px-6 pb-24 pt-12 lg:px-12">
        <section className="grid gap-10 rounded-3xl border border-emerald-200 bg-white/70 p-10 shadow-2xl shadow-emerald-100/60 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-8">
            <p className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1 text-sm font-semibold text-emerald-700">
              LIBBY&apos;S AROID APOTHECARY · DIGITAL GREENHOUSE
            </p>
            <h1 className="text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl">
              Manage every plant, sale, and story from one PWA-ready dashboard.
            </h1>
            <p className="text-lg text-slate-600">
              This repo pairs a Next.js frontend with Supabase services, AI species
              identification, Stripe commerce flows, and a cozy public garden experience.
              The hero tasks below are the fastest path to a demo-ready release.
            </p>
            <div className="flex flex-wrap gap-3 text-sm font-semibold">
              <a
                className="rounded-full bg-emerald-600 px-5 py-2 text-white shadow-lg shadow-emerald-600/30 transition hover:bg-emerald-500"
                href="https://supabase.com/"
                target="_blank"
                rel="noreferrer"
              >
                Connect Supabase
              </a>
              <a
                className="rounded-full border border-slate-200 px-5 py-2 text-slate-700 hover:border-emerald-300 hover:text-emerald-700"
                href="https://nextjs.org"
                target="_blank"
                rel="noreferrer"
              >
                Next.js Docs
              </a>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-slate-950/95 p-6 text-white shadow-xl shadow-emerald-200/20">
              <p className="text-sm uppercase tracking-[0.2em] text-emerald-300">
                Launch Checklist
              </p>
              <ul className="mt-6 space-y-4 text-sm text-emerald-50">
                <li>✅ Create Next.js + Tailwind shell (done)</li>
                <li>⬜ Plant schema + seed data</li>
                <li>⬜ Mobile admin PWA shell</li>
                <li>⬜ Supabase Storage uploads from device camera</li>
                <li>⬜ Stripe SKU sync + checkout</li>
                <li>⬜ Timelapse ingestion + viewer</li>
              </ul>
              <p className="mt-6 text-xs text-emerald-200">
                Mirror these milestones in GitHub Projects / Linear to keep momentum visible.
              </p>
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
                Crafted for the curator, the caretaker, and the community that follows every
                new unfurling leaf.
              </p>
              <div className="flex flex-wrap justify-center gap-3 text-xs uppercase tracking-[0.3em] text-emerald-200">
                <span className="rounded-full border border-white/10 px-4 py-2">
                  PWA READY
                </span>
                <span className="rounded-full border border-white/10 px-4 py-2">
                  SUPABASE
                </span>
                <span className="rounded-full border border-white/10 px-4 py-2">
                  STRIPE
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-semibold text-slate-950">Core Systems</h2>
            <span className="text-sm uppercase tracking-[0.3em] text-slate-400">
              Phase 1
            </span>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-lg shadow-emerald-50"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-500">
                  {feature.badge}
                </span>
                <h3 className="text-2xl font-semibold text-slate-900">{feature.title}</h3>
                <p className="text-slate-600">{feature.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-4 rounded-3xl border border-slate-200 bg-slate-950/90 p-10 text-slate-100 shadow-emerald-100/20">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-emerald-300">Stack</p>
              <h2 className="text-3xl font-semibold text-white">Tech Garden</h2>
            </div>
            <p className="text-slate-400">
              Ship confidently with typed APIs, end-to-end auth, and infra-as-code.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {stack.map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm"
              >
                {item}
              </span>
            ))}
          </div>
        </section>

        <section className="space-y-8">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-500">
              Delivery Map
            </p>
            <h2 className="text-3xl font-semibold text-slate-950">
              Roadmap snapshots to keep everyone aligned
            </h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {roadmap.map((lane) => (
              <article
                key={lane.label}
                className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-lg shadow-emerald-50"
              >
                <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
                  {lane.label}
                </h3>
                <ul className="mt-4 space-y-3 text-sm text-slate-600">
                  {lane.items.map((item) => (
                    <li className="flex items-start gap-2" key={item}>
                      <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
