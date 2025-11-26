'use client';

import { useActionState, useState, useRef } from 'react';

import { createPlantAction, plantFormInitialState } from '@/app/(admin)/admin/plants/actions';
import type { Plant } from '@/types/plant';

type PlantFormProps = {
  plant?: Plant;
};

export default function PlantForm({ plant }: PlantFormProps) {
  const [state, formAction, pending] = useActionState(createPlantAction, plantFormInitialState);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isIdentifying, setIsIdentifying] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEnhance = async () => {
    const descriptionEl = document.querySelector<HTMLTextAreaElement>('textarea[name="description"]');
    const careEl = document.querySelector<HTMLTextAreaElement>('textarea[name="care_notes"]');
    
    const description = descriptionEl?.value;
    const care_notes = careEl?.value;

    if (!description && !care_notes) return;

    setIsEnhancing(true);
    try {
      const res = await fetch('/api/admin/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, care_notes }),
      });

      if (!res.ok) throw new Error('Enhance failed');

      const data = await res.json();
      if (data.description && descriptionEl) descriptionEl.value = data.description;
      if (data.care_notes && careEl) careEl.value = data.care_notes;
    } catch (err) {
      console.error(err);
      alert('Failed to polish text. Check console.');
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleIdentifyClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsIdentifying(true);
    try {
      // Convert to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      const base64 = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
      });

      const res = await fetch('/api/admin/identify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_base64: base64 }),
      });

      if (!res.ok) throw new Error('Identify failed');

      const data = await res.json();
      
      // Auto-fill fields
      const nameEl = document.querySelector<HTMLInputElement>('input[name="name"]');
      const speciesEl = document.querySelector<HTMLInputElement>('input[name="species"]');
      const cultivarEl = document.querySelector<HTMLInputElement>('input[name="cultivar"]');
      const categoryEl = document.querySelector<HTMLSelectElement>('select[name="category"]');
      
      if (data.species && speciesEl) speciesEl.value = data.species;
      if (data.cultivar && cultivarEl) cultivarEl.value = data.cultivar;
      
      if (data.genus && nameEl && !nameEl.value) {
        nameEl.value = `${data.genus} ${data.species || ''} ${data.cultivar || ''}`.trim();
      }

      if (data.genus && categoryEl) {
        const genusLower = data.genus.toLowerCase();
        if (['syngonium', 'alocasia', 'begonia'].includes(genusLower)) {
          categoryEl.value = genusLower;
        } else {
          categoryEl.value = 'other';
        }
      }

      if (data.identification_notes) {
        alert(`ID Confidence: ${data.confidence}\nNotes: ${data.identification_notes}`);
      }

    } catch (err) {
      console.error(err);
      alert('Failed to identify plant. Check console.');
    } finally {
      setIsIdentifying(false);
      // Reset input so same file can be selected again if needed
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <form action={formAction} className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-slate-900">
            {plant ? 'Update plant details' : 'Create a new plant'}
          </h2>
          <div className="flex gap-2">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*"
            />
            <button
              type="button"
              onClick={handleIdentifyClick}
              disabled={isIdentifying}
              className="group flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-600 transition hover:bg-emerald-100 disabled:opacity-50"
            >
              {isIdentifying ? (
                <span className="animate-pulse">🔍 Analyzing...</span>
              ) : (
                <>
                  <span>📸 Auto-ID</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleEnhance}
              disabled={isEnhancing}
              className="group flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-1.5 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-100 disabled:opacity-50"
            >
              {isEnhancing ? (
                <span className="animate-pulse">✨ Polishing...</span>
              ) : (
                <>
                  <span>✨ AI Polish</span>
                </>
              )}
            </button>
          </div>
        </div>
        <p className="text-sm text-slate-500">
          Slug will be used for public URLs. Only lowercase, numbers, and hyphens.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="text-sm font-medium text-slate-700">
            Name
            <input
              name="name"
              defaultValue={plant?.name}
              className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-base"
              required
            />
            {state.errors?.name && <p className="text-xs text-rose-600">{state.errors.name[0]}</p>}
          </label>
          <label className="text-sm font-medium text-slate-700">
            Slug
            <input
              name="slug"
              defaultValue={plant?.slug}
              className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-base lowercase"
              required
            />
            {state.errors?.slug && <p className="text-xs text-rose-600">{state.errors.slug[0]}</p>}
          </label>
          <label className="text-sm font-medium text-slate-700">
            Category
            <select
              name="category"
              defaultValue={plant?.category ?? ''}
              className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-base"
            >
              <option value="">Select category</option>
              <option value="syngonium">Syngonium</option>
              <option value="alocasia">Alocasia</option>
              <option value="begonia">Begonia</option>
              <option value="other">Other</option>
            </select>
          </label>
          <label className="text-sm font-medium text-slate-700">
            Stage
            <select
              name="stage"
              defaultValue={plant?.stage ?? ''}
              className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-base"
            >
              <option value="">Select stage</option>
              <option value="corm">Corm</option>
              <option value="pup">Pup</option>
              <option value="juvenile">Juvenile</option>
              <option value="mature">Mature</option>
            </select>
          </label>
          <label className="text-sm font-medium text-slate-700">
            Root Status
            <select
              name="root_status"
              defaultValue={plant?.root_status ?? ''}
              className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-base"
            >
              <option value="">Select status</option>
              <option value="unrooted">Unrooted</option>
              <option value="lightly_rooted">Lightly rooted</option>
              <option value="rooted">Rooted</option>
            </select>
          </label>
          <label className="text-sm font-medium text-slate-700">
            Species
            <input
              name="species"
              defaultValue={plant?.species ?? ''}
              className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-base"
              placeholder="Anthurium"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Cultivar
            <input
              name="cultivar"
              defaultValue={plant?.cultivar ?? ''}
              className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-base"
              placeholder="Warocqueanum"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Price (cents)
            <input
              name="price_cents"
              type="number"
              defaultValue={plant?.price_cents ?? ''}
              className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-base"
              placeholder="1500"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Quantity
            <input
              name="quantity"
              type="number"
              defaultValue={plant?.quantity ?? 0}
              className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-base"
            />
          </label>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {[
            { name: 'light_requirements' as const, label: 'Light requirements', placeholder: 'Bright indirect' },
            { name: 'water_schedule' as const, label: 'Water schedule', placeholder: 'Weekly, allow top to dry' },
            { name: 'temperature_range' as const, label: 'Temperature range', placeholder: '65-80°F' },
            { name: 'humidity_range' as const, label: 'Humidity range', placeholder: '60-80%' },
          ].map((field) => (
            <label key={field.name} className="text-sm font-medium text-slate-700">
              {field.label}
              <input
                name={field.name}
                defaultValue={plant?.[field.name] ?? ''}
                className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-base"
                placeholder={field.placeholder}
              />
            </label>
          ))}
        </div>

        <label className="mt-4 block text-sm font-medium text-slate-700">
          Description
          <textarea
            name="description"
            defaultValue={plant?.description ?? ''}
            className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-base"
            rows={3}
          />
        </label>

        <label className="mt-4 block text-sm font-medium text-slate-700">
          Care notes
          <textarea
            name="care_notes"
            defaultValue={plant?.care_notes ?? ''}
            className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-base"
            rows={3}
          />
        </label>

        <div className="mt-4 flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              name="is_public"
              value="true"
              defaultChecked={plant?.is_public ?? true}
              className="h-4 w-4 rounded border-slate-300 text-emerald-600"
            />
            Visible on public site
          </label>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              name="in_stock"
              value="true"
              defaultChecked={plant?.in_stock ?? false}
              className="h-4 w-4 rounded border-slate-300 text-emerald-600"
            />
            In stock
          </label>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-emerald-500/30 transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? 'Saving...' : plant ? 'Save changes' : 'Create plant'}
          </button>
          {!plant && (
            <button
              type="reset"
              className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-600 hover:border-emerald-200 hover:text-emerald-600"
            >
              Reset
            </button>
          )}
        </div>
        {state.message && <p className="text-sm text-rose-600">{state.message}</p>}
        {state.ok && !pending && <p className="text-sm text-emerald-600">Saved!</p>}
      </div>
    </form>
  );
}
