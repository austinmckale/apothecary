import Link from "next/link";

const mockAlerts = [
  {
    title: "Camera feed paused",
    detail: "Timelapse camera has not uploaded in 4 hours. Check power + Wi-Fi.",
    actionLabel: "View timelapse",
    href: "/admin/timelapse",
  },
  {
    title: "Low humidity warning",
    detail: "Propagation tent dipped below 60% for 2 hours.",
    actionLabel: "Open climate log",
    href: "/admin/settings",
  },
];

const quickStats = [
  { label: "Plants catalogued", value: "128", delta: "+6 this week" },
  { label: "Active products", value: "24", delta: "Stripe synced" },
  { label: "Open orders", value: "5", delta: "2 waiting for pickup" },
  { label: "Timelapse frames", value: "1,482", delta: "+24 today" },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-emerald-500">Preview site</p>
            <h1 className="text-2xl font-semibold text-slate-950">Public storefront quick link</h1>
            <p className="text-sm text-slate-500">
              Jump out to the public site to verify new photos, timelapse frames, or shop updates.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-900/30 transition hover:bg-slate-800"
          >
            View public site
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {quickStats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-white/60 bg-white p-4 shadow-sm shadow-slate-200"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{stat.label}</p>
            <p className="mt-2 text-3xl font-semibold text-slate-950">{stat.value}</p>
            <p className="text-xs text-emerald-600">{stat.delta}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/70">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-emerald-500">Today</p>
              <h2 className="text-2xl font-semibold text-slate-950">Garden operations</h2>
            </div>
            <Link
              href="/admin/plants"
              className="text-sm font-medium text-emerald-600 hover:text-emerald-500"
            >
              Manage plants →
            </Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                Capture queue
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">6 plants need new photos</p>
              <p className="text-xs text-slate-500">Tap to open camera with pre-filled plant</p>
              <button
                type="button"
                className="mt-4 rounded-full bg-slate-900 px-4 py-1.5 text-sm font-semibold text-white"
              >
                Open capture mode
              </button>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                AI assists
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">Species suggestions ready</p>
              <p className="text-xs text-slate-500">Upload photos, tap “Identify species”.</p>
              <button
                type="button"
                className="mt-4 rounded-full border border-emerald-200 px-4 py-1.5 text-sm font-semibold text-emerald-700"
              >
                Review matches
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {mockAlerts.map((alert) => (
            <div
              key={alert.title}
              className="rounded-2xl border border-amber-100 bg-amber-50/80 p-5 text-amber-900 shadow-sm shadow-amber-100"
            >
              <p className="text-sm font-semibold">{alert.title}</p>
              <p className="text-xs text-amber-800">{alert.detail}</p>
              <Link
                href={alert.href}
                className="mt-3 inline-flex text-xs font-semibold text-amber-900 underline"
              >
                {alert.actionLabel}
              </Link>
            </div>
          ))}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">Next steps</p>
            <ul className="mt-3 space-y-2 text-xs text-slate-600">
              <li>• Connect Stripe keys to enable checkout</li>
              <li>• Map Supabase storage bucket for plant photos</li>
              <li>• Configure roles for greenhouse staff accounts</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-slate-950/95 p-6 text-white shadow-lg shadow-slate-900/50">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-emerald-300">Live feed</p>
            <h2 className="text-2xl font-semibold">Latest timelapse frames</h2>
            <p className="text-sm text-white/70">
              Hook this widget up to Supabase Storage once uploads are automated.
            </p>
          </div>
          <button
            type="button"
            className="rounded-full border border-white/20 px-4 py-1.5 text-sm font-semibold text-white hover:border-emerald-200 hover:text-emerald-200"
          >
            Configure cameras
          </button>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {['Morning stretch', 'Midday bloom', 'Golden hour glow'].map((label) => (
            <div
              key={label}
              className="rounded-2xl bg-gradient-to-br from-slate-800 via-slate-900 to-black p-4 text-sm text-white/80"
            >
              <div className="mb-3 h-32 rounded-xl bg-black/30" />
              <p>{label}</p>
              <p className="text-xs text-white/50">Placeholder still</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}


