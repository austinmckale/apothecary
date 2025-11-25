'use server';

import { Buffer } from 'buffer';
import { revalidatePath } from 'next/cache';

import { plantSchema } from '@/lib/schemas/plant';
import { getSupabaseServiceClient } from '@/lib/supabase/service';

export type PlantFormState = {
  ok: boolean;
  message?: string;
  errors?: Record<string, string[] | undefined>;
};

const emptyState: PlantFormState = { ok: false };

export async function createPlantAction(
  _prevState: PlantFormState,
  formData: FormData,
): Promise<PlantFormState> {
  const parsed = plantSchema.safeParse({
    name: formData.get('name'),
    slug: (formData.get('slug') as string | null)?.toLowerCase().trim(),
    species: formData.get('species'),
    cultivar: formData.get('cultivar'),
    light_requirements: formData.get('light_requirements'),
    water_schedule: formData.get('water_schedule'),
    temperature_range: formData.get('temperature_range'),
    humidity_range: formData.get('humidity_range'),
    description: formData.get('description'),
    care_notes: formData.get('care_notes'),
    is_public: formData.get('is_public') === 'true',
  });

  if (!parsed.success) {
    return { ok: false, errors: parsed.error.flatten().fieldErrors };
  }

  const payload = {
    ...parsed.data,
    species: parsed.data.species || null,
    cultivar: parsed.data.cultivar || null,
    light_requirements: parsed.data.light_requirements || null,
    water_schedule: parsed.data.water_schedule || null,
    temperature_range: parsed.data.temperature_range || null,
    humidity_range: parsed.data.humidity_range || null,
    description: parsed.data.description || null,
    care_notes: parsed.data.care_notes || null,
  };

  try {
    const supabase = getSupabaseServiceClient();
    const { error } = await supabase.from('plants').insert(payload);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('createPlantAction error', error);
    return { ok: false, message: 'Unable to create plant.' };
  }

  revalidatePath('/admin/plants');
  return { ok: true, message: 'Plant created!' };
}

export { emptyState as plantFormInitialState };

type PhotoState = {
  ok: boolean;
  message?: string;
};

const photoInitialState: PhotoState = { ok: false };

export async function uploadPlantPhotoAction(
  _prevState: PhotoState,
  formData: FormData,
): Promise<PhotoState> {
  const plantId = formData.get('plant_id') as string | null;
  const file = formData.get('photo') as File | null;

  if (!plantId || !file || file.size === 0) {
    return { ok: false, message: 'Missing photo.' };
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const ext = file.name.split('.').pop() ?? 'jpg';
  const path = `plant-photos/${plantId}/${Date.now()}.${ext}`;

  try {
    const supabase = getSupabaseServiceClient();
    const uploadResult = await supabase.storage.from('plant-photos').upload(path, buffer, {
      contentType: file.type || 'image/jpeg',
      cacheControl: '3600',
    });

    if (uploadResult.error) {
      throw uploadResult.error;
    }

    const { error } = await supabase.from('plant_photos').insert({
      plant_id: plantId,
      storage_path: path,
      alt: `${file.name}`,
      is_cover: false,
    });

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('uploadPlantPhotoAction error', error);
    return { ok: false, message: 'Upload failed.' };
  }

  revalidatePath(`/admin/plants/${plantId}`);
  return { ok: true, message: 'Photo uploaded!' };
}

export { photoInitialState };



