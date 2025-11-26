'use server';

import { Buffer } from 'buffer';
import { revalidatePath } from 'next/cache';

import { plantSchema } from '@/lib/schemas/plant';
import { getSupabaseServiceClient } from '@/lib/supabase/service';

export type PlantFormState = {
  ok: boolean;
  message?: string;
  errors?: Record<string, string[] | undefined>;
  plantId?: string;
  plantSlug?: string;
};

export async function createPlantAction(
  _prevState: PlantFormState,
  formData: FormData,
): Promise<PlantFormState> {
  const rawData = {
    name: formData.get('name'),
    slug: (formData.get('slug') as string | null)?.toLowerCase().trim(),
    category: formData.get('category'),
    species: formData.get('species'),
    cultivar: formData.get('cultivar'),
    stage: formData.get('stage'),
    root_status: formData.get('root_status'),
    price_cents: formData.get('price_cents') ? Number(formData.get('price_cents')) : null,
    in_stock: formData.get('in_stock') === 'true',
    quantity: Number(formData.get('quantity') ?? 0),
    light_requirements: formData.get('light_requirements'),
    water_schedule: formData.get('water_schedule'),
    temperature_range: formData.get('temperature_range'),
    humidity_range: formData.get('humidity_range'),
    description: formData.get('description'),
    care_notes: formData.get('care_notes'),
    is_public: formData.get('is_public') === 'true',
  };

  const parsed = plantSchema.safeParse(rawData);

  if (!parsed.success) {
    return { ok: false, errors: parsed.error.flatten().fieldErrors };
  }

  const payload = {
    ...parsed.data,
    category: parsed.data.category || null,
    species: parsed.data.species || null,
    cultivar: parsed.data.cultivar || null,
    stage: parsed.data.stage || null,
    root_status: parsed.data.root_status || null,
    price_cents: parsed.data.price_cents || null,
    light_requirements: parsed.data.light_requirements || null,
    water_schedule: parsed.data.water_schedule || null,
    temperature_range: parsed.data.temperature_range || null,
    humidity_range: parsed.data.humidity_range || null,
    description: parsed.data.description || null,
    care_notes: parsed.data.care_notes || null,
  };

  try {
    const supabase = getSupabaseServiceClient();
    const { data: insertResult, error: insertError } = await supabase
      .from('plants')
      .insert(payload)
      .select('id, slug')
      .single();

    if (insertError || !insertResult) {
      throw insertError ?? new Error('Plant insert failed');
    }

    const plantId = insertResult.id;
    const photos = (formData.getAll('photos') as File[]).filter(
      (file): file is File => file instanceof File && file.size > 0,
    );

    if (photos.length) {
      for (const file of photos) {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const ext = file.name.split('.').pop() ?? 'jpg';
        const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const path = `plant-photos/${plantId}/${uniqueSuffix}.${ext}`;

        const uploadResult = await supabase.storage.from('plant-photos').upload(path, buffer, {
          contentType: file.type || 'image/jpeg',
          cacheControl: '3600',
        });

        if (uploadResult.error) {
          throw uploadResult.error;
        }

        const { error: photoError } = await supabase.from('plant_photos').insert({
          plant_id: plantId,
          storage_path: path,
          alt: file.name,
          is_cover: false,
        });

        if (photoError) {
          throw photoError;
        }
      }
    }

    revalidatePath('/admin/plants');
    revalidatePath(`/admin/plants/${plantId}`);
    return { ok: true, message: 'Plant created!', plantId, plantSlug: insertResult.slug };
  } catch (error) {
    console.error('createPlantAction error', error);
    return { ok: false, message: 'Unable to create plant.' };
  }
}

type PhotoState = {
  ok: boolean;
  message?: string;
};

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
