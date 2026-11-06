---
source: sources/ai-agent-workflows/20261105/course/10-routing.txt
source_type: text
source_lines: 153
status: absorbed
absorbed_at: 2026-11-05
created: 2026-11-05
updated: 2026-11-05
---

# L1 overview

- Routing classifies an input and sends it down one predefined path: to an LLM, a prompt, or deterministic code.
- The classification step is usually cheap, and each path can be specialized and optimized for cost and latency.
- Routing criteria include topic or intent, cost and complexity, and confidence; low confidence can escalate to a human.
- Routing is a fork, not a sequence: only one control flow is chosen, even if the overall app runs the process again later.
- Classification models such as GPT output a label from a multiple-choice list instead of conversational text.
- Example: career, training, and funding questions each route to a dedicated path and produce a focused answer.
- Splitting into specialized prompts beats one giant prompt by avoiding extra API calls, context, and database lookups.

# L2 detail

- `#L1-L3` — Introduces routing as the next LLM-powered workflow.
- `#L4-L20` — Definition: classify the input, then route to an LLM, a prompt, or deterministic code; classification is cheap, paths are specialized for cost and latency, and criteria include topic/intent, cost, complexity, and confidence (with human escalation).
- `#L21-L31` — Routing is a fork, not a sequence: it selects one control flow rather than routing here first and there next.
- `#L32-L67` — Discussion of classification models like GPT: they take a multiple-choice list and output one answer rather than conversational text, making routing cheap and reliable.
- `#L68-L76` — Diagram-level rule: classify the request first, then send it to a specialized fixed path; the LLM only routes, and every path is predefined.
- `#L77-L105` — Worked example with user inputs about career direction, training options, or funding; the classifier outputs a simple label, and code sends the request to the matching path.
- `#L106-L116` — Reiterates the fork/sequence distinction and notes that a later step could restart the process, but the routing itself is still one fork.
- `#L117-L127` — The three paths: career has its own model and career-fit prompt, training has specialized code and school lookups, and funding is a third option; only one is taken.
- `#L128-L153` — Final response depends on the chosen route and uses focused logic; the split is cheaper than one giant prompt because only the needed APIs, context, and lookups are used.
