'use server';

import { Buffer } from 'node:buffer';
import { revalidatePath } from 'next/cache';

import { getSupabaseServerClient } from '@/lib/supabase/server';

export async function createTimelapseSessionAction(formData: FormData) {
  const supabase = await getSupabaseServerClient();
  const payload = {
    camera_label: String(formData.get('camera_label') ?? ''),
    interval_minutes: Number(formData.get('interval_minutes') ?? 15),
  };

  const { error } = await supabase.from('timelapse_sessions').insert(payload);
  if (error) {
    console.error('createTimelapseSessionAction error', error);
    return;
  }

  revalidatePath('/admin/timelapse');
}

export async function uploadTimelapseFrameAction(formData: FormData) {
  const file = formData.get('photo') as File | null;
  if (!file) {
    console.error('Photo is required for timelapse frame upload.');
    return;
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
    console.error('uploadTimelapseFrameAction failed', await res.text());
    return;
  }

  revalidatePath('/admin/timelapse');
}
