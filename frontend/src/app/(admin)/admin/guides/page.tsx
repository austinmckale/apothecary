import Link from 'next/link';

import { getAllGuides } from '@/lib/guides';

export default function AdminGuidesPage() {
  const guides = getAllGuides();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-500">Content</p>
          <h1 className="text-3xl font-semibold text-slate-950">Care guides</h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage plant care guides and educational content for the public site.
          </p>
        </div>
        <div className="flex gap-3 text-sm">
          <Link
            href="/admin/guides/new"
            className="rounded-full bg-emerald-600 px-4 py-1.5 font-semibold text-white shadow-emerald-500/30 transition hover:bg-emerald-500"
          >
            New guide
          </Link>
          <Link
            href="/guides"
            target="_blank"
            className="rounded-full border border-slate-200 px-4 py-1.5 font-medium text-slate-600 hover:border-emerald-200 hover:text-emerald-600"
          >
            View public guides ↗
          </Link>
        </div>
      </div>

      {guides.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-emerald-200 bg-emerald-50/40 p-10 text-center text-slate-600">
          <p className="text-lg font-semibold text-slate-900">No guides yet</p>
          <p className="text-sm text-slate-600">
            Create your first care guide to help customers learn about plant care, species identification, and
            greenhouse practices.
          </p>
          <Link
            href="/admin/guides/new"
            className="mt-4 inline-flex rounded-full bg-slate-900 px-5 py-1.5 text-sm font-semibold text-white"
          >
            Create first guide
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {guides.map((guide) => (
            <article
              key={guide.slug}
              className="group flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-xl font-serif font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {guide.title}
                  </h2>
                  <p className="mt-2 text-sm text-slate-600 line-clamp-2">{guide.excerpt}</p>
                </div>
                <div className="ml-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 text-2xl shadow-inner shadow-emerald-100">
                  📚
                </div>
              </div>

              <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="text-xs text-slate-500">
                  <span className="font-mono">{guide.slug}</span>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/guides/${guide.slug}`}
                    target="_blank"
                    className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 hover:border-emerald-200 hover:text-emerald-600"
                  >
                    View ↗
                  </Link>
                  <Link
                    href={`/admin/guides/${guide.slug}/edit`}
                    className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white hover:bg-slate-800"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

