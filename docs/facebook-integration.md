## Facebook Integration Blueprint

### Goals
- Mirror Libby’s greenhouse updates (photos, captions, events) from the public Facebook Page into Supabase so we can display them alongside native timelapse shots and plant galleries.
- Allow greenhouse staff to publish curated posts from the admin dashboard back to Facebook (without leaving the app).
- Keep everything auditable (Supabase tables + logs) and controllable via RLS/service role keys.

---

### Data Model (Supabase)
| Table | Purpose | Key Columns |
| --- | --- | --- |
| `facebook_posts` | Canonical record of each FB post pulled in or sent out. | `id`, `facebook_post_id`, `direction` (`ingest`/`crosspost`), `status`, `message`, `link`, `posted_at`, `raw_payload` |
| `facebook_media` | 1:N media assets per post (photo, video). | `id`, `facebook_posts_id`, `storage_path`, `media_url`, `media_type`, `width`, `height`, `source` (`facebook` or `site`) |
| `automation_events` (existing/ planned) | Log for alerts & audit trail. | `source`, `level`, `payload`, `created_at` |

Storage buckets already defined:
- `facebook-ingest` – raw media pulled from Facebook.
- `plant-photos` – first-class plant uploads.

---

### Ingestion Flow (Facebook ➜ Supabase)
1. **Facebook App & Permissions**
   - Create Meta app, request `pages_read_engagement`, `pages_read_user_content`.
   - Generate long-lived Page Access Token. Store in Supabase project secrets as `FACEBOOK_PAGE_TOKEN`.
2. **Supabase Edge Function `facebookIngest`**
   - Scheduled every 10 minutes (Supabase cron) OR triggered by Facebook Webhook (preferred once approved).
   - Calls Graph API: `GET /{page-id}/posts?fields=message,attachments{media_type,media,url},created_time`.
   - Deduplicates via `facebook_post_id`.
   - Downloads media assets, writes to `facebook-ingest/{post_id}/{asset_id}.jpg`.
   - Inserts/updates `facebook_posts` and `facebook_media`.
   - Emits row into `automation_events` for observability.
3. **Admin Surfacing**
   - New admin module “Social Feed” lists latest ingested posts with status tags (new / published / hidden).
   - Allows toggling visibility on the public gallery (boolean `is_featured` column).
4. **Public Gallery Merge**
   - Extend `getLatestGalleryPhotos` to union plant photos + featured FB media (ordered by `captured_at` or `posted_at`).
   - Display source pill (“Facebook”) so visitors know origin.

---

### Cross-Posting Flow (Supabase ➜ Facebook)
*(overlaps todo9–10 but documented here for context)*
1. **Admin Composer UI**
   - Staff select existing plant photos or upload new shot.
   - Provide caption + optional product link.
2. **Server Action `createFacebookPostAction`**
   - Uses Supabase Edge Function `facebookPublish` (service key) to call `POST /{page-id}/photos` or `/feed`.
   - On success, record inserted into `facebook_posts` with `direction = 'crosspost'` and returned Facebook ID.
   - If scheduled posts needed, store desired `publish_at` and queue via cron.
3. **Error Handling**
   - Edge Function returns structured error; server action surfaces toast in UI.
   - All failures logged into `automation_events` for notifications.

---

### Environment Variables
| Variable | Scope | Description |
| --- | --- | --- |
| `FACEBOOK_PAGE_ID` | Edge functions + Next server | Numeric page ID |
| `FACEBOOK_APP_ID` / `FACEBOOK_APP_SECRET` | Edge functions | Needed to refresh long-lived tokens |
| `FACEBOOK_PAGE_TOKEN` | Edge functions | Long-lived page token used for both read/write |
| `FACEBOOK_WEBHOOK_SECRET` | Edge functions | Signature verification if we register webhook |

Store these in:
- Supabase: `supabase secrets set ...` (for Edge Functions).
- Vercel: Project Environment Variables (so Next.js server actions can proxy requests if needed).

---

### Security & Roles
- Edge Functions invoked from Next.js should use `SUPABASE_SERVICE_ROLE_KEY` (already available server-side) but **never** expose tokens to the browser.
- RLS: allow inserts/updates to `facebook_posts` only for service role; read access for authenticated admins.
- Public API (picture gallery) only reads filtered view (`is_public = true`).

---

### Implementation Checklist
1. [ ] Add migrations for `facebook_posts`, `facebook_media`, new columns (`is_featured`, etc.).
2. [ ] Scaffold `supabase/functions/facebookIngest` and optional `facebookWebhook`.
3. [ ] Schedule cron job `every 10 minutes` to hit ingest function.
4. [ ] Build Admin “Social Feed” page (filter, toggle, manual refresh).
5. [ ] Extend public gallery query to merge FB + Supabase photos.
6. [ ] Implement cross-post server action + UI composer.
7. [ ] Add alerting (PostHog/Sentry or Supabase logs) when ingest/cross-post fails.

This plan satisfies TODO #8 (“Design FB integration plan”). Implementation will be tracked via TODOs #9–10 for ingest and cross-posting.

