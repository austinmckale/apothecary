'use client';

import { useActionState } from 'react';
import { createTimelapseSessionAction } from '@/lib/timelapse/actions';

type ActionState = {
  error?: string;
  message?: string;
};

const initialState: ActionState = {
  message: '',
  error: '',
};

export function CreateSessionForm() {
  const [state, formAction] = useActionState(createTimelapseSessionAction, initialState);

  return (
    <form action={formAction} className="mt-4 space-y-4">
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
      {state?.error && <p className="text-xs text-rose-600">{state.error}</p>}
      {state?.message && <p className="text-xs text-emerald-600">{state.message}</p>}
      <button className="rounded-full bg-emerald-600 px-4 py-2 font-semibold text-white">Create session</button>
    </form>
  );
}
