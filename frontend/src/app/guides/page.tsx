import Link from 'next/link';
import { getAllGuides } from '@/lib/guides';

export const metadata = {
  title: 'Plant Care Guides · Libby\'s Aroid Apothecary',
  description: 'Expert care guides for Alocasias, Syngoniums, and other aroids.',
};

export default function GuidesIndexPage() {
  const guides = getAllGuides();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-emerald-900 py-12 text-white">
        <div className="mx-auto max-w-4xl px-6">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-400">
            Alivia&apos;s Apothecary
          </p>
          <h1 className="mt-2 text-4xl font-bold sm:text-5xl">Grow Guides</h1>
          <p className="mt-4 text-lg text-emerald-100/80">
            Deep dives into light, soil, pests, and species-specific care.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="grid gap-6 sm:grid-cols-2">
          {guides.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="group block rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-emerald-200 hover:shadow-md"
            >
              <h2 className="text-xl font-semibold text-slate-900 group-hover:text-emerald-700">
                {guide.title}
              </h2>
              <p className="mt-2 line-clamp-3 text-sm text-slate-600">
                {guide.excerpt}
              </p>
              <span className="mt-4 inline-flex items-center text-sm font-medium text-emerald-600 group-hover:underline">
                Read guide →
              </span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

