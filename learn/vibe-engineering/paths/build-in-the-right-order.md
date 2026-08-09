---
id: build-in-the-right-order
title: Build in the right order
subject: vibe-engineering
tier: 3
order: 4
duration: 10-15 minutes
status: content-written
goal: Sequence feature work so each implementation step reduces uncertainty instead of building on an unstable foundation.
sources:
  - "[[sources/vibe-engineering/Vibe Engineering guide.pdf#page=12]]"
  - "[[sources/vibe-engineering/Vibe Engineering guide.pdf#page=13]]"
nodes:
  - design-system-foundation
  - placeholder-first-ui
  - data-model-as-source-of-truth
  - manual-before-automation
created: 2026-08-09
updated: 2026-08-09
---

# Build in the right order

## Learning goal

Sequence feature work so each implementation step reduces uncertainty instead of building on an unstable foundation.

## Nodes
- [[learn/vibe-engineering/nodes/design-system-foundation|Design system as foundation]]
- [[learn/vibe-engineering/nodes/placeholder-first-ui|Placeholder-first UI]]
- [[learn/vibe-engineering/nodes/data-model-as-source-of-truth|Data model as source of truth]]
- [[learn/vibe-engineering/nodes/manual-before-automation|Manual before automation]]

## Lesson
The phrase "build in the right order" can sound like project-management ceremony. It is more practical than that. The order is a way to make each step reduce uncertainty for the next one.

When an AI coding agent builds against an unknown data shape, an undecided visual language, or an untested integration, it can still produce code. The problem appears later, when the assumptions collide. You then spend your time untangling a chain of decisions that should have been made separately. A good sequence lets you see the product early, establish the contracts that later work depends on, and verify one small slice before adding the next.

The guide's default sequence is:

1. Design system
2. Core UI screens
3. Auth
4. Database and data model
5. Seed or configuration data
6. Read path
7. Core engine
8. Intelligence
9. Automation
10. Deploy, then polish and harden

This is a default, not a law. A real project may have a constraint that changes the order. The useful question is: "Which next step removes the most uncertainty without depending on work that does not exist yet?" Each step should have its own short prompt, approved plan, implementation, and verification.

### 1. Establish the visual foundation

Start with a small [[learn/vibe-engineering/nodes/design-system-foundation|design system as foundation]]: colors, typography, spacing, and base components. The purpose is not to create a complete design library before anyone can see the product. It is to make the first real screens use shared decisions.

This matters more with an AI agent because the agent can generate a plausible button or card in any local context. Without a shared system, that flexibility becomes drift: one screen gets a different radius, another invents a new spacing value, and a third uses a different heading hierarchy. Establish the primitives once, then direct every screen to compose them.

Keep the first system small. If the product needs a navigation shell, buttons, cards, forms, and a type scale, define those. Do not spend a week specifying components no current feature needs.

### 2. Shape the product before the backend

Build the core UI screens next, using [[learn/vibe-engineering/nodes/placeholder-first-ui|placeholder-first UI]]. Temporary data gives you something visible to shape while the database and integrations are still uncertain. You can decide what belongs on the home screen, how a detail view is organized, and how the interface behaves at different sizes without waiting for a production pipeline.

Use representative fixtures rather than one perfect example. Include content with different lengths and counts so the agent and you can see whether the layout holds. Include the states users will actually encounter: loading, empty, and failure states where they apply.

The placeholder is a seam, not a fake backend. Do not build elaborate persistence just to avoid an empty state. The point is to learn about the product's interaction and visual structure early. Later, the read path will replace the temporary source with stored data.

### 3. Add identity, then settle the durable shape

Auth comes after the first screens. At that point you know which account controls, protected routes, and user-specific areas the product actually has. You are not securing an abstract design; you are securing visible behavior.

Then define the database and data model as the [[learn/vibe-engineering/nodes/data-model-as-source-of-truth|source of truth]]. Identify the tables, important fields, required values, and relationships needed for the next flow. This is where temporary UI knowledge becomes a durable contract.

The model should be explicit enough that later code does not have to guess. If a record needs a date, an owner, or a unique key, make that requirement part of the model and validation rather than relying on an agent to remember it from a previous prompt. At the same time, avoid modeling the entire imagined future. The smallest durable shape that supports the next end-to-end flow is usually the right one.

### 4. Put real data through the product

Seed the starting rows or configuration the app needs: sources, categories, settings, or other inputs. Then build the read path, replacing placeholders with real stored data.

Expect empty states during this stage. An empty state is evidence that the UI is correctly connected to a data source that currently has no rows; it is not automatically a bug. What matters is that the app reads from the known model, handles no data intentionally, and displays real records when they exist.

This sequence also exposes a useful distinction: the UI can be designed before the data exists, but the application cannot claim to be integrated until the read path is real. Verify that transition before adding more behavior.

### 5. Build the engine and intelligence on real input

Now implement the app's core engine: scraping, processing, generation, or whatever the product actually does. The engine should fill the database with real content through the model you already established.

Only after there is real input does intelligence become a meaningful layer. AI analysis, search, or ranking built on empty or invented data can look impressive while avoiding the actual product problem. With real stored input, you can test whether the intelligence improves the user's result and whether its failures are handled.

Give the engine and intelligence separate prompts and plans. That keeps each change small enough to review and makes it clear whether a failure belongs to ingestion, persistence, or interpretation.

### 6. Automate only a working manual flow

Apply the [[learn/vibe-engineering/nodes/manual-before-automation|manual before automation]] rule. Run the complete flow deliberately: trigger it, observe the engine, confirm the data is stored, and check that the result appears in the product. Fix that path before introducing a scheduler, cron job, queue worker, or background process.

Automation should remove repetition from a flow you understand. It should not be used to discover whether the flow works. Otherwise a failed scheduled run may hide whether the trigger, credentials, timing, data model, engine, or UI is responsible.

Deployment is part of finishing, not an afterthought. Some scheduled behavior only runs in the deployed environment. Deploy the working flow, verify it there, and then polish and harden the edges. This is also why "done locally" is not the end of the sequence when deployment changes the behavior you need to test.

### Use the sequence as a decision tool

For your next feature, write one short prompt for one step. Let the agent inspect the relevant rules and code, produce an implementation plan, and wait for approval. Before approving, ask what uncertainty the step removes and what it depends on.

If the request is "add scheduled analysis," the right first step may be the data model, read path, or manual analysis flow rather than the scheduler. If the request is "build the dashboard," start with the design system and placeholder screens rather than wiring an API that has not been defined. If the request is "make the pipeline automatic," first prove that a manual run creates the right stored result.

After each approved step, run its checks and follow the exact verification steps. A successful step is not merely code that compiles; it is a verified foundation for the next step. That is the core habit: build the smallest useful piece, reduce uncertainty, and only then move downstream.

## Sources
- [[sources/vibe-engineering/Vibe Engineering guide.pdf#page=12]]
- [[sources/vibe-engineering/Vibe Engineering guide.pdf#page=13]]
