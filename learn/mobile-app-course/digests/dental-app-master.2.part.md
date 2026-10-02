---
source: dental-app-master
source_type: codebase
source_lines: 7425
language: TypeScript
file_count: 63
part: 2
status: absorbed
absorbed_at: 2026-10-02
created: 2026-10-01
updated: 2026-10-01
---

# Digest — dental-app-master (part 2)

## Overview (L1)

- `src/lib/` — Framework-free domain core: timezone-correct scheduling (`scheduling.ts`, `time.ts`), the booking write-guard (`booking.ts`), OpenAI education/triage rules (`ai.ts`), auth/ownership guards (`auth.ts`), HTTP error envelope (`http.ts`), ImageKit private uploads (`imagekit.ts`), Stream chat/video (`stream.ts`), audit logging (`audit.ts`), Zod schemas (`validation.ts`).
- `src/app/api/` — Next.js Route Handlers that the Expo patient app calls: appointments (list/create/cancel/reschedule), availability, patients + medical history, AI chat and photo attachments, Stream token/channel, and the Clerk webhook. Every handler is wrapped in `route()` and gated by `requireAuth()`/`requireStaff()`.
- `src/app/dashboard/` — Staff-facing Next.js Server Components reading Drizzle directly (no HTTP hop): today's schedule, patient roster, per-patient intake/medical-history/timeline, dentist roster. Server Actions add post-op notes and mark visits complete.
- `src/app/(site)/` — Public marketing route group: landing page plus Privacy Policy and Terms pages, sharing `SiteNav`/`SiteFooter`.
- `src/components/` — Shared design system (`ui.tsx`, `icons.tsx`) and site chrome (`site-chrome.tsx`, `sidebar-nav.tsx`); `AGENTS.md` forbids re-implementing buttons/cards outside these.
- `src/db/` — Drizzle + Neon HTTP schema (users, patients, medical histories, dentists, services, working hours, time off, appointments, attachments, visit notes, AI threads, audit log) plus seed/utility scripts.

## Structure (L2)

### sources/mobile-app-course/20261001/dental-app-master/apps/web/src/lib/time.ts

- Locator: `[[sources/mobile-app-course/20261001/dental-app-master/apps/web/src/lib/time.ts]]`
- Purpose: Single-clinic timezone layer (PLAN.md A1). Converts clinic-local wall-clock time to UTC instants and back via `@date-fns/tz` `TZDate`, keeping all DST math in one file.
- Key exports: `CLINIC_TZ`, `CalendarDay`, `parseDay`, `formatDay`, `clinicInstant`, `parseClockTime`, `clinicDayOf`, `weekdayOf`, `eachDay`, `formatClinicTime`, `formatClinicDate`.
- Dependencies: `@date-fns/tz` (`TZDate`);
- Learner-relevant: Why `new Date('YYYY-MM-DD')` is wrong (UTC-parsed); representing days as `{year,month,day}` structs and stepping by calendar arithmetic rather than `+24h`; using `Intl.DateTimeFormat` with an explicit `timeZone` for display.

### sources/mobile-app-course/20261001/dental-app-master/apps/web/src/lib/scheduling.ts

- Locator: `[[sources/mobile-app-course/20261001/dental-app-master/apps/web/src/lib/scheduling.ts]]`
- Purpose: Pure slot engine. Computes every bookable start time across a date range from working hours + busy intervals, and classifies a proposed write as `ok | taken | invalid`.
- Key exports: `SLOT_GRANULARITY_MINUTES` (15), `MIN_LEAD_TIME_MINUTES` (120), `CANCEL_CUTOFF_HOURS` (24), `JOIN_OPENS_BEFORE_MINUTES` (5), `JOIN_CLOSES_AFTER_MINUTES` (30), `WorkingHour`, `BusyInterval`, `Slot`, `overlaps`, `availableSlots`, `canCancel`, `canJoinCall`, `classifySlot`.
- Dependencies: `./time`.
- Learner-relevant: Half-open interval overlap (`aStart < bEnd && bStart < aEnd`); grouping busy intervals per dentist; the split between "taken" (409, real slot) and "invalid" (400, never a slot) so the same pure function backs both the read and write paths; why the engine is pure (DST testable without a DB). Includes `src/lib/scheduling.test.ts` (381 lines) pinning DST/lead-time/cancel cases.

### sources/mobile-app-course/20261001/dental-app-master/apps/web/src/lib/booking.ts

- Locator: `[[sources/mobile-app-course/20261001/dental-app-master/apps/web/src/lib/booking.ts]]`
- Purpose: Server-side write guard. Loads the scheduling inputs from Postgres and rejects any appointment `POST`/reschedule that `GET /api/availability` would not have offered.
- Key exports: `loadSchedulingInputs`, `assertSlotBookable`.
- Dependencies: `drizzle-orm`, `@/db`, `@/db/schema`, `./http` (`badRequest`, `conflict`), `./scheduling` (`classifySlot`), `./time`.
- Learner-relevant: Sharing one input loader between the availability read and the booking write so the two cannot drift; widening the queried range by a day each side; excluding the appointment being rescheduled so it cannot block itself.

### sources/mobile-app-course/20261001/dental-app-master/apps/web/src/lib/ai.ts

- Locator: `[[sources/mobile-app-course/20261001/dental-app-master/apps/web/src/lib/ai.ts]]`
- Purpose: Education-and-triage-only assistant rules. Prompt, hard-coded emergency/photo/fallback replies, a regex emergency classifier that runs before the model, and the fail-closed transmission gate.
- Key exports: `externalTransmissionApproved`, `AI_MODEL` (`gpt-4o-mini`), `SYSTEM_PROMPT`, `isEmergency`, `EMERGENCY_REPLY`, `PHOTO_REPLY`, `AI_FALLBACK_REPLY`, `replyStream`.
- Dependencies: Node/Web globals (`process.env`, `TextEncoder`, `ReadableStream`), `openai` types.
- Learner-relevant: "No patient record to OpenAI" vs "no PHI reaches OpenAI" distinction; fail-closed env gate (`=== 'true'` only); deterministic emergency handling because an LLM is not an acceptable control where the wrong answer is an airway; draining a chat-completion async iterator into a plain-text `ReadableStream`, persisting via `onDone` before close, and never echoing errors that could quote the patient prompt. Includes `src/lib/ai.test.ts` (125 lines).

### sources/mobile-app-course/20261001/dental-app-master/apps/web/src/lib/auth.ts

- Locator: `[[sources/mobile-app-course/20261001/dental-app-master/apps/web/src/lib/auth.ts]]`
- Purpose: Clerk-backed authorization. Upserts the mirrored `users` row on first request, derives roles, and owns the patient-ownership check used by every patient-scoped route.
- Key exports: `Role`, `AppUser`, `roleFromMetadata`, `requireAuth`, `requireStaff`, `requireOwnedPatient`, `selfPatient`.
- Dependencies: `@clerk/nextjs/server` (`auth`, `currentUser`), `drizzle-orm`, `@/db`, `@/db/schema`, `./http`.
- Learner-relevant: Handling webhook eventual-consistency by upserting from the session; trusting either Clerk `publicMetadata` or the DB when deciding staff (DB can lag); resolving ownership once (`requireOwnedPatient`) rather than per route; 404-over-403 for other users' records.

### sources/mobile-app-course/20261001/dental-app-master/apps/web/src/lib/http.ts

- Locator: `[[sources/mobile-app-course/20261001/dental-app-master/apps/web/src/lib/http.ts]]`
- Purpose: API error envelope and route wrapper. Turns thrown `ApiError`/`ZodError` into JSON responses and scrubs query parameters from errors before logging/Sentry.
- Key exports: `ApiError`, `unauthorized`, `forbidden`, `notFound`, `badRequest`, `conflict`, `isExclusionViolation`, `scrubQuery`, `json`, `route`.
- Dependencies: `@sentry/nextjs`, `zod` (`ZodError`).
- Learner-relevant: `isExclusionViolation` detects Postgres `23P01` (the double-booking exclusion constraint) so the app returns a clean 409; `scrubQuery` strips Drizzle's `params:` bound values (patient rows) from error messages; `json()` sets `Cache-Control: no-store` because responses are identity-specific; the wrapper preserves PHI-free 500s.

### sources/mobile-app-course/20261001/dental-app-master/apps/web/src/lib/imagekit.ts

- Locator: `[[sources/mobile-app-course/20261001/dental-app-master/apps/web/src/lib/imagekit.ts]]`
- Purpose: Private image storage. Server-side uploads to per-user private folders and signed, expiring delivery URLs; blur-derived thumbnails and a watermark on appointment attachments.
- Key exports: `photoFolder`, `attachmentFolder`, `imagekit`, `SignedPhoto`, `signedPhoto`, `SignedAttachment`, `signedAttachment`, `uploadPrivateImage`.
- Dependencies: `imagekit` SDK, `./http`.
- Learner-relevant: Why bytes upload through the server (client-upload signatures authorise *an* upload, not a destination, so a signed-in patient could write anywhere); `isPrivateFile` + `useUniqueFileName` + extension from declared MIME type; signature includes the transformation string so blurred/full/thumb are separately signed renderings of one stored file; URL TTL vs stored path.

### sources/mobile-app-course/20261001/dental-app-master/apps/web/src/lib/stream.ts

- Locator: `[[sources/mobile-app-course/20261001/dental-app-master/apps/web/src/lib/stream.ts]]`
- Purpose: Stream Chat/Video server wrapper. Mints short-lived tokens, computes Stream user ids from our own user ids, and creates the one derived per-patient clinic channel.
- Key exports: `STREAM_API_KEY`, `streamServer`, `streamUserId`, `mintToken`, `clinicChannelId`, `isStaff`, `syncStreamUser`, `ensureClinicChannel`.
- Dependencies: `drizzle-orm`, `stream-chat` (`StreamChat`), `@/db`, `@/db/schema`, `./auth`, `./http`.
- Learner-relevant: Server-only secret; user id always taken from the session, never the client (a client-supplied id on a token endpoint is an impersonation bug); Chat+Video share one identity/token; derived channel id means no channel table; idempotent channel creation adding new staff; the one deliberate name crossing to a BAA-covered vendor.

### sources/mobile-app-course/20261001/dental-app-master/apps/web/src/lib/appointments.ts · validation.ts · audit.ts · ai-thread.ts

- Locator: `[[sources/mobile-app-course/20261001/dental-app-master/apps/web/src/lib/appointments.ts]]`, `[[sources/mobile-app-course/20261001/dental-app-master/apps/web/src/lib/validation.ts]]`, `[[sources/mobile-app-course/20261001/dental-app-master/apps/web/src/lib/audit.ts]]`, `[[sources/mobile-app-course/20261001/dental-app-master/apps/web/src/lib/ai-thread.ts]]`
- Purpose: `appointments.ts` serializes an appointment row into the exact shape mobile cards render (labels pre-formatted in clinic time, `canCancel`/`canJoin` decided server-side). `validation.ts` holds all Zod request schemas. `audit.ts` writes one row per staff PHI access without logging values. `ai-thread.ts` is the single ownership-checked conversation resolver.
- Key exports: `AppointmentRow`, `serialize`; `patientProfileSchema`, `createPatientSchema`, `medicalHistorySchema`, `availabilityQuerySchema`, `createAppointmentSchema`, `patchAppointmentSchema`, `aiChatSchema`, `visitNoteSchema`; `audit`; `getOrCreateConversation`.
- Dependencies: `drizzle-orm`, `zod`, `@/db`, `@/db/schema`, `./http`, `./scheduling`, `./time`.
- Learner-relevant: Computing `canCancel`/`canJoin` server-side so the client only renders buttons; `z.discriminatedUnion` for cancel-vs-reschedule; deriving `ends_at` server-side (client never sends duration); audit logging entity ids only; a conversation id belonging to someone else is a 404 not a 403.

### sources/mobile-app-course/20261001/dental-app-master/apps/web/src/app/api/appointments/route.ts

- Locator: `[[sources/mobile-app-course/20261001/dental-app-master/apps/web/src/app/api/appointments/route.ts]]`
- Purpose: `GET` lists the whole family's appointments (`?scope=upcoming|past`, past notes included); `POST` is the booking aha-moment, computing `ends_at` from service duration and letting the Postgres exclusion constraint arbitrate races.
- Key exports: `GET`, `POST` (module-level, wrapped in `route()`).
- Dependencies: `drizzle-orm`, `@/db`, `@/db/schema`, `@/lib/auth`, `@/lib/booking`, `@/lib/http`, `@/lib/appointments`, `@/lib/validation`.
- Learner-relevant: Exclusion-violation → 409 `slot_taken`; server derives the teleconsult `streamCallId` (`appointment-{id}`); re-running `assertSlotBookable` so the client cannot invent a time; joining notes for past visits.

### sources/mobile-app-course/20261001/dental-app-master/apps/web/src/app/api/appointments/[id]/route.ts

- Locator: `[[sources/mobile-app-course/20261001/dental-app-master/apps/web/src/app/api/appointments/[id]/route.ts]]`
- Purpose: `GET` one owned appointment with notes and signed attachment URLs; `PATCH` cancels or reschedules, enforcing the 24-hour cutoff server-side.
- Key exports: `GET`, `PATCH`.
- Dependencies: `drizzle-orm`, `@/db`, `@/db/schema`, `@/lib/auth`, `@/lib/imagekit`, `@/lib/http`, `@/lib/scheduling`, `@/lib/appointments`, `@/lib/booking`, `@/lib/validation`.
- Learner-relevant: `loadOwned` scopes by the caller's patient set; reschedule excludes its own appointment to avoid self-blocking, then catches `23P01`; cancel sets `status`, `cancelledAt`, `cancelledBy`; reschedule nulls reminder timestamps.

### sources/mobile-app-course/20261001/dental-app-master/apps/web/src/app/api/appointments/[id]/attachments/route.ts · api/ai/attachments/route.ts

- Locator: `[[sources/mobile-app-course/20261001/dental-app-master/apps/web/src/app/api/appointments/[id]/attachments/route.ts]]`, `[[sources/mobile-app-course/20261001/dental-app-master/apps/web/src/app/api/ai/attachments/route.ts]]`
- Purpose: Multipart photo upload endpoints. Appointment route stores X-rays/prescriptions/referrals (max 10 per appointment) to a private folder; AI route stores a photo in the assistant thread and returns the hard-coded `PHOTO_REPLY` with no model call.
- Key exports: `POST` each.
- Dependencies: `drizzle-orm`, `@/db`, `@/db/schema`, `@/lib/auth`, `@/lib/imagekit`, `@/lib/http`, `@/lib/ai`, `@/lib/ai-thread`.
- Learner-relevant: Uploading only after the row/ownership exists so no orphan file; counting attachments to enforce a cap; photo turn writes both rows with empty `content` so the model prompt (which filters blank turns) sees no hole; photo never reaches OpenAI.

### sources/mobile-app-course/20261001/dental-app-master/apps/web/src/app/api/availability/route.ts

- Locator: `[[sources/mobile-app-course/20261001/dental-app-master/apps/web/src/app/api/availability/route.ts]]`
- Purpose: `GET` bookable slots for a service across a date range, aggregated over every active dentist that offers it; each slot carries the `dentistId` the booking POST needs.
- Key exports: `GET`.
- Dependencies: `drizzle-orm`, `@/db`, `@/db/schema`, `@/lib/auth`, `@/lib/booking`, `@/lib/http`, `@/lib/scheduling`, `@/lib/time`, `@/lib/validation`.
- Learner-relevant: Query parsing/validation with Zod; joining `dentist_services` to find offering dentists; pre-formatting a clinic-local `label` so the app never needs `CLINIC_TZ`.

### sources/mobile-app-course/20261001/dental-app-master/apps/web/src/app/api/ai/chat/route.ts

- Locator: `[[sources/mobile-app-course/20261001/dental-app-master/apps/web/src/app/api/ai/chat/route.ts]]`
- Purpose: `POST` the assistant turn (emergency short-circuit, transmission gate, OpenAI streaming), `GET` rehydrate the newest thread, `DELETE` clear history and its ImageKit photos.
- Key exports: `POST`, `GET`, `DELETE`.
- Dependencies: `@sentry/nextjs`, `drizzle-orm`, `openai`, `@/db`, `@/db/schema`, `@/lib/ai`, `@/lib/ai-thread`, `@/lib/auth`, `@/lib/imagekit`, `@/lib/http`, `@/lib/validation`.
- Learner-relevant: Emergency reply persists and returns as JSON before the model; 503s for unconfigured/blocked; Sentry agent tracing (`setUser` id-only, `setConversationId`, `instrumentOpenAiClient`) with gen_ai inputs/outputs disabled to keep PHI out; streaming text/plain with `X-Conversation-Id` because JSON branches and streams differ by content type; history limit 30 with blank photo turns filtered.

### sources/mobile-app-course/20261001/dental-app-master/apps/web/src/app/api/me/route.ts

- Locator: `[[sources/mobile-app-course/20261001/dental-app-master/apps/web/src/app/api/me/route.ts]]`
- Purpose: `GET` the mobile app's first call (identity, role, `hasOnboarded`, family); `DELETE` full account erasure across ImageKit → Stream → Postgres → Clerk, in that order.
- Key exports: `GET`, `DELETE`.
- Dependencies: `@clerk/nextjs/server` (`clerkClient`), `drizzle-orm`, `@/db`, `@/db/schema`, `@/lib/auth`, `@/lib/http`, `@/lib/imagekit`, `@/lib/stream`.
- Learner-relevant: Deliberate deletion order (identity last so a partial failure is retryable, never stranding PHI); cascading deletes from the `users` root; best-effort vendor cleanup; `route.test.ts` pins the order. Includes `src/app/api/me/route.test.ts` (96 lines).

### sources/mobile-app-course/20261001/dental-app-master/apps/web/src/app/api/patients/route.ts · patients/[id]/route.ts · patients/[id]/medical-history/route.ts

- Locator: `[[sources/mobile-app-course/20261001/dental-app-master/apps/web/src/app/api/patients/route.ts]]`, `[[sources/mobile-app-course/20261001/dental-app-master/apps/web/src/app/api/patients/[id]/route.ts]]`, `[[sources/mobile-app-course/20261001/dental-app-master/apps/web/src/app/api/patients/[id]/medical-history/route.ts]]`
- Purpose: Family/patient CRUD: family list + onboarding/dependent creation; per-patient get/patch/delete; the PHI medical-history `GET`/`PUT` (upsert).
- Key exports: `GET`, `POST`; `GET`, `PATCH`, `DELETE`; `GET`, `PUT`.
- Dependencies: `drizzle-orm`, `@/db`, `@/db/schema`, `@/lib/auth`, `@/lib/http`, `@/lib/validation`.
- Learner-relevant: The partial unique index enforces one `is_self` per account (also checked in code); `PATCH` uses `patientProfileSchema.partial()`; self-profile cannot be deleted here; medical-history upsert via `onConflictDoUpdate` on the unique `patientId`.

### sources/mobile-app-course/20261001/dental-app-master/apps/web/src/app/api/stream/token/route.ts · stream/channel/route.ts

- Locator: `[[sources/mobile-app-course/20261001/dental-app-master/apps/web/src/app/api/stream/token/route.ts]]`, `[[sources/mobile-app-course/20261001/dental-app-master/apps/web/src/app/api/stream/channel/route.ts]]`
- Purpose: `POST` mint/refresh a Stream credential derived from the Clerk session; `GET` the patient's single derived clinic channel (staff get `null` and use the shared inbox).
- Key exports: `POST`; `GET`.
- Dependencies: `@/lib/auth`, `@/lib/http`, `@/lib/stream`.
- Learner-relevant: The token endpoint never accepts a client-supplied user id; short TTL plus re-POST doubles as refresh and keeps the auth check live; staff/node role branch.

### sources/mobile-app-course/20261001/dental-app-master/apps/web/src/app/api/dentists/route.ts · api/services/route.ts

- Locator: `[[sources/mobile-app-course/20261001/dental-app-master/apps/web/src/app/api/dentists/route.ts]]`, `[[sources/mobile-app-course/20261001/dental-app-master/apps/web/src/app/api/services/route.ts]]`
- Purpose: Read-only catalog endpoints. Dentists (optionally narrowed by `?serviceId=` via `dentist_services`); active services driving the booking reason picker.
- Key exports: `GET` each.
- Dependencies: `drizzle-orm`, `@/db`, `@/db/schema`, `@/lib/auth`, `@/lib/http`.
- Learner-relevant: Conditional join vs full filter based on query param; both require auth even though the data is non-PHI.

### sources/mobile-app-course/20261001/dental-app-master/apps/web/src/app/api/webhooks/clerk/route.ts

- Locator: `[[sources/mobile-app-course/20261001/dental-app-master/apps/web/src/app/api/webhooks/clerk/route.ts]]`
- Purpose: Clerk webhook backstop mirroring identity into `users` (`user.created`/`updated` upsert, `user.deleted` cascade delete). Not the critical path because `requireAuth()` upserts.
- Key exports: `POST`.
- Dependencies: `@clerk/nextjs/webhooks` (`verifyWebhook`), `drizzle-orm`, `next/server`, `@/db`, `@/db/schema`, `@/lib/auth`.
- Learner-relevant: Signature-verified webhooks; `onConflictDoUpdate`; `user.deleted` racing the account-delete route is a safe no-op.

### sources/mobile-app-course/20261001/dental-app-master/apps/web/src/app/dashboard/layout.tsx · dashboard/page.tsx

- Locator: `[[sources/mobile-app-course/20261001/dental-app-master/apps/web/src/app/dashboard/layout.tsx]]`, `[[sources/mobile-app-course/20261001/dental-app-master/apps/web/src/app/dashboard/page.tsx]]`
- Purpose: Dashboard shell (fixed sidebar, Clerk `SignOutButton`/`UserButton`, `requireStaff` guard with a `NotStaff` fallback) and the day schedule Server Component (date shift nav, stat tiles, appointment table).
- Key exports: `DashboardLayout`, `DashboardPage` (default), local `NotStaff`/`PillLink`.
- Dependencies: `@clerk/nextjs`, `next/link`, `next/navigation`, `drizzle-orm`, `@/components/icons`, `@/components/ui`, `@/components/sidebar-nav`, `@/db`, `@/db/schema`, `@/lib/auth`, `@/lib/http`, `@/lib/time`.
- Learner-relevant: Resource-based guard in the layout (not path-matching middleware); Server Components querying Drizzle directly with no HTTP hop; `PageProps<'/dashboard'>` typed params; clinic-day window (`clinicInstant` → +24h) and alternative status `video` pill.

### sources/mobile-app-course/20261001/dental-app-master/apps/web/src/app/dashboard/patients/page.tsx · patients/[id]/page.tsx

- Locator: `[[sources/mobile-app-course/20261001/dental-app-master/apps/web/src/app/dashboard/patients/page.tsx]]`, `[[sources/mobile-app-course/20261001/dental-app-master/apps/web/src/app/dashboard/patients/[id]/page.tsx]]`
- Purpose: Patient roster (name/DOB/phone/visits/last-visit, household + dependent counts) and the per-patient chart: intake fields, medical history (chips/toggles/`LevelMeter`), visit timeline with signed attachment thumbnails, post-op notes, and complete/add-note controls.
- Key exports: `PatientsPage`, `PatientPage`, local `ChipGroup`.
- Dependencies: `drizzle-orm`, `next/link`, `next/navigation`, `@/components/icons`, `@/components/ui`, `@/db`, `@/db/schema`, `@/lib/audit`, `@/lib/auth`, `@/lib/imagekit`, `@/lib/time`, `./add-note-form`, `./complete-button`.
- Learner-relevant: A staff roster read is itself audited (`audit(staff.id, 'read', 'patients', null)`); notes/attachments scoped to this patient's appointment ids to avoid loading other patients' data; signed attachment URLs generated per read; medical history is flagged as THE PHI table.

### sources/mobile-app-course/20261001/dental-app-master/apps/web/src/app/dashboard/patients/[id]/actions.ts · add-note-form.tsx · complete-button.tsx

- Locator: `[[sources/mobile-app-course/20261001/dental-app-master/apps/web/src/app/dashboard/patients/[id]/actions.ts]]`, `[[sources/mobile-app-course/20261001/dental-app-master/apps/web/src/app/dashboard/patients/[id]/add-note-form.tsx]]`, `[[sources/mobile-app-course/20261001/dental-app-master/apps/web/src/app/dashboard/patients/[id]/complete-button.tsx]]`
- Purpose: `'use server'` actions `addVisitNote` (validated insert + audit + `revalidatePath`) and `completeAppointment` (status → completed, bump `lastVisitAt`, audit), with their client components using `useActionState` / `useTransition`.
- Key exports: `addVisitNote`, `completeAppointment`; `AddNoteForm`, `CompleteButton`.
- Dependencies: `drizzle-orm`, `next/cache`, `react`, `@/db`, `@/db/schema`, `@/lib/audit`, `@/lib/auth`, `@/lib/validation`.
- Learner-relevant: Server Actions as a REST-less write path, with the same `requireStaff`/Zod/audit discipline as routes; `revalidatePath` after mutation; progressive-enhancement pending/error states.

### sources/mobile-app-course/20261001/dental-app-master/apps/web/src/app/dashboard/dentists/page.tsx

- Locator: `[[sources/mobile-app-course/20261001/dental-app-master/apps/web/src/app/dashboard/dentists/page.tsx]]`
- Purpose: Dentist roster with per-dentist working hours, offered services, upcoming booking counts, and teleconsult capability; stat tiles for active dentists / teleconsult-capable / upcoming bookings.
- Key exports: `DentistsPage`, local `clockLabel`, `WEEKDAYS`.
- Dependencies: `drizzle-orm`, `@/components/icons`, `@/components/ui`, `@/db`, `@/db/schema`, `@/lib/auth`.
- Learner-relevant: Parallel `Promise.all` reads, a `count()` + `groupBy` aggregate, and in-memory grouping by dentist id; clinic-local wall-clock hours formatted without timezone conversion (they are not instants).

### sources/mobile-app-course/20261001/dental-app-master/apps/web/src/app/(site)/layout.tsx · (site)/page.tsx · (site)/privacy/page.tsx · (site)/terms/page.tsx

- Locator: `[[sources/mobile-app-course/20261001/dental-app-master/apps/web/src/app/(site)/layout.tsx]]`, `[[sources/mobile-app-course/20261001/dental-app-master/apps/web/src/app/(site)/page.tsx]]`, `[[sources/mobile-app-course/20261001/dental-app-master/apps/web/src/app/(site)/privacy/page.tsx]]`, `[[sources/mobile-app-course/20261001/dental-app-master/apps/web/src/app/(site)/terms/page.tsx]]`
- Purpose: Public route group (no URL segment): landing page with bundled device screenshots/feature grid/store badges, and the long-form Privacy Policy (613 lines) and Terms (801 lines) built from `LegalPage` with a draft banner.
- Key exports: `SiteLayout`, `Privacy`/`Terms` default pages, `metadata`.
- Dependencies: `next/image`, `next/link`, `next` (`Metadata`), `@/assets/*.png`, `@/components/icons`, `@/components/site-chrome`.
- Learner-relevant: Route groups; importing images so the bundler content-hashes them (cache-proof) and intrinsic size comes from the file; marketing claims kept to shipped features; legal text as semantic HTML styled by a `legal-prose` utility.

### sources/mobile-app-course/20261001/dental-app-master/apps/web/src/components/ui.tsx · icons.tsx · site-chrome.tsx · sidebar-nav.tsx

- Locator: `[[sources/mobile-app-course/20261001/dental-app-master/apps/web/src/components/ui.tsx]]`, `[[sources/mobile-app-course/20261001/dental-app-master/apps/web/src/components/icons.tsx]]`, `[[sources/mobile-app-course/20261001/dental-app-master/apps/web/src/components/site-chrome.tsx]]`, `[[sources/mobile-app-course/20261001/dental-app-master/apps/web/src/components/sidebar-nav.tsx]]`
- Purpose: The design system and public chrome. `ui.tsx` is the single source of truth for every dashboard surface; `icons.tsx` is the complete inline SVG icon set + `LogoMark`; `site-chrome.tsx` renders `SiteNav`/`SiteFooter`/`StoreBadges`/`LegalPage`; `sidebar-nav.tsx` is the active-route client nav.
- Key exports: `Card`, `CardTitle`, `StatTile`, `StatusPill`, `Chip`, `Field`, `ToggleRow`, `LevelMeter`, `EmptyState`, `Avatar`; ~15 named icons + `LogoMark`; `StoreBadges`, `SiteNav`, `SiteFooter`, `LegalPage`; `SidebarNav`.
- Dependencies: `react` types, `@clerk/nextjs` (`Show`, `SignInButton`), `next/link`, `next/navigation` (`usePathname`).
- Learner-relevant: Design-system discipline (add a prop, never fork a card/button) as enforced by `AGENTS.md`; `StatusPill` tone map; `Avatar` initials fallback + ImageKit delivery-time resize (`tr=w-…,h-…,fo-face,q-80`); Tailwind theme tokens (`aqua`, `navy`, `muted`, `powder`, `hairline`) and `card`/`btn-aqua`/`btn-glass` utilities.

### sources/mobile-app-course/20261001/dental-app-master/apps/web/src/db/schema.ts · db/index.ts

- Locator: `[[sources/mobile-app-course/20261001/dental-app-master/apps/web/src/db/schema.ts]]`, `[[sources/mobile-app-course/20261001/dental-app-master/apps/web/src/db/index.ts]]`
- Purpose: Full Drizzle Postgres schema and relation graph, plus the Neon HTTP drizzle client. Defines enums (`role`, `appointment_status`, `ai_role`) and tables `users`, `patients`, `medical_histories`, `dentists`, `services`, `dentist_services`, `working_hours`, `time_off`, `appointments`, `appointment_attachments`, `visit_notes`, `ai_conversations`, `ai_messages`, `audit_log`.
- Key exports: `db`, `schema`; all tables/enums/relations and inferred types (`$inferSelect`).
- Dependencies: `drizzle-orm` (`relations`, `sql`), `drizzle-orm/pg-core`, `drizzle-orm/neon-http`, `@neondatabase/serverless`.
- Learner-relevant: The family model (one account → N patients, exactly one `is_self` enforced by a partial unique index); double-booking prevented by a hand-written `EXCLUDE USING gist` constraint Drizzle cannot generate (never replace with app logic); `medical_histories` is THE PHI table with `unique` FK; family/timezone comments; relation definitions powering dashboard Server Components; `db/index.ts` fails fast without `DATABASE_URL`.

### sources/mobile-app-course/20261001/dental-app-master/apps/web/drizzle/ · drizzle.config.ts

- Locator: `[[sources/mobile-app-course/20261001/dental-app-master/apps/web/drizzle.config.ts]]`, `[[sources/mobile-app-course/20261001/dental-app-master/apps/web/drizzle/0000_oval_black_crow.sql]]`, `[[sources/mobile-app-course/20261001/dental-app-master/apps/web/drizzle/0001_ai_message_image.sql]]`, `[[sources/mobile-app-course/20261001/dental-app-master/apps/web/drizzle/0002_appointment_attachments.sql]]`
- Purpose: Drizzle Kit config (schema path, `./drizzle` out, `postgresql`, `DATABASE_URL`) and the migrations: initial schema, AI message image column, appointment attachments table (plus `meta/` journal/snapshots).
- Key exports: `defineConfig` default; SQL migration statements.
- Dependencies: `drizzle-kit`, `process.env.DATABASE_URL`, Postgres.
- Learner-relevant: Generated migration lifecycle and snapshots as build artifacts; additive migrations for new features (image path, attachments); hand-written constraints live alongside generated DDL.

### sources/mobile-app-course/20261001/dental-app-master/apps/web/src/db/seed.ts · seed-stream.ts · check-stream.ts · upload-dentist-photos.ts

- Locator: `[[sources/mobile-app-course/20261001/dental-app-master/apps/web/src/db/seed.ts]]`, `[[sources/mobile-app-course/20261001/dental-app-master/apps/web/src/db/seed-stream.ts]]`, `[[sources/mobile-app-course/20261001/dental-app-master/apps/web/src/db/check-stream.ts]]`, `[[sources/mobile-app-course/20261001/dental-app-master/apps/web/src/db/upload-dentist-photos.ts]]`
- Purpose: Idempotent demo seeding and diagnostics: `seed.ts` (425 lines) inserts 8 services, 3 dentists with hours/offers, patients, histories, appointments via the scheduling engine; `seed-stream.ts` creates Stream channels + sample staff/patient messages; `check-stream.ts` diagnoses Stream credentials; `upload-dentist-photos.ts` pushes public headshots and stamps URLs.
- Key exports: None (top-level scripts via `tsx`).
- Dependencies: `drizzle-orm`, `@/db`, `@/db/schema`, `@/lib/scheduling`, `@/lib/time`, `@/lib/stream`, `imagekit`, Node `fs`/`path`.
- Learner-relevant: Using the real slot engine to place seeded appointments; separating Postgres seeding from Stream seeding; public-folder headshots vs private patient photos; credential preflight checks for a third-party integration.

### sources/mobile-app-course/20261001/dental-app-master/apps/web/src/proxy.ts · instrumentation.ts · instrumentation-client.ts · sentry.server.config.ts · next.config.ts · layout.tsx · global-error.tsx · types/stream.d.ts · vitest.config.mts

- Locator: `[[sources/mobile-app-course/20261001/dental-app-master/apps/web/src/proxy.ts]]`, `[[sources/mobile-app-course/20261001/dental-app-master/apps/web/src/instrumentation.ts]]`, `[[sources/mobile-app-course/20261001/dental-app-master/apps/web/src/instrumentation-client.ts]]`, `[[sources/mobile-app-course/20261001/dental-app-master/apps/web/sentry.server.config.ts]]`, `[[sources/mobile-app-course/20261001/dental-app-master/apps/web/next.config.ts]]`, `[[sources/mobile-app-course/20261001/dental-app-master/apps/web/src/app/layout.tsx]]`, `[[sources/mobile-app-course/20261001/dental-app-master/apps/web/src/app/global-error.tsx]]`, `[[sources/mobile-app-course/20261001/dental-app-master/apps/web/src/types/stream.d.ts]]`, `[[sources/mobile-app-course/20261001/dental-app-master/apps/web/vitest.config.mts]]`
- Purpose: App-wide plumbing. `proxy.ts` (Next 16's renamed middleware) attaches Clerk auth context to every request for Bearer-token Expo calls with no path matching. Sentry init (server with PHI-scrubbing `dataCollection`/`beforeSend`, client with no replay), instrumentation hooks, root layout with `ClerkProvider`, root `global-error.tsx`, Stream module augmentation, and `withSentryConfig` build. `vitest.config.mts` sets the `@` alias for tests.
- Key exports: `default clerkMiddleware`, `config`; `register`, `onRequestError`; `onRouterTransitionStart`; `RootLayout`, `global-error` default; `nextConfig` wrapped by `withSentryConfig`; Vitest `defineConfig`.
- Dependencies: `@clerk/nextjs/server`, `@sentry/nextjs`, `next`, `vitest/config`, `./src/lib/http` (`scrubQuery`).
- Learner-relevant: Next 16 `middleware.ts` → `proxy.ts` rename and the Core 3 shift from `createRouteMatcher` to resource-based guards; attaching a Bearer-token auth context centrally; keeping PHI out of Sentry by disabling `genAI` inputs/outputs, `databaseQueryData`, `stackFrameVariables` and scrubbing error messages; no session replay because the dashboard renders PHI.

### sources/mobile-app-course/20261001/dental-app-master/apps/web/package.json · AGENTS.md · README.md

- Locator: `[[sources/mobile-app-course/20261001/dental-app-master/apps/web/package.json]]`, `[[sources/mobile-app-course/20261001/dental-app-master/apps/web/AGENTS.md]]`
- Purpose: The web app manifest (Next 16.3.3 / React 19.2.8, Clerk, Sentry, Drizzle, OpenAI, Stream, ImageKit, Zod, Vitest; `db:*`/`stream:check` scripts) and its coding rules: this Next version differs from training data, and `ui.tsx`/`icons.tsx`/`globals.css` are the single source of truth for design.
- Key exports: npm `scripts` and `dependencies`/`devDependencies`.
- Dependencies: listed packages above.
- Learner-relevant: Reading `package.json` for the true framework versions before trusting memory; the "never re-implement the design system" rule; `npm run dev/build/lint/typecheck/test` and Drizzle seed/migrate scripts as the local workflow.
