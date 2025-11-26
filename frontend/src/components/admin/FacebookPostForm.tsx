'use client';

import { useActionState } from 'react';
import { createFacebookPostAction, facebookPostInitialState } from '@/app/(admin)/admin/social/actions';

export function FacebookPostForm({
  createAction,
}: {
  createAction: typeof createFacebookPostAction;
}) {
  const [state, formAction, pending] = useActionState(createAction, facebookPostInitialState);

  return (
    <form action={formAction} className="grid gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-500">New post</p>
      <label className="text-sm font-semibold text-slate-600">
        Caption
        <textarea
          name="message"
          rows={3}
          placeholder="Share a greenhouse update, new drop, or timelapse moment."
          className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
          required
        />
      </label>
      {state?.error && <p className="text-xs text-rose-600">{state.error}</p>}
      <label className="text-sm font-semibold text-slate-600">
        Image URL (optional)
        <input
          name="image_url"
          type="url"
          placeholder="https://your-supabase-storage/object/public/plant-photos/..."
          className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
        />
        <span className="text-xs text-slate-500">Use a Supabase public URL or any hosted image.</span>
      </label>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-slate-950 px-5 py-2 text-sm font-semibold text-white shadow shadow-slate-900/30 hover:bg-slate-800 disabled:opacity-50"
        >
          {pending ? 'Publishing...' : 'Publish to Facebook'}
        </button>
      </div>
    </form>
  );
}

