---
source: harness-engineering
source_type: codebase
source_lines: 2378
language: typescript
file_count: 20
part: 2
status: absorbed
absorbed_at: 2026-09-15
created: 2026-09-15
updated: 2026-09-15
---

# Digest — harness-engineering (part 2)

## Overview (L1)

- `web/` — the **Harness Inspector**, a Vite + React UI that visualizes a running agent harness. It opens a single WebSocket to the harness server, appends every JSON `AgentEvent` to local state, and renders that stream in two panes: a chat/task pane that projects events into user/assistant/tool/handoff/supervision/approval turns, and an inspector pane that prints the raw durable event log. It also owns light/dark theming and outbound commands (`submit_task`, approvals, memory clear) sent back over the same socket. Students consume this UI but do not build it — it is the observable surface for durable execution, orchestration, supervision, and human-in-the-loop lessons.
- `web/src/components/ui/` — a shadcn/ui-style presentational cluster (prompt-kit). Purely visual: chat container, message, tool-call card, chain-of-thought, markdown/code-block, prompt input, loaders, and Radix primitives (button/tooltip/collapsible/textarea/avatar). These carry no harness logic and teach the component vocabulary the panes compose.

## Structure (L2)

### web/src/useHarnessSocket.ts

- Locator: `[[sources/agent-harness/20260915/harness-engineering/web/src/useHarnessSocket.ts]]`
- Purpose: The UI's single connection to the harness. Opens one WebSocket to `ws://<host>:8787/ws`, tracks `connected`, appends each parsed `AgentEvent` to an `events` array, and exposes `send` for `ClientMessage` commands. Comment states it is "the inspector's single source of truth: the harness event stream."
- Key exports: `useHarnessSocket()` → `{ events, connected, send }`
- Dependencies: `react`; shared types `AgentEvent`, `ClientMessage` from `@shared/events`
- Learner-relevant: Teaches that the browser is a pure projection of the server's event stream — all state arrives as events, not as RPC responses. One socket, append-only log, commands piggy-backed in the other direction.

### web/src/App.tsx

- Locator: `[[sources/agent-harness/20260915/harness-engineering/web/src/App.tsx]]`
- Purpose: Top-level shell. Calls `useHarnessSocket` and `useTheme`, renders the header (title, connected/disconnected dot, theme toggle) and a two-column grid: `TaskPane` (chat) and `InspectorPane` (raw log). Both panes receive the same `events`; `send` goes only to `TaskPane`.
- Key exports: `App`
- Dependencies: `./useHarnessSocket`, `./useTheme`, `./components/TaskPane`, `./components/InspectorPane`, `@/components/ui/tooltip`, `@/components/ui/button`, `@/lib/utils`, `lucide-react`
- Learner-relevant: Shows the two complementary views of one event stream — human-readable transcript vs. raw observability — and how a single hook fans the stream out to both.

### web/src/components/TaskPane.tsx

- Locator: `[[sources/agent-harness/20260915/harness-engineering/web/src/components/TaskPane.tsx]]`
- Purpose: Left pane; a **projection of the event stream into chat turns**. `toTranscript(events)` folds events into a `Turn[]` (`user | assistant | tool | handoff | supervision | approval | log`) and a `running` flag, coalescing `model.delta` into assistant text and matching tool/approval events by id. Renders each turn (markdown, `Tool` cards, sub-agent `ChainOfThought`, `ApprovalCard`, handoff dividers), a `TextDotsLoader` while running, and a `PromptInput` with a "Supervised" mode toggle. Submits via `send({ type: "submit_task", input, mode })`; approvals POST to `/api/approve/:workflowId`; clear POSTs `/api/clear` then reloads.
- Key exports: `TaskPane`; internal `toTranscript`, `TurnView`, `ApprovalCard`
- Dependencies: `@shared/events` (`EventType`, `AgentEvent`, `ClientMessage`), `@/components/ui/chat-container`, `markdown`, `tool`, `chain-of-thought`, `prompt-input`, `button`, `loader`, `@/lib/utils`, `lucide-react`
- Learner-relevant: The core event-accumulation pattern: state is reconstructed by replaying typed events, and UI features (sub-agent tree, approvals) appear only when their event types are emitted. Shows supervised mode and human-in-the-loop approval UI wired to durable workflow ids.

### web/src/components/InspectorPane.tsx

- Locator: `[[sources/agent-harness/20260915/harness-engineering/web/src/components/InspectorPane.tsx]]`
- Purpose: Right pane; the harness **observability surface**. Renders the raw event log in order with a count, a per-type color keyed on the event's group prefix (`workflow`/`model`/`tool`/`log`), and a `summarize` that JSON-stringifies the payload minus `id/ts/type/workflowId`. Comment notes every lesson adds richer panels (checkpoints, sub-agent tree, approvals) on this same stream.
- Key exports: `InspectorPane`; internal `formatTime`, `summarize`
- Dependencies: `@shared/events` (`AgentEvent`), `@/lib/utils`
- Learner-relevant: Teaches that durable execution is only trustworthy if it is observable — the raw event log is what makes invisible infrastructure (checkpoints, replays, retries) visible and debuggable.

### web/src/useTheme.ts

- Locator: `[[sources/agent-harness/20260915/harness-engineering/web/src/useTheme.ts]]`
- Purpose: Light/dark theme hook. Reads `localStorage` or `prefers-color-scheme`, toggles the `dark` class on `<html>`, and persists the choice. Comment points to the inline `index.html` script that applies the class before first paint to avoid a flash.
- Key exports: `useTheme()` → `{ theme, toggle }`
- Dependencies: `react`
- Learner-relevant: Minor but illustrates shadcn/Tailwind dark mode as a root class plus pre-paint script to prevent theme flash.

### web/src/main.tsx

- Locator: `[[sources/agent-harness/20260915/harness-engineering/web/src/main.tsx]]`
- Purpose: Vite entry point. Mounts `<App />` into `#root` under `StrictMode` and imports the global stylesheet.
- Key exports: none (side-effecting `createRoot().render`)
- Dependencies: `react`, `react-dom/client`, `./App`, `./styles.css`
- Learner-relevant: Standard React/Vite bootstrap; the only new idea is that styles.css carries the Tailwind/shadcn token system.

### web/index.html

- Locator: `[[sources/agent-harness/20260915/harness-engineering/web/index.html]]`
- Purpose: Vite HTML shell. Sets the "Harness Inspector" title, declares `#root`, loads `/src/main.tsx` as a module, and runs a tiny inline script that adds the `dark` class from saved/system preference before first paint.
- Key exports: n/a
- Dependencies: `/src/main.tsx`
- Learner-relevant: The pre-paint theme script is the pattern that avoids a light-mode flash on load.

### web/src/components/ui/ — chat/tool/CoT/markdown cluster

- Locator: `[[sources/agent-harness/20260915/harness-engineering/web/src/components/ui/chat-container.tsx]]`, `[[sources/agent-harness/20260915/harness-engineering/web/src/components/ui/message.tsx]]`, `[[sources/agent-harness/20260915/harness-engineering/web/src/components/ui/tool.tsx]]`, `[[sources/agent-harness/20260915/harness-engineering/web/src/components/ui/chain-of-thought.tsx]]`, `[[sources/agent-harness/20260915/harness-engineering/web/src/components/ui/markdown.tsx]]`, `[[sources/agent-harness/20260915/harness-engineering/web/src/components/ui/code-block.tsx]]`
- Purpose: The rendering vocabulary for the chat pane. `ChatContainerRoot/Content` wrap `use-stick-to-bottom` auto-scroll (role `log`). `Message*` compose avatar + tooltip + markdown message bubbles (shadcn prompt-kit). `Tool` renders a `ToolPart` as a collapsible card with a state icon/badge (`input-streaming | input-available | output-available | output-error`), Input/Output/Error sections, and the tool call id. `ChainOfThought*` renders collapsible, connected reasoning/sub-agent steps with left icons and a vertical rail. `Markdown` memoizes per-lexer-token rendering (`marked` split into blocks, `react-markdown` + GFM/breaks) and routes fenced code to `CodeBlock`; `CodeBlockCode` async-highlights via Shiki with a plain fallback.
- Key exports: `ChatContainerRoot`, `ChatContainerContent`, `ChatContainerScrollAnchor`; `Message`, `MessageAvatar`, `MessageContent`, `MessageActions`, `MessageAction`; `Tool`, `ToolPart`; `ChainOfThought`, `ChainOfThoughtStep/Trigger/Content/Item`; `Markdown`; `CodeBlock`, `CodeBlockCode`, `CodeBlockGroup`
- Dependencies: `@/lib/utils`, `@/components/ui/{avatar,tooltip,collapsible,button}`, `use-stick-to-bottom`, `marked`, `react-markdown`, `remark-gfm`, `remark-breaks`, `shiki`, `lucide-react`
- Learner-relevant: Teaches the mapping from harness events to visual states — a `ToolPart`'s four states mirror `tool.requested → tool.completed/failed`, and chain-of-thought/`Tool` cards are how tool calls and sub-agents are visualized.

### web/src/components/ui/prompt-input.tsx

- Locator: `[[sources/agent-harness/20260915/harness-engineering/web/src/components/ui/prompt-input.tsx]]`
- Purpose: The composer. A context provider (`PromptInput`, with `value/onValueChange/onSubmit/isLoading`) supplies an autosizing `PromptInputTextarea` (Enter submits, Shift+Enter newlines, capped by `maxHeight`), plus `PromptInputActions` / `PromptInputAction` (tooltip-wrapped buttons). Visual only; the submit handler lives in `TaskPane`.
- Key exports: `PromptInput`, `PromptInputTextarea`, `PromptInputActions`, `PromptInputAction`
- Dependencies: `@/components/ui/textarea`, `@/components/ui/tooltip`, `@/lib/utils`, `react`
- Learner-relevant: Illustrates the controlled-input context pattern used to wire "give the agent an objective" into an event-sending callback.

### web/src/components/ui/ — primitives cluster

- Locator: `[[sources/agent-harness/20260915/harness-engineering/web/src/components/ui/button.tsx]]`, `[[sources/agent-harness/20260915/harness-engineering/web/src/components/ui/tooltip.tsx]]`, `[[sources/agent-harness/20260915/harness-engineering/web/src/components/ui/collapsible.tsx]]`, `[[sources/agent-harness/20260915/harness-engineering/web/src/components/ui/textarea.tsx]]`, `[[sources/agent-harness/20260915/harness-engineering/web/src/components/ui/loader.tsx]]`, `[[sources/agent-harness/20260915/harness-engineering/web/src/components/ui/avatar.tsx]]`
- Purpose: Generic shadcn/ui-style building blocks. `Button` uses `class-variance-authority` for variant/size plus Radix `Slot` for `asChild`; `Tooltip*` wrap Radix tooltip in a portal; `Collapsible*` wrap Radix collapsible (used by `Tool`/`ChainOfThought`); `Textarea` is a styled textarea; `Avatar*` wrap Radix avatar with size variants and group/badge helpers; `Loader` is a catalog of twelve animated loaders (`circular`, `classic`, `pulse`, `dots`, `typing`, `wave`, `bars`, `terminal`, `text-blink`, `text-shimmer`, `loading-dots`, …), of which `TextDotsLoader` is used by `TaskPane`.
- Key exports: `Button`, `buttonVariants`; `Tooltip`, `TooltipTrigger`, `TooltipContent`, `TooltipProvider`; `Collapsible`, `CollapsibleTrigger`, `CollapsibleContent`; `Textarea`; `Loader` + each named loader (`CircularLoader`…`TextDotsLoader`); `Avatar`, `AvatarImage`, `AvatarFallback`, `AvatarBadge`, `AvatarGroup`, `AvatarGroupCount`
- Dependencies: `radix-ui`, `class-variance-authority`, `@/lib/utils`, `react`, `lucide-react`
- Learner-relevant: No harness logic — establishes only which primitives (Radix, CVA, className merge) the panes are built from, so the learner can tell UI chrome apart from the event-stream behavior under study.

### web/src/lib/utils.ts

- Locator: `[[sources/agent-harness/20260915/harness-engineering/web/src/lib/utils.ts]]`
- Purpose: The `cn` class-name helper: `twMerge(clsx(inputs))` merges conditional and conflicting Tailwind classes. Used by every UI component.
- Key exports: `cn`
- Dependencies: `clsx`, `tailwind-merge`
- Learner-relevant: Small shadcn convention; no harness behavior.

### web/src/styles.css

- Locator: `[[sources/agent-harness/20260915/harness-engineering/web/src/styles.css]]`
- Purpose: Global stylesheet. Imports Tailwind v4 (`@import "tailwindcss"`), `tw-animate-css`, and the typography plugin; defines the `dark` custom variant and the shadcn design tokens (background/foreground/card/primary/…, sidebar set) for `:root` and `.dark` in OKLCH, maps them via `@theme inline`, and applies base `border-border`/body/height-full rules.
- Key exports: n/a (CSS)
- Dependencies: `tailwindcss`, `tw-animate-css`, `@tailwindcss/typography`
- Learner-relevant: Defines the token set and dark-mode mechanism that `useTheme` toggles; no agent logic.
