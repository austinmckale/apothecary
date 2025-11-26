## Alivia's Apothecary Build Log

### Business Model & Positioning
- Boutique rare aroid studio in Reading, PA (primary species: Syngoniums, Alocasias, select climbers).
- Concierge services: private greenhouse visits, cutting previews, planting/repotting sessions, custom watering plans.
- Digital experiences: timelapse live feed, care guides, workshops/events, image-heavy catalog updated via Supabase.
- Merchandise plans: 3D-printed self-watering corm pots, curated merch drops fulfilled via Stripe + Printful.
- Content strategy: combine Supabase plant photos with Facebook gallery imports, AI timelapse captions, admin social feed to cross-post.
- Deployment stack: Next.js App Router + Tailwind + Supabase (Postgres/Auth/Storage/Edge Functions) + Vercel. Stripe handles checkout; future Printful integration will automate fulfillment.

### Key Implementation Notes
- **Frontend**: Marketing page reworked (hero, experience tiles, guide list, “Fresh snaps” gallery merging Supabase + FB media). Admin shell includes overview, plants, timelapse, social feed, etc.
- **Supabase**:
  - Core schema: `plants`, `plant_photos`, `products`, `orders`, `guides`, `timelapse_sessions`, `timelapse_frames`, `plant_identifications`.
  - Storage buckets: `plant-photos`, `timelapse`, `site-media`, `facebook-ingest`.
  - Edge functions: `ingestTimelapse`, `createStripeSession`, `stripeWebhook`, `facebookIngest`.
- **Admin features**: Plant CRUD + photo uploads, timelapse management, login protected via Supabase auth, new “Social Feed” admin page to manage Facebook posts and feature them on the public gallery.
- **PWA**: Manifest set up (`/manifest.ts`, new `icon.png`), PWA install hint component active in admin shell.
- **Automation plans** (in progress): species ID Edge function, fb cross-posting actions, Printful fulfillment, analytics & monitoring, Playwright tests.

### Outstanding Priorities
1. Finish Facebook ingest deployment (set secrets, deploy function, schedule cron) and add cross-posting UI.
2. Build About page + CMS pipeline for long-form story content.
3. Implement species identification Edge function & admin review queue.
4. Wire Printful + Stripe webhook to mark orders fulfilled.
5. Add GitHub Actions CI + test suite, plus observability/alerts (PostHog/Sentry, Supabase monitors).
6. Extend merchandising experience (filters/search), contact/booking form, localization, SEO automation.

Use this log as the quick reference for decisions, stack, and pending work. Update after each milestone so we keep continuity across sessions.

