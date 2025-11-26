'use client';

import { useActionState, useEffect, useRef, useState } from 'react';

import { uploadPlantPhotoAction } from '@/app/(admin)/admin/plants/actions';
import { photoInitialState } from '@/app/(admin)/admin/plants/state';

type PlantPhotoUploaderProps = {
  plantId: string;
};

export default function PlantPhotoUploader({ plantId }: PlantPhotoUploaderProps) {
  const [state, formAction, pending] = useActionState(uploadPlantPhotoAction, photoInitialState);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.ok) {
      const timer = setTimeout(() => {
        setPreview(null);
        if (inputRef.current) {
          inputRef.current.value = '';
        }
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [state.ok]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="plant_id" value={plantId} />
      
      <div className="flex items-center gap-4">
        <label className="flex cursor-pointer items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-slate-900/20 hover:bg-slate-800">
          <span>📷 Capture / Upload</span>
          <input
            ref={inputRef}
            type="file"
            name="photo"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
        {pending && <span className="text-sm text-slate-500">Uploading...</span>}
      </div>

      {preview && (
        <div className="relative mt-4 w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Preview" className="max-h-64 w-full object-contain" />
          <button
            type="submit"
            disabled={pending}
            className="absolute bottom-4 right-4 rounded-full bg-emerald-600 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-600/40 transition hover:bg-emerald-500 disabled:opacity-70"
          >
            {pending ? 'Saving...' : 'Confirm Upload'}
          </button>
        </div>
      )}
      
      {state.message && !state.ok && (
        <p className="text-sm text-rose-600">{state.message}</p>
      )}
    </form>
  );
}

