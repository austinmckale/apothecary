import Image from "next/image";

import { getTimelapseSessions } from "@/lib/timelapse-admin";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import {
  createTimelapseSessionAction,
  uploadTimelapseFrameAction,
} from "@/lib/timelapse/actions";

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
          <form action={createTimelapseSessionAction} className="mt-4 space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-600">Camera label</label>
              <input
                name="camera_label"
                className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2"
                placeholder="North bench"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-600">Interval (minutes)</label>
              <input
                name="interval_minutes"
                type="number"
                min={1}
                defaultValue={15}
                className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2"
              />
            </div>
            <button className="rounded-full bg-emerald-600 px-4 py-2 font-semibold text-white">Create session</button>
          </form>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <h3 className="text-xl font-semibold text-slate-900">Manual frame upload</h3>
          <form action={uploadTimelapseFrameAction} className="mt-4 space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-600">Session</label>
              <select name="session_id" className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2">
                <option value="">No session</option>
                {sessions.map((session) => (
                  <option key={session.id} value={session.id}>
                    {session.camera_label ?? "Default"} · {session.interval_minutes}m
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-600">Captured at</label>
              <input
                type="datetime-local"
                name="captured_at"
                defaultValue={new Date().toISOString().slice(0, 16)}
                className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-600">Photo</label>
              <input type="file" name="photo" accept="image/*" required className="mt-1 w-full" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-slate-500">Temp °F</label>
                <input name="temperature" type="number" step="0.1" className="w-full rounded-2xl border px-3 py-2" />
              </div>
              <div>
                <label className="text-xs text-slate-500">Humidity %</label>
                <input name="humidity" type="number" step="0.1" className="w-full rounded-2xl border px-3 py-2" />
              </div>
              <div>
                <label className="text-xs text-slate-500">Moisture %</label>
                <input name="moisture" type="number" step="0.1" className="w-full rounded-2xl border px-3 py-2" />
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-600">Notes</label>
              <textarea
                name="notes"
                rows={2}
                className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2"
                placeholder="Lights, adjustments, etc."
              />
            </div>
            <button className="rounded-full bg-slate-900 px-4 py-2 font-semibold text-white">Upload frame</button>
          </form>
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
