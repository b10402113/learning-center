---
source: nextjs-course
source_type: text
source_lines: 95937
part: 6
status: absorbed
absorbed_at: 2026-10-04
created: 2026-10-04
updated: 2026-10-04
---

# Digest — nextjs-course (part 6)

## Overview (L1)

- 111 Develop UI — builds the `Votes` component (upvote/downvote SVG icons, formatted counts, loading state) and wires it into the question details page with `upvotes`/`downvotes`/`hasUpVoted`/`hasDownVoted` props.
- 112 Create Vote Actions — adds `createVoteParams`/`updateVoteCountParams` types and schemas, then the `createVote` and `updateVoteCount` server actions using a Mongoose transaction, targeting either a question or an answer.
- 113 Has Voted Action — adds the `hasVoted` server action (and its schema/type) that reports whether the current user upvoted or downvoted a target, preferring a separate non-blocking call over folding it into `getQuestion`.
- 114 Integrate Actions on UI — uses React 19's `use` hook to resolve a `hasVoted` promise passed from a server component, wires `createVote` into `handleVote`, and adds `revalidatePath`; a cross-vote bug is left for the next lesson.
- 115 Fix Vote Issue — fixes the create-vote bug where switching between downvote and upvote left stale counts, using `existingVote.voteType` and updating both the removed and added vote counts.
- 116 Answer Votes — extends voting to answers by adding `upvotes`/`downvotes` to the `Answer` interface, rendering the `Votes` component in the answer card, and passing the answer target type/ID.
- 117 Get All Users Action — adds the `getUsers` server action with pagination, search by name/email, and sort options (newest/oldest/most popular), returning users plus an `isNext` flag.
- 118 Display all Users — builds the community page: an empty-users state, search params handling (all strings from the URL), the data renderer, and a reusable `UserCard` with avatar, name, and username.
- 119 Add to Collection Action — starts the collections/bookmarks module with the `toggleSaveQuestion` server action, its schema/params, and a `question`/`collection` route helper.
- 120 Implement Save Question — builds the client `SaveQuestion` star component that calls `toggleSaveQuestion`, shows toasts, and toggles between empty/filled star icons.
- 121 Show User Has Saved Question — adds the `hasSavedQuestion` action (using `!!collection` to coerce to boolean), resolves it with the `use` hook, and fixes the unsave issue by adding `_id` and `revalidatePath`.
- 122 Get All Saved Questions Action — defines the collection type and the `getSavedQuestions` action, which uses a MongoDB aggregation pipeline (match, lookup, unwind) to fetch/search questions through the collection model.
- 123 Develop Collections Page — reuses the homepage pattern to build the collections page, wire `getSavedQuestions`, and render saved questions through the data renderer with search.
- 124 Create Filter Component — adds the `filters.ts` constants and a reusable `CommonFilter` ShadCN Select component that updates URL query params via `formUrlQuery` and `router.push`.
- 125 Integrate Filters Everywhere — drops the common filter into the collections, community, answers (question details), tags, and tag details pages, driven by per-page filter lists.
- 126 Implement Pagination — builds the `Pagination` component (prev/next buttons, current page, URL updates) and integrates it across homepage, collections, community, answers, tags, and tag details.
- 127 Show Top Questions — adds the `getHotQuestions` action (sorted by views then upvotes, limited to five) and renders top questions in the right sidebar with links to each question.
- 128 Show Popular Tags — adds the `getTopTags` action (sorted by question count, limited to five), renders popular tags in the right sidebar, and makes tag links navigable.
- 129 Optimization — replaces sequential `await`s in the right sidebar with `Promise.all`, and demonstrates independent error handling between the two parallel requests.
- 130 Get User Info — adds the `getUser` server action (public, by user ID) returning the user plus total question and answer counts, in preparation for the profile page.

## Sections (L2)

### develop-ui

- Locator: `[[sources/next-js/20261004/111 -  Develop UI.en.srt#Develop UI]]`
- Summary: Creates the `Votes` component in `components/votes/votes.tsx` and replaces the placeholder votes text on the question details page, wiring up props, icon states, and loading.
- Key claims: props are `upvotes`, `downvotes`, `hasUpVoted`, `hasDownVoted`; icons switch between `upvote.svg`/`upvoted.svg` and `downvote.svg`/`downvoted.svg`; `formatNumber` abbreviates to `k`/`m`; `handleVote(voteType)` checks a session and shows toasts but does not yet persist votes.
- Learner-relevant: Can build a vote widget with correct type definitions (the `Question` type needed a `downvotes` field) and loading/disabled states, ready for a real server action.

### create-vote-actions

- Locator: `[[sources/next-js/20261004/112 -  Create Vote Actions.en.srt#Create Vote Actions]]`
- Summary: Defines vote validation schemas/types and implements the `createVote` and `updateVoteCount` server actions in `lib/actions/vote.action.ts` using atomic transactions.
- Key claims: a vote targets either a `question` or `answer` (via `targetId`/`targetType`) with a `voteType` of `upvote`/`downvote`; `updateVoteCountSchema` extends `createVoteSchema` with a `change` of `1` or `-1`; Mongoose `startSession`/`startTransaction`/`commitTransaction` guarantee all-or-nothing updates; deleting an existing same-type vote removes it, otherwise the vote is created or switched and counts adjusted.
- Learner-relevant: Can implement reusable, model-agnostic voting with a database transaction and the increment-based `findByIdAndUpdate`.

### has-voted-action

- Locator: `[[sources/next-js/20261004/113 -  Has Voted Action.en.srt#Has Voted Action]]`
- Summary: Adds the `hasVoted` server action and its schema/response type so the UI can know the current user's vote state.
- Key claims: `hasVotedSchema = createVoteSchema.pick({ targetId, targetType })`; separately fetching vote state is non-blocking and improves perceived performance versus folding it into `getQuestion`; response is `hasUpVoted`/`hasDownVoted` booleans, only one true at a time.
- Learner-relevant: Understands the tradeoff between one combined query and two separate calls, and can use Zod's `.pick`/TypeScript's `Pick` to derive narrower schemas and types.

### integrate-actions-on-ui

- Locator: `[[sources/next-js/20261004/114 -  Integrate Actions on UI.en.srt#Integrate Actions on UI]]`
- Summary: Integrates the new actions into the UI by resolving a `hasVoted` promise with React 19's `use` hook, wrapping the component in `Suspense`, and calling `createVote`.
- Key claims: passing an unresolved promise from a server component to a client component avoids blocking server rendering, unlike `await`; `use` can be called in loops/conditionals and pairs with Suspense/error boundaries; `revalidatePath(routes.question(id))` refreshes data without a full reload.
- Learner-relevant: Can apply the promise-props + `use` pattern and `revalidatePath`, and saw the mismatched `actionId`/`targetId` field naming surface as a runtime error.

### fix-vote-issue

- Locator: `[[sources/next-js/20261004/115 -  Fix Vote Issue.en.srt#Fix Vote Issue]]`
- Summary: Debugs and fixes the vote-switching bug in `createVote`, so switching from downvote to upvote correctly decrements the old count and increments the new one.
- Key claims: the handler must update both the existing vote and the new one; the existing document property is `voteType`, not `type`; `handleError` must be returned, not merely called; test data was reset in MongoDB Atlas to verify.
- Learner-relevant: Can trace a classic stale-count bug and understands that one user may hold only a single upvote or downvote per target.

### answer-votes

- Locator: `[[sources/next-js/20261004/116 -  Answer Votes.en.srt#Answer Votes]]`
- Summary: Extends the voting system to answers by adding counts to the `Answer` interface and rendering the `Votes` component in `answer-card.tsx`.
- Key claims: the votes action/component are type-agnostic, so switching `targetType` from `question` to `answer` is enough; `hasVoted` is fetched as a promise for answers too; upvotes/downvotes are passed down through the all-answers page.
- Learner-relevant: Sees the payoff of designing a customizable, target-agnostic feature and can vote on both questions and answers.

### get-all-users-action

- Locator: `[[sources/next-js/20261004/117 -  Get All Users Action.en.srt#Get All Users Action]]`
- Summary: Creates `lib/actions/user.action.ts` with a `getUsers` server action providing pagination, regex search, and sorting for the community page.
- Key claims: a new public `User` interface exposes only fields other users may see (`_id`, `name`, `username`, `email`, optional `bio`/`image`/`location`/`portfolio`/`reputation`); pagination uses `skip = (page - 1) * pageSize` and `limit`; sort criteria switch on `newest`/`oldest`/`most popular`; returns `users` and `isNext`.
- Learner-relevant: Can build a paginated, searchable user listing action following the established action-handler and error-handler structure.

### display-all-users

- Locator: `[[sources/next-js/20261004/118 -  Display all Users.en.srt#Display all Users]]`
- Summary: Implements the community page UI with an empty state, URL search params, the data renderer, and a `UserCard` component.
- Key claims: `empty_users` is added to states; search params are always strings from the URL so `page`/`pageSize` must be wrapped in `number`; the reusable data renderer handles success/empty/error; `UserCard` shows avatar, name, `@username`, links to `routes.profile`, and the `UserAvatar` needed a `cn` class fix and `fill` image.
- Learner-relevant: Can assemble a complete listing page from reusable pieces and understands search-param string coercion and responsive card layouts.

### add-to-collection-action

- Locator: `[[sources/next-js/20261004/119 -  Add to Collection Action.en.srt#Add to Collection Action]]`
- Summary: Begins the collections/bookmarks feature with the `toggleSaveQuestion` server action and its supporting schema, params, and types.
- Key claims: `collectionBaseSchema` requires a `questionId`; `toggleSaveQuestion` returns `{ saved: boolean }`; it fetches the question, finds an existing collection for that user+question, and either deletes (unsave) or creates (save) it; `revalidatePath` points at the question details route.
- Learner-relevant: Understands a toggle-style server action and the collection model linking a question to a user.

### implement-save-question

- Locator: `[[sources/next-js/20261004/120 -  Implement Save Question.en.srt#Implement Save Question]]`
- Summary: Builds the client `SaveQuestion` star component that calls `toggleSaveQuestion` and reflects saved state with toasts.
- Key claims: the component derives the user ID from the session and guards against double-clicks with an `isLoading` state; it toasts "saved/unsaved successfully"; it uses local `hasSaved` state to swap `star-red.svg` for `star-filled.svg`; without a persistence read, reload loses the saved state.
- Learner-relevant: Can implement an optimistic-ish toggle button with loading and error handling, and recognizes the need for a server-side state read.

### show-user-has-saved-question

- Locator: `[[sources/next-js/20261004/121 -  Show User Has Saved Question.en.srt#Show User Has Saved Question]]`
- Summary: Adds the `hasSavedQuestion` action and resolves it in `SaveQuestion` via `use`, giving persistent saved state.
- Key claims: `!!collection` coerces a found document (or null) into a boolean; `hasSavedQuestion` returns an action response whose `data.saved` is boolean; unsave was broken because `findByIdAndDelete` received `collection.id` instead of `collection._id`, and because the early return skipped `revalidatePath`.
- Learner-relevant: Can persist and display a saved state and understands the `!!` boolean-coercion idiom and the two concrete bugs fixed.

### get-all-saved-questions-action

- Locator: `[[sources/next-js/20261004/122 -  Get All Saved Questions Action.en.srt#Get All Saved Questions Action]]`
- Summary: Defines the `Collection` type and the `getSavedQuestions` action, which uses a MongoDB aggregation pipeline to query questions through the collection model with search, sort, and pagination.
- Key claims: because filtering happens on the collection model, a pipeline is required; stages `$match` (current author), `$lookup`+`$unwind` for questions, authors, and tags, then conditional `$match` for search, `$sort`, `$skip`, `$limit`, and `$project`; a pipeline is a series of transformation stages analogous to SQL.
- Learner-relevant: Gets a concrete, advanced introduction to MongoDB aggregation (`lookup`, `unwind`, `match`, `project`) and returns `isNext` from a total count.

### develop-collections-page

- Locator: `[[sources/next-js/20261004/123 -  Develop Collections Page.en.srt#Develop Collections Page]]`
- Summary: Builds the collections page by reusing the homepage structure and swapping in `getSavedQuestions`.
- Key claims: the page differs only in the server action called and the data/header text; the missing `authorize: true` caused an empty user ID and thus no results; saved questions render through the same data renderer and support search.
- Learner-relevant: Appreciates how reusable components let a whole new page be assembled with minimal code, and can debug an authorization flag.

### create-filter-component

- Locator: `[[sources/next-js/20261004/124 -  Create Filter Component.en.srt#Create Filter Component]]`
- Summary: Creates `constants/filters.ts` and a reusable `CommonFilter` component using the ShadCN Select to update URL query params.
- Key claims: one filter is shared across pages with matching values to server-action sort logic; the component reads params with `useSearchParams` (client) and updates the URL with `useRouter` from `next/navigation` plus `formUrlQuery`, keeping `scroll: false`; it maps a `filters` array into Select items; auto-imports from Radix rather than `@/components/ui/select` caused a rendering bug.
- Learner-relevant: Can build one reusable filter that drives backend sorting purely through URL search params, without backend changes.

### integrate-filters-everywhere

- Locator: `[[sources/next-js/20261004/125 -  Integrate Filters Everywhere.en.srt#Integrate Filters Everywhere]]`
- Summary: Adds the common filter to collections, community, answers, tags, and tag details pages, passing page-specific filter lists.
- Key claims: answers sorting is enabled by reading `page`/`pageSize`/`filter` search params on the question details page and passing them to `getAnswers`, with the filter defaulting to the URL value; the common filter appears on mobile while homepage-only home filters remain on desktop; sorting is verified as working.
- Learner-relevant: Can extend a reusable filter across an app and wire filter state into an existing server action.

### implement-pagination

- Locator: `[[sources/next-js/20261004/126 -  Implement Pagination.en.srt#Implement Pagination]]`
- Summary: Builds the `Pagination` client component and adds it to every listing page and to answers.
- Key claims: props are `page`, `isNext`, and optional `containerClasses`; prev shows only when `page > 1` and next only when `isNext`; navigation computes the next page number and updates the URL via `formUrlQuery`; a bug turning `page` into an empty string was fixed by always using the next page number's `toString`.
- Learner-relevant: Can implement URL-driven pagination reusing the `isNext` flag already returned by every server action, across many pages.

### show-top-questions

- Locator: `[[sources/next-js/20261004/127 -  Show Top Questions.en.srt#Show Top Questions]]`
- Summary: Adds the `getHotQuestions` server action and renders top questions in the right sidebar.
- Key claims: this action needs no params, auth, or validation, so it calls `db.connect()` and `question.find()` directly; it sorts by `views: -1` then `upvotes: -1` and limits to five; the sidebar uses the data renderer and links previously pointed to `routes.profile` before being fixed to `routes.question`.
- Learner-relevant: Can create a lightweight read-only action and populate a sidebar with live, clickable top questions.

### show-popular-tags

- Locator: `[[sources/next-js/20261004/128 -  Show Popular Tags.en.srt#Show Popular Tags]]`
- Summary: Adds the `getTopTags` action and renders popular tags in the right sidebar.
- Key claims: `getTopTags` sorts tags by `questions: -1` and limits to five; the tag type needed an optional `questions: number` field; the sidebar now has two data-renderer blocks with distinctly named destructured `success`/`data`/`error` for questions and tags.
- Learner-relevant: Can add a second live sidebar section and understands sorting by an aggregate/count field.

### optimization

- Locator: `[[sources/next-js/20261004/129 -  Optimization.en.srt#Optimization]]`
- Summary: Replaces sequential `await`s in the right sidebar with `Promise.all` to run independent requests in parallel.
- Key claims: sequential awaits on independent requests block each other and rendering, so concurrent requests should be batched with `Promise.all`; each request keeps independent success/error handling, so one failing (e.g. tags) does not break the other (questions); the error placeholder was switched from `default_error.button` to `empty.button`.
- Learner-relevant: Can identify sequential-wait waterfalls and optimize them with `Promise.all` while preserving per-request error states.

### get-user-info

- Locator: `[[sources/next-js/20261004/130 -  Get User Info.en.srt#Get User Info]]`
- Summary: Adds the public `getUser` server action to fetch a single user's details plus their question and answer counts, in preparation for the profile page.
- Key claims: because profiles are public, the action takes a `userId` param rather than relying on the session; `getUserParams`/`getUserSchema` validate the ID; it returns `user`, `totalQuestions`, and `totalAnswers` computed via `countDocuments`; `user` (a value) must be referenced as `type User` where used as a type.
- Learner-relevant: Can build a public, parameterized detail action and understands counting related documents for profile statistics.
