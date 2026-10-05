---
source: EBOOK
source_type: pdf
source_lines: 8292
part: 3
status: absorbed
absorbed_at: 2026-10-04
created: 2026-10-04
updated: 2026-10-04
---

# Digest — EBOOK (part 3)

## Overview (L1)

- Client Vs. Server — Explains client-side vs server-side rendering in Next.js, introduces component-level server rendering via the app directory, distinguishes Client Components from Server Components, and shows how `"use client"` marks the client/server boundary.
- Routing — Explains Next.js's file-based App Router: folders define routes, `page.js` files define the UI, `layout.js` provides shared UI, plus nested, dynamic, and grouped routes; Parallel and Intercepting routes are teased for the advanced chapter.

## Sections (L2)

### ch6-client-server-definitions

- Locator: `[[sources/next-js/20261004/EBOOK.pdf#Client Vs. Server]]`
- Summary: Defines the client (the user's device, which sends requests and displays the interactive interface) and the server (a continuously running, powerfully configured machine where application code lives and computations happen). Explains that before Next.js 13, server-side rendering was limited to individual route pages, causing prop drilling and duplicated API calls.
- Key claims: pre-13 SSR was route-page-only; the app directory introduced component-level server-side rendering so a single component (e.g. Navbar.jsx) can be rendered on server or client.
- Learner-relevant: establishes the vocabulary and motivation for component-level rendering decisions, anchoring why the app directory exists.

### ch6-component-types

- Locator: `[[sources/next-js/20261004/EBOOK.pdf#Client Vs. Server]]`
- Summary: Distinguishes Client Components (run/render on the user's device) from Server Components (run/render on the server/infra), and shows how rendering a component on the server removes its JavaScript from the browser, reducing bundle size and speeding initial load. Lists SSR benefits and a decision table for what to render where.
- Key claims: server rendering gives smaller JS bundle, improved SEO, faster initial page load, and efficient server resource use; use a Client Component when the component needs interactivity, event handlers, state/lifecycle, or browser-only APIs; use a Server Component for data fetching, backend access, secrets, large dependencies, and static content.
- Learner-relevant: gives the rule "does the component require user interactivity? yes → client, no → server" as a practical teaching anchor.

### ch6-use-client-boundary

- Locator: `[[sources/next-js/20261004/EBOOK.pdf#Client Vs. Server]]`
- Summary: Explains that in the app directory every component is a Server Component by default, and `"use client"` at the top of a file opts it into a Client Component. Uses console-log experiments to show clients see only client logs while the terminal sees server logs, and that Next.js still pre-renders client components on the server for UX and SEO.
- Key claims: Next.js default is static rendering that pre-renders server and safely pre-renderable client components; `"use client"` acts as a dividing line — modules imported into a client file, including child server components, become part of the client bundle; do not include server components inside client components.
- Learner-relevant: the boundary rule is a common real-world pitfall; this section supports a "when does my server component leak into the client?" teaching moment.

### ch6-hands-on-and-tasks

- Locator: `[[sources/next-js/20261004/EBOOK.pdf#Client Vs. Server]]`
- Summary: Walkthrough creates a `client-server` app, adds a console log to `app/page.js`, then builds `components/ExampleClient.jsx` (`"use client"`) and `components/ExampleServer.jsx`, importing them into the page and observing logs in terminal vs browser. Reviews tasks and self-check questions.
- Key claims: server-component logs appear only in the terminal; client-component logs appear in both terminal and browser because of pre-rendering; nesting a server component under a client component pulls it into the client module.
- Learner-relevant: reproducible experiment for learners to see the boundary firsthand; tasks reinforce component types, SSR benefits, and app-directory features.

### ch7-file-based-routing

- Locator: `[[sources/next-js/20261004/EBOOK.pdf#Routing]]`
- Summary: Contrasts React.js routing via `react-router-dom` v6 (nested `<Route>` configs, external package, growing complexity) with Next.js's built-in file-based router: folders define routes and files define the UI for that segment. Shows the same routes require only folders plus a `page.js`.
- Key claims: Next.js routing works out of the box with no external router package; folder name = route name; `page.js`/`page.jsx` is the special UI file per segment; use Kebab Case for route names.
- Learner-relevant: motivates the App Router convention "folders are routes, files are UI" as the foundation for all later routing lessons.

### ch7-navbar-and-layout

- Locator: `[[sources/next-js/20261004/EBOOK.pdf#Routing]]`
- Summary: Builds a `Navbar.jsx` using `next/link` `<Link href=...>` plus `navbar.module.css`, then shows two ways to display it on all routes. Importing it into each page (the "wrong method") is contrasted with importing it once into `app/layout.js` (the "right method").
- Key claims: importing Navbar into the parent `layout.js` renders it across all route pages consistently; `RootLayout({ children })` wraps `<html>`/`<body>` with `<Navbar />` before `{children}`.
- Learner-relevant: introduces layouts as shared UI wrappers, an anchor for nested layouts and route groups.

### ch7-simple-and-nested-routes

- Locator: `[[sources/next-js/20261004/EBOOK.pdf#Routing]]`
- Summary: Creates simple `/about` and `/contact` routes by adding folders with `page.js`, verifying navigation through the Navbar and Fast Refresh (changes appear without a page reload). Then creates nested routes by nesting folders, e.g. `app/projects/list/page.js` for `/projects/list`, linked from Home.
- Key claims: each folder segment maps to a URL segment; nesting folders produces nested routes; Fast Refresh updates the browser immediately on save.
- Learner-relevant: core mechanics of creating and linking static routes, reinforcing the folder-to-URL mapping.

### ch7-dynamic-routes

- Locator: `[[sources/next-js/20261004/EBOOK.pdf#Routing]]`
- Summary: Introduces dynamic routes for data-driven URLs: wrap the folder name in square brackets, e.g. `app/projects/[slug]/page.js`. Uses a projects list (`jobit`, `carrent`, `hipnode`) linking to `/projects/<name>`, then reads the segment via the `params` prop (`params.slug`) to display the actual project.
- Key claims: `[folder-name]` marks a variable route segment, avoiding one folder per item; `params` exposes the passed value and the key matches the folder name (e.g. `params.id` for `[id]`).
- Learner-relevant: teaches the dynamic-segment convention and `params` access, a prerequisite for detail pages and API-driven routes.

### ch7-route-groups

- Locator: `[[sources/next-js/20261004/EBOOK.pdf#Routing]]`
- Summary: Explains Route Groups for logical organization without affecting URLs: enclosing a folder name in parentheses like `(auth)` or `(dashboard)` excludes it from the path. Shows moving `about`, `contact`, and `projects` into `(dashboard)` and adding `sign-in`/`sign-up` under `(auth)`, with all existing URLs still working.
- Key claims: parentheses folders organize code but do not appear in the URL; groups let you keep the app folder shallow while preserving routes like `/sign-in` instead of `/auth/sign-in`.
- Learner-relevant: teaches separating file organization from URL structure, useful for auth/dashboard gating and layouts.

### ch7-parallel-intercepting-and-tasks

- Locator: `[[sources/next-js/20261004/EBOOK.pdf#Routing]]`
- Summary: Teases two client-side routing features to be covered in the Advanced Routing chapter. Parallel Routes display one or more pages simultaneously or conditionally within the same layout (e.g. admin vs non-admin dashboard). Intercepting Routes show a new route while preserving the current page context (e.g. a product preview modal with URL change). Ends with tasks for an e-commerce routing structure.
- Key claims: parallel routes render multiple/conditional pages in one layout on the same route; intercepting routes display a route in a modal over the current page while updating the URL; API routes are mentioned as a further topic.
- Learner-relevant: previews advanced routing concepts and sets an e-commerce routing exercise as applied practice.
