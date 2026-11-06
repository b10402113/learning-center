---
source: sources/ai-agent-workflows/20261105/course/11-parallelization-other-workflows.txt
source_type: text
source_lines: 342
status: absorbed
absorbed_at: 2026-11-05
created: 2026-11-05
updated: 2026-11-05
---

# L1 overview

- Parallelization runs multiple LLM calls simultaneously and aggregates the results, and exists in both single-agent and multi-agent forms.
- Sectioning splits a task into independent subtasks run in parallel; voting runs the same task multiple times and reconciles the outputs.
- It is faster than prompt chaining, and voting improves accuracy through redundancy.
- Worked example: three LLMs assess career fit in parallel, then a synthesis step uses either deterministic code or an LLM.
- Evaluator-optimizer loops a generator and an evaluator, building reflection into a workflow.
- It fits best when evaluation criteria are clear and grounded in something real, trading more calls for better quality.
- The fixed structure separates a workflow from an agent: the model fills boxes but cannot change the steps.
- Orchestrator-workers uses a central LLM to decompose, delegate, and synthesize, sitting on the edge between workflow and agent.

# L2 detail

- `#L1-L18` — Introduces parallelization: multiple LLM calls run at once and results are aggregated, with single-agent and multi-agent variants.
- `#L19-L32` — Sectioning: a task decomposes cleanly into independent subtasks that can be called in parallel and combined afterward.
- `#L33-L54` — Voting: the same task runs multiple times and outputs are aggregated; parallelization is faster than prompt chaining, and voting adds accuracy through redundancy.
- `#L55-L69` — Example setup: user personality, interests, and career goals go to the same request, with voting chosen because the task does not decompose cleanly.
- `#L70-L85` — Three different LLMs (or prompts/models) assess career fit simultaneously, and all outputs are awaited with low latency.
- `#L86-L129` — Synthesis can be plain code (count how often each career appears) or an LLM that writes a natural-language explanation; the reconciled answer increases confidence.
- `#L130-L163` — Evaluator-optimizer: one call generates and another evaluates in a loop, adding reflection to a workflow; it works best with clear, tangible evaluation criteria and costs more calls for better quality.
- `#L164-L210` — Diagram and example: generate career paths, programs, and funding; the evaluator reviews the draft ("add specific programs and estimated costs") and the generator retries until it passes or hits a stop condition.
- `#L211-L269` — The diagram contains LLMs and tools but is still a workflow because the process structure was fixed in code; the model cannot skip the evaluator, choose unavailable tools, or invent steps. In an agent, the model draws the boxes itself at runtime.
- `#L270-L302` — Orchestrator-workers: a central LLM decomposes the task, delegates subtasks to worker LLMs, and synthesizes results; it differs from prompt chaining because the orchestrator chooses the subtasks, and it fits unpredictable work such as writing and editing code.
- `#L303-L342` — Diagram: the orchestrator decomposes the request, picks needed workers (career, school, funding), gathers results, decides whether more calls are needed, and returns one synthesized application response.
