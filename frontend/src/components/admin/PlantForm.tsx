'use client';

import { useActionState } from 'react';

import { createPlantAction, plantFormInitialState } from '@/app/(admin)/admin/plants/actions';
import type { Plant } from '@/types/plant';

type PlantFormProps = {
  plant?: Plant;
};

export default function PlantForm({ plant }: PlantFormProps) {
  const [state, formAction, pending] = useActionState(createPlantAction, plantFormInitialState);

  return (
    <form action={formAction} className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
        <h2 className="text-lg font-semibold text-slate-900">
          {plant ? 'Update plant details' : 'Create a new plant'}
        </h2>
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

        <label className="mt-4 flex items-center gap-2 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            name="is_public"
            value="true"
            defaultChecked={plant?.is_public ?? true}
            className="h-4 w-4 rounded border-slate-300 text-emerald-600"
          />
          Visible on public site
        </label>

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


