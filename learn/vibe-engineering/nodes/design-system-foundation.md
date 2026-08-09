---
id: design-system-foundation
title: Design system as foundation
subject: vibe-engineering
tier: 2
order: 1
paths:
  - vibe-engineering/build-in-the-right-order
sources:
  - "[[sources/vibe-engineering/Vibe Engineering guide.pdf#page=12]]"
created: 2026-08-09
updated: 2026-08-09
---

# Design system as foundation

## Big picture
A design system is the shared set of colors, typography, spacing, and base components that gives an app visual consistency. In an AI-assisted build, establishing it first prevents every later screen from becoming a separate styling decision.

## The idea
Start a feature roadmap with the visual primitives rather than with a finished screen. Choose the colors, type scale, spacing rules, and reusable components that the rest of the product will use. Then each screen can compose those decisions instead of inventing its own button, card, margin, or heading style.

This is a foundation because visual choices spread. If the first screen is styled ad hoc, the agent has to copy a local example or improvise on every later screen. If the primitives are explicit, a short feature prompt can ask the agent to use the existing system and keep the product coherent.

## Why it matters / when it applies
Reach for this concept at the start of a new product or before a large UI expansion. It is especially valuable when an agent will create several screens, because consistency is cheaper to establish once than to repair across many files.

Do not turn it into a design exercise without an end. Define enough primitives to support the first core screens, verify them in use, and extend the system when a real need appears.

## Connections
- [[learn/vibe-engineering/nodes/placeholder-first-ui|Placeholder-first UI]] — the design system gives early placeholder screens a stable visual language.
- [[learn/vibe-engineering/nodes/data-model-as-source-of-truth|Data model as source of truth]] — visual foundations let the UI take shape before the final data shape is wired in.

## Deep dive
- [[sources/vibe-engineering/Vibe Engineering guide.pdf#page=12]] — explains why colors, type, spacing, and base components come before screens and calls the design system the foundation of the visual product.

## Check yourself
- Why does a design system reduce rework when an AI agent builds multiple screens?
- When is it better to define only a small initial system instead of designing every possible component?
- What four categories of primitives should a first-pass design system cover?

## Answers
- Later screens reuse explicit decisions instead of receiving inconsistent, ad hoc styling.
- When the product is still small or uncertain; define what the next screens need and expand from real usage.
- Colors, typography, spacing, and base components.
