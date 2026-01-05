import { notFound } from 'next/navigation';

import GuideForm from '@/components/admin/GuideForm';
import { getGuideBySlug } from '@/lib/guides';

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function EditGuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-emerald-500">Content</p>
        <h1 className="text-3xl font-semibold text-slate-950">Edit: {guide.title}</h1>
        <p className="mt-1 text-sm text-slate-600">
          Update the guide content. Changes will be reflected on the public site.
        </p>
      </div>

      <GuideForm guide={guide} />
    </div>
  );
}

