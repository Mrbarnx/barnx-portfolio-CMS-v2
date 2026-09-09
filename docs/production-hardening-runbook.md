# Barnx V2 production hardening runbook

Use this checklist after the final hardening preview passes. Never paste secret keys into the CMS or commit them to Git.

## 1. Apply the final database migration

Run `supabase/migrations/202609070001_final_security_hardening.sql` once in the Supabase SQL Editor. A successful migration returns no rows. It:

- limits anonymous analytics events per session;
- removes rapid duplicate page views;
- restricts media writes to the signed-in admin's folder and approved image extensions;
- validates media type, size, path and accessibility metadata.

## 2. Lock down Supabase Auth

In Supabase Dashboard → Authentication:

- disable public user sign-ups because Barnx Admin is owner-only;
- keep email confirmation enabled if it is available for the chosen flow;
- use a unique password stored in a password manager;
- enable MFA for the owner account when available;
- confirm only the intended user ID exists in `public.cms_admin_users`.

The publishable/anonymous key is safe to expose in the browser. Never add the service-role key to Vercel unless a future server-only feature explicitly requires it.

## 3. Verify Vercel variables

Keep these values in Production, Preview and Development where required:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

After changing a variable, redeploy. Set `NEXT_PUBLIC_SITE_URL` to the custom production domain after the domain is connected.

## 4. Smoke test before merging

- Public: Home, Projects, one project detail, Impact, Barnx Studio, prompts and learning paths.
- Admin: unauthenticated `/admin` redirects to login.
- Admin: authorized login works; unauthorized accounts cannot enter.
- CMS: save a draft and confirm it is absent publicly.
- CMS: publish the same record and confirm it appears publicly.
- Media: upload an allowed image under 8 MB, attach it, then confirm an in-use image cannot be deleted.
- Analytics: visit public pages and confirm aggregated counts appear without names, emails or network addresses.
- Headers: confirm admin/API responses use `Cache-Control: no-store` and public responses include the configured security headers.

## 5. Backup and rollback

- Before schema changes, export the affected tables from Supabase or create a database backup available to your plan.
- Keep migrations append-only after production use; do not edit an already-applied migration.
- Use the previous successful Vercel deployment for an immediate application rollback.
- If a migration must be reversed, write and test a separate rollback migration rather than deleting data manually.

## 6. Ongoing checks

- Review Vercel deployment/runtime logs after releases.
- Review Supabase Auth users and the CMS allowlist monthly.
- Remove unused media and stale drafts periodically.
- Export CMS data before large content or schema changes.
- Rotate the admin password immediately if account access is suspected.
