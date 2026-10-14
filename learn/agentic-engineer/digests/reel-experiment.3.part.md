---
source: reel-experiment
source_type: codebase
source_lines: 9230
language: typescript
file_count: 20
part: 3
status: absorbed
absorbed_at: 2026-10-14
created: 2026-10-14
updated: 2026-10-14
---

# Digest — reel-experiment (part 3) — reel-agentic_engineering: UI components

## Overview (L1)
- Two layers under `src/components/`: 11 base design-system primitives in `ui/` and 9 product components at the top level. All color/space/radius/shadow/font comes from Tailwind v4 `@theme` tokens in `src/app/globals.css` (`bg-canvas`, `text-accent`, `rounded-lg`, `shadow-e1`, `font-serif`), styled ShadCN-style on Radix with owned code (ADR 0004, `design.md`).
- The design system was established before feature work: the primitives (`button`, `badge`, `card`, `input`, `label`, `dialog`, `dropdown-menu`, `avatar`, `progress`, `skeleton`, `toast`) plus the presentational product shells were built against the tokens, so features compose them instead of restyling.
- Server/client split is explicit: `app-shell.tsx` stays server-rendered; interactivity is pushed into small client leaves (`user-menu.tsx`, `mobile-nav.tsx`, `swipe-card.tsx`, etc.), and only Server Actions cross the server→client function boundary. Every interactive element carries a `focus-visible` ring, icon-only buttons an `aria-label`, and motion respects `prefers-reduced-motion`.

## Structure (L2)

### ui/button
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/components/ui/button.tsx]]`
- Purpose: The canonical button, a class-variance-authority variant matrix with Radix Slot `asChild` support and a built-in loading spinner.
- Key exports: `Button`, `ButtonProps`, `buttonVariants`
- Dependencies: `@radix-ui/react-slot` (Slot), `class-variance-authority`, `lucide-react` (Loader2), `@/lib/utils` (`cn`)
- Learner-relevant: The design-system primitive pattern — `cva` base string + `variant` (`primary | secondary | ghost | destructive`) and `size` (`sm | md | lg | icon`) variants, defaults `primary`/`md`; focus ring and duration/ease tokens baked into the base. `loading` sets `aria-busy` and disables; `asChild` renders as a child `<a>`.

### ui/badge
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/components/ui/badge.tsx]]`
- Purpose: Small pill label for metadata (genres, chips).
- Key exports: `Badge`, `BadgeProps`, `badgeVariants`
- Dependencies: `class-variance-authority`, `@/lib/utils`
- Learner-relevant: Variants `neutral | accent | success | warning | danger | outline` (semantic color tokens at `/15` opacity), sizes `sm | md`. Renders a `<span>`, server-safe.

### ui/card
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/components/ui/card.tsx]]`
- Purpose: Surface container plus header/media/content/footer sub-parts.
- Key exports: `Card`, `CardHeader`, `CardMedia`, `CardContent`, `CardFooter`
- Dependencies: `@/lib/utils`
- Learner-relevant: `interactive` prop lifts `shadow-e1 → hover:shadow-e2`; base surface is `bg-surface-1 border-border rounded-lg shadow-e1`.

### ui/input
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/components/ui/input.tsx]]`
- Purpose: Text input with an error state.
- Key exports: `Input`, `InputProps`
- Dependencies: `@/lib/utils`
- Learner-relevant: `error?: boolean` renders the `danger` border and sets `aria-invalid` (pair with `aria-describedby`). Uses `surface-2`, `border-strong` on hover, `accent`/`ring` on focus.

### ui/label
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/components/ui/label.tsx]]`
- Purpose: Form label bound to a control.
- Key exports: `Label`, `LabelProps`
- Dependencies: `@radix-ui/react-label`, `@/lib/utils`
- Learner-relevant: Handles `peer-disabled` styling; `font-sans text-sm font-medium`.

### ui/dialog
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/components/ui/dialog.tsx]]`
- Purpose: Modal dialog built on Radix with a styled overlay, close button, header/footer, title, and description.
- Key exports: `Dialog`, `DialogTrigger`, `DialogPortal`, `DialogClose`, `DialogContent`, `DialogHeader`, `DialogFooter`, `DialogTitle`, `DialogDescription`
- Dependencies: `@radix-ui/react-dialog`, `lucide-react` (X), `@/lib/utils`
- Learner-relevant: Overlay uses the `reel-overlay`/`reel-dialog` animation classes and `bg-scrim`; content is centered `max-w-lg`, `bg-surface-2`, `shadow-e3`. Title uses `font-serif`; the close button has a visually-hidden "Close" label.

### ui/dropdown-menu
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/components/ui/dropdown-menu.tsx]]`
- Purpose: Radix dropdown menu parts styled to tokens.
- Key exports: `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuGroup`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuLabel`, `DropdownMenuSeparator`
- Dependencies: `@radix-ui/react-dropdown-menu`, `@/lib/utils`
- Learner-relevant: `DropdownMenuContent` uses `sideOffset = 6`, `min-w-[12rem]`, `bg-surface-2`, `shadow-e3`; items style `focus`/`data-[highlighted]` with `surface-3` and `data-[disabled]` states.

### ui/avatar
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/components/ui/avatar.tsx]]`
- Purpose: Round user avatar with image + text fallback.
- Key exports: `Avatar`, `AvatarImage`, `AvatarFallback`
- Dependencies: `@radix-ui/react-avatar`, `@/lib/utils`
- Learner-relevant: Radix fallback pattern — `size-9 rounded-full bg-surface-2`, fallback text `font-sans text-sm`.

### ui/progress
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/components/ui/progress.tsx]]`
- Purpose: Slim determinate progress meter, built on tokens with no extra dependency.
- Key exports: `Progress`, `ProgressProps`
- Dependencies: `@/lib/utils`
- Learner-relevant: `role="progressbar"` with `aria-valuemin/max/now`; value clamped 0–100; the accent bar animates width via `duration-base`/`ease-standard`.

### ui/skeleton
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/components/ui/skeleton.tsx]]`
- Purpose: Loading placeholders that announce themselves to assistive tech.
- Key exports: `Skeleton`, `SkeletonRegion`, `SkeletonProps`, `SkeletonRegionProps`
- Dependencies: `@/lib/utils`
- Learner-relevant: Two-part accessibility pattern — `Skeleton` is always `aria-hidden` with a `reel-shimmer` gradient animation (neutralized under reduced motion); `SkeletonRegion` wraps it in `role="status" aria-busy="true"` with a `label` announced to screen readers.

### ui/toast
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/components/ui/toast.tsx]]`
- Purpose: Thin app-facing surface over Sonner (the `<Toaster>` is mounted once in the root layout, styled to tokens there).
- Key exports: `toast`, `toastSuccess`, `toastError`
- Dependencies: `sonner` (`toast`)
- Learner-relevant: A single import point so defaults can be wrapped later without churn; success/error helpers carry an optional `description`; Sonner announces errors assertively.

### app-shell
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/components/app-shell.tsx]]`
- Purpose: Server-rendered app frame — skip link, header (Reel wordmark + primary nav + user menu), page `<main>`, and the global TMDB attribution footer.
- Key exports: `AppShell`, `AppShellProps`
- Dependencies: `next/image`, `next/link`, `@/lib/tmdb/attribution` (`TMDB_ATTRIBUTION_NOTICE`, `TMDB_HOME_URL`, `TMDB_LOGO_URL`), `@/lib/utils`, `./mobile-nav` (`MobileNav`, `NavItem`), `./user-menu`
- Learner-relevant: The server/client boundary — the shell itself has no `"use client"`; it passes `activeHref`, `userName`, `avatarUrl`, and the `onSignOut` Server Action down to the client leaves. `DEFAULT_NAV` is `Feed / Import / Search / Watchlist`; `activeHref` marks the current item (`aria-current="page"`). Includes an sr-only-with-focus skip link to `#main-content`.

### mobile-nav
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/components/mobile-nav.tsx]]`
- Purpose: Client hamburger menu shown below `md`; toggles a panel of primary nav links.
- Key exports: `MobileNav`, `MobileNavProps`, `NavItem`
- Dependencies: `lucide-react` (Menu, X), `next/link`, `react` (useState), `@/lib/utils`
- Learner-relevant: Client leaf pattern — local `open` state, `aria-expanded`/`aria-controls`/`aria-label`, `size-11` touch target, panel is `absolute inset-x-0 top-full z-40 bg-surface-1 shadow-e3`, closes on link click.

### user-menu
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/components/user-menu.tsx]]`
- Purpose: Client avatar dropdown with the user name label, an Account item, and Sign out.
- Key exports: `UserMenu`, `UserMenuProps`
- Dependencies: `lucide-react` (LogOut, User), `./ui/avatar`, `./ui/dropdown-menu`
- Learner-relevant: Composes `Avatar`/`AvatarFallback` with `DropdownMenu`; `initials()` derives 1–2 letter fallback from the name (returns `"?"` for empty). Trigger carries `aria-label`; sign-out fires `onSignOut?.()` on select.

### poster-image
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/components/poster-image.tsx]]`
- Purpose: Movie art at the 2:3 poster ratio; renders the TMDB poster or a designed fallback — never a broken image.
- Key exports: `PosterImage`, `PosterImageProps`
- Dependencies: `lucide-react` (Clapperboard), `next/image`, `@/lib/tmdb/attribution` (`posterUrl`), `@/lib/utils`
- Learner-relevant: When `poster_path` is null it renders a `surface-2 → surface-1 → canvas` gradient with a faint clapperboard watermark and the title in `font-serif`; `size` defaults to `w500`, `sizes` default `(max-width: 640px) 45vw, 220px`. Server-safe.

### recommendation-card
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/components/recommendation-card.tsx]]`
- Purpose: The ranked-feed card — poster, compact watchlist icon toggle, title (linked when `href` given), year/runtime/genre badges, and the "why this fits you" reason.
- Key exports: `RecommendationCard`, `RecommendationCardProps`
- Dependencies: `lucide-react` (Bookmark, BookmarkCheck), `@/lib/catalog/types` (`Movie`), `@/lib/utils`, `./poster-image`, `./ui/badge`, `./ui/card`, `./ui/skeleton`
- Learner-relevant: Composes `Card` + `Badge` + `Skeleton`; the reason renders as a Fraunces-italic pull quote; `formatRuntime` turns minutes into `1h 30m`; the whole card becomes one link target via an `after:absolute after:inset-0` overlay when `href` is set, with `has-[a:focus-visible]` ring. `loading` renders a `SkeletonRegion`.

### swipe-card
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/components/swipe-card.tsx]]`
- Purpose: Draggable Tinder-style card for onboarding — drag past ±120px to like/dislike, with Like/Nope overlay hints and Like/Dislike buttons.
- Key exports: `SwipeCard`, `SwipeCardProps`
- Dependencies: `lucide-react` (Heart, X), `motion/react` (`motion`, `PanInfo`, `useAnimationControls`, `useMotionValue`, `useReducedMotion`, `useTransform`), `@/lib/catalog/types`, `@/lib/motion` (`DURATION`, `EASE`, `SWIPE_SPRING`), `./poster-image`
- Learner-relevant: Motion-token choreography — `rotate` from `useTransform` over the x range, hint opacities tied to drag distance, `SWIPE_THRESHOLD = 120`, `FLY_DISTANCE = 640`. `useReducedMotion` disables drag and swaps the fly-out for a fade; the outcome is announced through an `aria-live="polite"` status region.

### vibe-search-input
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/components/vibe-search-input.tsx]]`
- Purpose: Natural-language vibe search field with a sparkle accent, submit button, and example prompt chips.
- Key exports: `VibeSearchInput`, `VibeSearchInputProps`
- Dependencies: `lucide-react` (Loader2, Sparkles), `react` (`FormEvent`, `useId`), `@/lib/utils`, `./ui/badge`
- Learner-relevant: `<form role="search">` (with a Biome a11y-ignore noting the design spec mandates it), `focus-within:shadow-glow` on the `rounded-xl` field, `aria-busy` while loading; example chips render as clickable `outline` Badges that fill the input.

### watchlist-button
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/components/watchlist-button.tsx]]`
- Purpose: Labelled add/remove watchlist control used on the detail page (the recommendation-card has its own compact icon toggle).
- Key exports: `WatchlistButton`
- Dependencies: `lucide-react` (Bookmark, BookmarkCheck), `react` (`useCallback`, `useState`), `@/app/watchlist/actions` (`setWatchlist`), `@/components/ui/button`, `@/components/ui/toast` (`toastError`)
- Learner-relevant: The optimistic-update pattern — flips local state immediately, awaits the `setWatchlist` Server Action, and on `status === "error"` reverts and raises `toastError`. `aria-pressed`/`aria-label` reflect state; variant swaps `secondary`/`primary` when in-list.

### continue-with-google
- Locator: `[[sources/agentic-engineer/20261014/reel-agentic_engineering/src/components/continue-with-google.tsx]]`
- Purpose: The single sign-in affordance — starts Google OAuth via Supabase and redirects to `/auth/callback`.
- Key exports: `ContinueWithGoogle`
- Dependencies: `react` (useState), `@/components/ui/button`, `@/lib/supabase/client` (`createClient`)
- Learner-relevant: Client leaf using `Button` with `loading={pending}`; calls `supabase.auth.signInWithOAuth({ provider: "google", ... })` with `redirectTo` from `window.location.origin`; only resets `pending` if OAuth failed to start (success navigates away). Inline `GoogleGlyph` SVG.
