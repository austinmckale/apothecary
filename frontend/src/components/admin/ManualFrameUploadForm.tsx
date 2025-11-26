'use client';

import { useActionState } from 'react';
import { uploadTimelapseFrameAction } from '@/lib/timelapse/actions';

type ActionState = {
  error?: string;
  message?: string;
};

const initialState: ActionState = {
  message: '',
  error: '',
};

type Session = {
  id: string;
  camera_label: string | null;
  interval_minutes: number;
};

export function ManualFrameUploadForm({ sessions }: { sessions: Session[] }) {
  const [state, formAction] = useActionState(uploadTimelapseFrameAction, initialState);

  return (
    <form action={formAction} className="mt-4 space-y-4">
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
      {state?.error && <p className="text-xs text-rose-600">{state.error}</p>}
      {state?.message && <p className="text-xs text-emerald-600">{state.message}</p>}
      <button className="rounded-full bg-slate-900 px-4 py-2 font-semibold text-white">Upload frame</button>
    </form>
  );
}
