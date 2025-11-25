import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getGuideData, getGuideSlugs } from '@/lib/guides';

type Params = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
  const files = getGuideSlugs();
  return files.map((file) => ({
    slug: file.replace(/\.md$/, ''),
  }));
}

export async function generateMetadata({ params }: Params) {
  const guide = await getGuideData(params.slug);
  if (!guide) return { title: 'Guide Not Found' };
  
  return {
    title: `${guide.title} · Libby's Aroid Apothecary`,
  };
}

export default async function GuidePage({ params }: Params) {
  const guide = await getGuideData(params.slug);

  if (!guide) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-slate-100 bg-slate-50/50">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link
            href="/guides"
            className="text-sm font-semibold text-emerald-700 hover:underline"
          >
            ← All Guides
          </Link>
          <Link href="/" className="text-sm font-semibold text-slate-900">
            Libby&apos;s Apothecary
          </Link>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="mb-8 text-3xl font-bold text-slate-900 sm:text-4xl">
          {guide.title}
        </h1>
        <div
          className="prose prose-slate prose-lg prose-emerald max-w-none"
          dangerouslySetInnerHTML={{ __html: guide.contentHtml }}
        />
      </article>
    </div>
  );
}

