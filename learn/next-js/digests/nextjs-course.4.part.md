---
source: nextjs-course
source_type: text
source_lines: 95937
part: 4
status: absorbed
absorbed_at: 2026-10-04
created: 2026-10-04
updated: 2026-10-04
---

# Digest — nextjs-course (part 4)

## Overview (L1)

- 055 Thinking in Backend — Approach the backend by defining requirements first: main goal, user actions, and data requirements. Map core entities, their relationships, and plan for scalability before writing code. Next.js covers client, backend, and database concerns in one place.
- 056 Setup MongoDB and Mongoose — Compare SQL (Postgres) vs non-SQL (MongoDB) trade-offs and pick MongoDB for flexible documents and easy scaling. Create a free MongoDB Atlas cluster, database user, connection string, network access rule, and `.env.local` entry. Model data with Mongoose schemas; use Prisma/Drizzle/native driver alternatives.
- 057 Architect Database Structure — Contrast arrays of references (one query, risk of huge documents) with multiple/join collections (smaller docs, flexible, more complex queries). Adopt the scalable multi-collection design: users, accounts, questions, answers, and more instead of embedding arrays.
- 058 Create User Model — Define the first Mongoose model in `database/user.model.ts`: a `userSchema` (name, username, email, bio, image, location, portfolio, reputation, timestamps), an `IUser` TypeScript interface, and a cached model via `models.user`. Reuse the existing model instead of re-creating it.
- 059 Create Account Model — Explain why an account differs from a user: one user has many provider accounts. Build `account.model.ts` with `userId` ref, name, image, optional password, provider, providerAccountId, and `IAccount`. Each account represents one login method (Google, GitHub, credentials).
- 060 Create Question Model — Create the central question model from a reusable `template.model.ts`. Fields: title, content, tags (array of objectId refs), views, upvotes, downvotes, answer count, and author (user ref). Track counts on the question instead of embedding answers.
- 061 Create Answer Model — Create `answer.model.ts` from the template. Each answer has an author, a question ref (one-to-many, singular not array), content, upvotes, downvotes, timestamps. Type errors caught by the `IAnswer` interface reveal the difference between TypeScript types and Mongoose schema types.
- 062 Create Tag Models — Build two models: `tag` (name, question count — for fast listing) and `tag-question` (join collection tying a tag to a question). Splitting avoids querying huge tag documents and makes tag listing and tag-to-question lookup each efficient.
- 063 Create Vote Model — Store votes in their own collection: author (user ref), post ID (question or answer ref), a `type` enum (question|answer), and `voteType` enum (upvote|downvote). Keeps the question/answer docs small instead of hosting giant arrays of voting users.
- 064 Create Collection Model — Add a `collection` model that bookmarks/favorites questions. Keep it minimal: an author (user ref) and a question ref. Enables starring questions into a personal collection.
- 065 Create Interaction Model — Build `interaction.model.ts` (user, action, actionId, actionType enum question|answer) to power a recommendation algorithm tracking upvotes, downvotes, views, asks, and more. Delete the template model; the full database architecture (account, answer, collection, interaction, question, tag, tag-question, user, vote) is now complete.
- 066 The Art of Failing Gracefully — Why error handling and logging matter: better UX via helpful messages, data integrity, reduced downtime, and easier debugging/security/performance insight. For larger apps, centralized error handling and logging replace scattered per-component try/catch for consistency, maintainability, and scalability.
- 067 Implement Error Handling — Define error classes in `lib/http-errors.ts` (`RequestError` base extended by `ValidationError`, `NotFoundError`, `ForbiddenError`, `UnauthorizedError`) with a `formatFieldErrors` static. Build `lib/handlers/error.ts` that formats API (via `NextResponse`) vs server-action responses and maps `RequestError`, Zod errors, and generic errors. Call `handleError` from a try/catch; test statuses 400/404/500.
- 068 Implement Logging — Compare console.log, Winston, Bunyan, and Pino; choose Pino for fast structured JSON plus `pino-pretty` for readable local logs. Configure levels, edge/production detection, transports, and formatters in `lib/logger.ts`; add `serverExternalPackages` in `next.config.ts` so Pino bundles correctly.
- 069 Introduction to Route Handlers — Create a mock tickets array and expose `/api/tickets` via exported async `GET`/`POST` and dynamic `[id]` handlers (`GET`, `PUT`, `DELETE`). Read JSON bodies, `params` (async), and `searchParams` via `request.nextUrl.searchParams` for a `/search` route. Demonstrates full CRUD in a serverless backend.
- 070 Create & Read User Routes — Add global `ActionResponse` types (`success`, optional `data`, `error`, `status`) and `NextResponse`-typed API responses. Create `app/api/users/route.ts` with `GET` (list all) and `POST` (create) connecting to real MongoDB. Add Zod `userSchema` and validate with `safeParse`; check duplicate email/username; return 201.
- 071 Dynamic User Routes — Build `app/api/users/[id]/route.ts` with `GET` (`findById`), `DELETE` (`findByIdAndDelete`), and `PUT` (`findByIdAndUpdate` with `new: true`). Parse async params, throw `NotFoundError`, validate partial updates with `userSchema.partial().parse`, and centralize errors through `handleError`.
- 072 Users by Mail — Add `app/api/users/email/route.ts` as a `POST` that reads `email` from the body, validates with `userSchema.partial().safeParse`, finds via `findOne({ email })`, and returns the user. Used by auth to detect an existing email and its associated accounts.
- 073 Create & Read Account Routes — Create `app/api/accounts/route.ts` by adapting the user routes: `GET` lists accounts, `POST` validates with a new Zod `accountSchema` and rejects duplicate provider/providerAccountId via `ForbiddenError`, then creates the account. Shows the pattern of adding a file, a frontend schema, and adapting the diff.
- 074 Dynamic Account Routes — Mirror the dynamic user routes in `app/api/accounts/[id]/route.ts`: `GET` by id, `DELETE`, and `PUT` validated with `accountSchema.partial()`. Mostly boilerplate copying with account-specific tweaks.
- 075 Account by Provider — Add `app/api/accounts/provider/route.ts` as a `POST` that takes a `providerAccountId`, validates with `accountSchema`, finds via `findOne`, and returns the account. Completes the API routes needed for user authentication.
- 076 API Fetch Handler — Build `lib/handlers/fetch.ts`: a `fetchHandler<T>` wrapping native `fetch` with merged default/custom headers, an `AbortController` timeout, `isError` guard, Pino logging, and `handleError`. Then create `lib/api.ts` exposing `API.users` and `API.accounts` (getAll, getById, getByEmail/getByProvider, create, update, delete) using `NEXT_PUBLIC_API_BASE_URL`. Call `API.users.getAll()` in one line.
- 077 Flow of Application — Walk the authentication flow for email/password (NextAuth → check user in MongoDB → create user/account or reuse → session → UI) and social login (NextAuth → OAuth provider → token → create/reuse account & user → session). Show the advanced case of one user linking both credentials and OAuth accounts, explaining why user and account are separate models.
- 078 The Edge Case — Next.js middleware only supports the edge runtime, but Mongoose has no edge support (no Node `net` API). Server actions run through middleware, so auth cannot use them. Solution: implement authentication via API routes (already built) while using server actions for everything else — best of both worlds.
- 079 Accounts for oAuth — Create `app/api/auth/sign-in-with-oauth/route.ts` that opens a Mongoose session/transaction, validates with a new `signInWithOAuthSchema`, finds or creates the user, updates name/image when an existing user signs in via another provider, creates the account if missing, and commits the transaction (atomic: all or nothing). Add the `API.auth.oAuthSignIn` helper and NextAuth `signIn`/`jwt`/`session` callbacks.
- 080 Debugging oAuth — Debug the OAuth flow using the centralized error/logging system: a route-string typo, a misspelled `userId` causing "account validation failed", and a missing `return NextResponse.json` causing "no response returned from the route handler". After fixes, verify the user/account documents in MongoDB Atlas and confirm that signing in with the same email via Google creates a second account for the same user.
- 081 Server Action Demo — Standalone demo (new Next app) of server actions: a `use server` actions file, a mock JSON file system (`readFile`/`writeFile`), `server-only`, and CRUD via forms. Show calling server actions from client components, server-rendered forms via the React 19 `action` prop, `revalidatePath`, and server-side `redirect`, including working with JavaScript disabled.
- 082 Flow of Application^ — Repeat of the app's authentication flow diagram: credentials flow, social login flow, and the cross-provider case where one user ends up with multiple accounts (credentials + OAuth). Reinforces why a single user can own many accounts but each account belongs to one user.
- 083 Server Action Handler — Create `lib/handlers/action.ts` (`use server`) with a generic `action<T>({ params, schema?, authorize? })` that validates params against a Zod schema, optionally authorizes via NextAuth `auth()`, connects to the database, handles Zod/generic errors, and returns `{ params, session }`. Centralizes auth checks, validation, and error handling for all server actions.
- 084 Sign Up implementation — Implement `signUpWithCredentials` in `lib/actions/auth.action.ts`: validate with `signupSchema` via the action handler, start a Mongoose transaction, reject duplicate email/username, hash the password with `bcryptjs`, create the user and a credentials account, commit, then sign in. Add the NextAuth `Credentials` provider with an `authorize` callback comparing hashed passwords; wire the form and toast/router feedback.
- 085 Sign In implementation — Add `signInWithCredentials` (using a `Pick<AuthCredentials, ...>` type) that validates with `signInSchema`, finds the user by email, finds the credentials account, compares passwords with `bcrypt.compare`, and calls `signIn` with `redirect: false`. Fix inverted not-found checks and wire it to the sign-in page.
- 086 Auth Checks and Logout — Use `await auth()` in the left sidebar, mobile navigation, and navbar to read the session. Conditionally render a logout form (`signOut` via the form `action` prop) versus login/signup buttons, pass `userId` into nav links, and build a `UserAvatar` component (ShadCN avatar, Next Image, remote image patterns for Google/GitHub, initials fallback). Completes the authentication segment.

## Sections (L2)

### thinking-in-backend

- Locator: `[[sources/next-js/20261004/055 -  Thinking in Backend.en.srt#Thinking in Backend]]`
- Summary: How to approach backend development by defining requirements and architecture before coding.
- Key claims: Identify the app's main goal (content, e-commerce, social), the user actions, and the data requirements; map core entities and their relationships; build for incremental scalability from the start.
- Learner-relevant: You can plan a backend's data flow and entities before touching code, and understand how Next.js spans client, server, and database.

### setup-mongodb-and-mongoose

- Locator: `[[sources/next-js/20261004/056 -  Setup MongoDB and Mongoose.en.srt#Setup MongoDB and Mongoose]]`
- Summary: Choosing MongoDB over SQL and setting up MongoDB Atlas with a Mongoose connection.
- Key claims: SQL fits complex relational data; MongoDB fits flexible documents and easy scaling; performance depends more on query quality than DB choice. Create a free Atlas cluster, DB user, connection string, `MONGODB_URI` in `.env.local`, and allow access from anywhere. Mongoose adds schemas/validation over the native driver.
- Learner-relevant: You can stand up a cloud MongoDB database and connect to it from a Next.js app.

### architect-database-structure

- Locator: `[[sources/next-js/20261004/057 -  Architect Database Structure.en.srt#Architect Database Structure]]`
- Summary: Comparing arrays of references with multiple/join collections and choosing the scalable design.
- Key claims: Arrays of references simplify retrieval but risk large documents and extra queries; separate collections keep documents small, allow independent scaling, and need more complex queries. The reworked model separates users, accounts, questions, answers, and comments instead of embedding arrays.
- Learner-relevant: You can reason about schema trade-offs and recognize that multiple collections are better for complex relationships.

### create-user-model

- Locator: `[[sources/next-js/20261004/058 -  Create User Model.en.srt#Create User Model]]`
- Summary: Creating the first Mongoose model, the user, with schema, interface, and cached model.
- Key claims: Define a `Schema` with typed required fields plus `timestamps`; declare an `IUser` interface for TypeScript safety; use `models.user || model('User', ...)` so the model is created once and reused.
- Learner-relevant: You can create a reusable, type-safe Mongoose model with proper file/folder structure.

### create-account-model

- Locator: `[[sources/next-js/20261004/059 -  Create Account Model.en.srt#Create Account Model]]`
- Summary: Creating the account model that represents one provider login per user.
- Key claims: A user has many accounts (one per provider); account fields include a `userId` ref, name, image, optional password, required provider, and required providerAccountId. Provider is required because an account identifies one auth method.
- Learner-relevant: You can model multiple login methods per user and understand why account is distinct from user.

### create-question-model

- Locator: `[[sources/next-js/20261004/060 -  Create Question Model.en.srt#Create Question Model]]`
- Summary: Creating the central question model from a reusable template.
- Key claims: Fields are title, content, tags (array of objectId refs), views, upvotes, downvotes, answer count, and required author ref. Counters are stored on the question instead of embedding answers.
- Learner-relevant: You can build the core entity of a Q&A app and reuse a model template for other models.

### create-answer-model

- Locator: `[[sources/next-js/20261004/061 -  Create Answer Model.en.srt#Create Answer Model]]`
- Summary: Creating the answer model as a separate collection linked to its question.
- Key claims: An answer has author, a singular question ref (one-to-many, not an array), content, upvotes, downvotes, and timestamps. The `IAnswer` interface catches confusion between TypeScript types and Mongoose schema types.
- Learner-relevant: You can model one-to-many relations with a single ref and rely on interfaces to catch schema mistakes.

### create-tag-models

- Locator: `[[sources/next-js/20261004/062 -  Create Tag Models.en.srt#Create Tag Models]]`
- Summary: Splitting tags into a tag model and a tag-question join model.
- Key claims: The tag model stores name (unique) and a question count for fast listing; the tag-question model ties a tag to a question via two objectId refs. This avoids querying large documents when you only need tag names/counts.
- Learner-relevant: You can optimize querying by separating a summary collection from a join collection.

### create-vote-model

- Locator: `[[sources/next-js/20261004/063 -  Create Vote Model.en.srt#Create Vote Model]]`
- Summary: Creating a dedicated vote collection instead of storing voter arrays.
- Key claims: A vote has an author (user ref), a post id (question or answer ref), a type enum (question|answer), and a voteType enum (upvote|downvote). Counts live on the question/answer; per-user votes live in this collection.
- Learner-relevant: You can track who voted on what without bloating the voted document.

### create-collection-model

- Locator: `[[sources/next-js/20261004/064 -  Create Collection Model.en.srt#Create Collection Model]]`
- Summary: Creating a collection model for bookmarking/favoriting questions.
- Key claims: The model just needs an author (user ref) and a question ref, both required. It backs the star/bookmark feature.
- Learner-relevant: You can implement user-curated bookmarks with a simple join-style model.

### create-interaction-model

- Locator: `[[sources/next-js/20261004/065 -  Create Interaction Model.en.srt#Create Interaction Model]]`
- Summary: Creating the interaction model that feeds the recommendation algorithm.
- Key claims: Fields are user, action, actionId, and actionType (question|answer). It records upvotes, downvotes, views, asks, and similar signals. With this, the full database architecture is complete and the template model is deleted.
- Learner-relevant: You can design a tracking collection that powers personalized recommendations.

### the-art-of-failing-gracefully

- Locator: `[[sources/next-js/20261004/066 -  The Art of Failing Gracefully.en.srt#The Art of Failing Gracefully]]`
- Summary: Why robust error handling and logging matter and why centralization wins in larger apps.
- Key claims: Good error handling improves UX, protects data integrity, reduces downtime, and speeds debugging; logging adds state insight, performance visibility, and security signals. Centralized handling gives consistency, maintainability, and scalability.
- Learner-relevant: You can justify and plan a centralized error/logging layer before implementing it.

### implement-error-handling

- Locator: `[[sources/next-js/20261004/067 -  Implement Error Handling.en.srt#Implement Error Handling]]`
- Summary: Building custom error classes and a centralized `handleError` for API and server actions.
- Key claims: `RequestError` extends `Error`, with `ValidationError`, `NotFoundError`, `ForbiddenError`, and `UnauthorizedError` subclasses carrying status codes and field errors. `handleError` branches on `RequestError`, Zod errors, and generic errors, returning API-shaped `NextResponse` or server-action objects. Usage is one try/catch calling `handleError(error)`.
- Learner-relevant: You can standardize error responses and surface useful statuses/messages across the app.

### implement-logging

- Locator: `[[sources/next-js/20261004/068 -  Implement Logging.en.srt#Implement Logging]]`
- Summary: Adding Pino structured logging with pretty output for development.
- Key claims: Pino is fast and JSON-based; `pino-pretty` gives readable local logs. Configure level from env, detect edge/production to disable the transport there, add formatters and ISO timestamps. Add `serverExternalPackages: ['pino', 'pino-pretty']` in `next.config.ts`.
- Learner-relevant: You can add production-grade logging to database connection and error handling code.

### introduction-to-route-handlers

- Locator: `[[sources/next-js/20261004/069 -  Introduction to Route Handlers^.en.srt#Introduction to Route Handlers]]`
- Summary: Building a mock CRUD API with Next.js route handlers.
- Key claims: Export async functions named after HTTP verbs in `route.ts`; dynamic `[id]` folders supply async `params`; `request.nextUrl.searchParams` gives query params for a search route. `GET`/`POST`/`PUT`/`DELETE` cover create/read/update/delete without initializing a server.
- Learner-relevant: You can expose REST endpoints using file-based routing and distinguish params from searchParams.

### create-read-user-routes

- Locator: `[[sources/next-js/20261004/070 -  Create & Read User Routes.en.srt#Create & Read User Routes]]`
- Summary: Defining global response types and creating/reading users through real API routes.
- Key claims: `ActionResponse`, `SuccessResponse`, `ErrorResponse`, and `APIResponse` standardize every response. `app/api/users/route.ts` `GET` uses `User.find()`; `POST` validates with Zod `userSchema.safeParse`, checks duplicate email/username, creates the user, and returns 201.
- Learner-relevant: You can create a validated, consistent user API backed by MongoDB.

### dynamic-user-routes

- Locator: `[[sources/next-js/20261004/071 -  Dynamic User Routes.en.srt#Dynamic User Routes]]`
- Summary: Implementing get/update/delete by user id.
- Key claims: `app/api/users/[id]/route.ts` uses `findById`, `findByIdAndDelete`, and `findByIdAndUpdate(..., { new: true })`. `PUT` validates partial data with `userSchema.partial().parse`; missing users throw `NotFoundError`. Status codes: 200/201/204/400/404/500.
- Learner-relevant: You can build type-safe dynamic routes with centralized error handling.

### users-by-mail

- Locator: `[[sources/next-js/20261004/072 -  Users by Mail.en.srt#Users by Mail]]`
- Summary: A POST route to fetch a user by email.
- Key claims: Email is sent in the JSON body (so it is POST, not GET). Validate with `userSchema.partial().safeParse`, query `User.findOne({ email })`, throw `NotFoundError` when absent. Used by auth to find a user and their accounts.
- Learner-relevant: You can look users up by non-id fields and reuse the route-handler pattern.

### create-read-account-routes

- Locator: `[[sources/next-js/20261004/073 -  Create & Read Account Routes.en.srt#Create & Read Account Routes]]`
- Summary: Creating and listing accounts with a new account Zod schema.
- Key claims: `app/api/accounts/route.ts` `GET` lists accounts; `POST` validates with `accountSchema`, rejects duplicates by provider/providerAccountId via `ForbiddenError`, and creates the account. Adding routes means adding a file plus a front-end validation schema.
- Learner-relevant: You can replicate the user-route pattern for a second resource with minimal changes.

### dynamic-account-routes

- Locator: `[[sources/next-js/20261004/074 -  Dynamic Account Routes.en.srt#Dynamic Account Routes]]`
- Summary: Get, delete, and update an account by id.
- Key claims: `app/api/accounts/[id]/route.ts` mirrors the user routes using `findById`, `findByIdAndDelete`, and `findByIdAndUpdate`. Updates validate with `accountSchema.partial().safeParse` to keep private fields safe.
- Learner-relevant: You can apply the dynamic-route boilerplate to any model.

### account-by-provider

- Locator: `[[sources/next-js/20261004/075 -  Account by Provider.en.srt#Account by Provider]]`
- Summary: A POST route to fetch an account by provider account id.
- Key claims: `app/api/accounts/provider/route.ts` reads `providerAccountId` from the body, validates with `accountSchema`, and queries `Account.findOne`. This is the last API route needed for authentication.
- Learner-relevant: You can resolve OAuth logins by looking up the provider-linked account.

### api-fetch-handler

- Locator: `[[sources/next-js/20261004/076 -  API Fetch Handler.en.srt#API Fetch Handler]]`
- Summary: A centralized fetch wrapper plus an `API` object abstracting all endpoints.
- Key claims: `fetchHandler<T>` merges default/custom headers, enforces a 5000ms timeout with `AbortController`, guards errors with `isError`, logs, and returns normalized `ActionResponse`. `lib/api.ts` exposes `API.users` and `API.accounts` methods built on `NEXT_PUBLIC_API_BASE_URL`. Calls become one-liners like `API.users.getAll()`.
- Learner-relevant: You can standardize data fetching, error handling, and timeouts, and call endpoints through a clean controller.

### flow-of-application

- Locator: `[[sources/next-js/20261004/077 -  Flow of Application.en.srt#Flow of Application]]`
- Summary: The authentication flows for credentials and OAuth, including multi-provider linking.
- Key claims: Credentials flow checks MongoDB for the user, creates user/account if new, else reuses and generates a session. OAuth flow adds a redirect to the provider and creates an account/user from the token. The advanced case links a credentials login and an OAuth login to the same user by creating a second account.
- Learner-relevant: You can trace exactly where users and accounts are created or reused during sign-in.

### the-edge-case

- Locator: `[[sources/next-js/20261004/078 -  The Edge Case.en.srt#The Edge Case]]`
- Summary: Mongoose does not support the edge runtime, so auth must use API routes, not server actions.
- Key claims: Middleware runs only on the edge runtime; Mongoose needs the Node `net` API, so it cannot connect there. Server actions execute through middleware and hit the same limitation. The workaround is to implement authentication via API routes while keeping server actions for the rest.
- Learner-relevant: You understand a real-world Next.js/MongoDB constraint and the architectural workaround.

### accounts-for-oauth

- Locator: `[[sources/next-js/20261004/079 -  Accounts for oAuth.en.srt#Accounts for oAuth]]`
- Summary: Creating and linking OAuth accounts with an atomic transaction.
- Key claims: `app/api/auth/sign-in-with-oauth/route.ts` starts a Mongoose session/transaction, validates with `signInWithOAuthSchema`, finds or creates the user, updates name/image when an existing user adds a provider, and creates the account only if missing. `commitTransaction` applies all-or-nothing; `slugify` normalizes usernames. NextAuth `signIn`/`jwt`/`session` callbacks attach the account/user id to the token.
- Learner-relevant: You can implement atomic OAuth account creation and provider-linking in MongoDB.

### debugging-oauth

- Locator: `[[sources/next-js/20261004/080 -  Debugging oAuth.en.srt#Debugging oAuth]]`
- Summary: Using error handling/logging to debug OAuth, then verifying data in MongoDB.
- Key claims: Bugs found and fixed were a route-string typo, a misspelled `userId` (account validation failed), and a missing `return NextResponse.json` (no response from handler). Verify the created user/account in Atlas; signing in with the same email via Google creates a second account for the same user while updating name/image.
- Learner-relevant: You can debug auth failures quickly by reading centralized errors and confirm persistence in the database.

### server-action-demo

- Locator: `[[sources/next-js/20261004/081 -  Server Action Demo.en.srt#Server Action Demo]]`
- Summary: A standalone demo of server actions for form submissions and mutations.
- Key claims: Files with `use server` export server actions callable from client or server components. React 19 lets a form `action` accept a function, enabling server-rendered forms with no client JS; `revalidatePath` refreshes data and `redirect` handles navigation. `server-only` prevents accidental client imports of server code.
- Learner-relevant: You can implement create/delete/update through server actions and render forms that work without JavaScript.

### flow-of-application-2

- Locator: `[[sources/next-js/20261004/082 -  Flow of Application^.en.srt#Flow of Application]]`
- Summary: Restating credentials, social, and cross-provider authentication flows before implementing credentials with server actions.
- Key claims: Credentials flow validates against MongoDB and generates a session; OAuth flow redirects to the provider and creates account/user from the token; the cross-provider case returns the existing user but adds a new account. One user can own many accounts; one account belongs to one user.
- Learner-relevant: You can explain why the user/account split supports multiple login methods per person.

### server-action-handler

- Locator: `[[sources/next-js/20261004/083 -  Server Action Handler.en.srt#Server Action Handler]]`
- Summary: A generic server-action handler centralizing validation, authorization, and DB connection.
- Key claims: `action<T>({ params, schema?, authorize? })` validates params with the provided Zod schema, optionally authorizes via NextAuth `auth()` (UnauthorizedError if no session), connects to the database, and returns `{ params, session }`. Zod errors become `ValidationError` with flattened field errors.
- Learner-relevant: You can write server actions with built-in auth/validation/DB setup, reducing repetition.

### sign-up-implementation

- Locator: `[[sources/next-js/20261004/084 -  Sign Up implementation.en.srt#Sign Up implementation]]`
- Summary: Implementing email/password sign-up with a transaction, bcrypt hashing, and a Credentials provider.
- Key claims: `signUpWithCredentials` validates via the action handler, opens a Mongoose transaction, rejects duplicate email/username, hashes the password with `bcryptjs`, creates user + credentials account, commits, then signs in. To pass a session to `model.create`, the first argument must be an array (advanced JS signature behavior). NextAuth `Credentials` provider's `authorize` verifies the password.
- Learner-relevant: You can implement a complete, atomic credentials registration flow and custom NextAuth provider.

### sign-in-implementation

- Locator: `[[sources/next-js/20261004/085 -  Sign In implementation.en.srt#Sign In implementation]]`
- Summary: Implementing email/password sign-in.
- Key claims: `signInWithCredentials` (typed with a `Pick<AuthCredentials, ...>`) validates with `signInSchema`, finds the user by email, finds the credentials account by provider/providerAccountId, compares passwords with `bcrypt.compare`, and calls `signIn` with `redirect: false`. No transaction is needed since there are no mutations.
- Learner-relevant: You can complete the credentials sign-in path and connect it to the sign-in page.

### auth-checks-and-logout

- Locator: `[[sources/next-js/20261004/086 -  Auth Checks and Logout.en.srt#Auth Checks and Logout]]`
- Summary: Showing the session, conditionally rendering buttons, and implementing logout plus a user avatar.
- Key claims: `await auth()` in sidebar/mobile/navbar yields the session; render a logout form (`signOut` via the form action prop) when a userId exists, else login/signup. Pass `userId` to nav links and build a `UserAvatar` (ShadCN avatar, Next Image with configured remote patterns, initials fallback).
- Learner-relevant: You can finalize authentication with visible session state, logout, and a profile avatar.
