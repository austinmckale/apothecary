import { FrameHero } from "@/components/timelapse/FrameHero";
import { FrameTimeline } from "@/components/timelapse/FrameTimeline";
import { getLatestTimelapseFrames } from "@/lib/timelapse";
import PublicShell from "@/components/PublicShell";

export const metadata = {
  title: "Greenhouse Timelapse · Libby's Apothecary",
};

export default async function TimelapsePage() {
  const frames = await getLatestTimelapseFrames();
  const [latest, ...history] = frames;

  return (
    <PublicShell>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-emerald-50/40">
        <header className="border-b border-emerald-100 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-8 lg:px-12">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-500">Live diary</p>
            <h1 className="text-4xl font-semibold text-slate-950">Greenhouse Timelapse</h1>
            <p className="text-sm text-slate-500">
              Automatic frames every 15 minutes, plus sensor data from the propagation bench.
            </p>
          </div>
        </header>

        <main className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-10 lg:px-12">
          {latest ? (
            <FrameHero frame={latest} />
          ) : (
            <div className="rounded-3xl border border-dashed border-emerald-200 bg-white/80 p-10 text-center text-slate-500">
              Timelapse feed will appear here once frames are uploaded.
            </div>
          )}

          {history.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-900">Previous frames</h2>
              <FrameTimeline frames={history} />
            </section>
          )}
        </main>
      </div>
    </PublicShell>
  );
}
