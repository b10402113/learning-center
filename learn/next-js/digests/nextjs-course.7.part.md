---
source: nextjs-course
source_type: text
source_lines: 95937
part: 7
status: absorbed
absorbed_at: 2026-10-04
created: 2026-10-04
updated: 2026-10-04
---

# Digest — nextjs-course (part 7)

## Overview (L1)

- 131 Develop Profile Header — Builds the `profile/[id]` page: fetches a user with `getUser`, reads the route `id`, uses `notFound` for missing users and `auth()` to detect the logged-in viewer, and adds a reusable `ProfileLink` plus an Edit Profile button shown only on your own profile.
- 132 Develop Stats UI — Defines a `BadgeCounts` global type and renders a `Stats` component with a responsive grid of reusable `StatCard`s showing total questions, total answers, and gold/silver/bronze badge counts.
- 133 Tabs Layout — Installs the shadcn Tabs component and lays out the profile tabs (Top Posts / Answers) with a Top Tags sidebar that is hidden on small screens.
- 134 Implement User Questions Tab — Adds a `getUserQuestions` server action + validation, paginates the user's questions, populates tags/author, and renders them through `DataRenderer`, `QuestionCard`, and `Pagination`.
- 135 Implement User Answers Tab — Mirrors the questions tab with a `getUserAnswers` action, extends `AnswerCard` with `containerClasses`/`showReadMore`, truncates previews, and deep-links "read more" to the parent question via an answer hash.
- 136 Implement User Tags — Implements `getUserTopTags` with a MongoDB aggregation pipeline (`$match` → `$unwind` → `$group` → `$lookup` → `$sort` → `$limit` → `$project`) and renders the top 10 ranked tags as compact `TagCard`s, with an aside about large-file maintainability.
- 137 A note moving forward — A course update announcing a shift from video-follow-along to interactive, challenge-based learning with quizzes, AI interview practice, and improved lesson UI.
- 138 Create Edit Delete Component — Installs shadcn `alert-dialog`, adds a `showActionBtns` prop gated on ownership, and builds `EditDeleteAction` (edit icon redirects to the edit form, trash icon opens a confirm dialog with toast messages).
- 139 Implement Question Delete Functionality — Implements the `deleteQuestion` schema + server action with validation, author authorization, and a transaction that clears tags/answers/votes before deleting the question, then wires it to `handleDelete`.
- 140 Build interactions and reputation (part 1) — Lays out the reputation point table and action-naming pattern: post +5 (question) / +10 (answer), upvote performer +2 / receiver +10, downvote −1/−2, delete −5/−10.
- 141 Build interactions and reputation (part 2) — Implements the `updateReputation` server action in `interaction.action.ts`: a switch over action/actionType computes performer and author points, blocks self-reputation, and applies both via `user.bulkWrite` tied to a session.
- 142 Badge System — Implements `assignBadges` in utils: maps each criterion to `badge_criteria` from constants and increments gold/silver/bronze counts, returns `BadgeCounts`, and is called from `getUser`; verified by lowering thresholds.
- 143 Build Recommendation System (part 1) — Implements `getRecommendedQuestions`: pulls recent interactions, extracts question IDs and their tags, flattens unique tags, builds a query that excludes seen questions/authors but matches those tags (plus optional text search), then populates, sorts by upvotes/views, paginates, and counts.
- 144 Build Recommendation System (part 2) — Enables the homepage filters (newest, popular, unanswered, recommended), tests recommendations with a second account posting React/Java questions, and fixes `action` vs `actions` and `upvotes` sort bugs.
- 145 Use of Loading file — Adds shadcn Skeleton and a route-level `loading.tsx` to the community page so a layout-matching shimmer is shown while data loads.
- 146 Use of Error File — Adds a client-side `error.tsx` with `error`/`reset` props, effect-based logging, and a "Try Again" button, while noting the page-level boundary hides the rest of the page.
- 147 SEO-optimize dynamic metadata — Compares static `metadata` objects with the dynamic `generateMetadata` function and implements per-question title/description and a Twitter `summary_large_image` card on the question details page.
- 148 React cache — Diagnoses the doubled `getQuestion` request in dynamic metadata (server actions are not auto-cached) and wraps `getQuestion` in React's `cache()` to memoize it per request.
- 149 Advanced Next.js — A three-hour workshop on React Server Components vs SSR, hydration, streaming/selective hydration with `Suspense`, static/dynamic/ISR rendering, sequential vs parallel/preload data fetching, caching (fetch cache, React cache, `unstable_cache`, `revalidateTag`/`revalidatePath`), server actions with `use server`, edge vs node runtimes, and SEO metadata.
- 150 Deploy on Vercel — Walks through a full production deploy: push to GitHub, ESLint ignore patterns for `components/ui`, import to Vercel, set env vars and `NEXT_PUBLIC_API_BASE_URL`, fix a Mongoose enum client-import error, recreate GitHub/Google OAuth apps with deployed callback URLs, and disable ESLint/TS errors during builds.

## Sections (L2)

### develop-profile-header

- Locator: `[[sources/next-js/20261004/131 -  Develop Profile Header.en.srt#Develop Profile Header]]`
- Summary: Implements the `/profile/[id]` page that fetches a user, distinguishes the logged-in viewer from other users, and renders the profile header.
- Key claims: the route `id` comes from `params` (not `searchParams`), `notFound()` handles a missing user, and `auth()` decides whether to show the Edit Profile button; a reusable `ProfileLink` renders icon + label and only wraps in a link when an `href` exists; `dayjs` formats the join date.
- Learner-relevant: You can build a dynamic profile route with ownership-aware UI and a typed `User` interface in `global.d.ts`.

### develop-stats-ui

- Locator: `[[sources/next-js/20261004/132 -  Develop Stats UI.en.srt#Develop Stats UI]]`
- Summary: Adds a `BadgeCounts` type and a `Stats` component showing questions, answers, and gold/silver/bronze badges in a responsive grid.
- Key claims: `grid-cols-1` → `xs:grid-cols-2` → `md:grid-cols-4` is the right pattern for stat cards; badge values are temporarily hardcoded until the reputation system exists; `formatNumber` formats counts.
- Learner-relevant: You can build a reusable stat-card grid that reads counts from props.

### tabs-layout

- Locator: `[[sources/next-js/20261004/133 -  Tabs Layout.en.srt#Tabs Layout]]`
- Summary: Installs the shadcn Tabs component and composes the profile tabs plus the Top Tags sidebar.
- Key claims: tabs use `defaultValue="top-posts"` with matching `TabsTrigger`/`TabsContent` values; import Tabs from your UI components, not directly from Radix, for the styles to work; the tags sidebar uses `max-lg:hidden` to drop on small screens.
- Learner-relevant: You can add accessible, animated tabbed layouts cheaply with shadcn.

### implement-user-questions-tab

- Locator: `[[sources/next-js/20261004/134 -  Implement User Questions Tab.en.srt#Implement User Questions Tab]]`
- Summary: Fetches and paginates a specific user's questions and displays them with the existing question card and pagination components.
- Key claims: the action params type extends `PaginatedSearchParams` but `Omit`s query/filter/sort and adds `userId`; pagination uses `skip = (page - 1) * pageSize` and `limit = pageSize`; populate tags and author (name, image), and compute `isNext` from `totalQuestions > skip + questions.length`.
- Learner-relevant: You can reuse one data-renderer/card/pagination trio to show any paginated list per user.

### implement-user-answers-tab

- Locator: `[[sources/next-js/20261004/135 -  Implement User Answers Tab.en.srt#Implement User Answers Tab]]`
- Summary: Adds the answers tab by duplicating the questions action and extending `AnswerCard` for profile use.
- Key claims: `getUserAnswers` mirrors `getUserQuestions` but reads the `Answer` model and populates only author; the `Answer` type gains a `question` id so "read more" links to `/questions/{question}#answer-{id}` and scrolls to that answer; `containerClasses` and `showReadMore` props make the card reusable and its text truncated.
- Learner-relevant: You can build cross-linked list items that deep-link back into their parent resource.

### implement-user-tags

- Locator: `[[sources/next-js/20261004/136 -  Implement User Tags.en.srt#Implement User Tags]]`
- Summary: Uses a MongoDB aggregation pipeline to derive a user's most-used tags and renders them as compact tag cards.
- Key claims: since tags aren't owned by users, derive them by `$match`ing authored questions, `$unwind`ing tags, `$group`ing by tag id with a count, `$lookup`ing tag info, sorting by count desc, limiting to 10, and `$project`ing `_id`/`name`/`count`; `question.aggregate(pipeline)` executes it.
- Learner-relevant: You can compute ranked "top N" aggregates over related collections and surface them as a competence profile.

### a-note-moving-forward

- Locator: `[[sources/next-js/20261004/137 -  A note moving forward.en.srt#A note moving forward]]`
- Summary: A message from the instructor announcing a format change for the rest of the course.
- Key claims: the course moves to interactive, challenge-based learning where learners attempt tasks first; new platform features include lesson quizzes, AI interview practice, better code blocks, and a cleaner accessible UI; the instructor frames this as testing knowledge in real time rather than copying videos.
- Learner-relevant: Sets expectations that upcoming lessons ask you to implement features yourself before seeing the solution.

### create-edit-delete-component

- Locator: `[[sources/next-js/20261004/138 -  Create Edit Delete Component for Questions and Answers.en.srt#Create Edit Delete Component for Questions and Answers]]`
- Summary: Builds the edit/delete action UI for question and answer cards using shadcn's alert dialog.
- Key claims: a `showActionBtns` boolean prop, computed by comparing the logged-in user id to the item author id, gates the controls; the edit icon routes to `/questions/{id}/edit`; the trash icon opens an `AlertDialog` confirming the deletion and firing a toast.
- Learner-relevant: You can add ownership-gated CRUD controls and destructive-action confirmations to any card.

### implement-question-delete-functionality

- Locator: `[[sources/next-js/20261004/139 -  Implement Question Delete Functionality.en.srt#Implement Question Delete Functionality]]`
- Summary: Implements the `deleteQuestion` server action and connects it to the confirm dialog.
- Key claims: deletion is not a single `deleteOne` — it requires author authorization plus a transaction that removes related collections/tags, answers, and votes first; the action takes a generic `itemId` because the same component handles questions and answers; passing it from `handleDelete` refreshes the profile.
- Learner-relevant: You can safely delete an entity and its dependent records atomically instead of leaving orphans.

### build-interactions-and-reputation

- Locator: `[[sources/next-js/20261004/140 -  Build interactions and reputation.en.srt#Build interactions and reputation]]`
- Summary: Introduces the reputation model by defining which actions earn or lose points.
- Key claims: name the tracked actions by a consistent pattern (post, upvote, downvote, delete, bookmark, search); the course's sample table awards +5 per question and +10 per answer, +2 to the upvoter and +10 to the author receiving the upvote, and deducts for downvotes/deletions; the system is deliberately developer-configurable.
- Learner-relevant: You can design your own points table and know exactly what to award the performer versus the content author.

### build-interactions-and-reputation-part-2

- Locator: `[[sources/next-js/20261004/141 -  Build interactions and reputation.en.srt#Build interactions and reputation]]`
- Summary: Implements the `updateReputation` server action that applies point changes for an interaction.
- Key claims: init `performerReputation`/`authorReputation` to 0 and use a `switch` over `action` to set them (post: 5 for a question, 10 for an answer; delete: −5/−10; upvote 2/10; downvote −1/−2); guard against `performerId === authorId` to stop self-reputation; apply both updates with `user.bulkWrite` scoped to the session so a failure changes nothing.
- Learner-relevant: You can atomically update two documents from one logical action and prevent self-inflation.

### badge-system

- Locator: `[[sources/next-js/20261004/142 -  Badge System.en.srt#Badge System]]`
- Summary: Implements `assignBadges`, which converts a user's activity counts into gold/silver/bronze badge tallies.
- Key claims: `badge_criteria` in constants maps each activity type (questions, answers, upvotes, views) to level thresholds; the function maps criteria, takes each badge level's keys, and increments the matching badge count when `count >= badgeLevels[level]`; it is imported into `user.action.ts` and returned alongside the user's totals, using DB aggregations for question/answer stats.
- Learner-relevant: You can derive achievement badges from thresholds and return them with profile data.

### build-recommendation-system

- Locator: `[[sources/next-js/20261004/143 -  Build Recommendation System.en.srt#Build Recommendation System]]`
- Summary: Implements `getRecommendedQuestions`, which recommends questions based on a user's interaction history.
- Key claims: get the user's recent interactions (newest first, limited, `.lean()`), map to `actionId`s, fetch those questions' tags, and flatten them with `flatMap` + `[...new Set(...)]`; build a query that excludes already-interacted questions and the same author but includes the unique tags (plus optional case-insensitive title/content regex); populate tag names and author name/image, sort by upvotes then views, apply skip/limit, and return `isNext`.
- Learner-relevant: You can implement a content-based recommender over interaction data with a single Mongoose query.

### build-recommendation-system-part-2

- Locator: `[[sources/next-js/20261004/144 -  Build Recommendation System.en.srt#Build Recommendation System]]`
- Summary: Enables the homepage filter set and validates the recommender end to end.
- Key claims: uncomment the `newest`, `popular`, `unanswered`, and `recommended` filters in the home filter component; a second account posting a React-tagged question makes it appear under Recommended for the first user, while an unrelated Java question does not until the user interacts with Java; two bugs must be fixed — `action` (not `actions`) in the `$in` filter and sorting by `upvotes` (not `upvoted`).
- Learner-relevant: You can test and debug recommendation behavior with two accounts and real interactions.

### use-of-loading-file

- Locator: `[[sources/next-js/20261004/145 -  Use of Loading file.en.srt#Use of Loading file]]`
- Summary: Adds a route-level `loading.tsx` that mimics the page layout with shadcn Skeleton placeholders.
- Key claims: `loading.tsx` is a special file that Next.js renders while the route's data is in flight; the skeleton must match the page's structure (search, filters, list) for a smooth transition; static text like the heading needs no skeleton.
- Learner-relevant: You can add instant perceived-performance loading states to any route with a single file.

### use-of-error-file

- Locator: `[[sources/next-js/20261004/146 -  Use of Error File.en.srt#Use of Error File]]`
- Summary: Adds a client-side `error.tsx` page-level error boundary.
- Key claims: `error.tsx` must be a client component, receives `error` and `reset`, logs the error in a `useEffect`, and offers a "Try Again" button calling `reset`; a page-level boundary replaces the whole page, whereas the app's existing component-level boundaries keep the rest of the app usable.
- Learner-relevant: You can catch rendering errors gracefully, and you know the trade-off between page-level and component-level boundaries.

### seo-optimize-dynamic-metadata

- Locator: `[[sources/next-js/20261004/147 -  How to SEO-optimize websites in Nextjs_.en.srt#How to SEO-optimize websites in Nextjs]]`
- Summary: Implements dynamic per-page metadata using Next.js's `generateMetadata` function.
- Key claims: dynamic metadata is best for changing/generated content like question detail pages, not the fixed homepage; `generateMetadata` takes `params`, returns a promise, and can fetch the same data the page uses; the returned object sets `title`, a sliced `description`, and a Twitter `summary_large_image` card (an image URL would further improve OpenGraph sharing).
- Learner-relevant: You can make each dynamic route produce its own browser title and social-share preview.

### react-cache

- Locator: `[[sources/next-js/20261004/148 -  How to SEO-optimize websites in Nextjs.en.srt#How to SEO-optimize websites in Nextjs]]`
- Summary: Eliminates a duplicated database request by wrapping a server action in React's `cache()`.
- Key claims: using `getQuestion` in both the page and `generateMetadata` causes two uncached calls because server actions are not auto-cached like `fetch`; wrapping the function in `cache` from `react` memoizes it per request; nothing else about the function changes, but only one query runs.
- Learner-relevant: You can memoize your own server actions with `React.cache` so they aren't re-fetched within a single render.

### advanced-nextjs

- Locator: `[[sources/next-js/20261004/149 -  Advanced Next.js.en.srt#Advanced Next.js]]`
- Summary: A long workshop covering the internals and advanced features of the modern Next.js/React stack.
- Key claims: RSC run only on the server and never hydrate, while SSR renders on the server then hydrates on the client — they are different concepts that Next.js combines; React 18 adds streaming and selective hydration via `Suspense`; Next.js offers static, dynamic, and incremental (ISR via `revalidate`) rendering plus route segment config; avoid request waterfalls with parallel `Promise.all` or preload patterns; caching spans fetch cache, `React.cache`, `unstable_cache`, and `revalidateTag`/`revalidatePath`; `use server` marks server actions (turned into POST requests when called from client components); edge runtime runs close to users (fast, limited APIs, ~25s/4MB limits) while node runtime is full-featured with possible cold starts; metadata can be static, dynamic, or file-based (file-based overrides config).
- Learner-relevant: You gain a mental model for choosing between RSC/RCC, SSR modes, caching layers, server actions, and edge vs node runtimes in production.

### deploy-on-vercel

- Locator: `[[sources/next-js/20261004/150 -  Deploy on Vercel.en.srt#Deploy on Vercel]]`
- Summary: Deploys the finished Devflow app to Vercel and resolves the errors that come up.
- Key claims: add an ESLint `ignorePatterns` for `components/ui/**`; import the GitHub repo into Vercel and add all env vars including `NEXT_PUBLIC_API_BASE_URL`; the first build fails because `interaction.model`'s client-imported enum pulls Mongoose into the browser — fix by defining the enum locally in `lib/validations`; recreate GitHub and Google OAuth apps with the production homepage/callback URLs (`/api/auth/callback/github|google`); ignore ESLint/TS build errors to ship; a 403 at auth is fixed by appending `/api` to the base URL and redeploying.
- Learner-relevant: You can take a Next.js app from local to a live, authenticated production deployment and debug the usual env/OAuth/build issues.
