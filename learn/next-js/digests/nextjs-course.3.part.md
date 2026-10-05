---
source: nextjs-course
source_type: text
source_lines: 95937
part: 3
status: absorbed
absorbed_at: 2026-10-04
created: 2026-10-04
updated: 2026-10-04
---

# Digest — nextjs-course (part 3)

## Overview (L1)

- 030 What is Authentication — Defines authentication (verifying identity) versus authorization (what an authenticated user may do), motivates why apps protect sensitive data and differentiate user actions, and previews session-based, token/JWT, OAuth, and basic username/password auth with their trade-offs.
- 031 HTTP State Management Mechanisms — Explains how sessions are persisted across requests: cookies sent with every request, local storage for larger client data, session storage cleared when the browser closes, and session tokens sent as bearer tokens.
- 032 Create Auth Routes — Creates `/sign-in` and `/sign-up` pages and reorganizes the app into `(auth)` and `(root)` route groups so each group can have its own layout; shows that route groups do not appear in the URL.
- 033 Create Auth Layout & Social Auth Form — Builds a shared auth layout (background image, card, logo, tagline) that wraps both auth pages, and extracts a reusable `SocialAuthForm` with GitHub/Google buttons whose repeated Tailwind classes are extracted to a variable.
- 034 Setup NextAuth with GitHub Provider — Installs `next-auth@beta`, generates `AUTH_SECRET`, creates `auth.ts`, the catch-all route handler `app/api/auth/[...nextauth]/route.ts`, and `middleware.ts`, then registers a GitHub OAuth app and adds its client ID/secret.
- 035 Implement Github SignIn — Walks the OAuth flow diagram (button → NextAuth → GitHub authorize → auth code → access token → session cookie → redirect), implements client-side `signIn` with toasts, wraps the app in `SessionProvider`, reads the session server-side, and adds server logout via `signOut`.
- 036 Implement Google SignIn — Repeats the OAuth provider setup for Google Cloud (OAuth consent screen, credentials, callback URI), adds the Google provider and env vars, and confirms the already-dual-purpose `handleSignIn` signs into Google and yields the same session shape.
- 037 Creating Auth Form — Builds a single reusable `AuthForm` driven by Zod schemas and React Hook Form, with `formType`, `schema`, `defaultValues`, and `onSubmit` props; dynamically maps fields from default values and toggles between sign-in and sign-up.
- 038 Mobile Navigation — Adds a `MobileNavigation` using a ShadCN sheet, a reusable `NavLinks` component reading `usePathname` for active state, and creates the community/collections/jobs/tags/profile(ask-question) routes, handling the dynamic profile route.
- 039 Active Lesson LeftSidebar — First interactive "active lesson"; presents the left sidebar as a self-directed task with links to the live site and Figma designs, resources, and a hint, emphasizing attempting before the solution.
- 040 Implement LeftSidebar — Implements the desktop left sidebar in the root layout using the shared `NavLinks`, responsive collapsing of labels, sticky/full-height styling, and login/sign-up buttons for signed-out users.
- 041 Implement RightSidebar — Builds the right sidebar (top questions + popular tags), a reusable `TagCard`, and a `getDevIconClassName` utility that maps user tag names to Devicon icons with a default fallback.
- 042 What's State Management — Frames state management as a "why first" decision: inspect the Figma app flow, identify which data is repeated across pages, and question whether a library is needed before reaching for Redux/Zustand/Context.
- 043 Different types of State Management — Distinguishes local state (single component, e.g. `useState` counter) from global state (shared across components, centralized store or Context), and surveys Redux, Zustand, Context, Recoil, MobX without declaring a universal winner.
- 044 State Management in Next.js — Explains that library/hook-based state management forces client components and cannot run on the server, then teases an underrated server-friendly alternative.
- 045 URL State Management — Introduces URL state management via the Amazon search-bar example: state reflected in the URL is shareable and reproducible, and gives SEO benefits by giving each filter/sort/page variation its own URL.
- 046 Different URL Parameters in Next.js — Breaks a URL into scheme, domain, port, path, query/search params, and hash, and shows how to read params and searchParams via page props versus `useParams`/`useSearchParams` hooks (with the client-component caveat).
- 047 How to do URL State Management — Shows three ways to write URL state — `Link` href, `useRouter().push`, and programmatic `URLSearchParams`/`window.location` — and introduces `formURLQuery`/`removeKeysFromQuery` helpers using the `query-string` library.
- 048 Home Layout — Replaces the placeholder homepage with its structure: "All Questions" heading, an Ask Question button, a local search bar, home filters, and a list of question cards.
- 049 Local Search Bar — Builds a reusable `LocalSearchBar` and implements URL state management end-to-end with `query-string`, debounced input via `setTimeout`/`clearTimeout`, and filtering dummy questions by the URL query.
- 050 Filter in Next.js — Implements `HomeFilter` with selectable filter buttons that read/write a `filter` search param, toggle off on re-click, and combine with the search query to filter questions.
- 051 Question Card — Builds a reusable `QuestionCard` (and a `Metric` component) backed by global TypeScript types in `types/global.d.ts`, wiring tags, author/timestamp, and votes/answers/views, plus a `getTimestamp` utility.
- 052 Question Form — Creates the ask-question page and a `QuestionForm` client component with Zod `askQuestionSchema` validation (title, content, 1–3 tags), React Hook Form wiring, and the title/content/tags fields with a submit button.
- 053 Question Editor — Integrates the open-source MDX editor: client-only dynamic import (`ssr:false`), dark-mode CSS and CodeMirror theme, and a toolbar/plugin set (headings, lists, links, tables, code blocks) with syntax highlighting in both themes.
- 054 Multiple Tags Input — Implements the custom multi-tag input: Enter adds a tag to the form array, duplicate/length errors, tag chips rendered with the reusable `TagCard` (removable), remove logic, preventing accidental form submit, and confirming all form data is captured.

## Sections (L2)

### what-is-authentication

- Locator: `[[sources/next-js/20261004/030 -  What is Authentication.en.srt#What is Authentication]]`
- Summary: A conceptual introduction distinguishing authentication from authorization and surveying auth flavors before implementation.
- Key claims: Authentication verifies that a user is who they claim to be; authorization determines what an authenticated user may do. Auth exists to protect sensitive information and to let different user types perform different actions (create/delete their posts). Common types include session-based (cookie), token/JWT, OAuth via third parties (Google, GitHub), and basic username/password.
- Learner-relevant: Gives the vocabulary and mental model needed before wiring NextAuth, so the learner can reason about what each route and provider is actually doing.

### http-state-management-mechanisms

- Locator: `[[sources/next-js/20261004/031 -  HTTP State Management Mechanisms.en.srt#HTTP State Management Mechanisms]]`
- Summary: Compares the client-side storage mechanisms used to persist sessions and state across requests.
- Key claims: Cookies are stored by the browser and sent with every request to the same server, enabling identification and state across requests. Local storage is a larger key/value store suited to caching and even offline/PWA data but is not very secure. Session storage is like local storage but cleared when the browser closes, so sensitive data does not persist. A session token (often a JWT/bearer token) uniquely identifies a session and is typically stored client-side and sent per request.
- Learner-relevant: Explains where auth state actually lives, which is required to understand cookie-based sessions and why NextAuth stores its session in a cookie.

### create-auth-routes

- Locator: `[[sources/next-js/20261004/032 -  Create Auth Routes.en.srt#Create Auth Routes]]`
- Summary: Creates the two auth pages and restructures `app/` into route groups so auth pages can use a layout without the navbar.
- Key claims: Route groups are folders wrapped in parentheses and are not reflected in the URL (`/sign-in`, not `/auth/sign-in`). Each route group can have its own `layout.tsx`, so `(auth)` omits the navbar while `(root)` includes it. The shared top-level layout keeps app-wide concerns such as the theme provider for both groups.
- Learner-relevant: The learner can organize routes into layouts — the foundation for giving auth pages a distinctly different chrome from the rest of the app.

### create-auth-layout-social-auth-form

- Locator: `[[sources/next-js/20261004/033 -  Create Auth Layout & Social Auth Form.en.srt#Create Auth Layout & Social Auth Form]]`
- Summary: Builds the shared auth layout and a reusable social auth form, deduplicating styles and components.
- Key claims: The shared `(auth)/layout.tsx` holds the background image (added as a Tailwind `backgroundImage` so `bg-auth-light`/`bg-auth-dark` work per theme), the centered card, logo, and tagline, leaving each page to supply only its form. `SocialAuthForm` renders GitHub and Google buttons using an `invert-colors` utility filter for icon contrast in both themes. Repeated long Tailwind class strings are extracted to a `buttonClass` constant, and custom radii (`rounded-2`) are registered in the Tailwind config.
- Learner-relevant: The learner can build one layout that serves both sign-in and sign-up without duplicating UI, and knows how to add custom theme utilities.

### setup-nextauth-with-github-provider

- Locator: `[[sources/next-js/20261004/034 -  Setup NextAuth with GitHub Provider.en.srt#Setup NextAuth with GitHub Provider]]`
- Summary: Installs and scaffolds NextAuth/Auth.js and registers the GitHub OAuth application.
- Key claims: Install `next-auth@beta` and generate a secret into `.env.local`. Create root `auth.ts` exporting `handlers`, `signIn`, `signOut`, and `auth`, plus the catch-all route `app/api/auth/[...nextauth]/route.ts` (square brackets = dynamic segment, `...` = catch-all) and `middleware.ts` exporting `auth`. The catch-all lets Auth.js route all sign-in/sign-out/auth endpoints. Register a GitHub OAuth app (not a GitHub App) with homepage `http://localhost:3000` and callback `/api/auth/callback/github`, then store client ID/secret as env vars.
- Learner-relevant: Produces the base auth scaffolding and a ready GitHub provider, leaving only the sign-in wiring for the next lesson.

### implement-github-signin

- Locator: `[[sources/next-js/20261004/035 -  Implement Github SignIn.en.srt#Implement Github SignIn]]`
- Summary: Traces the OAuth flow and implements GitHub sign-in, session access, and sign-out.
- Key claims: The flow is: user clicks "Sign in with GitHub" → NextAuth redirect → GitHub authorize → redirect back with auth code → code exchanged for access token → NextAuth creates a session, sets a cookie, redirects to the callback URL. Client components call `signIn(provider, { callbackURL, redirect:false })` from `next-auth/react`; server code calls `signIn` from `@/auth` via a form action. Wrap the layout in `SessionProvider`, read the session server-side with `await auth()`, and log out server-side with `await signOut({ redirectTo })`. A `constants/routes.ts` map centralizes route strings to avoid typos.
- Learner-relevant: The learner can authenticate with GitHub, read the logged-in session anywhere, display user data, and log out — the first working social login.

### implement-google-signin

- Locator: `[[sources/next-js/20261004/036 -  Implement Google SignIn.en.srt#Implement Google SignIn]]`
- Summary: Adds Google as a second OAuth provider with almost identical steps to GitHub.
- Key claims: Create a Google Cloud project, configure the OAuth consent screen as External, and create a Web application OAuth client with origin `http://localhost:3000` and redirect URI `/api/auth/callback/google`. Store `AUTH_GOOGLE_ID`/`AUTH_GOOGLE_SECRET` and add Google to the provider list; the existing `handleSignIn(provider)` and Google button already work. The returned session shape (name, email, image, expiry) matches GitHub.
- Learner-relevant: Shows that adding providers is largely config, so the learner can extend auth with Facebook/etc., and confirms provider-agnostic session handling.

### creating-auth-form

- Locator: `[[sources/next-js/20261004/037 -  Creating Auth Form.en.srt#Creating Auth Form]]`
- Summary: Builds one reusable, schema-driven `AuthForm` used by both sign-in and sign-up.
- Key claims: A generic `AuthForm<T extends FieldValues>` accepts `formType`, `schema`, `defaultValues`, and `onSubmit`, using React Hook Form with `zodResolver`. Fields are rendered by mapping `Object.keys(defaultValues)`, and labels/placeholders/input types adapt (e.g. password types, capitalized labels). Zod schemas live in `lib/validations.ts`: the sign-in schema validates email and password, while sign-up adds name/username and stronger password rules (upper, lower, number, special). The form toggles its button text and switches between "/sign-in" and "/sign-up" links.
- Learner-relevant: The learner can build one form component that services multiple flows via props and validation schemas, a reusable pattern used again for the question form.

### mobile-navigation

- Locator: `[[sources/next-js/20261004/038 -  Mobile Navigation.en.srt#Mobile Navigation]]`
- Summary: Adds mobile navigation and the reusable nav-links component, and creates the app's content routes.
- Key claims: `MobileNavigation` uses a ShadCN `sheet` that opens from the left; wrapping links in `sheet-close` closes the sheet on navigation. `NavLinks` is reusable across mobile and desktop, reads `usePathname()` to mark the active link, and conditionally wraps links in `sheet-close` only when `isMobileNav`. Sidebar links are centralized in `constants/index.ts`, and all target routes (community, collections, jobs, tags, profile/[id], ask-question) are created, with profile handled as a dynamic route.
- Learner-relevant: The learner gets working mobile navigation, a reusable active-aware nav component, and the full set of application routes.

### active-lesson-leftsidebar

- Locator: `[[sources/next-js/20261004/039 -  Active Lesson LeftSidebar.en.srt#Active Lesson LeftSidebar]]`
- Summary: An interactive, self-directed task lesson asking the learner to build the left sidebar on their own.
- Key claims: Active lessons give a task, live site/Figma references, resources (Next.js `Link`, `usePathname`, auth helpers, flexbox, media queries), and a hint. Login/sign-up buttons should appear only when the user is not logged in. The lesson argues that attempting before seeing the solution builds stronger connections even if the task is not fully completed.
- Learner-relevant: Encourages independent problem decomposition and UI thinking before the guided solution in the following lesson.

### implement-leftsidebar

- Locator: `[[sources/next-js/20261004/040 -  Implement LeftSidebar.en.srt#Implement LeftSidebar]]`
- Summary: Implements the desktop left sidebar, reusing the mobile `NavLinks`.
- Key claims: The sidebar lives in the root layout as a sibling of the content section; `NavLinks` is reused because links are identical across devices. The sidebar is sticky, full-height, custom-scroll, and hides on small screens. Labels collapse to icons as width shrinks, and login/sign-up buttons (from the mobile nav, un-wrapped from `sheet-close`) appear on the desktop sidebar for signed-out users.
- Learner-relevant: The learner can build a responsive, reusable desktop sidebar and understands three-breakpoint behavior (mobile/tablet/desktop).

### implement-rightsidebar

- Locator: `[[sources/next-js/20261004/041 -  Implement RightSidebar.en.srt#Implement RightSidebar]]`
- Summary: Builds the right sidebar with top questions and popular tags, plus a reusable tag card and dynamic icon mapping.
- Key claims: The right sidebar shows "Top Questions" links and "Popular Tags" cards, hidden on extra-large breakpoints where space is scarce. A reusable `TagCard` (built on ShadCN `badge`) accepts `id`, `name`, `questions`, `showCount`, and `compact`. `getDevIconClassName` normalizes a user-entered tech name and maps it through a `techMap` to a Devicon class, falling back to a default icon; the Devicon stylesheet is added in the layout `<head>`.
- Learner-relevant: The learner can build a data-driven sidebar and dynamically turn arbitrary tag text into brand icons, a pattern reused in the tags input.

### whats-state-management

- Locator: `[[sources/next-js/20261004/042 -  What’s State Management.en.srt#What’s State Management]]`
- Summary: A "why first" lesson on deciding whether state management is needed at all.
- Key claims: Developers tend to choose flashy libraries before checking the need; the first question should be whether any state management library is required. Read the app flow (Figma): what data exists, what repeats across pages, and what is used app-wide. The user session is used on every page, so storing it globally avoids repeated database calls; sidebars are already extracted as components rather than state. Only after understanding the why should the simplest implementation be chosen.
- Learner-relevant: The learner learns to question tooling choices and to identify genuinely shared/app-wide data before adding state infrastructure.

### different-types-of-state-management

- Locator: `[[sources/next-js/20261004/043 -  Different types of State Management.en.srt#Different types of State Management]]`
- Summary: Defines local versus global state management and surveys common libraries.
- Key claims: State management is keeping track of and updating data so the app reacts accordingly (like a game tracking score, level, items). Local state is confined to one component and needs prop passing to reach others; a single `useState` counter already counts as local state management. Global state is shared across components via a centralized store/context (e.g. Context API with a provider) and avoids prop drilling. Redux, Zustand, Context, Recoil, and MobX each suit different problems; there is no single best library.
- Learner-relevant: The learner can classify a state problem as local or global and choose an appropriate tool rather than defaulting to one library.

### state-management-in-nextjs

- Locator: `[[sources/next-js/20261004/044 -  State Management in Next.js.en.srt#State Management in Next.js]]`
- Summary: Explains why hook-based global state libraries conflict with Next.js server rendering and teases the alternative.
- Key claims: Redux, Context, Zustand, etc. are hook-based and force the page/component into a client component, defeating Next.js's server-side strengths and reducing to plain React. These hooks cannot run server-side because they rely on client component lifecycles (`useState`, `useEffect`, `useContext`). An old-school, fast, simple approach used by large companies is the solution, though underrated.
- Learner-relevant: The learner understands the server/client constraint that motivates URL-based state management in the following lessons.

### url-state-management

- Locator: `[[sources/next-js/20261004/045 -  URL State Management.en.srt#URL State Management]]`
- Summary: Introduces managing state through the URL, using Amazon and Supabase as real-world examples.
- Key claims: On Amazon, typing a search updates the URL, so sharing the link reproduces the same results — this is URL state management. Client-managed React state cannot travel through a shared link unless it is placed in the URL. Many sites (Amazon, Supabase filters) use the URL for filters/sorting. Benefits: shareable, reproducible state and better SEO, since each filter/sort/pagination variation gets its own URL.
- Learner-relevant: The learner sees why URL state is shareable and SEO-friendly and can recognize it in real products.

### different-url-parameters-in-nextjs

- Locator: `[[sources/next-js/20261004/046 -  Different URL Parameters in Next.js.en.srt#Different URL Parameters in Next.js]]`
- Summary: Explains URL anatomy and how to read URL values in Next.js, contrasting server props with client hooks.
- Key claims: A URL consists of scheme (protocol), domain, optional port, path, query/search params (appended after `?`, separated by `&`), and hash. In a page, `params` holds dynamic segments and `searchParams` holds query values; both can be read from page props. `useParams`/`useSearchParams` from `next/navigation` give the same values but turn the component into a client component, so use them only in forms/already-client components. Rule of thumb: pass params/searchParams via props to nearby children; use hooks for distant components.
- Learner-relevant: The learner can extract `id`, `query`, `filter`, etc. from a URL correctly and choose server props or hooks appropriately.

### how-to-do-url-state-management

- Locator: `[[sources/next-js/20261004/047 -  How to do URL State Management.en.srt#How to do URL State Management]]`
- Summary: Shows how to write URL state and introduces helper utilities for updating and removing query params.
- Key claims: Update the URL whenever a user types or selects something. Three approaches: a Next.js `Link` with the query in `href` (e.g. `/jobs?type=software-developer`); `router.push` from `useRouter` in a client page; or programmatic `URLSearchParams` plus navigation. A helper `updateSearchParams(type, value)` constructs params, sets the value, appends to the current path, and must also handle deletion when a filter is removed. The `query-string` library simplifies this, e.g. a `formURLQuery` helper that returns an updated URL to push.
- Learner-relevant: The learner can implement and later reuse URL-state helpers for search and filters, which the Devflow pages build on directly.

### home-layout

- Locator: `[[sources/next-js/20261004/048 -  Home Layout.en.srt#Home Layout]]`
- Summary: Lays out the homepage structure and its component slots.
- Key claims: The homepage shows an "All Questions" heading with an Ask Question button linking to `routes.askQuestion`, a local search bar, home filters, and a list of question cards. The section uses `flex-col-reverse` on mobile and `flex-row` on small+ screens. The filters offer newest, recommended, frequent, and unanswered; the search bar and filters are placeholders to be converted into components.
- Learner-relevant: The learner gets the homepage skeleton and a clear plan of which components to implement top to bottom.

### local-search-bar

- Locator: `[[sources/next-js/20261004/049 -  Local Search Bar.en.srt#Local Search Bar]]`
- Summary: Builds a reusable `LocalSearchBar` and implements URL state management with debouncing.
- Key claims: The search bar is reused across homepage, global search, users, tags, and jobs, so it takes props (`route`, `imgSrc`, `placeholder`, `otherClasses`). It reads `useSearchParams()` for the current query and keeps a `useState` mirroring it. A `useEffect` on the search query builds a new URL via `formURLQuery` (preserving existing params) and `router.push(newURL, { scroll:false })`; an `else` branch calls `removeKeysFromQuery` when the input is cleared. Input is debounced with `setTimeout` inside the effect plus a `clearTimeout` cleanup so requests only fire after typing stops (recommended ~300ms). `query-string` (de)serializes and URL-encodes safely. Filtering dummy questions uses `query?.toLowerCase()` with a default empty string so `includes` behaves when the query is absent.
- Learner-relevant: The learner implements the course's central URL-state pattern end to end, including performance via debouncing, and can reproduce shareable search across mobile/desktop.

### filter-in-nextjs

- Locator: `[[sources/next-js/20261004/050 -  Filter in Next.js.en.srt#Filter in Next.js]]`
- Summary: Implements `HomeFilter` buttons that drive a `filter` URL param and combine with search.
- Key claims: Filters are defined as an array of `{name, value}` objects and rendered as buttons. The active filter is read from `searchParams.get('filter')` into state; the code deliberately avoids a `useEffect` and instead handles clicks (`handleTypeClick`) since selection is a click event. Selecting writes `formURLQuery({ key:'filter', value })`; re-clicking the active filter clears it via `removeKeysFromQuery`. A shared `let newURL` is assigned in each branch, then `router.push(newURL, { scroll:false })` runs once. Filtering is combined with the search query (matching `question.tags[0].name` for the dummy data).
- Learner-relevant: The learner can build click-driven URL filters, toggle them off, and compose filter and search predicates together.

### question-card

- Locator: `[[sources/next-js/20261004/051 -  Question Card.en.srt#Question Card]]`
- Summary: Builds a reusable `QuestionCard` and `Metric` component with global TypeScript types.
- Key claims: The `question` type is the app's root data type, so it is declared globally in `types/global.d.ts` (`interface Question`, `Tag`, `Author`) and reused without imports; the ESLint `no-undef` rule is disabled for `*.ts`/`*.tsx` to silence false positives. The card renders a human-readable timestamp via a `getTimestamp(date)` utility, clickable title (to `routes.question(id)`), reusable `TagCard`s for tags, and a `Metric` component for author/votes/answers/views. `Metric` accepts `imgUrl`, `alt`, `value`, `title`, `href`, `textStyles`, `imageStyles`, and `isAuthor`; it wraps content in a `Link` when `href` is present, otherwise a `div`. External avatar images require `images.remotePatterns` config in `next.config`.
- Learner-relevant: The learner can build a data-rich, reusable card with shared types, clickable tags/author, and responsive layout, and knows how to allow remote images.

### question-form

- Locator: `[[sources/next-js/20261004/052 -  Question Form.en.srt#Question Form]]`
- Summary: Creates the ask-question page and a client-side `QuestionForm` with Zod validation.
- Key claims: The server-rendered ask-question page imports a client `QuestionForm`. `askQuestionSchema` in `lib/validations.ts` validates `title` (5–100 chars), `content` (min 1, no max), and `tags` (each 1–30 chars, 1–3 tags). `useForm` passes `resolver: zodResolver(askQuestionSchema)` and default values; `form.handleSubmit(handleCreateQuestion)` runs on submit. Three form fields are built (title input, content editor slot, tags input with description); adding `use client` fixes a misleading `useForm` error, illustrating that third-party hook libraries can also require the client directive.
- Learner-relevant: The learner can build a validated multi-field form following the same pattern as the auth form and knows the Zod/React Hook Form workflow.

### question-editor

- Locator: `[[sources/next-js/20261004/053 -  Question Editor.en.srt#Question Editor]]`
- Summary: Integrates the open-source MDX editor with Markdown toolbar, plugins, code blocks, and dark-mode theming.
- Key claims: Install `@mdxeditor/editor`; because it does not support SSR, import it via `next/dynamic` with `ssr:false`. The editor receives `markdown=value` and `onChange=field.onChange` from React Hook Form, using an `editorRef` of type `MDXEditorMethods`. The `prose` class requires the Tailwind typography plugin (`@tailwindcss/typography`) registered in `tailwind.config.ts`. Plugins added: headings, lists, link/link-dialog, quote, thematic-break, markdown-shortcut, table, image, code-block (with CodeMirror languages like JS/TS/TSX/JSX/CSS/HTML/JSON), and a diff-source plugin. Toolbar uses `toolbarPlugin` + `conditionalContents` (code-block language selector when the cursor is in a code block, plus a fallback of undo/redo, bold/italic/underline, lists, link, image, table, thematic break, code block). Dark mode uses a custom `dark-editor.css` and `cm6-theme-basic-dark` via `useTheme`, applied through a CodeMirror `theme` extension.
- Learner-relevant: The learner can embed a feature-rich Markdown/rich-text editor (with syntax-highlighted code blocks) that respects light/dark theme, reusable later for answers.

### multiple-tags-input

- Locator: `[[sources/next-js/20261004/054 -  Multiple Tags Input.en.srt#Multiple Tags Input]]`
- Summary: Implements a custom multi-tag input with validation, removable chips, and submit prevention.
- Key claims: Pressing Enter (`handleInputKeyDown`) adds the trimmed input to the `tags` form array after `preventDefault`; errors cover tags >15 chars, duplicates ("tag already exists"), and too many tags. The field must declare its type via `useForm<z.infer<typeof askQuestionSchema>>` so tags is inferred as `string[]` (otherwise `field.value.map` fails). Tags render through the reusable `TagCard` with new props `remove`, `isButton`, and `handleRemove`; clicking a chip must `preventDefault` so the button does not submit the form. `handleTagRemove` filters out the clicked tag and re-sets the value, erroring if none remain. Mobile horizontal overflow was traced to the editor and fixed by setting its `display` to grid; console logging the submit handler confirms title, formatted Markdown content, and a 3-tag array are captured.
- Learner-relevant: The learner can implement a reusable multi-value chip input with inline errors and deletion, and understands the pitfalls of buttons inside forms and TypeScript inference in React Hook Form.
