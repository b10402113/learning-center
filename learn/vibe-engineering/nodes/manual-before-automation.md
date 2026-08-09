---
id: manual-before-automation
title: Manual before automation
subject: vibe-engineering
tier: 2
order: 4
paths:
  - vibe-engineering/build-in-the-right-order
sources:
  - "[[sources/vibe-engineering/Vibe Engineering guide.pdf#page=13]]"
created: 2026-08-09
updated: 2026-08-09
---

# Manual before automation

## Big picture
Manual before automation is the rule that an end-to-end flow should work when started deliberately before schedulers, cron jobs, or background workers run it unattended. Automation should repeat a known-good process, not conceal a broken one.

## The idea
Build the core engine that performs the app's main job, then add intelligence such as AI analysis or search on top of real stored input. Exercise that flow manually from its trigger to its visible result. Only after it works should you add automation that invokes it on a schedule or in the background.

Deployment belongs near the end of this sequence because some behavior, especially cron jobs, only becomes real in the deployed environment. Deploy, observe the complete flow, and then polish and harden the edges. The sequence is not a ban on iteration; it is a way to keep each iteration attached to a verifiable working foundation.

## Why it matters / when it applies
Use this rule whenever a feature includes jobs, webhooks, queues, scheduled work, or other unattended execution. It is valuable even for small projects because manual execution makes failures visible and localizes debugging.

Automation is worth adding when it removes repeated human effort from a flow you trust. If the manual flow is still unclear, adding a scheduler increases the number of places a failure can hide and makes diagnosis harder.

## Connections
- [[learn/vibe-engineering/nodes/data-model-as-source-of-truth|Data model as source of truth]] — the manual engine needs real stored input and a durable place for its output.
- [[learn/vibe-engineering/nodes/placeholder-first-ui|Placeholder-first UI]] — the early UI can be validated independently, then connected to the manual real-data flow before it is automated.

## Deep dive
- [[sources/vibe-engineering/Vibe Engineering guide.pdf#page=13]] — places the core engine, intelligence, automation, and deploy/polish stages in that order and warns that automating a broken flow hides the breakage.

## Check yourself
- Why is a manual run a prerequisite for reliable automation?
- When is adding a scheduler a good decision rather than premature complexity?
- What should be verified before moving from the core engine to automation?

## Answers
- It makes the full flow observable and debuggable before an unattended trigger adds another failure boundary.
- When the manual end-to-end flow works and repeated human triggering is now the actual cost.
- That real input can be read, the engine produces the intended stored result, and the result is visible through the product.
