---
id: data-model-as-source-of-truth
title: Data model as source of truth
subject: vibe-engineering
tier: 2
order: 3
paths:
  - vibe-engineering/build-in-the-right-order
sources:
  - "[[sources/vibe-engineering/Vibe Engineering guide.pdf#page=12]]"
  - "[[sources/vibe-engineering/Vibe Engineering guide.pdf#page=13]]"
created: 2026-08-09
updated: 2026-08-09
---

# Data model as source of truth

## Big picture
The database and data model define the durable shape of the information an app reads and writes. They belong before real read paths and engines because downstream features depend on that shape being correct.

## The idea
Once the core screens are understood, define the tables, important fields, required values, and relationships. Then seed the configuration or starting rows the app needs, and wire the UI to read from stored data. This turns the product from a visual prototype into a system with a known source of truth.

The order matters. A read path built before the model is settled tends to encode guesses in UI and API code. A core engine built before there is a durable place for its output has nowhere reliable to put it. Locking the model does not mean it can never change; it means changes are deliberate rather than accidental consequences of whichever feature was built first.

## Why it matters / when it applies
Reach for this concept when a feature crosses from temporary UI into persistence, ingestion, or processing. Treat required fields and valid relationships as product decisions, not implementation details. A clear model gives the agent a stable contract for the read path and for the engine that fills it.

Do not model every hypothetical future feature. Define the smallest durable shape that supports the next end-to-end flow, then evolve it when new evidence requires it.

## Connections
- [[learn/vibe-engineering/nodes/placeholder-first-ui|Placeholder-first UI]] — temporary data helps discover what the real model must represent without blocking early UI work.
- [[learn/vibe-engineering/nodes/manual-before-automation|Manual before automation]] — a stable data model is part of the manual flow that automation will later repeat.

## Deep dive
- [[sources/vibe-engineering/Vibe Engineering guide.pdf#page=12]] — puts the database and data model after auth and calls them the source of truth on which downstream work depends.
- [[sources/vibe-engineering/Vibe Engineering guide.pdf#page=13]] — places seed/config data and the read path before the core engine and intelligence layers.

## Check yourself
- Why should the read path follow the data model instead of defining it accidentally?
- When should you stop modeling and start the next end-to-end step?
- What must exist before an engine or intelligence layer can do useful work?

## Answers
- Otherwise UI and API code encode guesses, and later model changes create avoidable rework.
- When the smallest durable shape supports the next real flow; do not model hypothetical features.
- A stable place to store and read real input, including the required seed or configuration data.
