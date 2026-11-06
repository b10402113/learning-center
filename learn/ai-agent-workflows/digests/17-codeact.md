---
source: sources/ai-agent-workflows/20261105/course/17-codeact.txt
source_type: text
source_lines: 127
status: absorbed
absorbed_at: 2026-11-05
created: 2026-11-05
updated: 2026-11-05
---

# L1 overview

- CodeAct makes an agent's actions executable code instead of JSON tool calls.
- JSON actions force three round trips per call: build the JSON, invoke it, then wait for and feed back the result.
- One code block can perform the whole action in a single step.
- Models have seen enormous amounts of code in pretraining but see a given tool schema for the first time, which motivates code generation.
- The main trade-off is executing model-generated code, which can be dangerous or destructive.
- Safe CodeAct needs a sandbox with guardrails, which complicates setup compared with a simple ReAct agent.
- It is gaining popularity, especially among enterprises able to build sandboxes.
- In the diagram the code runs in a controlled sandbox with API access, returns structured results from multiple lookups, and can run again before the final answer.

# L2 detail

- `#L1-L8` — Introduces CodeAct as the last single-agent system, where actions are executable code rather than JSON, and notes it is hard to implement.
- `#L9-L27` — Explains the JSON round-trip cost (make JSON, call, wait and pass result) versus one code block doing everything in one step.
- `#L28-L48` — Argues models are trained on vast code and have never seen the tool schema, so generating code may beat figuring out custom tools; flags the trade-off.
- `#L49-L70` — Details the danger of running generated code, the need for sandboxes with guardrails, and enterprise adoption where sandboxing is available.
- `#L71-L93` — Diagram: write executable code as the action, run in a sandbox, observe the result, answer; no JSON tools and no manual result handoff.
- `#L94-L116` — Worked career example: the agent writes one code block to query careers, training, and funding APIs exposed inside the sandbox.
- `#L117-L127` — The sandbox executes model-generated code with guardrails, returns structured results from multiple lookups, and can be rerun until the final answer.
