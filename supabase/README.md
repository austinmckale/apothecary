## Supabase Workspace

This directory mirrors the Supabase project that powers Alivia's Apothecary. It keeps
infrastructure-as-code artifacts versioned alongside the frontend so new contributors can
bootstrap the backend quickly.

### Layout

- `functions/identifySpecies` – Edge Function that will forward plant photos to OpenAI or
  another vision model and normalize the response.
- `functions/createStripeSession` – Creates Stripe Checkout sessions based on selected
  product IDs and user metadata.
- `functions/stripeWebhook` – Verifies Stripe webhooks and persists order events to the DB.
- `functions/submitPrintfulOrder` – Optional function that posts paid orders to Printful.
- `migrations/` – SQL migrations generated via `supabase db diff` / `db push`.

Each function folder will eventually contain:

1. `index.ts` – the handler exported for deployment.
2. `types.ts` – shared runtime + schema validation helpers.
3. `README.md` – behavior overview, env requirements, and test steps.

### Getting Started

```bash
supabase init
supabase start     # launches local Postgres, Auth, and Storage
supabase db push   # applies migrations in ./migrations
```

> Tip: Use `.env.local` in the frontend to point to your local Supabase URL and anon key.


