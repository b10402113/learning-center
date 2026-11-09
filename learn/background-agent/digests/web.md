---
source: sources/background-agent/20261109/supplement/web
source_type: codebase
source_lines: 1741
language: tsx
file_count: 4
status: absorbed
absorbed_at: 2026-11-09
created: 2026-11-09
updated: 2026-11-09
---

# L1 overview

- `index.html` — Vite entry document: sets the dark theme, `#root` mount point, and loads `/src/main.tsx`; the page title frames the app as "Checkout Ops · Background Agents".
- `src/App.tsx` — The entire operator dashboard: a single React component with hash-free pathname routing over three views (Inbox, Activity, Events), typed `fetch` client for the operator API, 1.5s polling loop, and a phase-aware activity timeline that maps agent harness stages (`start`, `observe`, `predict`, `act`, `pause`, `resume`, `human`, `terminal`, `policy`, `event`) to icons and detail lines.
- `src/main.tsx` — Bootstraps React 18 `createRoot` on `#root` inside `StrictMode` and imports the global stylesheet.
- `src/styles.css` — Hand-written dark operator-console styling: layout shell (sidebar/topbar/content), the mail-style Inbox split pane, the run-list/activity timeline grid with per-phase accent colors, the events feed, and two responsive breakpoints.

# L2 detail

- `#L1-L13` — `sources/background-agent/20261109/supplement/web/index.html` — Purpose is the minimal Vite HTML shell; key pieces are `theme-color #09090b`, the empty `<div id="root">`, and the module script `/src/main.tsx`. Learner-relevant: the operator UI is a plain client-side SPA with no server rendering, so all state comes from the API at runtime.
- `#L14-L726` — `sources/background-agent/20261109/supplement/web/src/App.tsx` — Purpose is the whole operator console in one component. Key types: `ServiceEvent`, `Run` (goal/status/iteration/`waitReason`/`report`/`eventSequence`), `Approval` (action/input/status/`expiresAt`/`decidedAt`), `ActivityEntry` (`kind`/`message`/`detail`), `ServiceSnapshot`, and `Dashboard`. Key helpers: `request<T>` (JSON-only fetch with operator-API error mapping), `label`, `terminal` (the five terminal statuses), `PhaseOf`/`activityDetail` for the harness timeline, and an in-house `Link` that calls `pushState`. Views: Inbox (pending/resolved approval-and-`request_help` mailbox with approve/deny or answer wired to `POST /api/approvals/decide`), Activity (run list + phase icon rail + optional final report + `POST /api/runs/cancel`), Events (current `ServiceSnapshot` state plus raw event feed). `refresh` polls `/api/dashboard` every 1.5s and re-fetches `/api/runs/<id>/activity`. Learner-relevant: how a human-in-the-loop surface reads durable run state, exposes approvals with an expiry, and lets an operator cancel a background run.
- `#L727-L736` — `sources/background-agent/20261109/supplement/web/src/main.tsx` — Purpose is React bootstrap only; key export is the default `App` mount through `createRoot(...).render(<StrictMode><App /></StrictMode>)`, plus the `./styles.css` import. Learner-relevant: StrictMode double-invocation is why effects/polling must be written idempotently.
- `#L737-L1741` — `sources/background-agent/20261109/supplement/web/src/styles.css` — Purpose is the full visual system for the console, using CSS custom properties per activity phase (`--phase` on `.activity-entry.phase-*`) and status-colored `.run-dot` classes (`active`, `completed`, `cancelled`/`escalated`/`failed`, `deferred`). Key sections: root tokens and resets, app shell and sidebar nav with badge count, shared `.button*`/`.overline`/banner styles, Inbox (`.inbox-layout` two-column mailbox + reading pane + reply composer), Activity (`.activity-layout`, `.run-list-item`, `.activity-feed` with a connector rail, `.payload` details, `.report-section`), Events (`.event-feed`/`.event-entry`). Responsive fallbacks at 900px hide topbar links and at 650px collapse both split layouts into stacked blocks. Learner-relevant: the UI communicates agent lifecycle state through color and iconography, not progress bars.
