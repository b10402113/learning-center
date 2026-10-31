---
source: sources/claude-code-master/20261031/2-Volume A - Setup and Fundamentals/7-Module A7 - Effort Levels/7-Module_A7_-_Effort_Levels.en.vtt
source_type: text
source_lines: 451
status: absorbed
absorbed_at: 2026-10-31
created: 2026-10-31
updated: 2026-10-31
---

# L1 overview

- Six levels — effort is set in the command menu under model: low, medium, high, extra high, max, and the newer Ultra Code; effort is essentially how hard Claude thinks before it acts.
- Mechanism — effort adjusts the reasoning token budget for a prompt, allocating more tokens for planning and tool calls at higher levels; Anthropic does not publish the exact budgets, so the choice is partly taste.
- Trade-off — low effort is faster and cheaper but less considered; higher effort is slower, costs more tokens, and raises the probability of sharper output. Developers often default to extra high or max, while knowledge work is usually fine at medium or high.
- Measured demo — the same landing-page prompt at low vs max: low finishes immediately with 1–2 second thinking bursts, max runs ~5 second thinking bursts; `/context` shows 20,000 tokens for low vs 27,000 for max, roughly 35–40% more. Design output was similar, so higher effort is not automatically better.
- Ultra Code — spawns a fleet of parallel agents that cross-check each other, consuming the most tokens of any level; the author advises against it for now and recommends defaulting to medium, stepping up only when results disappoint.

# L2 detail

- `#L1-L60` — Where effort levels live (command menu → model): low, medium, high, extra high, max, Ultra Code; effort defined as how hard Claude thinks before acting.
- `#L61-L150` — Low effort = faster, fewer tokens, less considered; high effort = slower, costlier, higher probability of quality; under the hood effort sets the reasoning token budget for planning and tool calls.
- `#L151-L250` — Anthropic publishes no per-level token budgets, so defaults are taste; developers often use extra high or max, knowledge work is fine at medium or high.
- `#L251-L390` — Side-by-side low vs max landing-page demo, 1–2 second vs ~5 second thinking bursts, similar design quality, and `/context` totals of 20,000 vs 27,000 tokens (~35–40% more).
- `#L391-L451` — Ultra Code as a fleet of parallel, self-cross-checking agents at the highest token cost; recommendation to stick to the five levels, default to medium, and raise effort only when output falls short.
