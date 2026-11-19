---
source: sources/grokking-ai/20261119/course/Grokking the AI System Design Interview.11.part.txt
source_type: text
source_lines: 1020
part: 11
status: skipped
created: 2026-11-19
updated: 2026-11-19
skip_reason: "duplicate chapter-level rendering of the same lessons; the course teaches from the per-lesson digests"
---

# L1 overview

- Lesson 32, Evaluating LLM Systems — generative answers have no single correct label, so evaluation becomes a designed system: a three-layer pyramid of programmatic checks (valid JSON, citation present, length, banned phrases, a $10 refund limit), an LLM-as-judge scoring a rubric (correct / grounded / complete / clear) with length, self-preference and position biases plus calibration against an anchor set, and human expert review. The golden set of a few hundred real, hard and adversarial cases runs like CI on every prompt, model or retrieval change, scoring retrieval and answer separately; online brings canary releases, three signal tiers (explicit feedback, behavioral proxies, task outcomes), and the rule that when offline and online disagree, online wins and the case joins the golden set.
- Lesson 33, Capstone: The Inference Bill — prices a generative assistant for 5M DAU at 4 interactions (10B input / 1.2B output tokens/day), producing a naive bill of about $45K/day (~$16M/year, ~7% of a $20 seat). Routing 75% to a small model cuts it to ~$15K, prefix caching (1,500-token static prefix, 80% hit, ~90% discount) to ~$10K, and a 15% semantic cache to ~$9K (about 80% below naive). Also sizes a 16-node self-host fleet (~$1.15K/day) versus ~$2.2K/day on API, and covers cost telemetry, per-org budgets, a degradation ladder at 80/90/100% and a per-feature kill switch, with 50K/5M/50M DAU design variants.

# L2 detail

- `#L1-L19` — Lesson 32 header and vocabulary: evaluation, rubric, programmatic check, LLM-as-judge, human evaluation, golden set, regression, calibration, online signal.
- `#L20-L56` — Part 1: why evaluation stops being free. The delivery-time label (32 predicted vs 38 actual) versus a RAG support answer where two good answers share no words; why evaluation is not one accuracy number, a public benchmark, or a one-time pre-launch check.
- `#L57-L94` — Part 2: the evaluation pyramid, three layers cheap-and-broad at the bottom (code, judge, humans), each checking what the layer below cannot.
- `#L95-L116` — Part 3: Layer 1 programmatic checks — valid JSON, citation present, length limit, banned phrases, hard business limits, code that compiles; why code products trust this layer most.
- `#L117-L197` — Part 4: Layer 2 LLM-as-judge — four rubric items, pointwise versus pairwise grading, length/self-preference/position biases with countermeasures, calibrating against an anchor set, and pinning the judge model version.
- `#L198-L214` — Part 5: Layer 3 human evaluation — expert review and blind structured A/B, ~200 of 40,000 daily conversations per week, anchoring the judge and finding unexpected failure modes.
- `#L215-L273` — Part 6: the golden set — real, hard and adversarial cases, kept apart from training data, run on every change, size trade-off and accretion, and scoring retrieval versus answer to separate search from prompting faults.
- `#L274-L390` — Part 7: online evaluation — canary at 5% of traffic, the three online signals from cheap to rich, and the worked case where a 4% judge gain loses to a 6%→9% regeneration rise; online wins.
- `#L391-L436` — Part 8: the 30-second interview answer, likely follow-ups (golden-set size, flat thumbs-down with rising complaints, shifted judge scores), five common mistakes, and key takeaways.
- `#L437-L468` — Lesson 33 header and vocabulary (DAU, naive bill, kill switch) plus the exercise: project-management app at $20/user/month, 5M DAU, add an AI assistant, size the inference layer.
- `#L469-L481` — Part 1: framing — cost as the deciding variable, in and out of scope, confirming scope with one question.
- `#L482-L506` — Part 2: success and assumptions — frontier-equivalent quality via a golden set, TTFT ~2 s, 20% of DAU at 4 interactions, 2,500 input / 300 output tokens, frontier price examples.
- `#L507-L542` — Part 3: pricing the naive bill first — 4M interactions/day, ~46 average and ~150 peak req/s, 10B input and 1.2B output tokens, ~$45K/day, and what that means against the $20 seat and heavy users.
- `#L543-L610` — Part 4: model choice and task-type routing — small model for summarization and extraction, frontier for multi-project planning and long-context questions, 75/25 split, ~$15K/day, and how a router fails open versus closed.
- `#L611-L787` — Part 5: the serving path (gateway, budget check, semantic cache, router, prompt builder, streaming, cost log), prefix caching with a stable byte-for-byte static prefix, semantic cache scoping and thresholds, and the running $45K→$15K→$10K→$9K bill.
- `#L788-L822` — Part 6: the self-host question — sizing a small-model GPU fleet (about 16 nodes, ~85% busy at peak), pricing it against the API, the need for an existing infra team, caching narrowing the gap, and keeping the API as fallback.
- `#L823-L916` — Part 7: keeping it working — cost telemetry and dashboards, quality checks on each cheap path (golden set, judge sampling, reviewer sampling), rate limits, outage fallback, per-feature kill switch, and the 80/90/100% degradation ladder.
- `#L917-L963` — Part 8: the final bill and a product-size table — pure API at 50K DAU, router plus caches at 5M DAU, self-hosted small path at 50M DAU.
- `#L964-L981` — Part 9: how mid-level, senior and staff answers sound — moving numbers, naming failure modes and controls, and opening with the judgment that cost is the constraint.
- `#L982-L1017` — Part 10: five follow-ups (proactive suggestions at 200M calls/day, tuned-small-model drift, enforceable cost ceilings, a free email client using a cascade, a voice agent needing latency control) and key takeaways.
- `#L1018-L1020` — Chapter 5 divider: RAG & Retrieval.
