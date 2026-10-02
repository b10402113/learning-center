---
source: dental-app-master
source_type: codebase
source_lines: 7053
language: TypeScript
file_count: 49
part: 1
status: absorbed
absorbed_at: 2026-10-02
created: 2026-10-01
updated: 2026-10-01
---

# Digest — dental-app-master (part 1)

## Overview (L1)

- `src/app/` — Expo Router file-based routes for "Dentify", a patient-facing dental clinic app. Root `_layout.tsx` composes Sentry + Clerk + `MeProvider` + `StreamProvider`, and gates every route with `Stack.Protected` so a signed-out user only reaches the auth screen. Routes: auth (`index`), 4-screen onboarding, tab shell (`home`, `appointments`, `messages`, `profile/*`), a 3-step booking flow, appointment detail, AI assistant, chat channel, and video call.
- `src/components/` — the app's design system and shared widgets: `ui.tsx` is the single source of truth for every glossy button/chip/card (`Button`, `Chip`, `PrimaryButton`, `Card`, `DetailRow`, service artwork, status labels); `booking.tsx` holds the cross-step booking draft + date helpers; `onboarding.tsx` holds the onboarding draft + form primitives; `chat.tsx` wraps Stream Chat; `themed-*.tsx` are the stock theme-aware primitives.
- `src/lib/` — `api.tsx` is the entire network layer (token `fetch` wrapper, `useApi` refetch-on-focus, streaming `useApiStream`, `MeProvider`); `stream.tsx` wires Stream Video + Chat clients once at the root; `photo.ts` picks/resizes image uploads; `dob.ts` is a birth-date input mask/validator; `date-label.ts` splits the server-formatted clinic date.
- `src/hooks/` + `src/constants/` + `src/types/` — light/dark color-scheme helpers, theme tokens (colors, fonts, spacing), and a `stream-chat` module augmentation for custom channel/user fields.
- `src/app/sentry-test.tsx` + `sentry-logs.tsx` — dev-only harnesses that fire sample errors and structured-log batches to verify the Sentry wiring and the PHI scrubbing (`beforeSend` / `beforeSendLog`).
- Config — `tailwind.config.js` + `babel.config.js` + `metro.config.js` wire NativeWind (Tailwind) and Sentry source maps; `eslint.config.js` uses `eslint-config-expo/flat`.

## Structure (L2)

### src/app/_layout.tsx

- Locator: `[[sources/mobile-app-course/20261001/dental-app-master/apps/mobile/src/app/_layout.tsx]]`
- Purpose: The root layout. Initializes Sentry (with `sendDefaultPii: false`, console-breadcrumb stripping, `beforeSend`/`beforeSendLog` user reduction, mobile replay), nests `ClerkProvider` → `ThemeProvider` → `MeProvider` → `StreamProvider`, and runs the auth routing guards.
- Key exports: default `Sentry.wrap(RootLayout)`; local `RootNavigator`, `Unreachable`.
- Dependencies: `@clerk/expo`, `@sentry/react-native`, `expo-router` (`Stack`, `useNavigationContainerRef`), `@/lib/api` (`MeProvider`, `useMe`), `@/lib/stream` (`StreamProvider`).
- Learner-relevant: Auth-guarded routing with `Stack.Protected` guards instead of redirects (no wrong-screen flash); holding the splash until `/api/me` resolves; dev-only routes also guarded; PHI scrubbing as a configuration concern at the app boundary.

### src/app/index.tsx

- Locator: `[[sources/mobile-app-course/20261001/dental-app-master/apps/mobile/src/app/index.tsx]]`
- Purpose: Signed-out sign-in screen (Dentify hero + Apple/Google buttons) using Clerk's browser SSO flow; legal links open the web app in an in-app browser.
- Key exports: default `AuthScreen`; local `LegalLink`.
- Dependencies: `@clerk/expo` (`useSSO`), `expo-auth-session`, `expo-image`, `expo-symbols`, `expo-web-browser`, `react-native-safe-area-context`.
- Learner-relevant: OAuth SSO via `startSSOFlow` + `setActive`; env-driven API base URL; keeping legal text on the server rather than stale in the binary.

### src/app/(tabs)/_layout.tsx

- Locator: `[[sources/mobile-app-course/20261001/dental-app-master/apps/mobile/src/app/(tabs)/_layout.tsx]]`
- Purpose: Native-tab shell. Redirects un-onboarded patients to `/onboarding/step1`; hides Home/Appointments and relabels Messages as "Inbox" for staff/dentists.
- Key exports: default `TabsLayout`.
- Dependencies: `expo-router` + `expo-router/unstable-native-tabs` (`NativeTabs`), `@/lib/api` (`useMe`).
- Learner-relevant: Role-based UI from server-provided `me.role`; a single onboarding gate at the tab layout level; one binary serving both patients and staff.

### src/app/(tabs)/home.tsx

- Locator: `[[sources/mobile-app-course/20261001/dental-app-master/apps/mobile/src/app/(tabs)/home.tsx]]`
- Purpose: Patient home: greeting, next-appointment card with Join/View Details, and four quick actions (Book, Message, Video Consult, AI Assistant).
- Key exports: default `Home`; local `Row`.
- Dependencies: `expo-image`, `expo-router`, `@/components/ui` (`useAvatar`), `@/lib/api` (`useApi`, `useMe`, `Appointment`), `@/lib/stream` (`useClinic`, `useRingCall`).
- Learner-relevant: Refetch-on-focus fetching scoped to `scope=upcoming`; server-decided `canJoin`; initiating a ringing call from the ring-list resolved once at the root.

### src/app/(tabs)/appointments.tsx

- Locator: `[[sources/mobile-app-course/20261001/dental-app-master/apps/mobile/src/app/(tabs)/appointments.tsx]]`
- Purpose: Upcoming/Past segmented list of appointments, each card showing date box, service/dentist, status badge, and a "Book New Appointment" CTA.
- Key exports: default `Appointments`; local `VideoTile`, `Meta`, `Badge`, `Card`.
- Dependencies: `expo-image`, `expo-linear-gradient`, `@/components/ui` (`serviceArt`, `STATUS_LABEL`), `@/lib/api` (`useApi`, `Appointment`), `@/lib/date-label` (`dateParts`).
- Learner-relevant: Splitting the server-formatted `dateLabel` rather than re-deriving from `startsAt` (avoids device-timezone drift); scope as a query parameter.

### src/app/(tabs)/messages.tsx

- Locator: `[[sources/mobile-app-course/20261001/dental-app-master/apps/mobile/src/app/(tabs)/messages.tsx]]`
- Purpose: One screen, two roles — a patient lands in their single clinic conversation; staff get a `ChannelList` inbox and open a thread.
- Key exports: default `Messages`; local `StaffInbox`.
- Dependencies: `stream-chat-expo` (`ChannelList`, `useChatContext`), `@/components/chat` (`Conversation`, `ChatUnavailable`), `@/lib/api` (`useMe`), `@/lib/stream` (`useClinic`).
- Learner-relevant: Graceful degradation when Stream is down (`ready === false`); memoized channel `filters`/`sort` to avoid re-querying; passing channel ids (not instances) through routes.

### src/app/(tabs)/profile/index.tsx

- Locator: `[[sources/mobile-app-course/20261001/dental-app-master/apps/mobile/src/app/(tabs)/profile/index.tsx]]`
- Purpose: Profile hub: identity card, menu rows (Personal, Medical, Family, Notifications, Privacy, Help, dev Sentry tools), Delete Account, and Sign Out.
- Key exports: default `Profile`; local `HeartPulse`, `icon`, `MENU`.
- Dependencies: `@clerk/expo` (`useAuth`), `expo-image`, `expo-router`, `@/components/ui` (`useAvatar`), `@/lib/api` (`useMe`, `useApiClient`).
- Learner-relevant: Two-step destructive confirmation; sign-out ordering relative to the delete request; `__DEV__`-gated menu entries.

### src/app/(tabs)/profile/personal.tsx

- Locator: `[[sources/mobile-app-course/20261001/dental-app-master/apps/mobile/src/app/(tabs)/profile/personal.tsx]]`
- Purpose: Edit personal details (name, phone, DOB via native wheel picker, gender) and PATCH the patient record.
- Key exports: default `PersonalDetails`; local `Field`.
- Dependencies: `@expo/ui/swift-ui` (`DatePicker`, `BottomSheet`), `expo-image`, `@/components/ui`, `@/lib/api`.
- Learner-relevant: Server-owned email field (`editable={false}`) because Clerk owns identity; `date` column travels as `YYYY-MM-DD` with no timezone; validation before PATCH.

### src/app/(tabs)/profile/medical.tsx

- Locator: `[[sources/mobile-app-course/20261001/dental-app-master/apps/mobile/src/app/(tabs)/profile/medical.tsx]]`
- Purpose: Read-only patient medical history (allergies, conditions, medications, past procedure count) plus own notes.
- Key exports: default `MedicalHistory`; local `list`.
- Dependencies: `@/components/ui` (`Card`, `DetailRow`, `PageHeader`, `SectionLabel`), `@/lib/api`.
- Learner-relevant: Distinguishing "not provided yet" from "none reported"; patient self-read is not audited (only staff reads are).

### src/app/(tabs)/profile/notifications.tsx

- Locator: `[[sources/mobile-app-course/20261001/dental-app-master/apps/mobile/src/app/(tabs)/profile/notifications.tsx]]`
- Purpose: Local-only notification preference toggles (reminders, treatments, promotions, billing, updates, marketing).
- Key exports: default `Notifications`.
- Dependencies: `@/components/ui` (`Card`, `DetailRow`, `PageHeader`, `UI`), `react-native` `Switch`.
- Learner-relevant: UI-state-only preferences with no persistence yet; switch theming.

### src/app/(tabs)/profile/_layout.tsx

- Locator: `[[sources/mobile-app-course/20261001/dental-app-master/apps/mobile/src/app/(tabs)/profile/_layout.tsx]]`
- Purpose: A stack inside the Profile tab so detail screens keep the tab bar.
- Key exports: default `ProfileLayout`.
- Dependencies: `expo-router` (`Stack`).
- Learner-relevant: Nested stack navigation within a tab.

### src/app/onboarding/_layout.tsx

- Locator: `[[sources/mobile-app-course/20261001/dental-app-master/apps/mobile/src/app/onboarding/_layout.tsx]]`
- Purpose: Headerless stack for the four onboarding steps.
- Key exports: default `OnboardingLayout`.
- Dependencies: `expo-router` (`Stack`).
- Learner-relevant: Route-group layout convention.

### src/app/onboarding/step1.tsx

- Locator: `[[sources/mobile-app-course/20261001/dental-app-master/apps/mobile/src/app/onboarding/step1.tsx]]`
- Purpose: Onboarding step 1 — name, DOB (masked), phone, gender; validates DOB before continuing.
- Key exports: default `Step1`.
- Dependencies: `@/components/onboarding` (`Field`, `Chip`, `draft`, `StepHeader`), `@/lib/dob` (`formatDob`, `isValidDob`, `dobError`).
- Learner-relevant: Controlled input mask + validation split from masking; writing to a shared in-memory draft.

### src/app/onboarding/step2.tsx

- Locator: `[[sources/mobile-app-course/20261001/dental-app-master/apps/mobile/src/app/onboarding/step2.tsx]]`
- Purpose: Onboarding step 2 — medical history (allergies, medications, smoker/pregnant toggles, anxiety slider, notes) with an "I'll do this later" skip.
- Key exports: default `Step2`; local `ToggleRow`.
- Dependencies: `@expo/ui/swift-ui` (`Host`, `Slider`), `@/components/onboarding`.
- Learner-relevant: `medicalDone` flag distinguishing skipped from "none"; native SwiftUI slider integration; skippable intake with a later re-prompt.

### src/app/onboarding/step3.tsx

- Locator: `[[sources/mobile-app-course/20261001/dental-app-master/apps/mobile/src/app/onboarding/step3.tsx]]`
- Purpose: Onboarding step 3 — "What brings you in?" multi-select of non-teleconsult services, keyed by stable service `key`.
- Key exports: default `Step3`.
- Dependencies: `@/components/onboarding`, `@/components/ui` (`serviceArt`), `@/lib/api` (`useApi`, `Service`).
- Learner-relevant: Matching artwork/selection by stable key rather than display name; skipping a step.

### src/app/onboarding/step4.tsx

- Locator: `[[sources/mobile-app-course/20261001/dental-app-master/apps/mobile/src/app/onboarding/step4.tsx]]`
- Purpose: Onboarding step 4 — preferred time, referral source, extra notes; the single point where the whole draft is POSTed as a patient (and medical history PUT), then `refresh()` and redirect home.
- Key exports: default `Step4`.
- Dependencies: `@/components/onboarding` (`draft`, `resetDraft`), `@/lib/api` (`useApiClient`, `useMe`).
- Learner-relevant: Posting onboarding once at the end (so `hasOnboarded` is defined by a `is_self` patient row existing); refreshing `me` before navigating; clearing the draft after submit.

### src/app/booking/_layout.tsx

- Locator: `[[sources/mobile-app-course/20261001/dental-app-master/apps/mobile/src/app/booking/_layout.tsx]]`
- Purpose: Headerless stack for the booking flow.
- Key exports: default `BookingLayout`.
- Dependencies: `expo-router` (`Stack`).
- Learner-relevant: Route-group layout convention.

### src/app/booking/date.tsx

- Locator: `[[sources/mobile-app-course/20261001/dental-app-master/apps/mobile/src/app/booking/date.tsx]]`
- Purpose: Booking step 1 — choose who the appointment is for (family member or self), a service reason, and a calendar date.
- Key exports: default `BookingDate`.
- Dependencies: `@/components/booking` (`booking`, `Header`, date helpers), `@/components/ui`, `@/lib/api` (`useApi`, `useMe`, `Service`, `FamilyMember`).
- Learner-relevant: A shared mutable cross-step draft; deriving calendar cells; a new day invalidating the previously chosen slot.

### src/app/booking/time.tsx

- Locator: `[[sources/mobile-app-course/20261001/dental-app-master/apps/mobile/src/app/booking/time.tsx]]`
- Purpose: Booking step 2 — dentist card + optional dentist picker, and the slot grid from `/api/availability`; de-duplicates slots aggregated across dentists by label.
- Key exports: default `BookingTime`.
- Dependencies: `@/components/booking`, `@/components/ui`, `@/lib/api` (`useApi`, `Dentist`, `Slot`).
- Learner-relevant: Availability aggregated across all dentists offering a service; de-duping identical wall-clock labels; ImageKit `e-bgremove` cutout on zoom; dropping a rejected slot from local state on refocus.

### src/app/booking/confirm.tsx

- Locator: `[[sources/mobile-app-course/20261001/dental-app-master/apps/mobile/src/app/booking/confirm.tsx]]`
- Purpose: Booking step 3 — summary, optional X-ray/photo attachments, and POST `/api/appointments`; handles the `slot_taken` 409 race and uploads attachments *after* the booking commits.
- Key exports: default `BookingConfirm`; local `DetailRow`.
- Dependencies: `@sentry/react-native` (loggers), `@/components/booking`, `@/components/ui`, `@/lib/api` (`ApiError`, `useApiClient`), `@/lib/photo` (`pickPhotos`, `UPLOAD_TIMEOUT_MS`).
- Learner-relevant: Client hands back the server-offered `startsAt` and never invents a time; the DB exclusion constraint resolves races (409 → "just taken"); uploads after insert to avoid orphan files; structured logging without PHI.

### src/app/appointment/[id].tsx

- Locator: `[[sources/mobile-app-course/20261001/dental-app-master/apps/mobile/src/app/appointment/[id].tsx]]`
- Purpose: One appointment's detail: status, dentist, date/time, who it's for, post-op notes, shared images, Join/Cancel actions with server-decided `canJoin`/`canCancel`.
- Key exports: default `AppointmentDetail`.
- Dependencies: `@/components/ui` (`Card`, `DetailRow`, `PageHeader`, `serviceArt`, `STATUS_LABEL`), `@/lib/api` (`useApi`, `useApiClient`).
- Learner-relevant: Cancel is a PATCH whose 24-hour rule is enforced server-side; the client only hides the button; full-screen attachment viewer via signed URLs.

### src/app/assistant.tsx

- Locator: `[[sources/mobile-app-course/20261001/dental-app-master/apps/mobile/src/app/assistant.tsx]]`
- Purpose: AI dental assistant chat — disclaimer header, suggestions/empty state, streaming bubbles, photo attachment turns, and clear-history.
- Key exports: default `Assistant`; local `Card`, `IconButton`, `Disclaimer`, `PhotoAttachment`, `MeBubble`, `AiBubble`, `toMsg`.
- Dependencies: `@/components/ui` (`Button`, `UI`), `@/lib/api` (`useApiClient`, `useApiStream`), `@/lib/photo` (`pickPhotos`).
- Learner-relevant: SSE-like streaming rendering via `useApiStream`; assistant policy lives entirely server-side (education/triage only, no diagnosis); a photo is a canned server turn and never sent to OpenAI; module-level `conversationId` persistence across screens.

### src/app/channel/[id].tsx

- Locator: `[[sources/mobile-app-course/20261001/dental-app-master/apps/mobile/src/app/channel/[id].tsx]]`
- Purpose: One patient thread opened from the staff inbox.
- Key exports: default `ChannelScreen`.
- Dependencies: `stream-chat-expo` (`useChatContext`), `@/components/chat`, `@/lib/stream` (`useClinic`).
- Learner-relevant: Reading the cached channel name without another round trip.

### src/app/call/[id].tsx

- Locator: `[[sources/mobile-app-course/20261001/dental-app-master/apps/mobile/src/app/call/[id].tsx]]`
- Purpose: Scheduled teleconsult screen — joins the Stream call id `appointment-{id}` and renders `CallContent`.
- Key exports: default `CallScreen`.
- Dependencies: `@sentry/react-native`, `@stream-io/video-react-native-sdk` (`CallContent`, `CallingState`, `StreamCall`), `expo-router`.
- Learner-relevant: Call id derived server-side at booking, never client-supplied; `reuseInstance` to avoid a second SFU connection; disconnect-timeout tolerance; guarded single `leave()`.

### src/app/sentry-test.tsx

- Locator: `[[sources/mobile-app-course/20261001/dental-app-master/apps/mobile/src/app/sentry-test.tsx]]`
- Purpose: Dev-only harness firing one sample failure per row (handled/unhandled errors, failed API call, render crash, native crash) plus structured-log rows, to verify the Sentry wiring and PHI scrubbing.
- Key exports: default `SentryTest`.
- Dependencies: `@sentry/react-native`, `@/components/ui`, `@/lib/api` (`useApiClient`).
- Learner-relevant: `beforeSend` user reduction; `Sentry.wrap` ErrorBoundary; `captureException`/`captureMessage`; deliberate PHI scrub checks with fake patient data.

### src/app/sentry-logs.tsx

- Locator: `[[sources/mobile-app-course/20261001/dental-app-master/apps/mobile/src/app/sentry-logs.tsx]]`
- Purpose: Dev-only structured-logging harness that replays whole sessions in batches (booking happy/race, assistant, vendor degradation, deletion orphans, volume bursts) so the Logs view has real queryable data.
- Key exports: default `SentryLogs`; module data `SCENARIOS`, `VOLUME`.
- Dependencies: `@sentry/react-native`, `@/components/ui`.
- Learner-relevant: Structured logging with ids/counts/durations only (never content); `batch_id`/`scenario` tags for query isolation; `Sentry.flush()` to force delivery.

### src/components/ui.tsx

- Locator: `[[sources/mobile-app-course/20261001/dental-app-master/apps/mobile/src/components/ui.tsx]]`
- Purpose: The design system — glossy aqua/glass surfaces, profile-detail page primitives, service artwork, status labels, and the avatar hook. Every tappable/raised surface must come from here (per AGENTS.md).
- Key exports: `UI`, `AQUA_BODY`, `GLASS_BODY`, `SHADOW_AQUA`, `SHADOW_GLASS`, `Button`, `Chip`, `PrimaryButton`, `PAGE`, `SHADOW_CARD`, `PAGE_PAD`, `PageHeader`, `SectionLabel`, `IconTile`, `DetailRow`, `Card`, `SERVICE_ART`, `serviceArt`, `STATUS_LABEL`, `useAvatar`.
- Dependencies: `@clerk/expo` (`useUser`), `expo-linear-gradient`, `expo-router`, `expo-symbols`, `react-native`.
- Learner-relevant: Centralized design tokens + variant props instead of per-screen forks; press-state via plain style arrays because NativeWind's Pressable interop drops function styles; gradient + gloss + rim + shadow as a reusable "raised surface" recipe.

### src/components/booking.tsx

- Locator: `[[sources/mobile-app-course/20261001/dental-app-master/apps/mobile/src/components/booking.tsx]]`
- Purpose: Shared booking tokens (`B`), ISO date helpers, the cross-step booking draft, and the `Header`/`SectionRow` primitives.
- Key exports: `B`, `todayISO`, `toISODay`, `fromISODay`, `booking`, `formatDate`, `Header`, `SectionRow`.
- Dependencies: `expo-router`, `expo-symbols`, `./ui` (`SHADOW_GLASS`), `@/lib/api` types.
- Learner-relevant: Storing ids (not labels) in the draft; local-date parsing that avoids the UTC shift of `new Date(str)`.

### src/components/onboarding.tsx

- Locator: `[[sources/mobile-app-course/20261001/dental-app-master/apps/mobile/src/components/onboarding.tsx]]`
- Purpose: Onboarding design tokens (`T`), progress header, form primitives (`Heading`, `Label`, `Field`), and the shared `draft` object with `resetDraft`.
- Key exports: `T`, `AQUA`, `FIELD_SHADOW`, `SHADOW`, `Progress`, `StepHeader`, `Heading`, `Label`, `Field`, `draft`, `resetDraft`.
- Dependencies: `expo-linear-gradient`, `expo-router`, `expo-symbols`.
- Learner-relevant: One in-memory draft written once at submit; fresh arrays on reset so edited state isn't reused.

### src/components/chat.tsx

- Locator: `[[sources/mobile-app-course/20261001/dental-app-master/apps/mobile/src/components/chat.tsx]]`
- Purpose: Reusable conversation UI wrapping Stream Chat's `Channel`/`MessageList`/`MessageComposer`, plus a header video-call button and an unavailable state.
- Key exports: `Conversation`, `ChatUnavailable`, `goBackToInbox`; local `CallButton`, `Header`.
- Dependencies: `stream-chat-expo`, `@/components/ui` (`PAGE`), `@/lib/stream` (`useRingCall`).
- Learner-relevant: Rebuilding the channel from its id rather than passing instances through navigation; explicit `keyboardVerticalOffset`/`topInset` of 0; ringing everyone else in the conversation via SDK member state.

### src/components/themed-text.tsx

- Locator: `[[sources/mobile-app-course/20261001/dental-app-master/apps/mobile/src/components/themed-text.tsx]]`
- Purpose: Stock theme-aware `Text` with named type presets (default, title, small, link, code…).
- Key exports: `ThemedText`, `ThemedTextProps`.
- Dependencies: `@/constants/theme` (`Fonts`, `ThemeColor`), `@/hooks/use-theme`.
- Learner-relevant: Theme token consumption and typography presets.

### src/components/themed-view.tsx

- Locator: `[[sources/mobile-app-course/20261001/dental-app-master/apps/mobile/src/components/themed-view.tsx]]`
- Purpose: Stock theme-aware `View` that pulls its background from the active theme.
- Key exports: `ThemedView`, `ThemedViewProps`.
- Dependencies: `@/constants/theme` (`ThemeColor`), `@/hooks/use-theme`.
- Learner-relevant: Centralizing background color by semantic theme key.

### src/hooks/use-color-scheme.ts

- Locator: `[[sources/mobile-app-course/20261001/dental-app-master/apps/mobile/src/hooks/use-color-scheme.ts]]`
- Purpose: Native re-export of React Native's `useColorScheme`.
- Key exports: `useColorScheme`.
- Dependencies: `react-native`.
- Learner-relevant: Platform-specific file extension (`.web.ts`) selecting the implementation.

### src/hooks/use-color-scheme.web.ts

- Locator: `[[sources/mobile-app-course/20261001/dental-app-master/apps/mobile/src/hooks/use-color-scheme.web.ts]]`
- Purpose: Web variant that defers to the client after hydration to keep static rendering deterministic.
- Key exports: `useColorScheme`.
- Dependencies: `react`, `react-native`.
- Learner-relevant: Hydration-safe theming on web.

### src/hooks/use-theme.ts

- Locator: `[[sources/mobile-app-course/20261001/dental-app-master/apps/mobile/src/hooks/use-theme.ts]]`
- Purpose: Resolves the active color scheme to a palette, defaulting "unspecified" to light.
- Key exports: `useTheme`.
- Dependencies: `@/constants/theme` (`Colors`), `@/hooks/use-color-scheme`.
- Learner-relevant: Topic-based palette lookup; defaulting an ambiguous scheme.

### src/constants/theme.ts

- Locator: `[[sources/mobile-app-course/20261001/dental-app-master/apps/mobile/src/constants/theme.ts]]`
- Purpose: Light/dark color palettes, platform font families, spacing scale, and layout constants.
- Key exports: `Colors`, `ThemeColor`, `Fonts`, `Spacing`, `BottomTabInset`, `MaxContentWidth`.
- Dependencies: `@/global.css`, `react-native` (`Platform`).
- Learner-relevant: Semantic color keys (`text`, `background`, `textSecondary`) and a spacing scale instead of magic numbers.

### src/lib/api.tsx

- Locator: `[[sources/mobile-app-course/20261001/dental-app-master/apps/mobile/src/lib/api.tsx]]`
- Purpose: The app's entire network layer and shared API types — a Clerk-token `fetch` wrapper with a 15s timeout and path scrubbing, a streaming POST for the assistant, a refetch-on-focus `useApi` hook, and the root `MeProvider`.
- Key exports: `ApiError`, `useApiClient`, `useApiStream`, `useApi`, types (`Patient`, `FamilyMember`, `Me`, `Service`, `Dentist`, `Slot`, `MedicalHistory`, `Appointment`), `MeProvider`, `useMe`.
- Dependencies: `@clerk/expo` (`useAuth`), `@sentry/react-native`, `expo/fetch`, `expo-router` (`useFocusEffect`), `react`.
- Learner-relevant: No data-fetching library — refetch-on-focus is the cache strategy; a stable token ref so fetchers don't churn effects; request sequencing (`latest` ref) to ignore stale replies; timeout on every request because RN fetch has none; `/api/me` fetched once at the root; never falling back to null `me` on error (would re-trigger onboarding).

### src/lib/stream.tsx

- Locator: `[[sources/mobile-app-course/20261001/dental-app-master/apps/mobile/src/lib/stream.tsx]]`
- Purpose: Wires Stream Video + Stream Chat once at the root from a server-issued token, exposes the clinic channel/ring list, retints the chat theme, and renders root-level ringing-call overlays.
- Key exports: `useClinic`, `useRingCall`, `StreamProvider`; local `ClinicContext`, `RingingCalls`, `Connecting`, `ConnectedStream`.
- Dependencies: `@clerk/expo`, `@sentry/react-native`, `@stream-io/video-react-native-sdk`, `expo-crypto`, `stream-chat-expo`, `./api`.
- Learner-relevant: Server derives the Stream user id from the Clerk session (a client can't name its own); `getOrCreateInstance` for a single video client; time-boxed connection with graceful degradation so booking/AI outlive messaging; ringing calls rendered above the navigator.

### src/lib/photo.ts

- Locator: `[[sources/mobile-app-course/20261001/dental-app-master/apps/mobile/src/lib/photo.ts]]`
- Purpose: Picks images from the library, shrinks them to ≤1400px JPEG, and wraps them as an Expo `File` for multipart upload.
- Key exports: `UPLOAD_TIMEOUT_MS`, `PickedPhoto`, `pickPhotos`.
- Dependencies: `expo-file-system` (`File`), `expo-image-manipulator`, `expo-image-picker`.
- Learner-relevant: Shrink-before-upload as an optimization that isn't a hard gate; why Expo's `fetch` needs a `File` (not an RN `{uri,name,type}` descriptor) for multipart; timestamping the server's authority on validation.

### src/lib/dob.ts

- Locator: `[[sources/mobile-app-course/20261001/dental-app-master/apps/mobile/src/lib/dob.ts]]`
- Purpose: `MM / DD / YYYY` digit input mask and calendar validation (past date, ≤120 years, real days incl. leap years).
- Key exports: `formatDob`, `isValidDob`, `dobError`.
- Dependencies: none (pure functions).
- Learner-relevant: A digit is accepted only if its field can still reach a legal value; date rollover detection by reading a constructed `Date` back; mask and validation as separate concerns.

### src/lib/date-label.ts

- Locator: `[[sources/mobile-app-course/20261001/dental-app-master/apps/mobile/src/lib/date-label.ts]]`
- Purpose: Splits the server's already-clinic-formatted `dateLabel` into `{dow, mon, day}` for the date box.
- Key exports: `dateParts`.
- Dependencies: none (pure).
- Learner-relevant: Parsing the server's label rather than re-deriving from `startsAt`, so a device timezone can't shift a clinic appointment to the wrong day.

### src/lib/dob.test.ts

- Locator: `[[sources/mobile-app-course/20261001/dental-app-master/apps/mobile/src/lib/dob.test.ts]]`
- Purpose: Node `--experimental-strip-types` test asserting mask grouping/limits, idempotence, and validation edge cases (leap days, future dates, age cap).
- Key exports: none (script).
- Dependencies: `./dob.ts`.
- Learner-relevant: Table-driven pure-function testing and why leap-day / impossible-date cases matter.

### src/lib/date-label.test.ts

- Locator: `[[sources/mobile-app-course/20261001/dental-app-master/apps/mobile/src/lib/date-label.test.ts]]`
- Purpose: Verifies `dateParts` against the exact web formatter, including a UTC-midnight-crossing case, and that unparseable labels degrade instead of throwing.
- Key exports: none (script).
- Dependencies: `./date-label.ts`.
- Learner-relevant: Testing a client against the server's formatting contract; graceful degradation.

### src/types/stream.d.ts

- Locator: `[[sources/mobile-app-course/20261001/dental-app-master/apps/mobile/src/types/stream.d.ts]]`
- Purpose: Module augmentation adding custom Stream Chat channel/user fields (`CustomChannelData.name`, `CustomUserData.staff`).
- Key exports: none (declaration).
- Dependencies: `stream-chat` module types.
- Learner-relevant: Typed SDK extension; keeping client and server field shapes in agreement.

### tailwind.config.js

- Locator: `[[sources/mobile-app-course/20261001/dental-app-master/apps/mobile/tailwind.config.js]]`
- Purpose: NativeWind/Tailwind config scanning `./src/**` with the nativewind preset.
- Key exports: default config object.
- Dependencies: `nativewind/preset`.
- Learner-relevant: How Tailwind classes resolve in React Native.

### metro.config.js

- Locator: `[[sources/mobile-app-course/20261001/dental-app-master/apps/mobile/metro.config.js]]`
- Purpose: Metro bundler config combining Sentry's config (for source-map debug IDs) with NativeWind's CSS transform.
- Key exports: default config.
- Dependencies: `@sentry/react-native/metro`, `nativewind/metro`.
- Learner-relevant: Composing bundler plugins; source maps tying stack traces to uploaded maps.

### babel.config.js

- Locator: `[[sources/mobile-app-course/20261001/dental-app-master/apps/mobile/babel.config.js]]`
- Purpose: Babel preset setup for Expo with the NativeWind JSX import source and preset.
- Key exports: default preset function.
- Dependencies: `babel-preset-expo`, `nativewind/babel`.
- Learner-relevant: `jsxImportSource` enabling `className` on RN components.

### eslint.config.js

- Locator: `[[sources/mobile-app-course/20261001/dental-app-master/apps/mobile/eslint.config.js]]`
- Purpose: Flat ESLint config extending `eslint-config-expo`.
- Key exports: default config array.
- Dependencies: `eslint/config`, `eslint-config-expo/flat`.
- Learner-relevant: Flat-config conventions.
