## Alivia's Apothecary

Modern web platform to manage the greenhouse inventory, sell merch, and share plant
stories. This README is optimized for Cursor-powered workflows and expands on the product
brief maintained in `alivias_apothecary_readme.md`.

### Stack

- Frontend: Next.js App Router + React Server Components + Tailwind CSS.
- Backend: Supabase (Postgres, Auth, Storage, Edge Functions).
- AI Assist: OpenAI (or pluggable OSS vision model) for species recognition.
- Commerce: Stripe Checkout, optional Printful fulfillment.
- Media: Supabase Storage for plant galleries and timelapse frames.

### Repository Layout

```
.
├── frontend/                # Next.js app (App Router, Tailwind, PWA ready)
├── supabase/                # Edge functions + SQL migrations
└── README.md                # you're here
```

Upcoming subdirectories

- `frontend/src/components` – PlantForm, TimelapseViewer, MerchGrid, etc.
- `frontend/src/app/(admin)` – Protected mobile-first admin dashboard routes.
- `supabase/functions/*` – Identify species, Stripe flows, Printful automation.
- `supabase/migrations` – Schemas for plants, guides, products, orders, timelapse.

### Core Features (phase 1)

1. Plant inventory CRUD with species-specific metadata and gallery uploads.
2. PWA-ready mobile admin dashboard with camera upload UX.
3. AI-assisted species identification via Supabase Edge Function.
4. Public timelapse viewer backed by frequent image uploads to Storage.
5. Merchandise storefront that routes carts through Stripe Checkout.
6. Guide pages (light, temperature, species) powered by markdown or pre-generated copy.
7. About page highlighting the mission, contact links, and hero photography.

### Current Progress

- **Landing experience**: Next.js hero describing roadmap, stacked sections for features/tech/roadmap.
- **Branding**: Raw “Libby’s Aroid Apothecary” logo wired into hero plus favicon.
- **Supabase schema**: Core tables + RLS for plants, photos, guides, products, orders, timelapse frames.
- **Admin shell**: `/admin` route with mobile PWA nav, install prompt hint, and dashboard widgets.

### Supabase Schema Overview

- `plants` – canonical plant records with species metadata, care notes, visibility flag.
- `plant_photos` – Storage references, cover image flag, capture metadata.
- `guides` – markdown-friendly content for care guides and blog-style posts.
- `products` – merch catalog, pricing, currency, SKU, optional Printful IDs.
- `orders` – Stripe transaction metadata, status, line items, shipping JSON.
- `timelapse_frames` – Storage paths + capture timestamps for public viewer.

### Upcoming Workstreams

1. **Plant CRUD + Storage uploads** – Supabase client, server actions, camera-first `PlantForm`.
2. **Species identification Edge Function** – Call OpenAI/vision model, expose helper in admin UI.
3. **Timelapse ingestion + public page** – Automate uploads, cache-busted public gallery.
4. **Merch + Stripe** – Checkout session creator, webhook consumer, optional Printful fulfillment.
5. **Guides & About** – Markdown content pipeline, Tailwind `prose`, mission imagery.
6. **PWA polish** – `manifest.json`, service worker, offline caching strategy.
7. **Facebook integration** – Monitor Page feed for auto gallery imports and cross-post new uploads.

### Local Development

```bash
# Frontend
cd frontend
npm install
npm run dev

# Supabase
supabase init         # run once
supabase start        # launches local services
supabase db push      # applies migrations inside supabase/migrations
```

Environment variables (`.env.local` for the app, `.env` for Supabase functions):

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
OPENAI_API_KEY=...
PRINTFUL_API_KEY=...        # optional
```

### Suggested Cursor Tasks

- Scaffold plant list page + Supabase client hooks.
- Implement image uploader that writes directly to Supabase Storage.
- Write species identification Edge Function calling OpenAI responses.
- Build Stripe checkout session creator + webhook consumer.
- Generate `public/manifest.json` and service worker for installable PWA.
- Sync Facebook Page posts into Supabase gallery tables and cross-post new uploads.
- Create GitHub Actions workflow to lint/test on every pull request before Vercel deploys.

### Deployment Notes

- Initialize one Git repository at the workspace root, push to GitHub (`main` branch).
- Connect the GitHub repo to Vercel; set the project root to `frontend`, build command `npm run build`.
- Configure environment variables in both Vercel and Supabase (`NEXT_PUBLIC_SUPABASE_URL`, Stripe keys, OpenAI, Printful).
- Optional: add GitHub Actions workflow to run `npm run lint` + future tests before merging.

### Tips

- Enable Supabase Row Level Security with helper policies in `/supabase/policies`.
- Store media under `plants/{plantId}/...` and reuse filenames to simplify cache busting.
- For the timelapse viewer, overwrite `latest.jpg` and append `?t=${Date.now()}` on fetch.
- Use Tailwind `prose` for guide markdown and `@vercel/og` for shareable imagery.

Happy building 🌱


