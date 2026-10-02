---
source: codexgram-master
source_type: codebase
source_lines: 2236
language: TypeScript
file_count: 56
part: 2
status: absorbed
absorbed_at: 2026-10-02
created: 2026-10-01
updated: 2026-10-01
---

# Digest — codexgram-master (part 2)

## Overview (L1)

- Expo Router app shell (`src/app`) — File-based route tree: a root Clerk+Convex provider layout, a four-tab native tab bar (home/messages/explore/profile), full-screen modals for compose/story, dynamic detail routes (`post/[id]`, `member/[id]`, `chat/[id]`), an SSO callback, and a dev-only `design-preview` tab set.
- Live social components (`src/components/social`) — Backend-connected screens: home feed with stories, explore grid, member/own profile, post detail with comments, chat/inbox, and the media-aware composer that uploads to Convex.
- Shared UI components (`src/components`) — Reusable layout/primitive pieces (icon set, chat screen, profile layout, settings, edit-profile, tab screens), plus local demo/mock implementations used by `design-preview` and the messages tab.
- Context providers (`src/context`) — Cross-cutting state: `ProfileGate` onboarding/auth gate, message outbox with optimistic send/retry, and a local-only feed store for previews.
- Hooks (`src/hooks`) — Clerk `useSSO` social sign-in orchestration (Google/Apple) with in-flight guarding and error mapping.
- Libraries (`src/lib`) — Convex API re-exports and view types, validation, upload transport, static feed/explore demo data, auth/legal error helpers.

## Structure (L2)

### src/app

- Locator: `[[sources/mobile-app-course/20261001/codexgram-master/src/app/_layout.tsx]]`
- Purpose: Root layout. Initializes Sentry (with feedback integration), reads Clerk/Convex env keys, constructs `ConvexReactClient`, wraps the app in `ClerkProvider` + `ConvexProviderWithClerk`, and defines the route stack.
- Key exports: `RootLayout` (default, wrapped in `Sentry.wrap`), internal `AuthenticatedRoutes`.
- Dependencies: `@clerk/expo` (ClerkProvider, useAuth, tokenCache), `convex/react`, `convex/react-clerk`, `expo-router` Stack, `@sentry/react-native`, `@/context/messages-context`.
- Learner-relevant: Auth/providers composition and route guarding via `Stack.Protected guard` for signed-in vs signed-out screens; `MessagesProvider` keyed by `userId`.

- Locator: `[[sources/mobile-app-course/20261001/codexgram-master/src/app/index.tsx]]`
- Purpose: Signed-out landing/sign-in screen. Pixel-proportional artwork canvas with Google/Apple buttons, legal links, and Clerk captcha mount point (`nativeID="clerk-captcha"`).
- Key exports: `Index` (default).
- Dependencies: `useSocialAuth`, `openLegalDocument`, expo-image, expo-linear-gradient, react-native, safe-area.
- Learner-relevant: Provider SSO entry point; proportional scaling (`Math.min(width/390, 1.3)`) for reference-art layouts.

- Locator: `[[sources/mobile-app-course/20261001/codexgram-master/src/app/(tabs)/_layout.tsx]]`
- Purpose: Tab group layout wrapping `AppTabs` in `ProfileGate`; sets `initialRouteName: 'home'`.
- Key exports: `Tabs` (default), `unstable_settings`.
- Dependencies: `@/components/app-tabs`, `@/context/social-context`.
- Learner-relevant: Nested layout pattern; gate requires a completed profile before tabs render.

- Locator: `[[sources/mobile-app-course/20261001/codexgram-master/src/app/(tabs)/home.tsx]]`, `[[sources/mobile-app-course/20261001/codexgram-master/src/app/(tabs)/messages.tsx]]`, `[[sources/mobile-app-course/20261001/codexgram-master/src/app/(tabs)/explore.tsx]]`, `[[sources/mobile-app-course/20261001/codexgram-master/src/app/(tabs)/profile.tsx]]`
- Purpose: One-line re-export route stubs mapping each tab to its component (`LiveHome`, `MessagesTab`, `LiveExplore`, `OwnProfile`).
- Key exports: default re-export per file.
- Dependencies: components under `@/components/social/*` and `@/components/tab-screens`.
- Learner-relevant: Expo Router convention where route files stay thin and logic lives in components.

- Locator: `[[sources/mobile-app-course/20261001/codexgram-master/src/app/compose.tsx]]`, `[[sources/mobile-app-course/20261001/codexgram-master/src/app/story-compose.tsx]]`, `[[sources/mobile-app-course/20261001/codexgram-master/src/app/post/[id].tsx]]`, `[[sources/mobile-app-course/20261001/codexgram-master/src/app/member/[id].tsx]]`, `[[sources/mobile-app-course/20261001/codexgram-master/src/app/chat/[id].tsx]]`
- Purpose: Dynamic/modal routes gated by `ProfileGate`; `Composer`/`PostDetail`/`MemberRoute`/`LiveChat`. `chat/[id]` also exports an `ErrorBoundary` with retry and back-to-messages.
- Key exports: default route components; `ErrorBoundary` (chat).
- Dependencies: `@/components/social/*`, `@/context/social-context`, expo-router.
- Learner-relevant: Dynamic segments `[id]` read via `useLocalSearchParams`; route-level error boundaries.

- Locator: `[[sources/mobile-app-course/20261001/codexgram-master/src/app/sso-callback.tsx]]`
- Purpose: Deep-link OAuth callback that redirects to `/home` or `/` based on `useAuth`.
- Key exports: `SSOCallback` (default).
- Dependencies: `@clerk/expo`, expo-router `Redirect`.
- Learner-relevant: Deep-link vs in-app browser auth flow distinction.

- Locator: `[[sources/mobile-app-course/20261001/codexgram-master/src/app/design-preview/_layout.tsx]]` and sibling `index.tsx`, `home.tsx`, `explore.tsx`, `messages.tsx`, `profile.tsx`
- Purpose: Dev-only tab set (`__DEV__` guarded, redirects otherwise) reusing `AppTabs`; each preview screen maps to demo/mock components (`HomeTab`, `ExploreTab`, `MessagesTab preview`, `ProfileTab`).
- Key exports: `PreviewTabs`, `PreviewIndex`, and default re-exports.
- Dependencies: `@/components/app-tabs`, `@/components/*-screen`, `@/components/home-tab`, expo-router.
- Learner-relevant: Separating preview/mock routes from live routes at the same component seam.

### src/components/social

- Locator: `[[sources/mobile-app-course/20261001/codexgram-master/src/components/social/feed.tsx]]`
- Purpose: Live home feed. Paginated `api.posts.list` with `feed:'home'`, header `Stories`, viewability tracking for video autoplay, pull-to-load-more, and empty state.
- Key exports: `LiveHome`.
- Dependencies: `convex/react` `usePaginatedQuery`, `@/lib/social`, `./ui`, `../home-layout`, `./stories`, `./post-card`.
- Learner-relevant: Convex pagination contract (`status`, `loadMore`), viewability config for media.

- Locator: `[[sources/mobile-app-course/20261001/codexgram-master/src/components/social/stories.tsx]]`
- Purpose: Story rail + full-screen viewer. Groups active (non-expired) stories by author, tracks seen state, auto-advances a timed progress bar, pause on long-press, deletes own story.
- Key exports: `Stories`, internal `StoryViewer`, `Story` type.
- Dependencies: `convex/react`, expo-image, expo-linear-gradient, `./media` (`Avatar`, `useMediaSource`), `@/lib/social`.
- Learner-relevant: Ephemeral content (`expiresAt`), `AppState` foreground handling, interval-driven progress.

- Locator: `[[sources/mobile-app-course/20261001/codexgram-master/src/components/social/explore.tsx]]`
- Purpose: Live explore grid. Debounced profile search (250 ms), topic filters via regex keyword map, paginated posts, optimistic likes, `ExploreLayout` presentation.
- Key exports: `LiveExplore`.
- Dependencies: `convex/react`, `../explore-layout`, `./media`, `./post-card`, `@/lib/explore-data`, `@/lib/social`.
- Learner-relevant: Debounce pattern, optimistic UI with pending map, client-side topic filtering.

- Locator: `[[sources/mobile-app-course/20261001/codexgram-master/src/components/social/profile.tsx]]`
- Purpose: Own/member profile. Paginated post gallery, follow/start-chat actions, followers/following lists, live edit with avatar upload, account deletion hook, and settings sheet.
- Key exports: `OwnProfile`, `MemberRoute`.
- Dependencies: `convex/react`, `@clerk/expo`, `@/context/social-context`, `@/lib/profile-form`, `@/lib/upload`, `./media`, `./post-card`, `./ui`, `../profile-layout`, `../edit-profile-screen`, `../settings-screen`.
- Learner-relevant: Composing multiple paginated queries and mutations; demo-profile constraints (`isDemo`).

- Locator: `[[sources/mobile-app-course/20261001/codexgram-master/src/components/social/post-detail.tsx]]`
- Purpose: Post detail with paginated comments, sort asc/desc preserving scroll offset, add/delete comments, optimistic comment likes, reply-to-prefill, keyboard-aware input bar.
- Key exports: `PostDetail`; internal `CommentRow`, `relativeTime`.
- Dependencies: `convex/react`, expo-crypto `randomUUID`, `./post-card`, `./media`, `./ui`, `@/context/social-context`.
- Learner-relevant: Idempotent writes via `requestId`, relative-time formatting, scroll restoration.

- Locator: `[[sources/mobile-app-course/20261001/codexgram-master/src/components/social/post-card.tsx]]` and `[[sources/mobile-app-course/20261001/codexgram-master/src/components/social/post-detail-actions.tsx]]`
- Purpose: Reusable post card (home/detail/default variants) with optimistic like, delete-own-post, hashtag extraction, and a follow button; separate share/bookmark actions component.
- Key exports: `PostCard`, `FollowButton`, `DetailActions`.
- Dependencies: `convex/react`, expo-router, `./media`, `./ui`, `@/lib/social`.
- Learner-relevant: Variant prop patterns, optimistic mutation with rollback on error, `accessibilityState`.

- Locator: `[[sources/mobile-app-course/20261001/codexgram-master/src/components/social/composer.tsx]]`
- Purpose: Upload composer for posts/stories. Picks from camera/library, validates media, runs begin → XHR upload (progress) → publish/`publishStory`, with abort/cancel and resumable upload-id reuse.
- Key exports: `Composer`.
- Dependencies: expo-image-picker, expo-device, `convex/react`, `@/lib/upload`, `@/lib/social`, `@/context/social-context` `useBackendToken`, `./ui`.
- Learner-relevant: Multi-phase upload state machine (`idle|preparing|uploading|publishing`), abort signals, permission handling.

- Locator: `[[sources/mobile-app-course/20261001/codexgram-master/src/components/social/messages.tsx]]`
- Purpose: Live chat route and new-conversation picker. Merges paginated history with optimistic pending outbox messages, marks read on focus/active/at-bottom, formats inbox timestamps.
- Key exports: `LiveChat`, `NewConversation`, `messageTime`, `inboxTime`.
- Dependencies: `convex/react`, expo-router `useFocusEffect`, `@/context/messages-context`, `../chat-screen`, `./media`, `./ui`.
- Learner-relevant: Optimistic message reconciliation by `requestId`, read-receipt sequencing.

- Locator: `[[sources/mobile-app-course/20261001/codexgram-master/src/components/social/media.tsx]]`
- Purpose: Authenticated media rendering. `useMediaSource` builds a bearer-token `/media` URL; `Avatar` falls back to initial; `PostMedia` handles image/video, aspect ratio, retry; `InlineVideo` controls playback by focus/viewability.
- Key exports: `useMediaSource`, `Avatar`, `PostMedia`; internal `InlineVideo`.
- Dependencies: expo-image, expo-video, `@/context/social-context` `useBackendToken`, `@/lib/social`.
- Learner-relevant: Token-header image loading, cache-busting `v=revision`, video lifecycle.

- Locator: `[[sources/mobile-app-course/20261001/codexgram-master/src/components/social/ui.tsx]]`
- Purpose: Shared header, connection status banner (`useConvexConnectionState`), load-more control, and the `ui` StyleSheet design tokens.
- Key exports: `Header`, `ConnectionStatus`, `LoadMore`, `ui`.
- Dependencies: `convex/react`, expo-router, `@/lib/social` palette, `../feed-icon`.
- Learner-relevant: Centralized style tokens and reusable loading/connection affordances.

### src/components

- Locator: `[[sources/mobile-app-course/20261001/codexgram-master/src/components/app-tabs.tsx]]`
- Purpose: Native tab bar (`expo-router/unstable-native-tabs`) with four triggers and platform icons; wraps `FeedProvider` and theme provider.
- Key exports: `AppTabs`.
- Dependencies: expo-router `NativeTabs`, `@/context/feed-context`.
- Learner-relevant: Native tabs configuration (SF Symbols/`md` icons, tint/selected colors).

- Locator: `[[sources/mobile-app-course/20261001/codexgram-master/src/components/feed-icon.tsx]]`
- Purpose: Single data-URI SVG icon component covering ~37 named icons; supports fill and stroke rendering.
- Key exports: `FeedIcon`, `IconName`.
- Dependencies: expo-image.
- Learner-relevant: Keeping one vector icon system without native font assets.

- Locator: `[[sources/mobile-app-course/20261001/codexgram-master/src/components/chat-screen.tsx]]`
- Purpose: Presentational chat screen used by both live and demo flows: message bubbles, image attachments, read/delivered ticks, pending/failed retry, photo picker, image viewer, keyboard handling.
- Key exports: `ChatScreen`, `ChatMessage`, `initialMessages`, `chatAvatar`.
- Dependencies: expo-crypto, expo-image, expo-image-picker, react-native, `./feed-icon`.
- Learner-relevant: Keyboard-aware list, scroll-to-end strategy, `maintainVisibleContentPosition`.

- Locator: `[[sources/mobile-app-course/20261001/codexgram-master/src/components/tab-screens.tsx]]`
- Purpose: Messages tab implementation. Live inbox (paginated conversations, unread filter, new-chat modal) plus a demo inbox with local threads; switches on `preview`.
- Key exports: `MessagesTab`; internal `LiveInbox`, `MessagesLayout`, `ConversationRow`.
- Dependencies: `convex/react`, expo-image, `./chat-screen`, `./social/media`, `./social/messages`, `./social/ui`, `./feed-icon`.
- Learner-relevant: Preview vs live switch at one entry component; conversation list composition.

- Locator: `[[sources/mobile-app-course/20261001/codexgram-master/src/components/home-feed.tsx]]`
- Purpose: Local demo home feed with stories, carousel posts, like/save/comment state from `FeedProvider`, and a modal sheet for story/search/compose/comments/menu.
- Key exports: `HomeFeed`.
- Dependencies: expo-image, expo-linear-gradient, `@/context/feed-context`, `@/lib/feed-data`, `./feed-icon`.
- Learner-relevant: Modal-sheet state machine, local-only interactions, FlatList header/footer.

- Locator: `[[sources/mobile-app-course/20261001/codexgram-master/src/components/home-layout.tsx]]`, `[[sources/mobile-app-course/20261001/codexgram-master/src/components/home-tab.tsx]]`
- Purpose: Shared home header (logo, search, compose) with preview-aware navigation, and `HomeTab` wrapper that feeds username into `HomeFeed`.
- Key exports: `HomeHeader`, `HomeTab`.
- Dependencies: expo-image, expo-router, `./feed-icon`, `./home-feed`, `@clerk/expo`.
- Learner-relevant: Reusing a header across live/demo paths via pathname detection.

- Locator: `[[sources/mobile-app-course/20261001/codexgram-master/src/components/profile-layout.tsx]]` and `[[sources/mobile-app-course/20261001/codexgram-master/src/components/profile-screen.tsx]]`
- Purpose: Profile layout primitives (`ProfileHeader`, `ProfileSummary`, `ProfileGalleryTabs`, `useProfileScale`) plus the local demo profile screen with edit/settings/follow sheets and a static gallery.
- Key exports: `ProfileHeader`, `ProfileSummary`, `ProfileGalleryTabs`, `useProfileScale`, `ProfilePanel`; `ProfileTab`.
- Dependencies: expo-image, expo-router, `@/context/feed-context`, `@/lib/feed-data`, `./settings-screen`, `./edit-profile-screen`, `@/lib/profile-form`.
- Learner-relevant: Parameterized layout components and a consistent responsive scale hook.

- Locator: `[[sources/mobile-app-course/20261001/codexgram-master/src/components/edit-profile-screen.tsx]]`
- Purpose: Controlled profile edit form (username/name/bio/website/location), client validation via `validateProfile`, dirty-state discard confirmation, and JPG/PNG ≤5 MB photo pick.
- Key exports: `EditProfileScreen`.
- Dependencies: expo-image, dynamic import of expo-image-picker, `@/lib/profile-form`, `./feed-icon`.
- Learner-relevant: Form validation, dirty checking, image type/size guards, dynamic import for picker.

- Locator: `[[sources/mobile-app-course/20261001/codexgram-master/src/components/settings-screen.tsx]]` and `[[sources/mobile-app-course/20261001/codexgram-master/src/components/sentry-test-screen.tsx]]`
- Purpose: Settings list (account/support/legal rows, feedback via Sentry, sign out, destructive account deletion with confirmation) and a diagnostics screen that emits synthetic Sentry errors/logs at all six levels.
- Key exports: `SettingsScreen`, `SentryTestScreen`.
- Dependencies: `@sentry/react-native`, `@/lib/social`, `@/lib/legal-links`, `./feed-icon`.
- Learner-relevant: Destructive-action confirmation, observability (captureException, logger levels, scope/tags, flush).

- Locator: `[[sources/mobile-app-course/20261001/codexgram-master/src/components/explore-layout.tsx]]` and `[[sources/mobile-app-course/20261001/codexgram-master/src/components/explore-screen.tsx]]`
- Purpose: Explore presentation (header, search, suggested-people rail, topic chips, 3-column tile grid) and its local demo implementation with follow/like state and sheets.
- Key exports: `ExploreLayout`, `exploreColors`, `ExplorePerson`, `ExploreTile`; `ExploreTab`.
- Dependencies: expo-image, expo-linear-gradient, `@/lib/explore-data`, `@/lib/feed-data`, `./feed-icon`, `@/context/feed-context`.
- Learner-relevant: Presentational/container split; multi-column FlatList with typed item renderers.

- Locator: `[[sources/mobile-app-course/20261001/codexgram-master/src/components/demo-message-avatar.tsx]]`
- Purpose: Crops portrait regions from a single reference sprite image to render demo avatars without resampling.
- Key exports: `DemoMessageAvatar`.
- Dependencies: expo-image, react-native.
- Learner-relevant: Sprite-sheet cropping technique via absolute positioning + scale.

### src/context

- Locator: `[[sources/mobile-app-course/20261001/codexgram-master/src/context/social-context.tsx]]`
- Purpose: Auth/onboarding gate. `ProfileGate` resolves Convex auth, account-deletion status, and profile; shows loading, auth-failure, deletion-progress, or onboarding (username/name creation). Exposes `useProfile` and `useBackendToken`.
- Key exports: `ProfileGate`, `useProfile`, `useBackendToken`.
- Dependencies: `@clerk/expo`, `convex/react`, `@/lib/social`, `@/components/social/ui`.
- Learner-relevant: Gating render branches, Convex+Clerk auth integration, token template selection for HTTP media.

- Locator: `[[sources/mobile-app-course/20261001/codexgram-master/src/context/messages-context.tsx]]`
- Purpose: Optimistic message outbox. `send` appends a pending message with a UUID `requestId`; `retry` calls `api.messaging.send`, tracking a busy set and failed state.
- Key exports: `MessagesProvider`, `useMessages`.
- Dependencies: `convex/react`, expo-crypto `randomUUID`, react.
- Learner-relevant: Optimistic UI with idempotent `requestId` and retry semantics.

- Locator: `[[sources/mobile-app-course/20261001/codexgram-master/src/context/feed-context.tsx]]`
- Purpose: Local-only feed store for previews (posts, unliked, saved, comments) via `useState`.
- Key exports: `FeedProvider`, `useFeed`.
- Dependencies: react, `@/lib/feed-data`.
- Learner-relevant: Context + reducer-like state for mock interactions without a backend.

### src/hooks

- Locator: `[[sources/mobile-app-course/20261001/codexgram-master/src/hooks/use-social-auth.ts]]`
- Purpose: `useSocialAuth` wraps Clerk `startSSOFlow` for Google/Apple; guards re-entry with a ref, sets active session, and maps cancel/dismiss/missing-requirements to user feedback.
- Key exports: `useSocialAuth`, `AuthProvider`.
- Dependencies: `@clerk/expo`, expo-auth-session `makeRedirectUri`, `@/lib/auth-errors`.
- Learner-relevant: Async auth flow states, redirect URI scheme, intentional-cancel handling.

### src/lib

- Locator: `[[sources/mobile-app-course/20261001/codexgram-master/src/lib/social.ts]]`
- Purpose: Central backend surface: re-exports Convex `api` and `Id`, infers `SocialPost`/`SocialProfile` from Convex views, exposes `siteUrl`, `errorMessage`, and the color `palette`.
- Key exports: `api`, `Id`, `SocialPost`, `SocialProfile`, `siteUrl`, `errorMessage`, `palette`.
- Dependencies: `convex/values`, `../../convex/lib/views`, generated api/dataModel.
- Learner-relevant: Type inference from Convex validators keeps client types in sync with backend.

- Locator: `[[sources/mobile-app-course/20261001/codexgram-master/src/lib/upload.ts]]`
- Purpose: `validateMedia` enforces avatar/video/image size, duration, and MIME rules; `sendUpload` performs an authenticated XHR POST with progress and abort support.
- Key exports: `validateMedia`, `sendUpload`.
- Dependencies: expo-image-picker type, `./social` `siteUrl`.
- Learner-relevant: Client-side media constraints and XHR upload progress vs fetch.

- Locator: `[[sources/mobile-app-course/20261001/codexgram-master/src/lib/profile-form.ts]]` and `[[sources/mobile-app-course/20261001/codexgram-master/src/lib/auth-errors.ts]]`
- Purpose: Profile draft type + `validateProfile` (username regex, lengths, URL check) and `authErrorMessage` (maps Clerk API errors and suppresses cancellations).
- Key exports: `ProfileDraft`, `validateProfile`, `authErrorMessage`.
- Dependencies: `@clerk/expo` `isClerkAPIResponseError`.
- Learner-relevant: Pure validation/normalization helpers separated from UI.

- Locator: `[[sources/mobile-app-course/20261001/codexgram-master/src/lib/legal-links.ts]]` and `[[sources/mobile-app-course/20261001/codexgram-master/src/lib/feed-data.ts]]`, `[[sources/mobile-app-course/20261001/codexgram-master/src/lib/explore-data.ts]]`
- Purpose: Legal document URLs opened in a web browser sheet; static `Post`/`stories`/`media` demo data and explore topics/suggested people/explore posts.
- Key exports: `openLegalDocument`; `media`, `Post`, `initialPosts`, `stories`; `topics`, `suggestedPeople`, `explorePosts`.
- Dependencies: expo-web-browser, react-native `Alert`, expo-image types, `./feed-data`.
- Learner-relevant: In-app browser usage and typed static content fixtures for previews.
