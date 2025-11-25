import Link from 'next/link';

import LoginForm from '@/components/auth/LoginForm';

type LoginPageProps = {
  searchParams: Promise<{
    next?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const redirectTo = params?.next ?? '/admin';

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-emerald-50 px-4">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-slate-100 bg-white p-8 shadow-2xl shadow-emerald-100/50">
        <div className="space-y-2 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-500">
            Libby&apos;s Aroid Apothecary
          </p>
          <h1 className="text-3xl font-semibold text-slate-950">Admin sign in</h1>
          <p className="text-sm text-slate-500">Use your greenhouse credentials to access the dashboard.</p>
        </div>
        <LoginForm redirectTo={redirectTo} />
        <p className="text-center text-xs text-slate-500">
          Need help? <Link href="mailto:hello@libbysapothecary.com" className="font-semibold text-emerald-600">Contact Libby</Link>
        </p>
      </div>
    </div>
  );
}


