'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

import { createGuideAction, updateGuideAction, deleteGuideAction } from '@/app/(admin)/admin/guides/actions';

type GuideFormProps = {
  guide?: {
    slug: string;
    title: string;
    content: string;
    date?: string;
  } | null;
};

export default function GuideForm({ guide }: GuideFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState(guide?.title ?? '');
  const [content, setContent] = useState(guide?.content ?? '');

  const isEditing = !!guide;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        let result;
        if (isEditing) {
          result = await updateGuideAction(formData);
        } else {
          result = await createGuideAction(formData);
        }

        if (result.ok) {
          router.push('/admin/guides');
          router.refresh();
        } else {
          setError(result.message ?? 'Failed to save guide');
        }
      } catch (err) {
        setError('An unexpected error occurred');
        console.error(err);
      }
    });
  };

  const handleDelete = async () => {
    if (!guide || !confirm(`Are you sure you want to delete "${guide.title}"? This cannot be undone.`)) {
      return;
    }

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.set('slug', guide.slug);
        const result = await deleteGuideAction(formData);

        if (result.ok) {
          router.push('/admin/guides');
          router.refresh();
        } else {
          setError(result.message ?? 'Failed to delete guide');
        }
      } catch (err) {
        setError('An unexpected error occurred');
        console.error(err);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">
          {error}
        </div>
      )}

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-slate-900">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              placeholder="Watering Guide — Alocasia & Syngonium"
            />
          </div>

          {isEditing && (
            <div>
              <label htmlFor="slug" className="block text-sm font-semibold text-slate-900">
                Slug (URL identifier)
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                defaultValue={guide.slug}
                readOnly
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-600"
              />
              <p className="mt-1 text-xs text-slate-500">
                Slug cannot be changed after creation. Delete and recreate to change.
              </p>
            </div>
          )}

          <div>
            <label htmlFor="content" className="block text-sm font-semibold text-slate-900">
              Content (Markdown)
            </label>
            <textarea
              id="content"
              name="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={20}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-mono text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              placeholder="# Guide Title&#10;&#10;Write your guide content here using Markdown...&#10;&#10;## Section&#10;&#10;You can use **bold**, *italic*, lists, and more."
            />
            <p className="mt-2 text-xs text-slate-500">
              Supports Markdown formatting. Use headings, lists, bold, italic, links, and code blocks.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-emerald-500/30 transition hover:bg-emerald-500 disabled:opacity-50"
          >
            {isPending ? 'Saving...' : isEditing ? 'Update guide' : 'Create guide'}
          </button>
          <Link
            href="/admin/guides"
            className="rounded-full border border-slate-200 px-5 py-2 text-sm font-medium text-slate-600 hover:border-emerald-200 hover:text-emerald-600"
          >
            Cancel
          </Link>
        </div>

        {isEditing && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="rounded-full border border-rose-200 px-4 py-2 text-sm font-medium text-rose-600 hover:border-rose-300 hover:bg-rose-50 disabled:opacity-50"
          >
            Delete guide
          </button>
        )}
      </div>
    </form>
  );
}

