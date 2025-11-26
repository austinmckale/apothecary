'use server';

import { Buffer } from 'node:buffer';
import { revalidatePath } from 'next/cache';

import { getSupabaseServerClient } from '@/lib/supabase/server';

type ActionState = {
  error?: string;
  message?: string;
};

export async function createTimelapseSessionAction(_prev: ActionState, formData: FormData) {
  const supabase = await getSupabaseServerClient();
  const payload = {
    camera_label: String(formData.get('camera_label') ?? ''),
    interval_minutes: Number(formData.get('interval_minutes') ?? 15),
  };

  const { error } = await supabase.from('timelapse_sessions').insert(payload);
  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin/timelapse');
  return { message: 'Session created' };
}

export async function uploadTimelapseFrameAction(_prev: ActionState, formData: FormData) {
  const file = formData.get('photo') as File | null;
  if (!file) {
    return { error: 'Photo is required' };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = buffer.toString('base64');

  const body = {
    session_id: formData.get('session_id') || undefined,
    camera_label: formData.get('camera_label') || undefined,
    captured_at: formData.get('captured_at') || new Date().toISOString(),
    frame_index: Number(formData.get('frame_index') ?? 0),
    temperature: Number(formData.get('temperature') ?? NaN) || undefined,
    humidity: Number(formData.get('humidity') ?? NaN) || undefined,
    moisture: Number(formData.get('moisture') ?? NaN) || undefined,
    notes: formData.get('notes') || undefined,
    image_base64: base64,
  };

  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/ingestTimelapse`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    return { error: await res.text() };
  }

  revalidatePath('/admin/timelapse');
  return { message: 'Frame uploaded' };
}


