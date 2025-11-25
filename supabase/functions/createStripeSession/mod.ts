import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@13.11.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.46.1";

const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY") ?? "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

type CheckoutPayload = {
  items: { product_id: string; quantity: number }[];
  success_url: string;
  cancel_url: string;
  customer_email?: string;
};

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const payload = (await req.json()) as CheckoutPayload;
    if (!payload.items?.length) {
      return new Response("No items provided", { status: 400 });
    }

    const { data: products, error } = await supabase
      .from("products")
      .select("*")
      .in(
        "id",
        payload.items.map((item) => item.product_id)
      )
      .eq("is_active", true);

    if (error) {
      throw error;
    }

    const priceMap = new Map(products.map((p) => [p.id, p]));
    const line_items = payload.items
      .map((item) => {
        const product = priceMap.get(item.product_id);
        if (!product) return null;
        return {
          quantity: item.quantity,
          price_data: {
            currency: product.currency ?? "usd",
            product_data: {
              name: product.name,
              description: product.description ?? undefined,
            },
            unit_amount: product.price_cents,
          },
        };
      })
      .filter(Boolean) as Stripe.Checkout.SessionCreateParams.LineItem[];

    if (!line_items.length) {
      return new Response("No purchasable items", { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: payload.success_url,
      cancel_url: payload.cancel_url,
      customer_email: payload.customer_email,
      metadata: {
        items: JSON.stringify(payload.items),
      },
    });

    return new Response(JSON.stringify({ url: session.url, id: session.id }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("createStripeSession error", err);
    return new Response("Failed to create Stripe session", { status: 500 });
  }
});

