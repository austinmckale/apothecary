import Link from 'next/link';
import { getAllGuides } from '@/lib/guides';
import PublicShell from '@/components/PublicShell';

export const metadata = {
  title: 'Plant Care Guides · Libby\'s Aroid Apothecary',
  description: 'Expert care guides for Alocasias, Syngoniums, and other aroids.',
};

export default function GuidesIndexPage() {
  const guides = getAllGuides();

  return (
    <PublicShell>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-emerald-50/30">
        <header className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-900 py-20 text-white">
           <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=2664&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
           <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/50 to-transparent"></div>
          <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-400">
              Knowledge Base
            </p>
            <h1 className="mt-2 text-4xl font-serif font-bold sm:text-5xl tracking-tight text-emerald-50">Care Guides & Tutorials</h1>
            <p className="mt-4 max-w-2xl text-lg text-emerald-100/90 leading-relaxed">
              Deep dives into light, soil, pests, and species-specific care for your rare aroid collection.
            </p>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {guides.map((guide) => (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="group flex flex-col rounded-3xl border border-slate-200 bg-white/80 backdrop-blur-sm p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-900/5 hover:border-emerald-100/50"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 text-2xl shadow-inner shadow-emerald-100">
                  🌿
                </div>
                <h2 className="text-xl font-serif font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {guide.title}
                </h2>
                <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600">
                  {guide.excerpt}
                </p>
                <div className="mt-6 flex items-center text-sm font-semibold text-emerald-600">
                  Read guide 
                  <svg className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </PublicShell>
  );
}
