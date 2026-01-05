import GuideForm from '@/components/admin/GuideForm';

export default function NewGuidePage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-emerald-500">Content</p>
        <h1 className="text-3xl font-semibold text-slate-950">New care guide</h1>
        <p className="mt-1 text-sm text-slate-600">
          Create a new plant care guide. Write in Markdown for rich formatting.
        </p>
      </div>

      <GuideForm />
    </div>
  );
}

