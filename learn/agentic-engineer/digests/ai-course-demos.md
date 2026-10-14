---
source: ai-course-demos
source_type: codebase
source_lines: 881
language: TypeScript
file_count: 75
status: absorbed
absorbed_at: 2026-10-14
created: 2026-10-14
updated: 2026-10-14
---

# Digest — ai-course-demos

## Overview (L1)
- `001-login-btn-issue/` — Next.js 16 + TypeScript task manager (login, session cookie, dashboard task CRUD, in-memory stores) with a deliberate, TypeScript-invisible silent login bug: the auth handler registry is keyed `"authenticate"` but the login action looks up `"login"` through optional chaining, so clicking Log in does nothing, with no error and no redirect. Shared base app for lessons 2.1 (agent read/decide/act/observe loop) and 2.3 (search-and-read "where is auth handled").
- `003-mcp-server/` — Next.js 16 + Prisma Postgres (Prisma v7) app: `User`/`Post` models, a global Prisma client built on the `@prisma/adapter-pg` driver adapter, a `/api/users` GET+POST route, a server-component home page listing users and posts, plus a `db:test` connection script. Supports the MCP lesson (a real DB-backed service the agent exposes/uses).
- `004-agent-context/` — Minimal Next.js 16 app whose point is project context: an `AGENTS.md` stating conventions (money fields suffixed `Cents` as integer cents; API responses snake_case) and a small `types/order.ts` domain type. Used for the agent-context lesson (how project/type context steers generated code).

## Structure (L2)

### 001-login-btn-issue/
- Locator: `[[sources/agentic-engineer/20261014/ai-course-demos/001-login-btn-issue]]`
- Purpose: Small, readable task-manager app intentionally seeded with a silent bug so an agent must explore, hypothesize, and verify rather than read a stack trace. `overview.md` documents lessons 2.1/2.3, the required bug mechanism, and pre-recording sanity checks. `AGENTS.md`/`CLAUDE.md` carry the "This is NOT the Next.js you know" rule: read `node_modules/next/dist/docs/` before writing code because this version has breaking changes. `skills-lock.json` pins ten `JavaScript-Mastery-Pro/jsm-skills-workflow` skills (architect, audit, debug, document, honest, mvp, plan, remember, review, teach).
- Key exports: `verifyCredentials`, `getUserById`, `authHandlers`, `AuthHandler`, `AuthOutcome`, `User` (`lib/auth.ts`); `createSession`, `getSession`, `deleteSession`, `Session` (`lib/session.ts`); `getTasks`, `addTask`, `toggleTask`, `removeTask`, `Task` (`lib/tasks.ts`); `login`, `logout`, `LoginState` (`app/actions/auth-actions.ts`); `addTaskAction`, `toggleTaskAction`, `removeTaskAction`; `LoginForm`, `TaskList`; `proxy`, `config`.
- Dependencies: within-app imports use the `@/*` alias (`@/lib/...`, `@/app/actions/...`, `@/components/...`). `next`, `react`, `react-dom`, `next/navigation`, `next/headers`, `next/server`, `next/cache`, `server-only`. Tailwind v4 via `@tailwindcss/postcss`.
- Learner-relevant: the canonical subject for the agent-loop (2.1) and code-reading (2.3) lessons — a codebase small enough to read in one sitting yet realistic enough to grep.

#### The intentional bug (2.1)
- Locator: `[[sources/agentic-engineer/20261014/ai-course-demos/001-login-btn-issue/app/actions/auth-actions.ts]]`
- `login` does `const handler = authHandlers["login"]; const outcome = await handler?.(formData);` — the registry (`lib/auth.ts`) defines the key `"authenticate"`, not `"login"`. `handler` is `undefined`; optional chaining makes the call a no-op; `outcome?.success` is falsy and `outcome?.error` is `undefined`, so the form returns `{ error: undefined }` and redirects nowhere. No throw, no console error.
- Why it is silent and compiler-invisible: `authHandlers` is typed `Record<string, AuthHandler>`, so indexing any string key type-checks; there is no static check that the key exists. `overview.md` requires a full `next build` to pass with zero TypeScript errors as proof.
- Traceability: `verifyCredentials` in `lib/auth.ts` is deliberately correct in isolation, so the bug is provably in one place. `logout` uses the matching key `"logout"`, so search/compare exposes the mismatch.

#### Supporting modules
- Locator: `[[sources/agentic-engineer/20261014/ai-course-demos/001-login-btn-issue/lib/auth.ts]]`
- Registry pattern: `authHandlers: Record<string, AuthHandler>` maps `"authenticate"` (calls `verifyCredentials`, then `createSession`) and `"logout"` (calls `deleteSession`); in-memory `USERS` holds `demo@example.com` / `password123`. Grep-friendly "auth" naming is a stated requirement of lesson 2.3.
- Locator: `[[sources/agentic-engineer/20261014/ai-course-demos/001-login-btn-issue/lib/session.ts]]`
- Base64-encoded JSON session in an httpOnly `session` cookie (`SESSION_MAX_AGE` 7 days); `encode`/`decode` private helpers. Imports `server-only` and `next/headers` `cookies()`; `getSession()` is awaited.
- Locator: `[[sources/agentic-engineer/20261014/ai-course-demos/001-login-btn-issue/lib/tasks.ts]]`
- In-memory `tasksByUser` `Map`, seeded on first access with `t_seed_1`/`t_seed_2` ("Read the codebase end to end", "Find the login bug"); `getTasks`/`addTask`/`toggleTask`/`removeTask`.
- Locator: `[[sources/agentic-engineer/20261014/ai-course-demos/001-login-btn-issue/proxy.ts]]`
- Optimistic auth gate (Next.js proxy/middleware) redirecting `/dashboard` without a session cookie to `/login` and vice versa, with a `config.matcher` excluding `api`/`_next`/static assets. Note: cookie presence only — the real check is `getSession()` in pages/actions.
- Locator: `[[sources/agentic-engineer/20261014/ai-course-demos/001-login-btn-issue/components/login-form.tsx]]` — `"use client"` form using `useActionState(login, initialState)`; `disabled={pending}`, renders `state.error` when present.
- Locator: `[[sources/agentic-engineer/20261014/ai-course-demos/001-login-btn-issue/app/dashboard/page.tsx]]` — server component; `getSession()` → `redirect("/login")` if absent, else `getUserById` + `getTasks` and `<TaskList>`; hosts the `logout` form.
- Locator: `[[sources/agentic-engineer/20261014/ai-course-demos/001-login-btn-issue/app/login/page.tsx]]` / `app/page.tsx` — login page redirects to `/dashboard` when a session exists; root `/` redirects to `/login`.
- Locator: `[[sources/agentic-engineer/20261014/ai-course-demos/001-login-btn-issue/app/actions/task-actions.ts]]` — `"use server"` task mutations gated by `requireUserId()` (throws `Unauthorized`), each ending in `revalidatePath("/dashboard")`.
- Config: `package.json` (`next`/`react` 19.2.4, `eslint-config-next` 16.2.10), `tsconfig.json` (`strict`, `@/*` → `./*`), `next.config.ts` (empty), `eslint.config.mjs`, `postcss.config.mjs`, `pnpm-workspace.yaml` (ignores `sharp`/`unrs-resolver` builds).

### 003-mcp-server/
- Locator: `[[sources/agentic-engineer/20261014/ai-course-demos/003-mcp-server]]`
- Purpose: A Next.js + Prisma Postgres service an agent can back a lesson's MCP tooling with. `prompt.md` is a long (578-line) Prisma v7 bootstrap spec spelling out the exact required patterns and the deprecated patterns that break the app. Per the prompt, next-generation Prisma requires `provider = "prisma-client"`, custom `output = "../app/generated/prisma"`, import from `../app/generated/prisma/client` (with `/client`), the `@prisma/adapter-pg` adapter, `import "dotenv/config"`, no `url` in the datasource, no `engine` property, and TCP `postgres://` URLs only.
- Key exports: default `prisma` client (`lib/prisma.ts`); `GET`/`POST` handlers (`app/api/users/route.ts`); `Home` async server component (`app/page.tsx`); `testDatabase` (`scripts/test-database.ts`).
- Dependencies: `@prisma/adapter-pg` `^7.8.0`, `@prisma/client` `^7.8.0`, `prisma` `^7.8.0` (dev), `dotenv` `^17.4.2`, `tsx` `^4.23.1`, plus Next 16.2.10 / React 19.2.4. `route.ts` imports `../../../lib/prisma`; `page.tsx` and the test script import `../lib/prisma`.
- Learner-relevant: how an agent wires a real database into an app (driver adapters, global singleton, generated-client import paths) and follows a strict, version-specific prompt to avoid silently deprecated patterns.

#### Prisma schema & client
- Locator: `[[sources/agentic-engineer/20261014/ai-course-demos/003-mcp-server/prisma/schema.prisma]]`
- `generator client { provider = "prisma-client"; output = "../app/generated/prisma" }`; `datasource db { provider = "postgresql" }` (no `url`). Models: `User { id Int @id @default(autoincrement()); email String @unique; name String?; createdAt/updatedAt; posts Post[] }` and `Post { id, title, content String?, published Boolean @default(false), author User @relation(...), authorId Int, createdAt/updatedAt }` — a one-to-many `User`→`Post` relation.
- Locator: `[[sources/agentic-engineer/20261014/ai-course-demos/003-mcp-server/lib/prisma.ts]]`
- Global singleton: builds `new PrismaPg({ connectionString: process.env.DATABASE_URL! })` and `new PrismaClient({ adapter })`, cached on `globalForPrisma` outside production. This is the canonical pattern the prompt mandates.
- Locator: `[[sources/agentic-engineer/20261014/ai-course-demos/003-mcp-server/prisma.config.ts]]` — starts with `import "dotenv/config"`, `defineConfig({ schema, migrations.path, datasource: { url: process.env["DATABASE_URL"] } })`; no `engine` property.
- Locator: `[[sources/agentic-engineer/20261014/ai-course-demos/003-mcp-server/app/api/users/route.ts]]` — `GET` returns `prisma.user.findMany()`; `POST` parses JSON, `prisma.user.create({ data: { email, name } })`, returns 201; both wrap calls in try-catch returning `{ error }` at status 500.
- Locator: `[[sources/agentic-engineer/20261014/ai-course-demos/003-mcp-server/app/page.tsx]]` — async server component fetching users and posts in `Promise.all`, posts with `include: { author: { select: { id, name, email } } }`, rendering user list and post cards; references `prisma.post`.
- Locator: `[[sources/agentic-engineer/20261014/ai-course-demos/003-mcp-server/scripts/test-database.ts]]` — `import "dotenv/config"`, creates and reads a demo user, exits non-zero on failure; wired as `npm run db:test`.
- Config: `package.json` scripts `db:test` (`tsx scripts/test-database.ts`) and `db:studio` (`prisma studio`); `AGENTS.md`/`CLAUDE.md` carry the same Next.js-version warning as 001.

### 004-agent-context/
- Locator: `[[sources/agentic-engineer/20261014/ai-course-demos/004-agent-context]]`
- Purpose: A deliberately near-empty app whose value is its *context files* — the agent-context lesson's subject. `AGENTS.md` states the project's conventions: Next.js App Router + TypeScript; money fields named with a `Cents` suffix and typed as integer cents (e.g. `totalCents`), never a plain dollar amount; API responses use snake_case keys. `CLAUDE.md` is empty. `app/page.tsx` renders only "Hello world".
- Key exports: `OrderStatus` and `Order` (`types/order.ts`).
- Dependencies: none internal; `next` 16.2.11, `react`/`react-dom` 19.2.4, Tailwind v4. `tsconfig.json` mirrors 001 (`strict`, `@/*`), `pnpm-workspace.yaml` allows/ignores `sharp`/`unrs-resolver`.
- Learner-relevant: demonstrates how written project context (`AGENTS.md` conventions + a shared domain type) is what steers an agent's output — the same mechanisms a real agent reads before editing.

#### The domain type
- Locator: `[[sources/agentic-engineer/20261014/ai-course-demos/004-agent-context/types/order.ts]]`
- `export type OrderStatus = "pending" | "fulfilled" | "cancelled";` and `export interface Order { id: string; customerName: string; status: OrderStatus; }`. Note the type deliberately uses camelCase `customerName` while `AGENTS.md` says API responses are snake_case — the file is a context/type anchor, not a wire format.
