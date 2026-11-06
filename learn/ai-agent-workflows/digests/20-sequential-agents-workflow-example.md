---
source: sources/ai-agent-workflows/20261105/course/20-sequential-agents-workflow-example.txt
source_type: text
source_lines: 253
status: absorbed
absorbed_at: 2026-11-05
created: 2026-11-05
updated: 2026-11-05
---

# L1 overview

- Sequential multi-agent orchestration ("pipeline" or "linear delegation") chains agents in a predefined linear order, per Microsoft's agent documentation.
- The worked example takes a user's likes/dislikes, has a career-picker agent choose a career, then a path-advisor agent explain schooling, certifications, and licenses.
- Two separate agents, each with its own role, system prompt, tools, and fresh transcript, but both running the same ReAct loop (thought → action → observation) and sharing only a small handoff object.
- The orchestrator is plain code in a fixed order; agents never choose who goes next, so a validation gate can sit between stages.
- Each agent needs `maxSteps`; on exceeding it the loop returns `null` rather than a half-finished answer.
- Stage two receives only the handoff plus the original input, not agent one's transcript, keeping context small and focused.
- Contrast: prompt chain = one LLM call per step with no tools/loops/decisions; ReAct agent = one agent with every tool in a single loop; sequential = ReAct agents inside a fixed pipeline.

# L2 detail

- `#L1-L19` — Framing the exercise: build a sequential multi-agent workflow in code that reads a person's likes/dislikes, has one agent pick a career, then passes to a second agent for education/certification guidance; must be genuinely multi-agent, not a single agent or an LLM workflow.
- `#L20-L37` — Prompt constraints for the generated code: heavy JS comments, fake the LLM calls with comments showing where real keys/calls go, keep it to one file and few lines unless clarity needs more, and ask questions / look up sequential systems for correctness before handing it to Copilot.
- `#L38-L59` — Naming variants (pipeline, linear delegation) and the generated structure: user input → career-picker agent → validated handoff → path-advisor agent → result; gates are what make sequential feel like a familiar workflow.
- `#L60-L74` — Microsoft-sourced definition (agents chained in predefined linear order) and the three-pattern contrast: prompt chain has one LLM call per step with no tools, loops, or decisions; ReAct has one agent with every tool in one loop.
- `#L75-L91` — The sequential file has two agents, each with its own role, prompt, tools, transcript, and a ReAct loop deciding which tools to call and when it is done; they share only the small handoff object.
- `#L92-L118` — The orchestrator's hard-coded decision to pass agent 1 → agent 2, the `maxSteps` per-agent stop condition, and the ReAct rules interleaving thought/action/observation.
- `#L119-L132` — Agent 1 ("career picker"): specialist in matching people to careers, only career-matching tools (`search careers`, `get job outlook`), model Claude Sonnet 4.5, dedicated system prompt.
- `#L133-L158` — Agent 2 ("path advisor"): specialist in education and training, only education tools (`get requirements`, `find programs`, `finish`), same model here but not required; specialists with smaller calls/models beat broad agents.
- `#L159-L178` — The single central LLM call site: pass which agent and what memory/context; both agents share one loop but use their own prompt, tools, and fresh transcript; returns the answer or `null` at max steps.
- `#L179-L198` — Why `null` on max steps is acceptable (no half-finished or broken answer reaches the user), though the speaker would prefer an error; `runAgentSystem` mirrors the earlier ReAct agent.
- `#L199-L219` — Orchestrator is plain code: stage one runs the career picker, then a handoff gate validates the output so a bad pick does not cascade and compound errors through the pipeline.
- `#L220-L240` — Stage two gives the path advisor only the handoff plus the original input — no prior transcript, tool calls, steps, or reasoning — keeping context small and focused; then path output and finish.
- `#L241-L253` — Closing point: prompt chaining, ReAct, and sequential are deliberately built to look alike in code, so experimenting with which pattern fits is cheap.
