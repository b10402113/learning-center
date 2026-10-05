---
source: nextjs-course
source_type: text
source_lines: 95937
part: 2
status: absorbed
absorbed_at: 2026-10-04
created: 2026-10-04
updated: 2026-10-04
---

# Digest — nextjs-course (part 2)

## Overview (L1)

- Create a Next.js Application — Scaffold the app with `npx create-next-app@latest`, answer the CLI prompts (TypeScript, ESLint, Tailwind, App Router, Turbopack), walk the whole file/folder structure, run `npm run dev`, and edit `layout.tsx` metadata and `page.tsx` to see Fast Refresh.
- Git & GitHub Setup — Create a GitHub repo and push the project with `git init/add/commit/branch/remote/push`, commit one change per lesson, and use commit diffs, "browse repository at this point," and `github.dev` as debugging aids for typos.
- ESlint & Prettier Setup — Install `eslint-config-standard` plus its peer plugins, add the Tailwind ESLint plugin and `eslint-config-prettier`, install Prettier and the import-order plugin, and wire VS Code workspace settings/extensions so save auto-formats and auto-fixes.
- Migrate to NEW ESLint — Migrate legacy `.eslintrc.json` to the flat `eslint.config.mjs` using `@eslint/migrate-config`, install the `@eslint/compat`/`js`/`eslintrc` packages, and explain `.mjs` (ES modules) vs `.cjs` (CommonJS).
- Tailwind CSS Setup — Strip `globals.css` to the Tailwind import, extend the theme with custom colors (e.g. `--color-light-500`) and other tokens as named CSS variables instead of inline hex values, then copy in the final project theme.
- Tailwind CSS Theming — Use the `@layer base`/`components`/`utility` directives to move repetitive JSX styling into CSS, define reusable heading and background utility classes, and install `@tailwindcss/typography`.
- Setup Fonts — Replace the default Geist fonts with Inter via `next/font/local` (self-hosted, no external requests), register `fontFamily` in `tailwind.config`, and add Space Grotesk for the logo.
- Assets and Metadata — Export assets from the Figma design into `public/` with a consistent naming convention, swap in the new favicon, and configure the Next.js `metadata` object (title, description, icon) for SEO.
- File Based Routing — Contrast React Router with file-based routing: folders define routes and `page.tsx` provides UI; cover static, nested, dynamic `[param]` routes, and route groups `(...)` that organize files without changing the URL.
- Client vs. Server Paradigm — Define client vs server components, give the "does it need user interactivity?" test, note server components are the default, `"use client"` marks the boundary, and imported modules inside a client file become client code.
- Different Rendering Strategies — Explain rendering environments, build time vs runtime vs runtime environment (Node.js vs Edge), and the three server strategies SSG, ISR, and SSR with a two-question decision checklist.
- Set up the themes — Install `next-themes` (fix the React peer-dep mismatch via `package.json` `overrides`), build a `ThemeProvider`, wrap the layout, default to `system`, and suppress the resulting hydration warning.
- Installing ShadCN UI — Explain shadcn/ui's copy-only-what-you-need model, initialize it (New York style, slate), review `components.json`, `lib/utils.ts`, and Tailwind config changes, then add the dropdown-menu component.
- Creating the Navbar — Describe the app's navigation architecture (top navbar, left/right sidebars), create the `navigation/navbar` folder, and build a fixed, responsive nav with logo, search placeholder, and theme-picker slot.
- Create a theme toggler — Follow shadcn's Next.js dark-mode docs to build `theme.tsx`, install the button component, and use `useTheme` with a dropdown to switch light/dark/system app-wide.

## Sections (L2)

### create-a-next-js-application

- Locator: `[[sources/next-js/20261004/015 -  Create a Next.js Application.en.srt#Create a Next.js Application]]`
- Summary: Scaffolds the project with `npx create-next-app@latest`, walks through each CLI prompt, tours the generated file/folder structure bottom-up, starts the dev server, and edits metadata and `page.tsx` to demonstrate Hot Module Replacement.
- Key claims: App Router and Tailwind are opt-ins that must be chosen; the `app/` folder is the primary workspace for pages and API routes; `package-lock.json` locks versions and must not be deleted; `layout.tsx` wraps every route while `page.tsx` is the home route.
- Learner-relevant: You can create and run a Next.js 15 app, understand what every top-level file does, and change global layout content and the home page with instant feedback.

### git-github-setup

- Locator: `[[sources/next-js/20261004/016 -  Git & GitHub Setup.en.srt#Git & GitHub Setup]]`
- Summary: Creates a GitHub repo, initializes git locally, commits the previous lesson's work, renames the branch to `main`, adds the remote, and pushes; the lesson then shows how to use commits to recover from and debug typos.
- Key claims: Committing per lesson makes the code state for each lesson browsable; commit diffs pinpoint exactly which lines changed; `github.dev` (or pressing `.`) opens a full web VS Code at any commit; typos in strings, class names, and variable names are the most common blocker.
- Learner-relevant: You can put any project under version control, push it, and inspect or compare the exact code state at any point of the course to fix your own mistakes.

### eslint-prettier-setup

- Locator: `[[sources/next-js/20261004/017 -  ESlint & Prettier Setup.en.srt#ESlint & Prettier Setup]]`
- Summary: Extends the default Next.js ESLint config with `eslint-config-standard` and its required plugins, adds the Tailwind CSS rule plugin, installs Prettier plus `eslint-config-prettier` to avoid conflicts, adds an import-order plugin, and configures VS Code to format and fix on save.
- Key claims: ESLint is a linter (finds problems) while Prettier is an opinionated formatter (auto-formats) and they must be reconciled; `--legacy-peer-deps` works around the ESLint-version mismatch; the Tailwind ESLint plugin does not yet support the newest Tailwind, so that config is commented out for now.
- Learner-relevant: You get a production-ready, consistent codebase that auto-formats and auto-fixes on save, and you know how to resolve common linting setup errors.

### migrate-to-new-eslint

- Locator: `[[sources/next-js/20261004/018 -  Migrate to NEW ESLint.en.srt#Migrate to NEW ESLint]]`
- Summary: Migrates the legacy `.eslintrc.json` configuration to the new flat `eslint.config.mjs` with `@eslint/migrate-config`, installs the required `@eslint/*` compatibility packages, and explains the module-file extension.
- Key claims: Tools often ship a one-command migration; the new config format needs `@eslint/compat`, `@eslint/js`, and `@eslint/eslintrc`; `.mjs` marks an ES6 module (imports/exports) whereas `.cjs` is CommonJS (require).
- Learner-relevant: You can keep your linting up to date across breaking config-format changes and understand the `.mjs`/`.cjs` distinction you will meet in many config files.

### tailwind-css-setup

- Locator: `[[sources/next-js/20261004/019 -  Tailwind CSS Setup.en.srt#Tailwind CSS Setup]]`
- Summary: Explains why inline hex colors are unmaintainable and shows how to extend the Tailwind theme directly in `globals.css` by defining named custom properties, then applying the full project theme.
- Key claims: Extend rather than override the Tailwind default theme; custom colors like `--color-light-500` become reusable utilities (`text-light-500`); themed properties extend beyond color to spacing, radius, shadows, and breakpoints; the docs' theme section lists what is customizable.
- Learner-relevant: You can turn a design system's colors and tokens into maintainable Tailwind utilities instead of scattering arbitrary values, and change a token once to update the whole app.

### tailwind-css-theming

- Locator: `[[sources/next-js/20261004/020 -  Tailwind CSS Theming.en.srt#Tailwind CSS Theming]]`
- Summary: Moves messy repeated styling out of JSX using Tailwind's `@layer` directives — `base` for element defaults (headings), `components` for reusable components (cards), and `utility` for reusable utilities (backgrounds) — and installs `@tailwindcss/typography`.
- Key claims: `base` sets foundational element styles, `components` defines component classes via `@apply`, and `utility` defines reusable utilities; reading exact properties from Figma (size, leading, tracking) makes the CSS match the design; a `background-light-*/dark-*` utility pattern enables automatic light/dark theming.
- Learner-relevant: You can keep components clean by centralizing typography and background styles in `globals.css` and reusing them as short class names such as `h1-bold`.

### setup-fonts

- Locator: `[[sources/next-js/20261004/021 -  Setup Fonts.en.srt#Setup Fonts]]`
- Summary: Replaces the default Geist fonts with Inter (and Space Grotesk for the logo) using `next/font/local`, wiring font variables into `layout.tsx` and `tailwind.config.ts`.
- Key claims: `next/font/local` self-hosts fonts, eliminating external provider requests and improving load performance; fonts are exposed as CSS variables (e.g. `--font-inter`); variables are registered in the Tailwind `fontFamily` config; heavier body fonts are applied globally while logo fonts stay as classes.
- Learner-relevant: You can install any Google font locally and use it in a Next.js app, improving performance and matching a design's typography.

### assets-and-metadata

- Locator: `[[sources/next-js/20261004/022 -  Assets and Metadata.en.srt#Assets and Metadata]]`
- Summary: Exports icons and images from Figma into `public/` with clear names, replaces the default favicon, and expands the Next.js `metadata` object with a description and icon for SEO.
- Key claims: `public/` holds static assets and is served as-is; consistent asset naming matters when referencing them in code; the `metadata` export feeds search-engine understanding (title, description) and can be static or dynamic per page; `.vscode` `files.exclude` can hide `.next`/`node_modules` to keep the tree clean.
- Learner-relevant: You can gather and organize a project's assets and configure basic SEO metadata and the browser-tab icon.

### file-based-routing

- Locator: `[[sources/next-js/20261004/023 -  File Based Routing.en.srt#File Based Routing]]`
- Summary: Compares React Router's configuration-heavy approach with Next.js file-based routing, then builds static, nested, and dynamic routes in a practice app, ending with route groups.
- Key claims: Folders define routes and `page.tsx` provides the route UI, so no routing package is needed; nested folders nest routes (`/projects/list`); square-bracket folders (`[name]`) create dynamic segments read via the `params` prop; parenthesized folders (`(auth)`, `(dashboard)`) are route groups that organize files without appearing in the URL.
- Learner-relevant: You can construct a complete route tree — static, nested, dynamic, and grouped — and explain how Next.js routing differs from React Router.

### client-vs-server-paradigm

- Locator: `[[sources/next-js/20261004/024 -  Client vs. Server Paradigm.en.srt#Client vs. Server Paradigm]]`
- Summary: Defines client and server environments and components, demonstrates with `console.log` where each renders, and shows the `"use client"` boundary behavior.
- Key claims: All components are server components by default; use client components when a component needs interactivity (events, hooks, browser APIs) and server components for data fetching, secrets, and large dependencies; `"use client"` marks the boundary and everything imported into that module becomes client code; Next.js pre-renders both on the server for fast initial load and SEO (so server logs appear in the terminal).
- Learner-relevant: You can decide where any component should render, apply the one-question test; add `"use client"` correctly, and avoid the anti-pattern of nesting server components inside client components.

### different-rendering-strategies

- Locator: `[[sources/next-js/20261004/025 -  Different Rendering Strategies.en.srt#Different Rendering Strategies]]`
- Summary: Explains the meaning of rendering, build time vs runtime, runtime environments, and the three server rendering strategies (SSG, ISR, SSR), plus when to choose each.
- Key claims: Rendering is turning code into UI; build time is developer-time compilation while runtime is when a user executes it; Next.js offers the Node.js runtime (default) and the lightweight Edge runtime, switchable via `export const runtime`; SSG runs at build time and is cached/served via CDN, ISR updates static pages on-demand without a full rebuild, and SSR renders fresh on every request; choose by asking whether the content is the same for each request (SSG), changes every second (SSR), or something in between (ISR).
- Learner-relevant: You can pick the right rendering strategy per page, understand the trade-offs in interactivity, SEO, security, server load, and device consistency, and justify your choice.

### set-up-the-themes

- Locator: `[[sources/next-js/20261004/026 -  Set up the themes.en.srt#Set up the themes]]`
- Summary: Installs `next-themes`, resolves its React peer-dependency conflict with `package.json` overrides, creates a `ThemeProvider` context component, wraps the root layout, and suppresses the resulting hydration warning.
- Key claims: `next-themes` gives dark mode with system-preference support and no flash; a version mismatch with React is fixed with `packageManager` + `overrides` (`$react`, `$react-dom`) rather than downgrading React; the provider is a client component wrapping `children`; the theme provider causes a one-level-deep hydration mismatch that `suppressHydrationWarning` on `<html>` resolves.
- Learner-relevant: You can add app-wide light/dark/system theming and diagnose and fix a hydration mismatch.

### installing-shadcn-ui

- Locator: `[[sources/next-js/20261004/027 -  Installing ShadCN UI.en.srt#Installing ShadCN UI]]`
- Summary: Introduces shadcn/ui as a copy-in component library, initializes it with the CLI (New York style, slate color), explains the files it generates, and adds the dropdown-menu component.
- Key claims: Unlike Material UI, shadcn gives you only the components you request, as editable source; initialization writes `components.json`, updates `tailwind.config.ts` (radius, Tailwind CSS Animate), and creates `lib/utils.ts`; components are added with `npx shadcn@latest add <name>` and land in `components/ui`.
- Learner-relevant: You can scaffold and extend a design-system component library and add fully-functional, accessible components like a dropdown with minimal code.

### creating-the-navbar

- Locator: `[[sources/next-js/20261004/028 -  Creating the Navbar.en.srt#Creating the Navbar]]`
- Summary: Lays out the app's navigation architecture (a top navbar plus left and right sidebars) and builds the fixed, responsive top navbar component, mounted in the root layout.
- Key claims: Organize related navigation into `components/navigation/navbar` to keep the desktop, mobile, and theme pieces close but separated; components imported in the root layout render on every route; custom utilities like `flex-between` (composed of three Tailwind classes) live in `globals.css`; the navbar is `fixed`, `z-50`, full-width, and hides the wordmark below 640px.
- Learner-relevant: You can structure navigation code cleanly, mount a shared navbar app-wide, and build a responsive bar with a logo, search placeholder, and slot for the theme picker.

### create-a-theme-toggler

- Locator: `[[sources/next-js/20261004/029 -  Create a theme toggler.en.srt#Create a theme toggler]]`
- Summary: Builds the theme toggle by adapting shadcn's Next.js dark-mode documentation into `theme.tsx`, installing the button component, and using `useTheme` with a dropdown to switch theme app-wide.
- Key claims: Reading and adapting documentation is part of the skill; the toggle uses `useTheme` from `next-themes` plus the shadcn dropdown and button; because the layout is wrapped by `ThemeProvider`, a theme change propagates to every page; the change is committed as "set up light and dark theme, shadcn, and navbar."
- Learner-relevant: You can implement a working light/dark/system switcher and understand how provider context makes theme state global.
