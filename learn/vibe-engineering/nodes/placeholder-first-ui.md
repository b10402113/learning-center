---
id: placeholder-first-ui
title: Placeholder-first UI
subject: vibe-engineering
tier: 3
order: 2
paths:
  - vibe-engineering/build-in-the-right-order
sources:
  - "[[sources/vibe-engineering/Vibe Engineering guide.pdf#page=12]]"
  - "[[sources/vibe-engineering/Vibe Engineering guide.pdf#page=13]]"
created: 2026-08-09
updated: 2026-08-09
---

# Placeholder-first UI

## Big picture
Placeholder-first UI means building the core screens with temporary, representative data before the backend is ready. It separates early product and interaction decisions from backend uncertainty.

## The idea
After the design system, build the main screens using fixtures or other temporary data. The placeholders should have enough variety to expose layout problems: short and long titles, missing-looking states where relevant, different item counts, and realistic content lengths.

This is not pretending the temporary data is production data. It is a deliberate seam. The agent can shape navigation, hierarchy, responsive behavior, and empty/loading/error states while the database and integrations are still being decided. Later, the read path replaces the fixtures with stored data without forcing the product to be designed for the first time at the same moment.

## Why it matters / when it applies
Use it when the product has meaningful screens but the data layer does not exist yet. It is a good default for new apps and substantial UI features. It is less useful for a tiny change whose behavior is already fully constrained by an existing data contract.

Judge the placeholders by whether they help you see the product, not by whether they resemble a hidden second implementation. Keep them simple and disposable. Do not build fake persistence or a fake integration merely to avoid an empty state.

## Connections
- [[learn/vibe-engineering/nodes/design-system-foundation|Design system as foundation]] — the screens consume shared visual primitives rather than creating local styles.
- [[learn/vibe-engineering/nodes/data-model-as-source-of-truth|Data model as source of truth]] — placeholders let the UI mature before it is connected to the final stored shape.

## Deep dive
- [[sources/vibe-engineering/Vibe Engineering guide.pdf#page=12]] — places core UI screens after the design system and recommends temporary placeholder data.
- [[sources/vibe-engineering/Vibe Engineering guide.pdf#page=13]] — describes replacing placeholders through the read path and treating empty states as correct behavior while data flows in.

## Check yourself
- How does placeholder data change the dependency between UI work and backend work?
- When should you reject placeholder-first UI as unnecessary overhead?
- What should realistic placeholders help you discover before the read path exists?

## Answers
- The UI can be shaped before the backend exists; only the later read-path wiring depends on stored data.
- For a small change with an existing, trusted data contract and no meaningful independent UI uncertainty.
- Problems in hierarchy, layout, responsiveness, and states such as empty or loading views.
