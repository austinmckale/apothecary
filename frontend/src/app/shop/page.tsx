import Image from "next/image";

import { getSupabaseServerClient } from "@/lib/supabase/server";
import PublicShell from "@/components/PublicShell";
import { ProductCard } from "@/components/shop/ProductCard";

type Product = {
  id: string;
  name: string;
  description: string | null;
  price_cents: number;
  currency: string;
  image_url: string | null;
};

async function getProducts(): Promise<Product[]> {
  const supabase = await getSupabaseServerClient();
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
    <PublicShell>
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
                <ProductCard product={product} />
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
    </PublicShell>
  );
}
