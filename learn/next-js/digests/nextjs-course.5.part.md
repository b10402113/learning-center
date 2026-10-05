---
source: nextjs-course
source_type: text
source_lines: 95937
part: 5
status: absorbed
absorbed_at: 2026-10-04
created: 2026-10-04
updated: 2026-10-04
---

# Digest — nextjs-course (part 5)

## Overview (L1)

- Create Question Action — Design and build the `createQuestion` server action: validate title/content/tags, open a Mongoose session/transaction, create the question tied to the current user, upsert tags (increment or insert), bulk-insert `tagQuestion` join documents, push tag IDs onto the question, then commit.
- Create and Test Question — Gate the ask-question page behind `auth()`, add a dynamic `questions/[id]` details route, wire the form's `handleCreateQuestion` to the action, and use React's `useTransition` for the pending state; verify the new question, tags, and tag-question docs in MongoDB.
- Edit Question Action — Build `editQuestion`: fetch the question, authorize the author, update changed title/content, diff added/removed tags, upsert new tags, delete removed tag-question links, and save; add a simpler `getQuestion` action plus a discussion of server actions (post requests only when called from the client).
- Edit and Test Question — Add a `questions/[id]/edit` page that fetches the question, checks authorship, and reuses the same form with `isEdit` and pre-populated defaults; test edit by changing title content and swapping a tag, and confirm changes in the database.
- Fetch and Display Questions — Add `paginatedSearchParams` type/schema, build a reusable `getQuestions` action with search/sort/filter/pagination (`recommended`, `newest`, `unanswered`, `popular`), preload all Mongoose models in `database/index.ts`, and render real questions on the homepage.
- Render UI States — Download empty/error illustrations and build a generic `dataRenderer` plus `stateSkeleton` component driven by `constants/states.tsx`, so every collection can show empty and error states; mock an error to verify.
- Create Tags Action — Create `tag.actions.ts` with a `getTags` action mirroring `getQuestions` (validation, query, sort by `popular`/`recent`/`oldest`/`name`, pagination), and test it from the tags page server-side.
- Display Tags — Read `searchParams` on the tags page, make `LocalSearch` support an `iconPosition` prop, render tags through `dataRenderer`/`TagCard`, and build the non-compact `TagCard` with icon, description (`getTechDescription`), and question count.
- Create Tags Question Action — Add `getTagQuestionsSchema`/`getTagQuestionsParams`, and a `getTagQuestions` action that finds questions whose `tags` array contains the tag ID, with optional title query and pagination.
- Create Question Details UI — Build the question-details layout: author avatar/name link, votes, title, metrics (asked/answers/views), tag cards, and reusable `Metric`/`UserAvatar` updates, using a sample question until real data is wired.
- Render Question Content — Install `next-mdx-remote` and `bright`, create an editor `Preview` component that renders user MDX with syntax-highlighted code blocks and light/dark themes, and render the question content on the details page.
- Fetch Question Details — Populate the author (`_id`, `name`, `image`) in `getQuestion`, fetch the real question by ID on the details page, redirect to 404 when missing, and tune `globals.css` markdown spacing.
- Question Views (Approach 1) — Add an `incrementViews` action/schema/type, and implement the counter with a client `View` component calling the action in `useEffect`; observe the stale-data/reload problem, double-firing in dev StrictMode, and the extra network requests.
- Question Views (Approach 2) — Call `incrementViews` directly on the server page before/after `getQuestion`, discover ordering matters for immediate display, and use `Promise.all` for parallel requests to avoid the sequential waterfall.
- Question Views (Approach 3) — Implement the ideal solution with Next.js `after()` from `next/server`, scheduling `incrementViews` after the response is sent so the page renders immediately without blocking.
- Create Answer Form — Create `answerForm.tsx` from the existing form with a `content`-only schema (min 100 chars), MDX editor via dynamic import (`ssr: false`), and a disabled-state AI "Generate AI Answer" button (UI only for now).
- Create Answer Action — Add `createAnswer` action: validate content + question ID, authorize via the session, create the answer in a transaction, increment `question.answers`, revalidate the question path, and wire the form using `useTransition`.
- Get All Answers — Add `getAnswersParams`/`getAnswersSchema`/global `Answer` type and a `getAnswers` action with question filter, pagination, sorting (`latest`/`oldest`/`popular`), `isNext`, and `totalAnswers`; log results from the details page.
- Display All Answers — Build an `AllAnswers` component and `AnswerCard` with author, timestamp, vote slot, and MDX `Preview`, render answers through `dataRenderer` with an empty-answers state, and note the still-blocking server render.
- AI Integration (Intro) — Survey the major LLMs (OpenAI, Llama, Gemini, Mistral, DeepSeek) and introduce Vercel's AI SDK as a unified API to swap models with one parameter change.
- OpenAI Integration — Sign up for OpenAI, create an API key, and store it in `.env.local` as `OPENAI_API_KEY`.
- AI Answer API Route — Install `ai` and `@ai-sdk/openai`, add `aiAnswerSchema`, and create `app/api/ai/answers/route.ts` using `generateText` with an OpenAI model, prompt, and system message; define `API.ai.getAnswer` to call it.
- Generate AI Answer — Wire the form's generate button to `API.ai.getAnswer`, format the returned markdown into the editor via `setMarkdown`/`form.setValue`, require authentication, and raise the fetch timeout from 5s to 100s.
- Make Your Answer AI-Perfect — Add optional `userAnswer` to the schema, API and route, feed the user's current draft into the prompt so AI enhances rather than replaces it, and demo how pasting real code yields a precise answer.

## Sections (L2)

### create-question-action

- Locator: `[[sources/next-js/20261004/087 -  Create Question Action.en.srt#Create Question Action]]`
- Summary: Implements the `createQuestion` server action that validates title/content/tags, creates the question owned by the logged-in user, upserts each tag and its question count, inserts the tag-question join docs, pushes the tag IDs onto the question, and commits everything in a Mongoose transaction.
- Key claims: Multi-model writes need a `mongoose.startSession()` + transaction so either all documents are created or none; tags are upserted with `findOneAndUpdate` using a case-insensitive name regex and `$inc` on the question count; the question is updated with `$push` for tag IDs only after the tags are resolved; types belong in `types/action.d.ts` and validation schemas in `validations.ts`.
- Learner-relevant: You can build an atomic, multi-collection server action that creates a question together with its tags and relationships.

### create-and-test-question

- Locator: `[[sources/next-js/20261004/088 -  Create and Test Question.en.srt#Create and Test Question]]`
- Summary: Locks the ask-question page behind `auth()`, adds a `questions/[id]` details route with a shared `RouteParams` type, connects the form to `createQuestion`, navigates to the new question, and uses `useTransition` for a non-blocking pending state; verifies the question/tag/tag-question documents in MongoDB.
- Key claims: Only authenticated users may ask questions — otherwise redirect to sign in; `params` and `searchParams` are now Promises that must be awaited, and differ (path segment vs `?key=value`); REST collection routes should be plural (`/questions/[id]`); `useTransition` gives `isPending`/`startTransition` and keeps the UI responsive.
- Learner-relevant: You can turn a validated question form into a working flow that creates real DB records and redirects to the details page.

### edit-question-action

- Locator: `[[sources/next-js/20261004/089 -  Edit Question Action.en.srt#Edit Question Action]]`
- Summary: Implements `editQuestion` (find question, authorize author, update changed fields, diff added/removed tags, upsert/delete accordingly) and a simpler `getQuestion` action, while explaining how server actions behave when called from server vs client code.
- Key claims: `EditQuestionParams extends CreateQuestionParams` plus a `questionId`, and `editQuestionSchema extends askQuestionSchema` — reuse via extension instead of redeclaring; get operations should not pass a session since they are non-mutating; only title/content changes trigger a save, while tags are handled as add/remove diffs; `populate` replaces stored tag IDs with full tag documents; server actions become POST requests only when invoked from client components — from server components they are direct function calls.
- Learner-relevant: You can safely edit a question and its tag relationships, and you understand when a server action is a POST vs a plain call.

### edit-and-test-question

- Locator: `[[sources/next-js/20261004/090 -  Edit and Test Question.en.srt#Edit and Test Question]]`
- Summary: Adds a `questions/[id]/edit` page that fetches the question, 404s when missing, redirects non-authors, and reuses the question form with `isEdit` and pre-populated defaults; tests create + edit and checks the DB changes.
- Key claims: The same form serves create and edit via an `isEdit` boolean and optional `question` prop; default values fall back to the fetched question (title/content/tags); an early `return` after the edit branch prevents the create code from also running; authorship is enforced server-side against `session.user.id`.
- Learner-relevant: You can make a single form component reusable for both creating and editing records.

### fetch-and-display-questions

- Locator: `[[sources/next-js/20261004/091 -  Fetch and Display Questions.en.srt#Fetch and Display Questions]]`
- Summary: Introduces the `paginatedSearchParams` type/schema and a `getQuestions` action that combines search, sort, filter, and pagination, preloads all models through `database/index.ts`, fixes related bugs, and replaces the dummy homepage list with real data.
- Key claims: `skip = (page - 1) * pageSize` and `limit = pageSize` drive pagination; filters (`newest`, `unanswered`, `popular`, `recommended`) are applied by switching `sortCriteria` and/or the filter query; `countDocuments` feeds the `isNext` check; `json.parse(json.stringify(...))` is needed for large server-action payloads; Mongoose models must be registered before use (serverless), so `lib/mongoose.ts` imports `@/database` which re-exports every model.
- Learner-relevant: You can write one reusable data-fetching action covering search, filtering, sorting, and pagination for any collection.

### render-ui-states

- Locator: `[[sources/next-js/20261004/092 -  Render UI States.en.srt#Render UI States]]`
- Summary: Adds empty/error illustrations, a `constants/states.tsx` file of reusable state objects, and a generic `DataRenderer` + `StateSkeleton` component that renders data or shows empty/error states everywhere.
- Key claims: `DataRenderer` takes `success`, `error`, `data`, an `empty` state, and a generic `render` function so it is agnostic to the data type; the empty/error illustrations must be swapped correctly between light and dark (`empty` uses `light/dark-illustration`, `error` uses `light/dark-error`); `StateSkeleton` is the shared image + title + message + optional button layout; reusing it avoids duplicating empty/error UI across questions, tags, collections, etc.
- Learner-relevant: You can handle empty and error states consistently with a single reusable component instead of repeating UI per page.

### create-tags-action

- Locator: `[[sources/next-js/20261004/093 -  Create Tags Action.en.srt#Create Tags Action]]`
- Summary: Creates `lib/actions/tag.actions.ts` with a `getTags` action mirroring `getQuestions`, supporting validation, search, sort (`popular`/`recent`/`oldest`/`name`), and pagination, and tests it server-side.
- Key claims: The same `paginatedSearchParams` type validates both questions and tags — only the model and queried fields change; tag filters sort by `questions` count, `createdAt`, or `name`; `totalTags` + `countDocuments` produce `isNext`; once you understand one CRUD action, the rest follow the same structure (pattern recognition across the codebase).
- Learner-relevant: You can fetch tags with the same search/filter/pagination machinery used for questions.

### display-tags

- Locator: `[[sources/next-js/20261004/094 -  Display Tags.en.srt#Display Tags]]`
- Summary: Reads `searchParams` on the tags page, makes `LocalSearch` support an `iconPosition` prop, renders tags through `DataRenderer`/`TagCard`, and builds the full (non-compact) tag card with icon and description.
- Key claims: All `searchParams` values arrive as strings and must be converted (page/pageSize to number); `LocalSearch` gained an optional `iconPosition` defaulting to left so callers don't have to pass it; `getTechDescription` (added alongside `getDevIconClassName` in `lib/utils.ts`) supplies tag descriptions, backed by a `techDescriptionMap`; the compact tag card only rendered a button/link, so the non-compact branch had to be built to show name, icon, description, and question count.
- Learner-relevant: You can build a searchable tags index page that reuses the homepage's search, renderer, and tag-card components.

### create-tags-question-action

- Locator: `[[sources/next-js/20261004/095 -  Create Tags Question Action.en.srt#Create Tags Question Action]]`
- Summary: Adds `getTagQuestionsSchema`/`getTagQuestionsParams` and a `getTagQuestions` action that returns the questions belonging to one tag, with optional title query and pagination.
- Key claims: Two valid approaches exist (query the `questions` model by tag vs query `tagQuestion` join docs), and the lesson chooses querying `questions` for simpler filtering; `GetTagQuestionsParams extends PaginatedSearchParams` but omits `filter` and adds `tagId`; the filter uses `tags: { $in: [tagId] }`, and the action first fetches the tag (404/`tagNotFound` if absent) then counts and selects only display fields (title, views, answers, votes, author, createdAt).
- Learner-relevant: You can fetch and paginate the questions associated with a specific tag for the tag-details page.

### create-question-details-ui

- Locator: `[[sources/next-js/20261004/096 -  Create Question Details UI.en.srt#Create Question Details UI]]`
- Summary: Builds the question-details page layout — author avatar/name, votes, title, metrics (asked/answers/views), and tag cards — and makes `UserAvatar` and `Metric` more reusable.
- Key claims: `flex-col-reverse` lifts the most important right-hand info above less important left info on mobile; `UserAvatar` accepts an optional `fallbackClassName`; `Metric` was generalized to render its title only when provided and to accept `titleStyles`; `formatNumber` (M/K) was added to `lib/utils.ts`; a `RouteParams`-style dynamic `[id]` page holds the question details.
- Learner-relevant: You can assemble a polished, responsive question-details layout with reused components and correctly formatted metrics.

### render-question-content

- Locator: `[[sources/next-js/20261004/097 -  Render Question Content.en.srt#Render Question Content]]`
- Summary: Installs `next-mdx-remote` and `bright`, creates an editor `Preview` component that renders user MDX at runtime with syntax-highlighted code blocks, and displays the question content and code.
- Key claims: `next-mdx-remote/rsc` renders MDX dynamically in a React Server Component (no `.mdx` file needed); `Code` from `bright` with `theme` (`github-light`/`github-dark`, selector `html.light`) provides light/dark syntax highlighting; content is formatted (strip double backslashes and blank characters) before rendering; the `pre` component override plus class names `markdown prose grid break-words` produce correct layout; without these packages/classes the code block is unreadable.
- Learner-relevant: You can render user-submitted markdown (including highlighted code blocks) safely and attractively in your app.

### fetch-question-details

- Locator: `[[sources/next-js/20261004/098 -  Fetch Question Details.en.srt#Fetch Question Details]]`
- Summary: Populate the author in `getQuestion`, fetch the real question by ID on the details page (redirecting to 404 when absent), and fix markdown spacing in `globals.css`.
- Key claims: `.populate` on `author` selecting `_id`/`name`/`image` is required so the details page can show the real poster; the details page must handle `!success || !question` with a redirect to `/404`; `globals.css` markdown needs `prose-p:my-2`, `prose-ol:my-0`, `prose-ul:my-0` to remove unwanted list/paragraph margins.
- Learner-relevant: You can replace dummy question details with real, populated database data.

### question-views-approach-1

- Locator: `[[sources/next-js/20261004/099 -  Question Views (Approach  1).en.srt#Question Views (Approach 1)]]`
- Summary: Adds an `incrementViews` action (schema/type included) and implements view counting via a client `View` component that calls it from `useEffect` on mount.
- Key claims: Views are recorded when a user opens the details page, useful later for recommendations; `question.views += 1` then `save()`; the `useEffect` approach yields stale data (needs a reload to see the new count), fires twice in development under StrictMode, and adds two POST requests (~400ms each) on top of the page GET; `revalidatePath` fixes the visible staleness but not the double-firing.
- Learner-relevant: You understand the tradeoffs of a naive client-side view counter and why it is not optimal.

### question-views-approach-2

- Locator: `[[sources/next-js/20261004/100 -  Question Views (Approach  2).en.srt#Question Views (Approach 2)]]`
- Summary: Moves the increment call onto the server page itself, shows that ordering the increment before `getQuestion` makes the new count appear immediately, then replaces the sequential calls with `Promise.all` to avoid a waterfall.
- Key claims: Calling `incrementViews` before fetching the question makes the view update visible without a reload; doing it after means it is only seen on the next visit; sequential calls create a waterfall that hurts LCP/FCP; `Promise.all` runs independent requests in parallel and one result can be skipped with `_`; parallel calls cannot guarantee ordering (a race condition) and still block rendering until both finish.
- Learner-relevant: You can reason about request ordering, waterfalls, and parallel data fetching in server components.

### question-views-approach-3

- Locator: `[[sources/next-js/20261004/101 -  Question Views (Approach  3).en.srt#Question Views (Approach 3)]]`
- Summary: Uses Next.js's `after()` API to schedule the view increment after the response is sent, giving the fastest render without blocking the UI.
- Key claims: `after()` (from `next/server`) runs a callback after the response/pre-render finishes, usable in server components, `generateMetadata`, server actions, route handlers, and middleware; it cannot modify the response, only run post-response work such as analytics, logging, or this view update; with this approach the counter may not update instantly (like YouTube), but the page renders sooner — the deliberate tradeoff for performance.
- Learner-relevant: You can implement non-blocking post-response side effects and choose the view-count strategy that best fits your UX priorities.

### create-answer-form

- Locator: `[[sources/next-js/20261004/102 -  Create Answer Form.en.srt#Create Answer Form]]`
- Summary: Creates `answerForm.tsx` (derived from the existing form) with a content-only answer schema, the MDX editor loaded client-side via dynamic import, a validation message, and a placeholder "Generate AI Answer" button.
- Key claims: `answerSchema` validates a single `content` field with a minimum of 100 characters; the MDX editor must be imported with `next/dynamic` and `ssr: false` because it is client-only; the form holds `isSubmitting` and `isAISubmitting` states now, and the submit button swaps to a spinning "posting…" state; the AI button is UI-only until the next lessons.
- Learner-relevant: You can build a minimal answer form with a markdown editor and placeholder AI generation UI.

### create-answer-action

- Locator: `[[sources/next-js/20261004/103 -  Create Answer Action.en.srt#Create Answer Action]]`
- Summary: Implements the `createAnswer` server action (validated content + question ID, transaction, answer creation, question answer-count increment, revalidation) and wires it into the form using `useTransition`.
- Key claims: The user is never passed from the client — the action handler with `authorize: true` returns the session user ID; answer creation uses a Mongoose session/transaction and throws if the question is missing; the answer's `question` and `author` references plus the `questions.answers` count must be updated consistently; `revalidatePath(routes.question(questionId))` refreshes the details page; `useTransition` replaces the manual submitting state.
- Learner-relevant: You can submit an answer to a question, persist it, and reflect the new count immediately.

### get-all-answers

- Locator: `[[sources/next-js/20261004/104 -  4F9DD9FD1CB3456CA037048523F19EBD.en.srt#Get All Answers]]`
- Summary: Adds `getAnswersParams`/`getAnswersSchema` and a global `Answer` type, then builds the `getAnswers` action that returns a question's answers with pagination, sorting (`latest`/`oldest`/`popular`), `isNext`, and `totalAnswers`.
- Key claims: `GetAnswersParams extends PaginatedSearchParams` plus `questionId`, and `getAnswersSchema` extends the paginated schema similarly; answers are filtered by `question: questionId` and the author is populated (`_id`, `name`, `image`); pagination uses `skip = (page - 1) * pageSize` and `isNext` compares `totalAnswers > skip + answers.length`; the response is `json.parse(json.stringify(answers))`; alternative result variables are renamed (`answersLoaded`, `answersResult`, `answersError`) to avoid collisions with the question fetch.
- Learner-relevant: You can fetch a paginated, sorted list of a question's answers from the details page.

### display-all-answers

- Locator: `[[sources/next-js/20261004/105 -  Display All Answers.en.srt#Display All Answers]]`
- Summary: Creates `AllAnswers` and `AnswerCard` components, renders answers through `DataRenderer` with a new empty-answers state, and shows author, timestamp, vote slot, and markdown content.
- Key claims: `AllAnswers` props extend `ActionResponse` with `Answer[]` and `totalAnswers`; the empty state (no button, since the answer form sits right below) comes from `constants/states.tsx`; `AnswerCard` is an HTML5 `article` with a hash anchor span, `UserAvatar`, a profile link (`routes.profile`), `getTimestamp`, and the MDX `Preview`; rendering answers server-side still blocks the page and enlarges first-contentful-paint, with Next.js streaming noted as the future optimization.
- Learner-relevant: You can display a question's answers with empty-state handling, author info, and rendered markdown.

### ai-integration-intro

- Locator: `[[sources/next-js/20261004/106 -  AI Integration (Intro).en.srt#AI Integration (Intro)]]`
- Summary: Surveys major LLMs (OpenAI, Meta Llama, Google Gemini, Mistral, DeepSeek) and introduces Vercel's AI SDK as the unified way to integrate and switch between them.
- Key claims: Don't add AI just for hype — decide whether it genuinely helps, then choose a model; different use cases may need different models; writing a separate integration per model causes redundant code and conditionals; Vercel's AI SDK provides one unified API so you can change the model by editing a single parameter, and it integrates cleanly with Next.js.
- Learner-relevant: You can make an informed model choice and understand why a unified SDK simplifies AI features.

### openai-integration

- Locator: `[[sources/next-js/20261004/107 -  OpenAI Integration.en.srt#OpenAI Integration]]`
- Summary: Walks through signing up for OpenAI, creating an API key in the dashboard, and storing it in the project as `OPENAI_API_KEY`.
- Key claims: You may use any model/provider, but this course uses OpenAI as the simplest to integrate; create a project-scoped secret key in the OpenAI dashboard; paste the key into `.env.local` as `OPENAI_API_KEY`.
- Learner-relevant: You can authenticate an app against the OpenAI API with a securely stored key.

### ai-answer-api-route

- Locator: `[[sources/next-js/20261004/108 -  AI Answer API Route.en.srt#AI Answer API Route]]`
- Summary: Installs the Vercel AI SDK, adds an `aiAnswerSchema`, builds `app/api/ai/answers/route.ts` with `generateText`, and adds `API.ai.getAnswer` to the API layer.
- Key claims: Install `ai` and `@ai-sdk/openai`; validate the request body with zod (`question` 5–130 chars, `content` min 100) via `safeParse` and throw a validation error on failure; `generateText({ model: openai("gpt-4-turbo"), prompt, system })` produces the markdown answer, where the system message instructs markdown formatting and short language identifiers; return `NextResponse.json({ success: true, data: text }, { status: 200 })`; a 500 from a missing OpenTelemetry dependency is fixed by reinstalling packages/`node_modules`, after which invalid payloads correctly return 400.
- Learner-relevant: You can expose an AI generation endpoint that validates input and returns markdown using the Vercel AI SDK.

### generate-ai-answer

- Locator: `[[sources/next-js/20261004/109 -  Generate AI Answer.en.srt#Generate AI Answer]]`
- Summary: Wires the answer form's generate button to `API.ai.getAnswer`, injects the returned markdown into the editor and react-hook-form, restricts the feature to authenticated users, and raises the fetch timeout.
- Key claims: The details page passes `question.title`/`question.content` into the form; the `generateAIAnswer` handler requires `session.status === "authenticated"` (to avoid runaway cost) and toggles `isAISubmitting`; success formats the data (strip `<br>`, trim) and calls `editorRef.current.setMarkdown` plus `form.setValue`/`form.trigger` for validation; the shared fetch timeout in `handlers/fetch.ts` must increase from 5,000ms to 100,000ms because AI responses are slow; a version-4+ MDX editor is required to avoid an editor bug.
- Learner-relevant: You can generate an AI answer, place it in the editor for review, and post it — with auth and timeout safeguards.

### make-your-answer-ai-perfect

- Locator: `[[sources/next-js/20261004/110 -  Make Your Answer AI-Perfect.en.srt#Make Your Answer AI-Perfect]]`
- Summary: Adds an optional `userAnswer` to the schema/API/route and feeds the user's draft into the prompt so the AI enhances and corrects the human answer rather than replacing it.
- Key claims: `userAnswer` is an optional string on `aiAnswerSchema`, `API.ai.getAnswer`, and the route; the prompt now includes the user's answer and instructs the model to prioritize it if correct, or improve/correct it if incomplete, always returning concise markdown; the form reads the draft with `editorRef.current.getMarkdown()` before generating; this prevents the platform from filling with AI slop and lets the AI structure a genuinely human-provided answer (demonstrated by pasting the data-renderer code for a precise explanation).
- Learner-relevant: You can build a "human writes, AI polishes" answer helper that produces reliable, context-aware responses.
