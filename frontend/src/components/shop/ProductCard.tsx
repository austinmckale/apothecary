'use client';

import { useActionState } from 'react';
import { createCheckoutSessionAction, checkoutInitialState } from '@/lib/stripe/actions';

type Product = {
  id: string;
  name: string;
  description: string | null;
  price_cents: number;
  currency: string;
  image_url: string | null;
};

export function ProductCard({ product }: { product: Product }) {
  // @ts-expect-error - ActionState mismatch between server/client
  const [state, formAction] = useActionState(createCheckoutSessionAction, checkoutInitialState);

  return (
    <div className="mt-4 space-y-2">
      <h2 className="text-xl font-semibold text-slate-900">{product.name}</h2>
      <p className="text-sm text-slate-600">{product.description ?? "Limited release."}</p>
      <p className="text-lg font-semibold text-slate-900">
        {(product.price_cents / 100).toLocaleString("en-US", {
          style: "currency",
          currency: product.currency ?? "usd",
        })}
      </p>
      <form action={formAction} className="space-y-2">
        <input type="hidden" name="product_id" value={product.id} />
        <label className="text-xs text-slate-500">
          Quantity
          <input
            name="quantity"
            type="number"
            min={1}
            defaultValue={1}
            className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2"
          />
        </label>
        <button className="w-full rounded-full bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-500">
          Checkout
        </button>
        {state?.error && <p className="text-xs text-rose-600">{state.error}</p>}
      </form>
    </div>
  );
}
