# Engineering audit context

## AUD-001 — Quote delivery currently depends on the visitor's email client

- Evidence: `/quote` validates and formats the four-step enquiry, then opens a pre-addressed `mailto:` message.
- Impact: no public write endpoint or customer data store is exposed, but submission completion depends on a configured email application.
- Status: accepted for the initial release.
- Decision: prefer a safe, functional email handoff over an unauthenticated database insert that could attract spam.
- Verification: typecheck and production build pass; the generated message includes contact, business, scope, budget, timeline and project details.
- Deferred risk: move delivery to a server-side email provider or a rate-limited Supabase RPC when provider credentials and moderation rules are available.

## AUD-002 — OpenLink Hub production links are database-managed

- Evidence: `Mrbarnx/Open-Link-Hub` reads public cards from Cloudflare D1 and edits them through its protected admin dashboard.
- Impact: changing repository defaults would not reliably change the already-deployed profile.
- Status: requires content administration, not a portfolio-code change.
- Decision: add the Services URL through the OpenLink Hub admin instead of hardcoding a duplicate production card.
- Verification: `lib/content-data.ts` loads `profile_links` from D1 before using generic fallback entries.
- Deferred risk: none once the live link is saved in the dashboard.
