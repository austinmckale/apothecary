import Image from "next/image";

import { createCheckoutSessionAction } from "@/lib/stripe/actions";
import { getSupabaseServerClient } from "@/lib/supabase/server";

type Product = {
  id: string;
  name: string;
  description: string | null;
  price_cents: number;
  currency: string;
  image_url: string | null;
};

async function getProducts(): Promise<Product[]> {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase
    .from("products")
    .select("id, name, description, price_cents, currency, image_url")
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-6xl px 6 py-10 lg:px-12">
          <p className="text-xs uppercase tracking-[0.4em] text-emerald-500">Shop</p>
          <h1 className="text-4xl font-semibold text-slate-950">Merch & cuttings</h1>
          <p className="text-slate-500">
            Limited drops fulfilled via Stripe. Every purchase supports the greenhouse.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10 lg:px-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div key={product.id} className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
              <div className="relative h-56 w-full overflow-hidden rounded-2xl bg-slate-100">
                {product.image_url ? (
                  <Image src={product.image_url} alt={product.name} fill className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-400">Coming soon</div>
                )}
              </div>
              <div className="mt-4 space-y-2">
                <h2 className="text-xl font-semibold text-slate-900">{product.name}</h2>
                <p className="text-sm text-slate-600">{product.description ?? "Limited release."}</p>
                <p className="text-lg font-semibold text-slate-900">
                  {(product.price_cents / 100).toLocaleString("en-US", {
                    style: "currency",
                    currency: product.currency ?? "usd",
                  })}
                </p>
                <form action={createCheckoutSessionAction} className="space-y-2">
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
                </form>
              </div>
            </div>
          ))}
        </div>
        {products.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center text-slate-500">
            Inventory coming soon. Join the newsletter for drop alerts.
          </div>
        )}
      </main>
    </div>
  );
}


