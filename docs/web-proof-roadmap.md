# Barnx Web Design & Development: proof and sales roadmap

## Operating system

Services explain what Barnx can solve. Projects is the complete work library. Impact contains only selected deeper breakdowns, usually one or two per major service category when evidence warrants selection. No automatic promotion from Projects to Impact.

Narrative: **business context → problem → friction → desired outcome → solution → working proof → evidence → business value → technical approach → CTA**.

Public Builds are independently created concepts, not commissioned client work. Case Studies is a presentation filter, not an ownership type. A Public Build can have a project case study and later be selected for a deeper Impact story. Preserve Company Work and Open Source attribution when applicable; do not relabel them as client projects.

## Current state and audit (27 September 2026)

- The repo is Next.js 15 / React 19 / TypeScript with Supabase-backed CMS content, authentication, storage and publishing controls. Preserve this stack and the current Vercel workflow.
- Projects already supports ownership classification, galleries, external demo video links and case-study pages. Reuse it.
- Impact already has its own stories/evidence tables and protected editor. It is not necessary to replace the CMS.
- The Web Design page displayed eight capabilities, while the service data listed only four. This change shares the same eight-item list.
- The Impact public loader ignored evidence `media_id`; approved Media Library images therefore became labels without viewable proof. This change resolves only public images and displays them.
- This change removes Independent Case Studies from the public Impact filters, uses “From problem to evidence”, and places working proof before technology.
- Legacy Impact work types remain intact and editable until reviewed. Existing records are not automatically reclassified or deleted.
- `/quote` currently ends with a mailto handoff, not guaranteed server-side lead delivery (see AUD-001). Do not describe it as a stored enquiry/CRM workflow.
- Service-to-project selection is currently a code-managed slug list. The next CMS phase should expose an explicit relation; do not infer all projects from vague category strings.
- Some documentation describes historical phases and is not a substitute for inspecting the current source.
- Live domain content could not be retrieved through the available web lookup. This audit is based on repository source, not claimed live-browser verification.

## Task 1: migration-free portfolio foundation

Capability: clear presentation and management of outcome-led proof.

Target: prospective clients and the portfolio owner.

Problem: inconsistent capability lists, outdated Impact filter, evidence displayed after technology, and image evidence not resolved.

Desired outcome: distinguish full work library from selected evidence-led stories.

Minimum proof: shared service capabilities, correct filters, honest concept/evidence labels, readable workflow, viewable approved images, solution CTA and CMS writing guidance.

Placement: portfolio infrastructure, not a new Impact story.

- [x] Inspect CMS, public loaders, routes, data model and deployment documentation.
- [x] Share the eight service capability labels.
- [x] Keep headline “Real problems. Thoughtful systems. Verifiable outcomes.”
- [x] Use All / Client Work / Company Work / Public Builds / Open Source for Impact.
- [x] Replace “Proof first. Stories second.” with “From problem to evidence.”
- [x] Move approved working evidence ahead of technology and add Request a solution.
- [x] Resolve publicly approved Media Library image evidence without exposing private assets.
- [x] Preserve legacy records and support their later classification review.
- [x] Preserve commas in narrative list entries; one line means one entry.
- [ ] Review preview and merge the change through the existing deployment process.

No production migrations, record edits, secrets, hosting transfer or direct main-branch deployment are part of this change.

### Task 1 verification

- `node scripts/test-proof-foundation.cjs`: passed taxonomy, legacy preservation, narrative parsing, safe evidence URLs, mocked public-media query isolation, server-rendered story ordering, CTA and metadata checks.
- `npm run typecheck`: passed.
- `npm run validate:schema`: passed existing schema/security assertions; this is not a live database migration test.
- `npm run build`: passed, with existing global CSS compatibility and edge-runtime/static-generation warnings.
- Local production-server smoke checks: `/impact`, `/services/web-design-development` and `/projects` return 200 with expected content; unknown Impact story returns 404.
- Not yet verified: browser visual/interaction QA, authenticated CMS save against a configured Supabase environment, Vercel preview and live production data. No credentials were requested or copied.

## Task 2: complete the CMS content model where needed

- [ ] Add explicit service category and capability relations to Projects, with protected editing and public loading.
- [ ] Link an Impact story to its source project without duplicating project identity or making every project an Impact entry.
- [ ] Add separate investigation/assumptions, desired outcome, exclusions/limitations, technical approach and proposed improvements fields. Keep them optional for existing stories; map and review old content rather than inventing missing narrative.
- [ ] Add a project card capabilities/outcome presentation so cards do not lead with framework tags. Keep technical details lower on detail pages.
- [ ] Provide safe draft preview and an evidence-readiness checklist for Impact publishing.
- [ ] Prepare additive migrations and rollback notes; verify on a non-production database before application.
- [ ] Keep all existing media, private demos, permissions, published records and URLs intact.

## Tasks 3–10: the eight proof builds

All eight belong in **Projects → Public Builds**, under the **Web Design & Development** service category. Each starts with the six-part brief below. No fake brands presented as real clients, testimonials or business performance claims.

| # / capability | Target | Possible business problem | Desired outcome | Minimum functional proof | Impact selection |
|---|---|---|---|---|---|
| 1. Business/company website | Logistics company | Incomplete delivery enquiries require repeated questions | Collect the information needed to review a quote request | Services, coverage, route/package/contact form, review, confirmation, structured request view | Candidate after testing and evidence; not selected yet |
| 2. Conversion landing page | Logistics company promoting same-day delivery | Campaign traffic reaches a generic page without a clear next step | Give one campaign a focused enquiry path | Campaign headline, conditions, coverage, benefits, FAQs, one validated lead form and confirmation | Built as Dispatch Now; Projects first; select only if evidence differs meaningfully from #1 |
| 3. Service/booking website | Appointment-based clinic | Repeated conversations to find a suitable appointment | Let a visitor request a service and an available time | Built as CarePath: service/provider, sample slots, contact details, review, confirmation; no patient medical records | Projects first; not selected for Impact |
| 4. Product catalogue | Furniture supplier or wholesaler | Staff repeatedly sends product images and details | Let buyers explore products before asking for a quote | Categories, search/filter, product details, product-specific enquiry; no payment system | Projects first |
| 5. Digital storefront | Digital-product seller | Product explanations and orders are scattered across DMs | Structure discovery, selection and ordering | Product catalogue, details, clearly labelled demo checkout/order request, confirmation; no real payment collection | Projects first |
| 6. Professional portfolio | Architect, consultant or creative | Work is scattered and there is no clear enquiry path | Turn relevant work into understandable proof | Services, selected work, one honest case study, about and project enquiry; no fabricated testimonials | Projects first |
| 7. Lead capture/follow-up | Real-estate agency | Leads lack requirements and follow-up visibility | Give staff qualified enquiry details and visible next steps | Intake with location/budget/timeline, lead record, small status view; sample data with explicit demo boundaries | Strong candidate if workflow tested |
| 8. Website + automation | Cleaning/service business | Staff recopies one request into several tools | Use one submission to trigger the next agreed steps | Form → validated record → acknowledgement → internal notification/task → status; test inboxes only | Strong candidate only with actual integration execution evidence |

### Greenlane status and completion gate

Existing demo: https://greenlane-logistics-proof.usajames017.chatgpt.site

The demo is implemented and was published in the earlier build. This does not establish current uptime, successful browser testing or business impact. Requests are held in page memory, disappear on refresh, and are not sent to a real business. A draft script/case-study page exists; no finished marketing video has been produced.

- [ ] Inspect current Greenlane source and visually verify mobile/desktop.
- [ ] Run and document full request, validation, back-navigation, confirmation and business-view flows.
- [ ] Decide whether simulated handoff adequately proves #1. If using real handoff, configure only the explicitly agreed test destination; never silently send notifications to real prospects.
- [ ] Capture three useful screens and actual product footage with sample data.
- [ ] Add Greenlane as a CMS draft, marked Public Build, with explicit implementation limits and verified live link.
- [x] Add Greenlane to the code-managed Public Builds fallback and Web Design showroom; CMS-backed project entry remains pending.
- [x] Prepare the timed narration, shot list, fictional recording data, capture checklist, edit specification and SRT captions.
- [ ] Record/export the marketing demo; attach the real hosted video URL only once ready.
- [ ] Reassess Impact eligibility after evidence is assembled; no automatic selection.

## Task 11: actual marketing/demo video production

This is a deliverable, not a synonym for writing a script. Create one concise marketing demo for each approved proof project. Do it alongside each build, not after eight unfinished evidence packs.

1. Write the problem-led hook and narration.
2. Build the shot list and storyboard using actual working screens.
3. Record the product flow with fictional data; clearly label any simulated business messages or handoffs.
4. Edit footage with readable captions, restrained motion and a workflow graphic.
5. Add narration. Use an approved synthetic voice or the owner's supplied recording; never imply a cloned voice is the owner.
6. Export the main 60–90 second video (target approximately 75 seconds), a vertical 9:16 social version and a short outreach cut where useful. Preserve readable UI rather than blindly cropping the desktop recording.
7. Supply MP4, captions (SRT), poster frame and reusable script/storyboard/edit source where the tooling supports it.
8. Watch the full export: correct claims, no private data, readable mobile captions, clear audio and accurate workflow.
9. Attach the hosted video to the CMS using existing external-video support; do not add broken “Watch demo” buttons while production is pending.

| Time | Story | Visual |
|---|---|---|
| 0–7 sec | Problem/hook | Recognizable business friction |
| 7–15 sec | Existing process | Clearly labelled sample messages or workflow |
| 15–25 sec | Proposed solution | Product overview |
| 25–55 sec | Demonstration | Actual tested product footage |
| 55–65 sec | Outcome / evidence | Structured result and workflow |
| 65–75 sec | CTA | Similar problem? Request a solution |

Production depends on a usable screen-capture/video-editing runtime and narration assets. If a needed integration is unavailable, request that specific access when reached. GitHub handles source work; it is not itself a video renderer. No additional plugin is needed for Task 1.

## Task 12: selected Impact stories

- [ ] Compare the finished proofs; select roughly one or two meaningful examples, not eight copies.
- [ ] Context, possible/observed problem, investigation, assumptions, exclusions, desired outcome.
- [ ] Solution, visual system flow and product decisions.
- [ ] Working proof: demo, screenshots, video and actual verification notes.
- [ ] Evidence level and limitations; explain what is not measured.
- [ ] Technical approach, potential improvements and Request a solution CTA.
- [ ] Retain the source-project link and correct work attribution.

## Task 13: distribute and sell each proof

- [ ] Portfolio card and project page: problem/outcome first, capability labels, honest status, live demo/video links.
- [ ] TikTok, LinkedIn and X versions of the problem → solution → outcome story.
- [ ] Short outbound message personalized to a business signal that was actually observed, with relevant demo proof.
- [ ] Discovery questions, scope boundaries, deliverables, exclusions, handoff and maintenance options.
- [ ] Track enquiries and objections to validate the offer. Do not promise unmeasured conversion or revenue improvements.
- [ ] Consider templates/products only if repeated demand appears.

Drafting outreach does not authorize sending it, and making social assets does not authorize posting them.

## Completion standard for every proof

Polished responsive demo + verified core flow + clear demo boundaries + source + project entry + screenshots + actual video export + business-facing offer. Add an Impact story only if selected. Do not mark video, integrations or results complete based solely on a script, mock screen or intended behavior.

## Recommended order

Review Task 1 → safe CMS extension → finish/test/package Greenlane → create its video and sales pack → build and package #2 through #8 one at a time → curate Impact → final portfolio QA. Preserve source and edit history throughout.
