---
source: EBOOK
source_type: pdf
source_lines: 8292
part: 2
status: absorbed
absorbed_at: 2026-10-04
created: 2026-10-04
updated: 2026-10-04
---

# Digest — EBOOK (part 2)

## Overview (L1)

- How it works — Contrasts three eras of the web: vanilla HTML/CSS/JS (server sends complete files per request), the React way (minimal HTML + bundled JS, client-side rendering via the virtual DOM and React Router), and the Next.js way (server executes React components, returns fully rendered HTML, then hydrates on the client).
- Create a Next.js Application — A hands-on walkthrough: installing Node.js and VS Code, scaffolding a project with `create-next-app`, exploring the generated file/folder structure, understanding config and lock files, running the dev server, and editing `page.js`/`layout.js` to see Fast Refresh and the `children` prop.

## Sections (L2)

### how-it-works-foundations

- Locator: `[[sources/next-js/20261004/EBOOK.pdf#How it works]]`
- Summary: Frames the chapter as groundwork before writing Next.js code. Argues that understanding *why* things work prevents poor architectural decisions and interview gaps, then sets up a time-travel tour through web rendering approaches.
- Key claims: You must understand the "why" behind Next.js before the "how"; foundations guide sound application decisions, not just interviews.
- Learner-relevant: Motivates a conceptual-first teaching order — explain the rendering problem before introducing Next.js APIs.

### vanilla-html-css-js

- Locator: `[[sources/next-js/20261004/EBOOK.pdf#The vanilla — HTML, CSS, and JavaScript]]`
- Summary: Describes the traditional model: the browser (client) requests a page, the server responds with HTML, CSS, and (if needed) JavaScript. The browser parses HTML, applies CSS styles, and runs JS for interactions. Multi-page sites trigger a fresh full request/response per page.
- Key claims: Server sends complete files for each page request; each additional page means another round trip; JS is only sent when the page involves JavaScript.
- Learner-relevant: Baseline rendering model the reader compares every later approach against; anchor for "server sends files vs. server renders HTML."

### vanilla-tradeoffs

- Locator: `[[sources/next-js/20261004/EBOOK.pdf#What's the catch?]]`
- Summary (vanilla): Lists the drawbacks of the traditional approach — most processing burden lands on the client, bandwidth grows because full files are transferred per request (worse with many pages and media), and initial load is slower since nothing renders until all files arrive and parse.
- Key claims: Client-side processing stress; high bandwidth from full-file transfers; longer initial load tied to complete transfer plus parse.
- Learner-relevant: Trade-off vocabulary reused when evaluating SSR/CSR; concretely answers "why not just plain HTML?"

### the-react-way

- Locator: `[[sources/next-js/20261004/EBOOK.pdf#The React way]]`
- Summary: Introduces React's improvement: components, the virtual DOM, and the client-server mechanism. The server sends only a minimal entry-point HTML file plus one bundled JavaScript file. React performs client-side rendering, diffs a virtual DOM, and patches only necessary changes to the real DOM. `React Router` handles client-side navigation without full page refreshes, re-rendering components for the new URL and fetching data as needed.
- Key claims: Minimal HTML + bundled JS payload; virtual DOM diffing limits real-DOM writes; React Router navigates without a full server request; new-page data is fetched by the components themselves.
- Learner-relevant: Core mental model of client-side rendering and SPA routing; source for the virtual-DOM and React Router steps.

### react-tradeoffs

- Locator: `[[sources/next-js/20261004/EBOOK.pdf#What's the catch?]]`
- Summary (React): Names React's downsides — added complexity (thinking in components, state/props, virtual DOM learning curve), still primarily client-side rendering that delays render/interactivity on slow devices, and SEO risk because crawlers may not fully execute JavaScript-rendered content, hurting search visibility.
- Key claims: Client-side rendering delays first render/interactivity on weak devices; JS-dependent content can be hard for crawlers to index, harming SEO.
- Learner-relevant: Establishes the SEO and performance problem Next.js is positioned to solve; gives criteria for choosing CSR vs SSR.

### the-nextjs-way

- Locator: `[[sources/next-js/20261004/EBOOK.pdf#The Next.js Way - A blend of both]]`
- Summary: Next.js lets developers choose where to render. On a visit, the server runs the React components, generates HTML/CSS/JS including initial content, fetched data, and component markup, and returns fully rendered HTML so the client paints immediately without waiting for JS. JavaScript is still sent for interactivity, and Next.js then performs client-side **hydration** — attaching event handlers to the pre-rendered HTML. Mismatches between server placeholders (div/form/span) and client render cause hydration errors. This server-render-first flow is SSR; subsequent requests can be rendered on either server (SSR) or client (CSR) per the developer's choice.
- Key claims: Rendering location is developer-chosen; server returns fully rendered HTML plus content/data; JS arrives afterward for interactivity; hydration attaches handlers and can error on placeholder mismatch; SSR is the default-first-visit story, later requests are flexible.
- Learner-relevant: Central "blend of both" thesis; source for SSR, hydration, and hydration-error concepts.

### create-app-prerequisites

- Locator: `[[sources/next-js/20261004/EBOOK.pdf#Create a Next.js Application]]`
- Summary: Setup requirements: Node.js 16.8+ (a JavaScript runtime for running JS outside the browser, not a language; LTS is stable vs Current is "work in progress") verified with `node -v`, and a code editor — recommends VS Code and its built-in terminal (open with ctrl + backtick). Walks through creating and opening a project folder ("NextEbook") in VS Code.
- Key claims: Node.js 16.8 or newer required; Node.js is a runtime, not a language; LTS is most stable while Current may contain bugs; VS Code's integrated terminal avoids a separate shell.
- Learner-relevant: Prerequisite checklist and setup step; defines Node.js and its role before any Next.js code.

### create-app-installation

- Locator: `[[sources/next-js/20261004/EBOOK.pdf#Create a Next.js Application]]`
- Summary: Two installation routes — manual (install and configure packages and file structure yourself) vs automatic (one-click, choosing TypeScript, Tailwind, etc.). Recommends the Zero Dependency CLI `create-next-app` via `npx create-next-app@latest`, which prompts for project name, TypeScript, ESLint, Tailwind, `src/`, App Router (recommended), and import alias customization. Clarifies npx (Node Package eXecute) runs packages without global install, while npm (Node Package Manager) handles installation — npm arrives with Node.js. The sample selects No for TS/ESLint/Tailwind and Yes for App Router.
- Key claims: `npx` executes packages without installing them globally; `npm` installs and manages packages; `create-next-app` is a zero-dependency CLI scaffolded from templates; App Router is the recommended choice.
- Learner-relevant: The canonical scaffolding procedure and the npx-vs-npm distinction; anchor for "create your first app."

### create-app-structure-app

- Locator: `[[sources/next-js/20261004/EBOOK.pdf#Create a Next.js Application]]`
- Summary: Walks the generated `app/` directory. `favicon.ico` is the tab icon (defaults to the Vercel icon). `globals.css` holds global CSS — variables, font imports, initialization — and is movable/renamable but must have referencing code updated. `layout.js` is the root/parent layout; its content renders on every route and is where fonts, metadata, Redux providers, or a navbar go. `page.js` is the home route (`/`) and renders only there — `layout.js` is its parent. `page.module.css` is component-scoped CSS (`.module.css` naming scopes rules to the `page.js` component, imported via `import styles from './page.module.css'`).
- Key claims: `layout.js` wraps all routes while `page.js` is route-specific; `page.js` is the home route and a child of `layout.js`; `.module.css` scopes styles to one component; `globals.css` must propagate any rename/move to dependents.
- Learner-relevant: The App Router file conventions and layout/page relationship; anchor for layout vs. page and CSS Modules.

### create-app-structure-support

- Locator: `[[sources/next-js/20261004/EBOOK.pdf#Create a Next.js Application]]`
- Summary: Supporting files and folders: `node_modules/` is the dependency store populated by npm (contains `react`, `next`, `react-dom`, `postcss`, `styled-jsx`, etc.) and is auto-managed, not hand-edited. `public/` holds static assets (images, fonts, videos) that are auto-optimized and reachable app-wide. `.gitignore` tells Git which files to exclude — notably `node_modules`, to avoid clutter and repo bloat (quips about Node.js creator Ryan Dahl and the "heaviest object"). `README.md` is the project's manual/guidebook.
- Key claims: `node_modules` is the package store managed by npm; `public` assets are auto-optimized and globally available; `node_modules` is excluded from version control to avoid bloat; README documents install/usage/contribution.
- Learner-relevant: Explains the non-code parts of the scaffold; supports the "what are all these folders?" confusion after scaffolding.

### create-app-config-files

- Locator: `[[sources/next-js/20261004/EBOOK.pdf#Create a Next.js Application]]`
- Summary: Config/dependency files. `jsconfig.json` answers the "customize default import alias?" prompt: it configures `compilerOptions.paths`, mapping `@/*` to `./*` so imports like `from '@/components'` replace long relative paths like `'../../components'`; the alias is customizable (e.g. `#/*`). `package-lock.json` is auto-created and pins exact versions of installed packages and their dependencies, preventing "works on my machine" drift when a teammate installs without the lockfile and pulls newer, possibly buggy versions. `package.json` is the project's info card: name, version, `dependencies` (needed in production) vs `devDependencies` (dev-only, e.g. eslint), and `scripts` (customizable commands to test, build, run dev, deploy); npm records each installed package and its version here.
- Key claims: `jsconfig.json` enables path aliases and replaces relative imports; `package-lock.json` locks exact dependency versions to ensure reproducible installs; `package.json` separates dependencies from devDependencies and holds runnable scripts.
- Learner-relevant: Explains import aliases and why the lockfile matters; key for reproducible team setups and script-driven workflows.

### create-app-run-and-children

- Locator: `[[sources/next-js/20261004/EBOOK.pdf#Create a Next.js Application]]`
- Summary: Running and editing the app: `cd introduction` then `npm run dev` starts a dev server on port 3000, viewed at `http://localhost:3000`. Editing `page.js` (a fresh `Home` component returning `<main><p>Hello World</p></main>`) updates the browser without manual refresh via Next.js **Fast Refresh**. Adding text in `layout.js`'s `<body>` shows it appears on the home route and, because `children` is rendered after the text, before "Hello World" — reversing the order moves it after. `children` is a prop Next.js passes to `RootLayout` containing all child/route components from the home route onward. Closing tasks: comment out `{children}` to see the route content vanish, and explain Node.js's role, `create-next-app`/npx, and `node_modules`.
- Key claims: `npm run dev` serves on localhost:3000; Fast Refresh applies edits without manual reload; `layout.js` wraps route content and its render position controls placement; `children` is the injected route-content prop.
- Learner-relevant: First end-to-end "edit and see it live" loop; source for Fast Refresh, layout wrapping, and the `children` prop.
