import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getGuideData, getGuideSlugs } from '@/lib/guides';
import PublicShell from '@/components/PublicShell';

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const files = getGuideSlugs();
  return files.map((file) => ({
    slug: file.replace(/\.md$/, ''),
  }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const guide = await getGuideData(slug);
  if (!guide) return { title: 'Guide Not Found' };
  
  return {
    title: `${guide.title} · Libby's Aroid Apothecary`,
  };
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = await getGuideData(slug);

  if (!guide) {
    notFound();
  }

  return (
    <PublicShell>
      <div className="min-h-screen bg-white">
        <div className="bg-gradient-to-b from-emerald-50/40 to-white border-b border-emerald-100/50">
          <div className="mx-auto max-w-3xl px-6 py-12">
             <Link
              href="/guides"
              className="group inline-flex items-center text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors"
            >
              <svg className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Guides
            </Link>
             <h1 className="mt-6 text-3xl font-serif font-bold text-slate-900 sm:text-4xl md:text-5xl leading-tight">
              {guide.title}
            </h1>
          </div>
        </div>

        <article className="mx-auto max-w-3xl px-6 py-12">
          <div
            className="prose prose-slate prose-lg prose-emerald max-w-none prose-headings:font-serif prose-headings:font-bold prose-p:leading-relaxed prose-a:no-underline hover:prose-a:underline prose-img:rounded-3xl prose-blockquote:border-l-emerald-200 prose-blockquote:bg-emerald-50/30 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:not-italic prose-blockquote:rounded-r-lg"
            dangerouslySetInnerHTML={{ __html: guide.contentHtml }}
          />
        </article>
      </div>
    </PublicShell>
  );
}
