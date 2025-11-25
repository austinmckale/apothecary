'use client';

import { useFormState, useFormStatus } from 'react-dom';

import { signInAction, AuthState } from '@/lib/auth/actions';

const initialState: AuthState = {};

export default function LoginForm({ redirectTo }: { redirectTo: string }) {
  const [state, formAction] = useFormState(signInAction, initialState);
  const { pending } = useFormStatus();

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="redirectTo" value={redirectTo} />
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-600" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full rounded-2xl border border-slate-200 px-4 py-2 text-slate-900 focus:border-emerald-400 focus:outline-none"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-600" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="w-full rounded-2xl border border-slate-200 px-4 py-2 text-slate-900 focus:border-emerald-400 focus:outline-none"
        />
      </div>
      {state.error && <p className="text-sm text-rose-600">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-emerald-600 px-4 py-2 font-semibold text-white shadow-emerald-500/30 transition hover:bg-emerald-500 disabled:opacity-60"
      >
        {pending ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}


