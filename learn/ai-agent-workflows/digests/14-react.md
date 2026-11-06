---
source: sources/ai-agent-workflows/20261105/course/14-react.txt
source_type: text
source_lines: 434
status: absorbed
absorbed_at: 2026-11-05
created: 2026-11-05
updated: 2026-11-05
---

# L1 overview

- ReAct means reasoning and acting; it comes from a 2022 paper combining chain-of-thought prompting with actions.
- The loop is thought → action (tool call) → observation → thought again, repeated until a finish action or max steps.
- The LLM decides which tool to call, with what input, how many times, and when to stop; code just runs the loop.
- A single-agent system here is one LLM, one transcript, and one loop, with no coordinator or other agents.
- The demo prompts a single ReAct agent in one file, fakes the LLM calls, and asks the coding agent to look up ReAct papers.
- Agent instructions teach the ReAct format and tool descriptions; 1–2 example trajectories act as few-shot prompting.
- Tools score careers and look up paths; errors are returned as text so the agent can read them and retry.
- The transcript is the agent's memory and grows every turn, making context protection critical even before multi-agent systems.

# L2 detail

- `#L1-L25` — ReAct stands for reasoning and acting, not the frontend framework; it dates to 2022 and combines chain-of-thought ("think step by step") with acting.
- `#L26-L45` — How it works: the model produces an action, background code executes it, the result returns as an observation, and the model decides what to do next; the diagram shows reason, act, observe, repeat until a final answer.
- `#L46-L92` — Worked career example: reason about the user's interests, search careers, observe UX designer/teacher/counselor, think again, look up programs and funding; unlike a workflow, the number of loops and the tools chosen are unknown.
- `#L93-L156` — VS Code demo: prompt for a single ReAct agent (capital R, capital A) that takes user likes/dislikes, picks a career, then finds how to get there; asks for JSComm, faked LLM calls, one readable file, and research into ReAct agents.
- `#L157-L197` — Looking up ReAct papers works like few-shot prompting: the agent finds examples on arXiv, including the 2022 paper "ReAct: Synergizing Reasoning and Acting in Language Models," which underpins most single agents today.
- `#L198-L227` — Each turn has a thought (what it knows and what to do next), an action (tool name plus parameters executed by code), and an observation (the appended result); the loop ends on the special action `finish` or a max-step limit.
- `#L228-L254` — Why this is an agent, not a workflow: the code does not fix the steps; the LLM chooses the tool, input, count, and stopping point. It may search twice, compare careers, or retry a bad call, all in one transcript and one loop.
- `#L255-L308` — Setup: imports, career data with tags (park ranger = hiking, outdoors, animals, nature), paths, schools, and tools; tools score careers (+1 per matching like, −1 per dislike, best fit first) and look up how to enter a career, returning errors as text so the agent can retry.
- `#L309-L354` — Agent instructions teach the ReAct format and tool descriptions, include 1–2 example trajectories as few-shot prompting, and use a system prompt: career advisor, recommend one career, interleave thought/action/observation, write one thought and one action, then stop for the observation.
- `#L355-L394` — The LLM function takes the system prompt and the whole transcript, returning the next thought and action; a fake scripted model reads the transcript and uses crude keyword matching, while a real model would reason. Running the example returns park ranger.
- `#L395-L434` — The transcript is the agent's memory, appending question, thought, action, and observation each turn; the LLM sees all of it and context grows significantly. The agent finishes on a stop condition or its own `finish` action, with no control over loop count beyond that limit.
