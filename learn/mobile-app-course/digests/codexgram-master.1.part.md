---
source: codexgram-master
source_type: codebase
source_lines: 1383
language: TypeScript
file_count: 22
part: 1
status: absorbed
absorbed_at: 2026-10-02
created: 2026-10-01
updated: 2026-10-01
---

# Digest — codexgram-master (part 1)

## Overview (L1)

- `convex/` backend — Convex serverless backend for Codexgram, an Expo/React Native Instagram-style demo app. All app data, business logic, authentication checks, media storage, live queries, and scheduled cleanup live here.
- Data model (`schema.ts`) — 17 tables (profiles, posts, uploads, follows, likes, comments, commentLikes, bookmarks, stories, conversations, messages, inbox, seedAssets, accountDeletions, plus the `_storage` system table) with compound indexes and a full-text search index on profiles.
- Public API modules — `profiles`, `posts`, `social`, `postInteractions`, `stories`, `messaging`, `uploads`, `accounts` expose typed queries/mutations; `http.ts` adds `/upload` and `/media` HTTP actions.
- Auth — Clerk JWTs verified via `auth.config.ts`; `lib/auth.ts` derives the acting profile server-side (`requireIdentity` / `requireProfile`) and never trusts client-supplied identity.
- Shared libs — `lib/views.ts` public projections, `lib/video.ts` MP4 duration parser, `lib/seed_data.ts` fictional demo content.
- Seeding & tests — `seed.ts` development-only idempotent seeding; vitest + `convex-test` suites cover permissions, invariants, pagination, retries, and cleanup.

## Structure (L2)

### convex/schema.ts

- Locator: `[[sources/mobile-app-course/20261001/codexgram-master/convex/schema.ts]]`
- Purpose: Declares every application table, field validator, index, and the `mediaKind` union (`image | video`); the canonical data model for the whole backend.
- Key exports: `mediaKind`, default `defineSchema` (profiles, posts, uploads, likes, comments, commentLikes, bookmarks, follows, conversations, messages, inbox, stories, seedAssets, accountDeletions).
- Dependencies: `convex/server` (`defineSchema`, `defineTable`), `convex/values` (`v`).
- Learner-relevant: Convex schema/index design — composite indexes such as `by_userId_and_postId`, `by_conversationId_and_sequence`, `by_followerId_and_followingId` enforce uniqueness pairs; `searchIndex('search_profiles')`; denormalized counters (`likesCount`, `followersCount`); separating high-churn inbox/message data from stable profile data; avoiding unbounded arrays.

### convex/lib/auth.ts

- Locator: `[[sources/mobile-app-course/20261001/codexgram-master/convex/lib/auth.ts]]`
- Purpose: Central authorization helpers that resolve the caller from verified auth into a profile document.
- Key exports: `requireIdentity`, `requireProfile`.
- Dependencies: `convex/values` (`ConvexError`), `../_generated/server` (`QueryCtx`, `MutationCtx`).
- Learner-relevant: Never trust client identity — derive it server-side; prefer `tokenIdentifier` over `subject`; reject demo profiles, deletion-pending accounts, and signed-out users.

### convex/lib/views.ts

- Locator: `[[sources/mobile-app-course/20261001/codexgram-master/convex/lib/views.ts]]`
- Purpose: Defines the public projection validators and builder functions that shape documents before returning them to clients, hiding internal fields like storage IDs and Clerk identifiers.
- Key exports: `profileView`, `publicProfile`, `postView`, `publicPost`.
- Dependencies: `convex/values`, `../_generated/dataModel`, `../_generated/server`, `../schema` (`mediaKind`).
- Learner-relevant: Output shaping / DTOs; derived per-viewer booleans (`isFollowing`, `isOwn`, `isLiked`); keeping secrets out of the API surface.

### convex/lib/video.ts

- Locator: `[[sources/mobile-app-course/20261001/codexgram-master/convex/lib/video.ts]]`
- Purpose: Reads only MP4/MOV box headers (`moov`/`mvhd`) to compute true video duration without decoding or buffering the file.
- Key exports: `videoDuration(blob): Promise<number | null>`.
- Dependencies: Web platform (`Blob`, `DataView`, `Uint8Array`, `String.fromCharCode`).
- Learner-relevant: Server-side media validation and ISO BMFF parsing; trusting server-checked file metadata over client-supplied picker data.

### convex/lib/seed_data.ts

- Locator: `[[sources/mobile-app-course/20261001/codexgram-master/convex/lib/seed_data.ts]]`
- Purpose: Static fictional demo content — member personas, caption pools, comment pools — plus the deterministic `postPlan(index)` mapping posts to authors/assets/captions.
- Key exports: `SEED_VERSION`, `SEED_POSTS`, `members`, `captions`, `comments`, `postPlan`.
- Dependencies: None.
- Learner-relevant: Deterministic demo-data generation; clearly labeling fictional accounts (`isDemo`).

### convex/profiles.ts

- Locator: `[[sources/mobile-app-course/20261001/codexgram-master/convex/profiles.ts]]`
- Purpose: Profile onboarding and editing — username normalization/validation, unique-username enforcement, idempotent create, update, fetch, and full-text search.
- Key exports: `me`, `create`, `update`, `get`, `search`.
- Dependencies: `convex/server` pagination validators, `convex/values`, `./lib/auth`, `./lib/views`.
- Learner-relevant: Idempotent bootstrap keyed on `tokenIdentifier`; normalized unique usernames; search index pagination; username changes preserve relationships via stable IDs.

### convex/posts.ts

- Locator: `[[sources/mobile-app-course/20261001/codexgram-master/convex/posts.ts]]`
- Purpose: Post feeds (`home`/`explore`/`profile`) with pagination, publish-from-upload with idempotent retry, deletion, and cascading cleanup of dependent rows.
- Key exports: `list`, `get`, `publish`, `remove`, `cleanup` (internal).
- Dependencies: `convex/server`, `convex/values`, `./lib/auth`, `./lib/views`.
- Learner-relevant: Bounded page scans plus indexed relationship checks preserve cursors; server-side media size limits (10 MB image / 50 MB video); batch scheduling for large deletes.

### convex/social.ts

- Locator: `[[sources/mobile-app-course/20261001/codexgram-master/convex/social.ts]]`
- Purpose: Social graph and interaction writes — likes, follows, follower/following lists, comments (add/list/paginate/delete).
- Key exports: `setLike`, `setFollow`, `connections`, `comments`, `addComment`, `deleteComment`.
- Dependencies: `convex/server`, `convex/values`, `./_generated/api`, `./lib/auth`, `./lib/views`.
- Learner-relevant: Enforcing one-like/one-follow via unique indexes; idempotent comment retries via `requestId`; denormalized counter maintenance; authorization on delete.

### convex/postInteractions.ts

- Locator: `[[sources/mobile-app-course/20261001/codexgram-master/convex/postInteractions.ts]]`
- Purpose: Extras on posts/comments — bookmarking, comment likes, and batched cleanup of comment likes.
- Key exports: `isBookmarked`, `setBookmark`, `setCommentLike`, `cleanupComment` (internal).
- Dependencies: `convex/values`, `./_generated/server`, `./_generated/api`, `./lib/auth`.
- Learner-relevant: Toggle semantics that are safe under repeated calls; cascading cleanup continuation.

### convex/stories.ts

- Locator: `[[sources/mobile-app-course/20261001/codexgram-master/convex/stories.ts]]`
- Purpose: 24-hour expiring photo stories — publish (image-only, retry-safe), list unexpired, owner delete, and scheduled expiry cleanup.
- Key exports: `storyView`, `list`, `publish`, `remove`, `expire` (internal).
- Dependencies: `convex/values`, `./_generated/server`, `./_generated/api`, `./lib/auth`, `./lib/views`.
- Learner-relevant: Time-based state via `expiresAt` + `scheduler.runAt`; passing `now` into queries rather than reading the wall clock; purpose-restricted uploads.

### convex/messaging.ts

- Locator: `[[sources/mobile-app-course/20261001/codexgram-master/convex/messaging.ts]]`
- Purpose: One-to-one chat — canonical conversation creation/reuse, inbox listing (with unread filter), paginated history, idempotent sends, and read-state tracking.
- Key exports: `start`, `get`, `list`, `history`, `send`, `markRead`; internal `requireConversation`.
- Dependencies: `convex/server`, `convex/values`, `./_generated/server`, `./_generated/dataModel`, `./lib/auth`, `./lib/views`.
- Learner-relevant: Canonical participant ordering (sorted pair) guarantees one conversation per pair; monotonic `sequence` per message; retry-safe sends via `by_senderId_and_requestId`; unread derived from `latestIncomingSequence > lastReadSequence`.

### convex/uploads.ts

- Locator: `[[sources/mobile-app-course/20261001/codexgram-master/convex/uploads.ts]]`
- Purpose: Media upload lifecycle — begin (validate dimensions/duration), internal ownership lookups for the HTTP layer, finish (bind storage), cancel, expire, avatar assignment, authenticated media resolution.
- Key exports: `begin`, `forUpload` (internal), `finish` (internal), `cancel`, `expire` (internal), `setAvatar`, `media` (internal).
- Dependencies: `convex/values`, `./_generated/server`, `./_generated/api`, `./schema`, `./lib/auth`.
- Learner-relevant: Two-phase upload (pending → ready → published), one-hour expiry with scheduled cleanup, ownership derived from auth, purpose separation (post/avatar/story).

### convex/accounts.ts

- Locator: `[[sources/mobile-app-course/20261001/codexgram-master/convex/accounts.ts]]`
- Purpose: Account deletion workflow — request, call Clerk's DELETE API as an action, and run bounded multi-batch cleanup of all owned data with watchdogs and retries.
- Key exports: `status`, `requestDeletion`, `getJob`, `deleteIdentity` (internalAction), `identityResult`, `cleanup`, `watchdog` (internal).
- Dependencies: `convex/values`, `./_generated/server`, `./_generated/api`, `./schema`, `./lib/auth`.
- Learner-relevant: Durable multi-step workflows across transactions, at-most-once scheduling plus idempotent recovery (DELETE returning 404), exponential backoff, preserving unrelated users' data, tombstone to block re-creation.

### convex/http.ts

- Locator: `[[sources/mobile-app-course/20261001/codexgram-master/convex/http.ts]]`
- Purpose: HTTP actions for binary media — authenticated `POST /upload` (MIME + magic-byte validation, streamed size limiting, MP4 duration check) and `GET /media` (owner-scoped reads with HTTP Range support), plus CORS.
- Key exports: default `http` router.
- Dependencies: `./lib/video`, `convex/server` (`httpRouter`), `./_generated/server` (`httpAction`), `./_generated/api`.
- Learner-relevant: Streaming uploads to stay under action memory limits; validating file signatures, not just Content-Type; HTTP range requests for video; possession of a URL does not grant authorization.

### convex/seed.ts

- Locator: `[[sources/mobile-app-course/20261001/codexgram-master/convex/seed.ts]]`
- Purpose: Development-deployment-restricted, idempotent seeder that creates fictional profiles/posts with deterministic likes and comments and copies media per post.
- Key exports: `asset`, `registerAsset`, `storeAsset`, `initialize`, `existingPost`, `insertPost`, `populate`, `summary` (mostly internal).
- Dependencies: `convex/values`, `./_generated/server`, `./_generated/api`, `./_generated/dataModel`, `./schema`, `./lib/seed_data`.
- Learner-relevant: Environment gating (`CONVEX_CLOUD_URL`), idempotency via `seedKey`, batching scheduled action work, per-post file ownership so deletes don't break shared media.

### convex/auth.config.ts

- Locator: `[[sources/mobile-app-course/20261001/codexgram-master/convex/auth.config.ts]]`
- Purpose: Declares the Clerk JWT issuer as the Convex auth provider (`applicationID: 'convex'`).
- Key exports: default `AuthConfig` object.
- Dependencies: `convex/server` (`AuthConfig`), `process.env.CLERK_JWT_ISSUER_DOMAIN`.
- Learner-relevant: External-auth (Clerk) integration; without this file `ctx.auth.getUserIdentity()` returns null.

### convex/convex.config.ts

- Locator: `[[sources/mobile-app-course/20261001/codexgram-master/convex/convex.config.ts]]`
- Purpose: Declares app-level environment variables available to the deployment.
- Key exports: default `defineApp` with `env.CLERK_SECRET_KEY` (optional string).
- Dependencies: `convex/server` (`defineApp`), `convex/values` (`v`).
- Learner-relevant: Typed deployment env config read through `env` rather than `process.env`.

### convex/social.test.ts

- Locator: `[[sources/mobile-app-course/20261001/codexgram-master/convex/social.test.ts]]`
- Purpose: Largest test suite: profile idempotency/normalization/uniqueness, uploads+publish+feed scoping, ownership enforcement, cascade deletion, HTTP auth/range reads, video limits, pagination, comment sorting, bookmarks/comment-likes, and MP4 duration server-check.
- Key exports: None (vitest tests).
- Dependencies: `convex-test`, `vitest`, `./schema`, `./_generated/api`, `./_generated/dataModel`.
- Learner-relevant: Testing an authenticated backend with `withIdentity`, fake timers, `finishAllScheduledFunctions`, and `import.meta.glob` module maps.

### convex/accounts.test.ts

- Locator: `[[sources/mobile-app-course/20261001/codexgram-master/convex/accounts.test.ts]]`
- Purpose: Tests account deletion: auth/ownership, idempotent request, write/upload lockout, missing-config failure, multi-batch cleanup with counter repair, Clerk failure → retry (404 idempotency), and provider-failure backoff.
- Key exports: None.
- Dependencies: `convex-test`, `vitest`, `./schema`, `./_generated/api`; stubs global `fetch` and env.
- Learner-relevant: Mocking external HTTP APIs and verifying durable retry/backoff behavior.

### convex/messaging.test.ts

- Locator: `[[sources/mobile-app-course/20261001/codexgram-master/convex/messaging.test.ts]]`
- Purpose: Tests conversation reuse, participant-only access, idempotent sends, text/limit validation, unread sequence semantics, and history pagination.
- Key exports: None.
- Dependencies: `convex-test`, `vitest`, `./schema`, `./_generated/api`.
- Learner-relevant: Multi-actor authorization tests and sequence-based unread logic.

### convex/stories.test.ts

- Locator: `[[sources/mobile-app-course/20261001/codexgram-master/convex/stories.test.ts]]`
- Purpose: Tests story upload/publish retry safety, authenticated viewing and media route, owner deletion, 24h expiry cleanup, and rejection of video/unauthenticated stories.
- Key exports: None.
- Dependencies: `convex-test`, `vitest`, `./schema`, `./_generated/api`, fake timers.
- Learner-relevant: Time-based expiry and scheduled cleanup verification.

### convex/seed.test.ts

- Locator: `[[sources/mobile-app-course/20261001/codexgram-master/convex/seed.test.ts]]`
- Purpose: Tests that seeding is development-only and idempotent (no duplicate profiles/posts/counters; per-post files distinct; demo profiles cannot sign in).
- Key exports: None.
- Dependencies: `convex-test`, `vitest`, `./schema`, `./_generated/api`.
- Learner-relevant: Verifying deterministic, idempotent data generation and environment guards.

### convex/_generated/ai/guidelines.md

- Locator: `[[sources/mobile-app-course/20261001/codexgram-master/convex/_generated/ai/guidelines.md]]`
- Purpose: Framework-provided Convex conventions (validators, schema/index rules, auth, pagination, scheduling, testing, storage) that this backend follows; not runtime code.
- Key exports: None (documentation).
- Dependencies: None.
- Learner-relevant: The authoritative style guide mirrored by the modules above (e.g. always add args validators, prefer indexes over filters, derive identity server-side, use `ctx.db.system.get` for `_storage`, use `paginationOptsValidator`).
