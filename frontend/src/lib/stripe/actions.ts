'use server';

import { redirect } from 'next/navigation';

import { getSupabaseServerClient } from '@/lib/supabase/server';

export async function createCheckoutSessionAction(formData: FormData) {
  const productId = String(formData.get('product_id') ?? '');
  const quantity = Number(formData.get('quantity') ?? 1);

  if (!productId) {
    console.error('Missing product for checkout session.');
    return;
  }

  const supabase = await getSupabaseServerClient();
  const successUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.concat('/shop/success') ?? 'http://localhost:3000/shop/success';
  const cancelUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.concat('/shop') ?? 'http://localhost:3000/shop';

  const { data, error } = await supabase.functions.invoke('createStripeSession', {
    body: {
      items: [{ product_id: productId, quantity }],
      success_url: successUrl,
      cancel_url: cancelUrl,
    },
  });

  if (error || !data?.url) {
    console.error('Unable to start checkout', error);
    return;
  }

  redirect(data.url);
}