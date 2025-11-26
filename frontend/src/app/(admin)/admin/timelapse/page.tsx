import Image from "next/image";

import { getTimelapseSessions } from "@/lib/timelapse-admin";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { CreateSessionForm } from "@/components/admin/CreateSessionForm";
import { ManualFrameUploadForm } from "@/components/admin/ManualFrameUploadForm";

async function getRecentFrames() {
  const supabase = await getSupabaseServerClient();
  const { data } = await supabase
    .from("timelapse_frames")
    .select("id, captured_at, storage_path, camera_label, temperature, humidity")
    .order("captured_at", { ascending: false })
    .limit(8);
  return data ?? [];
}

export default async function AdminTimelapsePage() {
  const sessions = await getTimelapseSessions();
  const frames = await getRecentFrames();

  return (
    <div className="space-y-10">
      <section className="rounded-3xl border border-slate-200 bg-white p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-500">Sessions</p>
            <h2 className="text-2xl font-semibold text-slate-900">Camera runs</h2>
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {sessions.map((session) => (
            <div key={session.id} className="rounded-2xl border border-slate-100 p-4">
              <p className="text-sm font-semibold text-slate-500">{session.camera_label ?? "Default cam"}</p>
              <p className="text-xl font-semibold text-slate-900">
                Every {session.interval_minutes} min · {session.is_active ? "Active" : "Stopped"}
              </p>
              <p className="text-xs text-slate-500">
                Started {session.started_at ? new Date(session.started_at).toLocaleString() : "—"}
              </p>
            </div>
          ))}
          {sessions.length === 0 && (
            <div className="col-span-full rounded-2xl border border-dashed border-slate-200 p-6 text-slate-500">
              No sessions yet. Use the form below to create one.
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <h3 className="text-xl font-semibold text-slate-900">Start new session</h3>
          <CreateSessionForm />
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <h3 className="text-xl font-semibold text-slate-900">Manual frame upload</h3>
          <ManualFrameUploadForm sessions={sessions} />
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6">
        <h3 className="text-xl font-semibold text-slate-900">Recent frames</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-4">
          {frames.map((frame) => (
            <div key={frame.id} className="rounded-2xl border border-slate-100 overflow-hidden">
              <div className="relative h-40">
                <Image
                  src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${frame.storage_path}`}
                  alt={frame.camera_label ?? "Frame"}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-3 text-sm">
                <p className="font-semibold text-slate-900">{frame.camera_label ?? "Default"}</p>
                <p className="text-xs text-slate-500">{new Date(frame.captured_at).toLocaleString()}</p>
                <p className="text-xs text-slate-500">
                  {frame.temperature ? `${frame.temperature}°F` : "—"} · {frame.humidity ? `${frame.humidity}% RH` : "—"}
                </p>
              </div>
            </div>
          ))}
          {frames.length === 0 && (
            <div className="text-sm text-slate-500">No frames captured yet.</div>
          )}
        </div>
      </section>
    </div>
  );
}
