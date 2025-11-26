'use client';

import { useActionState, useState, useRef, useEffect } from 'react';

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

  // State for controlled inputs (only for care requirements to enable auto-fill)
  const [light, setLight] = useState(plant?.light_requirements ?? '');
  const [water, setWater] = useState(plant?.water_schedule ?? '');
  const [temp, setTemp] = useState(plant?.temperature_range ?? '');
  const [humidity, setHumidity] = useState(plant?.humidity_range ?? '');
  
  // State for triggers
  const [category, setCategory] = useState(plant?.category ?? '');
  const [stage, setStage] = useState(plant?.stage ?? '');
  const [rootStatus, setRootStatus] = useState(plant?.root_status ?? '');

  useEffect(() => {
    // Only auto-populate if we are creating a new plant OR if fields are empty/default
    // For now, we'll auto-populate if the user changes these fields.
    if (!category && !stage && !rootStatus) return;

    let newLight = light;
    let newWater = water;
    let newTemp = temp;
    let newHumidity = humidity;

    // Defaults based on Category
    if (category === 'alocasia') {
      newLight = 'Bright indirect (200-400 FC)';
      newWater = 'Allow top 1" to dry';
      newHumidity = '60-80%';
      newTemp = '65-80°F';
    } else if (category === 'syngonium') {
      newLight = 'Bright indirect to medium';
      newWater = 'Allow top 2" to dry';
      newHumidity = '50-70%';
      newTemp = '60-80°F';
    } else if (category === 'begonia') {
      newLight = 'Medium indirect';
      newWater = 'Keep evenly moist';
      newHumidity = '60-80%';
      newTemp = '65-75°F';
    }

    // Overrides based on Stage/Root Status
    if (stage === 'corm' || rootStatus === 'unrooted') {
      newHumidity = '90-100% (Prop box)';
      newWater = 'Keep medium damp';
      newTemp = '75-85°F (Heat mat)';
      // Light for corms/props usually standard bright indirect
    } else if (stage === 'pup' || rootStatus === 'lightly_rooted') {
      newHumidity = '70-90%';
      newWater = 'Keep evenly moist';
    }

    // Only update if we have a calculated value and it's different
    if (newLight !== light) setLight(newLight);
    if (newWater !== water) setWater(newWater);
    if (newTemp !== temp) setTemp(newTemp);
    if (newHumidity !== humidity) setHumidity(newHumidity);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, stage, rootStatus]);

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
      
      if (data.species && speciesEl) speciesEl.value = data.species;
      if (data.cultivar && cultivarEl) cultivarEl.value = data.cultivar;
      
      if (data.genus && nameEl && !nameEl.value) {
        nameEl.value = `${data.genus} ${data.species || ''} ${data.cultivar || ''}`.trim();
      }

      if (data.genus) {
        const genusLower = data.genus.toLowerCase();
        if (['syngonium', 'alocasia', 'begonia'].includes(genusLower)) {
          setCategory(genusLower);
        } else {
          setCategory('other');
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
              value={category}
              onChange={(e) => setCategory(e.target.value)}
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
              value={stage}
              onChange={(e) => setStage(e.target.value)}
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
              value={rootStatus}
              onChange={(e) => setRootStatus(e.target.value)}
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
          <label className="text-sm font-medium text-slate-700">
            Light requirements
            <input
              name="light_requirements"
              value={light}
              onChange={(e) => setLight(e.target.value)}
              className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-base"
              placeholder="Bright indirect"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Water schedule
            <input
              name="water_schedule"
              value={water}
              onChange={(e) => setWater(e.target.value)}
              className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-base"
              placeholder="Weekly, allow top to dry"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Temperature range
            <input
              name="temperature_range"
              value={temp}
              onChange={(e) => setTemp(e.target.value)}
              className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-base"
              placeholder="65-80°F"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Humidity range
            <input
              name="humidity_range"
              value={humidity}
              onChange={(e) => setHumidity(e.target.value)}
              className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-base"
              placeholder="60-80%"
            />
          </label>
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
