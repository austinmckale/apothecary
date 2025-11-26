'use server';

import { revalidatePath } from 'next/cache';

import { getSupabaseServiceClient } from '@/lib/supabase/service';

const SOCIAL_PATH = '/admin/social';

export async function togglePostFeaturedAction(formData: FormData) {
  const postId = formData.get('post_id') as string | null;
  const featureValue = formData.get('feature') as string | null;
  const shouldFeature = featureValue === 'true';

  if (!postId) {
    return;
  }

  try {
    const supabase = getSupabaseServiceClient();
    const { error } = await supabase
      .from('facebook_posts')
      .update({ is_featured: shouldFeature })
      .eq('id', postId);

    if (error) {
      console.error('togglePostFeaturedAction error', error);
    }
  } catch (error) {
    console.error('togglePostFeaturedAction unexpected error', error);
  }

  revalidatePath(SOCIAL_PATH);
}

export async function refreshFacebookFeedAction() {
  const functionUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/facebookIngest`;
  const authKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

  if (!functionUrl || !authKey) {
    console.error('Missing Supabase configuration for facebookIngest');
    return;
  }

  try {
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authKey}`,
      },
    });

    if (!response.ok) {
      console.error('facebookIngest failed', await response.text());
    }
  } catch (error) {
    console.error('refreshFacebookFeedAction error', error);
  }

  revalidatePath(SOCIAL_PATH);
}

// Add a type for the initial state
export type FacebookPostState = {
  ok: boolean;
  error?: string;
};

// Ensure the initial state matches this type
export const facebookPostInitialState: FacebookPostState = {
  ok: true,
};

export async function createFacebookPostAction(
  _prevState: FacebookPostState,
  formData: FormData,
): Promise<FacebookPostState> {
  const message = String(formData.get('message') ?? '').trim();
  const imageUrl = String(formData.get('image_url') ?? '').trim() || undefined;

  if (!message) {
    return { ok: false, error: 'Message is required' };
  }

  const functionUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/facebookPublish`;
  const authKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

  if (!functionUrl || !authKey) {
    return { ok: false, error: 'Missing Supabase configuration' };
  }

  try {
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, imageUrl }),
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error('facebookPublish failed', detail);
      return { ok: false, error: 'Facebook post failed.' };
    }

    const payload = await response.json();
    const facebookPostId = payload?.result?.id ?? null;

    const supabase = getSupabaseServiceClient();
    const { data: postRecord, error: postError } = await supabase
      .from('facebook_posts')
      .insert({
        facebook_post_id: facebookPostId,
        direction: 'crosspost',
        status: 'posted',
        message,
        posted_at: new Date().toISOString(),
        raw_payload: payload.result ?? null,
        is_featured: true,
      })
      .select('id')
      .single();

    if (postError || !postRecord) {
      console.error('Failed to store facebook post', postError);
    } else if (imageUrl) {
      const { error: mediaError } = await supabase.from('facebook_media').insert({
        facebook_post_uuid: postRecord.id,
        media_url: imageUrl,
        source: 'site',
      });
      if (mediaError) {
        console.error('Failed to store facebook media', mediaError);
      }
    }
  } catch (error) {
    console.error('createFacebookPostAction error', error);
    return { ok: false, error: 'Unexpected error.' };
  }

  revalidatePath(SOCIAL_PATH);
  return { ok: true };
}
