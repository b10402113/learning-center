---
source: cal-ai-tutorial-master
source_type: codebase
source_lines: 3826
language: TypeScript
file_count: 35
part: 1
status: absorbed
absorbed_at: 2026-10-02
created: 2026-10-01
updated: 2026-10-01
---

# Digest — cal-ai-tutorial-master (part 1)

## Overview (L1)

- `src/app/` — Expo Router route tree: the welcome entry (`index.tsx`), sign-in SSO, Sentry debug bench, and the root `_layout.tsx` that wires Clerk, TanStack Query, and Sentry providers. The public shell of the app.
- `src/app/(app)/` — the authenticated tab group: a guarded `_layout.tsx` (redirects to onboarding or sign-in), the Home dashboard (`home.tsx`), the camera/scan flow (`camera.tsx`), and Profile (`profile.tsx`). The core product loop lives here.
- `src/app/api/` — Expo Router server routes (`*+api.ts`): unauthenticated plan generation, authenticated meals (list/create) and profile (get/save/delete-account) handlers, plus the Clerk webhook receiver. The backend of the one-repo full-stack app.
- `src/app/onboarding/` — the anonymous questionnaire flow: dynamic `[step].tsx` renderer, `building.tsx` (runs plan generation), `plan.tsx` (plan reveal), and `plan-includes.tsx` (feature list + save/persist). Drives the aha moment before sign-up.
- `src/components/` — reusable UI: `onboarding.tsx` (screen shell, option cards, ruler picker), `ring.tsx` (SVG progress ring), `streak-sheet.tsx` (animated bottom sheet). Presentation primitives.
- `src/lib/` — shared logic: `api.ts` (TanStack Query hooks hitting the API routes), `plan.ts` (Zod input schema, plausibility validator, Mifflin-St Jeor formula fallback), `plan.check.ts` (self-check assertions), `server-auth.ts` (Clerk JWT verification), `imagekit.ts` (server-side upload/delete). The app's business core.
- `src/trigger/` — Trigger.dev background tasks: `generate-plan.ts` (OpenAI → validated targets), `analyze-meal.ts` (vision → macros, retries, not-food delete), `clerk-users.ts` (webhook user upsert/delete). Async AI and identity work.
- `src/db/` — Drizzle schema for `users` and `meals` plus the Neon serverless client. Single source of truth for the data model, shared by app and tasks.
- `src/onboarding/steps.ts` — declarative questionnaire definition (nine steps) plus the in-memory `answers` draft and generated `draft.plan` handoff. Ties onboarding screens to the plan schema.
- `src/constants/` — `macros.ts` (macro colour/icon source of truth) and `theme.ts` (colours, fonts, spacing, tab inset).
- `src/hooks/` — small colour-scheme/theme hooks (native + web variants), largely Expo template scaffolding.

## Structure (L2)

### src/app/_layout.tsx + src/app/index.tsx + src/app/sign-in.tsx + src/app/debug-sentry.tsx

- Locator: `[[sources/mobile-app-course/20261001/cal-ai-tutorial-master/src/app/_layout.tsx]]`
- Purpose: Root providers and the unauthenticated entry flow. `_layout.tsx` initialises Sentry (with React Navigation integration and user attachment), creates a per-instance `QueryClient`, and wraps the app in `ClerkProvider` + `QueryClientProvider` + a headerless `Stack`. `index.tsx` is the welcome screen (`Bulky AI`, CTA into onboarding, link to sign-in) that redirects signed-in users to `/home`. `sign-in.tsx` runs native Apple/Google SSO via `useSSO`, and on success persists a plan generated before sign-up through `useSaveProfile`. `debug-sentry.tsx` is a temporary QA bench that fires crashes, handled errors, logs, spans, and breadcrumbs at Sentry.
- Key exports: `RootLayout` (default), `SentryUser`, `WelcomeScreen`, `SignIn`, `DebugSentry`; local `MealAnalysisError`, `PaywallPurchaseError`, `LOGS`.
- Dependencies: `@clerk/expo`, `@sentry/react-native`, `@tanstack/react-query`, `expo-router`, `expo-symbols`; internal `@/lib/api`, `@/onboarding/steps`.
- Learner-relevant: provider composition, Sentry.init options, auth-gated redirects, and the SSO-then-save pattern for a flow that starts before an account exists.

### src/app/(app)/_layout.tsx + home.tsx + camera.tsx + profile.tsx

- Locator: `[[sources/mobile-app-course/20261001/cal-ai-tutorial-master/src/app/(app)/_layout.tsx]]`
- Purpose: The signed-in tab group. `_layout.tsx` is a single gate for all tabs — waits for Clerk, redirects unauthenticated users to `/`, shows a retry on profile error, bounces anyone without `onboardingCompletedAt` back into the questionnaire, then renders `NativeTabs` (Home / Scan / Profile). `home.tsx` renders the calorie ring and macro bars vs the profile's daily targets, a 21-day horizontal date strip, today's meal list with thumbnails/status, empty states, and a streak sheet. `camera.tsx` handles camera permission + `CameraView` capture, gallery picking, base64 upload via `useLogMeal`, and a `Result` component that subscribes to the Trigger.dev run with `useRealtimeRun` and renders analyzing/success/not-food states. `profile.tsx` shows Clerk identity, account/legal/support rows, feedback widget, sign-out, and account deletion.
- Key exports: `AppLayout` (default), `Home`, `Camera`, `Result`, `Screen`, `Profile`; `TabBar`-related constants `WEEKDAYS`, `THUMB`, `TAB_BAR`, helpers `thumbnail`, `midnight`, `isoDate`, `mealType`.
- Dependencies: `@clerk/expo`, `@trigger.dev/react-hooks`, `expo-camera`, `expo-image-picker`, `expo-image`, `expo-symbols`, `expo-router`, `react-native-svg` (via Ring); internal `@/components/ring`, `@/components/streak-sheet`, `@/constants/macros`, `@/constants/theme`, `@/lib/api`, `@/trigger/analyze-meal` (type only), `@/lib/server-auth` indirectly.
- Learner-relevant: route-group auth gating, native tabs, realtime background-job consumption, photo capture/upload, timezone-safe local-day computation, and a numeric dashboard derived from AI-generated targets.

### src/app/api/plan+api.ts + meals+api.ts + profile+api.ts + webhooks/clerk+api.ts

- Locator: `[[sources/mobile-app-course/20261001/cal-ai-tutorial-master/src/app/api/plan+api.ts]]`
- Purpose: Server route handlers. `plan+api.ts` (unauthenticated) validates onboarding answers with `planInputSchema`, triggers `generate-plan`, polls the run, and returns the finished plan. `meals+api.ts` GETs a local day's meals (Postgres `AT TIME ZONE` conversion against the user's IANA zone) and POSTs a base64 photo → ImageKit upload → `analyzing` DB row → `analyze-meal` trigger, returning meal + runId + public token. `profile+api.ts` GETs a whitelisted profile projection, POSTs an upsert of answers + generated plan on `clerk_user_id` (race-safe vs the webhook), and DELETEs account widest-to-narrowest (photos → row/meals → Clerk). `webhooks/clerk+api.ts` verifies the Svix signature and triggers idempotent clerk-user tasks.
- Key exports: `POST` (plan), `GET`/`POST` (meals), `GET`/`POST`/`DELETE` (profile), `POST` (webhook); `MEAL_COLUMNS`, `PROFILE_COLUMNS`, `saveProfileSchema`, `logMealSchema`, `primaryEmail`.
- Dependencies: `@trigger.dev/sdk`, `drizzle-orm`, `zod`, `@clerk/backend`, `@clerk/backend/webhooks`; internal `@/db`, `@/lib/imagekit`, `@/lib/plan`, `@/lib/server-auth`, `@/trigger/*` (type only).
- Learner-relevant: trusted server boundaries, column-level response shaping, upsert-for-race-safety, idempotency keys, and ordered destructive operations.

### src/app/onboarding/[step].tsx + building.tsx + plan.tsx + plan-includes.tsx

- Locator: `[[sources/mobile-app-course/20261001/cal-ai-tutorial-master/src/app/onboarding/[step].tsx]]`
- Purpose: The pre-auth questionnaire. `[step].tsx` is a generic renderer driven by the `steps` config, switching between card options, a native date picker, and a ruler picker, committing each answer into the shared `answers` store and advancing. `building.tsx` guards against missing answers, calls `requestPlan` exactly once (ref-guarded), cycles status copy, and redirects to the reveal or a retry screen. `plan.tsx` renders calories/macros/rationale with confetti. `plan-includes.tsx` lists features, then either saves (already signed in) or pushes to sign-in.
- Key exports: `OnboardingStep` (default), `BuildingPlan`, `PlanReveal`, `PlanIncludes`; `YEAR`, `CONFETTI`, `LINES`, `TICK`, `FEATURES`.
- Dependencies: `@expo/ui/swift-ui`, `expo-router`, `expo-symbols`, `expo-image`; internal `@/components/onboarding`, `@/onboarding/steps`, `@/lib/api`, `@/lib/plan`, `@/constants/macros`.
- Learner-relevant: config-driven multi-step forms, native UI modules, deriving progress from step index, and the "generate once, hold client-side, persist after auth" pattern.

### src/components/onboarding.tsx + ring.tsx + streak-sheet.tsx

- Locator: `[[sources/mobile-app-course/20261001/cal-ai-tutorial-master/src/components/onboarding.tsx]]`
- Purpose: Shared presentation components. `onboarding.tsx` exports `OnboardingScreen` (progress segments, title/subtitle, pinned CTA), `OptionCard` (selectable card with icon/glyph), and `RulerPicker` (snapping scroll ruler with stepped fade and centre marker). `ring.tsx` draws an SVG progress ring via dash offset. `streak-sheet.tsx` is a Reanimated slide-up modal showing the streak with tiered copy.
- Key exports: `OnboardingScreen`, `OptionCard`, `RulerPicker`, `Ring`, `StreakSheet`; constants `SEGMENTS`, `ITEM`, `VISIBLE`, `FADE`, `line`.
- Dependencies: `expo-router`, `expo-symbols`, `expo-status-bar`, `react-native-svg`, `react-native-reanimated`, `react-native-safe-area-context`.
- Learner-relevant: building reusable RN primitives, scroll-driven numeric input without a library, SVG math for progress rings, and animated modals.

### src/db/schema.ts + src/db/index.ts

- Locator: `[[sources/mobile-app-course/20261001/cal-ai-tutorial-master/src/db/schema.ts]]`
- Purpose: Drizzle Postgres schema defining enums (`unit_preference`, `goal`, `activity_level`, `diet_preference`, `meal_status`) and tables `users` (Clerk-keyed identity, body stats, AI targets, plan metadata, timestamps) and `meals` (image URL, status, macros, error reason, trigger run id, `loggedAt`, index on `(user_id, logged_at desc)`); `index.ts` constructs the `drizzle` client over `@neondatabase/serverless` with snake_case casing and re-exports the schema. Storage is metric + UTC.
- Key exports: `users`, `meals`, enums, `User`, `NewUser`, `Meal`, `NewMeal`, `db`.
- Dependencies: `drizzle-orm/pg-core`, `@neondatabase/serverless`, `drizzle-orm/neon-http`.
- Learner-relevant: typed schema-as-code, enum modelling, FK cascade deletes, timezone-aware timestamps, and sharing one schema between server app and background tasks.

### src/lib/api.ts + plan.ts + plan.check.ts + server-auth.ts + imagekit.ts

- Locator: `[[sources/mobile-app-course/20261001/cal-ai-tutorial-master/src/lib/api.ts]]`
- Purpose: The shared logic layer. `api.ts` exposes the client data hooks (`useProfile`, `useSaveProfile`, `useMeals` with analyzing-only polling, `useLogMeal`, `deleteAccount`, `requestPlan`) plus `Profile`/`LoggedMeal`/`DayMeal` types and cache keys. `plan.ts` holds the Zod `planInputSchema` trust boundary, `ageFrom`, the `isPlausible` validator (calorie band + macro-sum check), and the `formulaPlan` Mifflin-St Jeor fallback with activity/split tables. `plan.check.ts` is a dependency-free self-check of the formula, validator, schema, and questionnaire consistency. `server-auth.ts` verifies Clerk bearer JWTs to a user id. `imagekit.ts` does server-side upload and prefix-based bulk user-image deletion.
- Key exports: `requestPlan`, `useProfile`, `useSaveProfile`, `deleteAccount`, `useMeals`, `useLogMeal`, types `Profile`/`LoggedMeal`/`DayMeal`, `PROFILE_KEY`, `MEALS_KEY`; `planInputSchema`, `PlanInput`, `Plan`, `ageFrom`, `isPlausible`, `formulaPlan`; `getAuthUserId`, `unauthorized`; `uploadToImageKit`, `deleteUserImages`.
- Dependencies: `@clerk/expo`, `@clerk/backend`, `@sentry/react-native`, `@tanstack/react-query`, `zod`; internal `@/lib/plan`, `@/db/schema`, `@/onboarding/steps`, `@/trigger/*`.
- Learner-relevant: separating client hooks from server utilities, validation as a trust boundary, deterministic fallbacks for nondeterministic AI, pure-function unit self-checks, and least-privilege secret usage.

### src/onboarding/steps.ts

- Locator: `[[sources/mobile-app-course/20261001/cal-ai-tutorial-master/src/onboarding/steps.ts]]`
- Purpose: Declarative definition of the nine questionnaire steps (gender, birthday, height, weight, goal, target-weight, activity, pace, diet) with discriminated-union step kinds (`cards` | `ruler` | `date`), plus the module-level `answers` draft (pre-filled defaults, no AsyncStorage yet) and `draft.plan` handoff generated before sign-up. Exports `stepIndex` for key→position lookup.
- Key exports: `Answers`, `answers`, `draft`, `Step`, `steps`, `stepIndex`.
- Dependencies: `expo-symbols`; internal `@/lib/plan` (types).
- Learner-relevant: data-driven forms via discriminated unions, module singleton state as a simple draft store, and keeping UI config and validation schema in sync.

### src/trigger/generate-plan.ts + analyze-meal.ts + clerk-users.ts

- Locator: `[[sources/mobile-app-course/20261001/cal-ai-tutorial-master/src/trigger/generate-plan.ts]]`
- Purpose: Trigger.dev background tasks. `generate-plan.ts` (`schemaTask` keyed by `planInputSchema`) calls OpenAI Responses with structured Zod output, retries once, validates with `isPlausible`, and always returns either an AI plan (`source: "ai"`) or the formula fallback (`source: "formula"`). `analyze-meal.ts` calls a pinned vision model with structured output, deletes the row when `is_food` is false, writes macros + `completed`, retries once (`maxAttempts: 2`), and marks `failed` in `onFailure`. `clerk-users.ts` upserts a user on `clerk_user_id` (only touching `email`, coalesce-protected) for created/updated events and deletes by Clerk id.
- Key exports: `generatePlan`, `analyzeMeal`, `clerkUserCreated`, `clerkUserUpdated`, `clerkUserDeleted`; helper `upsertUser`, `askOpenAI`, `SYSTEM_PROMPT`, `aiPlanSchema`, `visionSchema`, `VISION_TRANSFORM`, `MODEL`.
- Dependencies: `@trigger.dev/sdk`, `openai`, `openai/helpers/zod`, `zod`, `drizzle-orm`; internal `../db`, `../lib/plan` (relative imports because Trigger.dev bundles the tasks, not Metro).
- Learner-relevant: durable background jobs with retries/failure hooks, structured LLM outputs, idempotent upserts, and keeping nondeterministic AI inside a validated, fallback-protected boundary.

### src/constants/macros.ts + theme.ts + src/hooks/*

- Locator: `[[sources/mobile-app-course/20261001/cal-ai-tutorial-master/src/constants/macros.ts]]`
- Purpose: Cross-cutting constants and small hooks. `macros.ts` is the single source of truth for the three macro keys/labels/icons/colours used by plan, home, and camera. `theme.ts` defines light/dark `Colors`, platform `Fonts`, `Spacing`, `BottomTabInset`, `MaxContentWidth`. `hooks/use-color-scheme.ts` re-exports RN's hook, the `.web.ts` variant adds hydration-safe static rendering, and `use-theme.ts` maps the scheme to a `Colors` entry.
- Key exports: `MACROS`; `Colors`, `ThemeColor`, `Fonts`, `Spacing`, `BottomTabInset`, `MaxContentWidth`; `useColorScheme`, `useTheme`.
- Dependencies: `expo-symbols`, `react-native`, `@/global.css`, `@/constants/theme`, `@/hooks/use-color-scheme`.
- Learner-relevant: centralising design tokens and domain constants, plus platform-specific file resolution (`.web.ts`) in React Native.
